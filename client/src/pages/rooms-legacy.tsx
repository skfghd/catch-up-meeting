import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Edit, Users, Plus, Eye, MessageCircle, Settings } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { getUser } from "@/lib/storage";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Room {
  id: number;
  name: string;
  description?: string;
  participantCount: number;
  createdAt: string;
  zoomLink?: string;
  teamsLink?: string;
  scheduledAt?: string;
  roomData?: any;
}

export default function RoomsLegacy() {
  const [, setLocation] = useLocation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    name: "",
    description: "",
    zoomLink: "",
    teamsLink: ""
  });
  const user = getUser();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 회의방 목록 조회
  const { data: rooms = [], isLoading } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
    retry: false
  });

  // 회의방 생성 mutation
  const createRoomMutation = useMutation({
    mutationFn: async (roomData: any) => {
      return await apiRequest('/api/rooms', {
        method: 'POST',
        body: roomData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rooms'] });
      setShowCreateDialog(false);
      setNewRoomData({ name: "", description: "", zoomLink: "", teamsLink: "" });
      toast({
        title: t('roomsLegacy.created'),
        description: t('roomsLegacy.createdDesc')
      });
    },
    onError: (error) => {
      console.error('Room creation error:', error);
      toast({
        title: t('roomsLegacy.failed'),
        description: t('roomsLegacy.failedDesc'),
        variant: "destructive"
      });
    }
  });

  // 회의방 삭제 mutation
  const deleteRoomMutation = useMutation({
    mutationFn: async (roomId: number) => {
      return await apiRequest(`/api/rooms/${roomId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rooms'] });
      toast({
        title: t('roomsLegacy.deleted'),
        description: t('roomsLegacy.deletedDesc')
      });
    },
    onError: (error) => {
      console.error('Room deletion error:', error);
      toast({
        title: t('roomsLegacy.failed'),
        description: t('roomsLegacy.failedDesc'),
        variant: "destructive"
      });
    }
  });

  const handleCreateRoom = () => {
    if (!newRoomData.name.trim()) {
      toast({
        title: t('roomsLegacy.required'),
        description: t('roomsLegacy.nameRequired'),
        variant: "destructive"
      });
      return;
    }

    createRoomMutation.mutate({
      name: newRoomData.name,
      description: newRoomData.description || null,
      zoomLink: newRoomData.zoomLink || null,
      teamsLink: newRoomData.teamsLink || null,
      hasPassword: false,
      participantCount: 0
    });
  };

  const deleteRoom = (roomId: number) => {
    if (window.confirm(t('roomsLegacy.deleteConfirm'))) {
      deleteRoomMutation.mutate(roomId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return t('roomsLegacy.timeAgo.justNow');
    if (diffInHours < 24) return `${diffInHours}${t('roomsLegacy.timeAgo.hoursAgo')}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}${t('roomsLegacy.timeAgo.daysAgo')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8 pb-8 bg-muted/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-display text-4xl font-bold mb-4">{t('roomsLegacy.title')}</h2>
            <p className="text-body text-lg text-muted-foreground">
              {t('roomsLegacy.subtitle')}
            </p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              {t('roomsLegacy.totalRooms')} {rooms.length}{t('roomsLegacy.roomsCount')}
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('roomsLegacy.createNew')}
            </Button>
          </div>

          {rooms.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">{t('roomsLegacy.noRooms')}</h3>
                <p className="text-muted-foreground mb-4">{t('roomsLegacy.noRoomsDesc')}</p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('roomsLegacy.createFirst')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold truncate flex-1 mr-2">
                        {room.name}
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLocation(`/room/${encodeURIComponent(room.name)}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRoom(room.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {room.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {room.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-muted-foreground">
                          <Users className="w-4 h-4 mr-1" />
                          {t('roomsLegacy.participants')} {room.participantCount}명
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {getTimeSince(room.createdAt)}
                        </Badge>
                      </div>
                      
                      {room.scheduledAt && (
                        <div className="text-xs text-muted-foreground">
                          {t('roomsLegacy.scheduled')}: {formatDate(room.scheduledAt)}
                        </div>
                      )}

                      {(room.zoomLink || room.teamsLink) && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          {room.zoomLink ? 'Zoom' : room.teamsLink ? 'Teams' : 'Meeting'}
                        </div>
                      )}

                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLocation(`/room/${encodeURIComponent(room.name)}`)}
                          className="flex-1 mr-2"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {t('roomsLegacy.view')}
                        </Button>
                        {(room.zoomLink || room.teamsLink) && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => window.open(room.zoomLink || room.teamsLink!, '_blank')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {t('roomsLegacy.join')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <BackButton fallbackPath="/rooms" />
        </div>
      </div>

      {/* 회의방 생성 다이얼로그 */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('roomsLegacy.createNew')}</DialogTitle>
            <DialogDescription>
              {t('roomsLegacy.createDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="room-name" className="text-sm font-medium">
                {t('roomsLegacy.roomName')} *
              </label>
              <Input
                id="room-name"
                placeholder={t('roomsLegacy.roomNamePlaceholder')}
                value={newRoomData.name}
                onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="room-description" className="text-sm font-medium">
                {t('roomsLegacy.description')}
              </label>
              <Textarea
                id="room-description"
                placeholder={t('roomsLegacy.descriptionPlaceholder')}
                value={newRoomData.description}
                onChange={(e) => setNewRoomData({ ...newRoomData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="zoom-link" className="text-sm font-medium">
                Zoom {t('roomsLegacy.link')}
              </label>
              <Input
                id="zoom-link"
                placeholder="https://zoom.us/j/..."
                value={newRoomData.zoomLink}
                onChange={(e) => setNewRoomData({ ...newRoomData, zoomLink: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="teams-link" className="text-sm font-medium">
                Teams {t('roomsLegacy.link')}
              </label>
              <Input
                id="teams-link"
                placeholder="https://teams.microsoft.com/..."
                value={newRoomData.teamsLink}
                onChange={(e) => setNewRoomData({ ...newRoomData, teamsLink: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              {t('roomsLegacy.cancel')}
            </Button>
            <Button 
              onClick={handleCreateRoom}
              disabled={createRoomMutation.isPending}
            >
              {createRoomMutation.isPending ? t('roomsLegacy.creating') : t('roomsLegacy.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}