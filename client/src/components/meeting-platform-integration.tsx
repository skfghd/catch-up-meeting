
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Video, Users, Calendar, Clock, ExternalLink, Copy, Check, Trash2, MessageSquare, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MeetingPlatformProps {
  roomName: string;
  onSaveLinks?: (zoomLink: string, teamsLink: string, scheduledAt?: Date) => void;
  initialZoomLink?: string;
  initialTeamsLink?: string;
  initialScheduledAt?: Date;
}

export default function MeetingPlatformIntegration({ 
  roomName, 
  onSaveLinks, 
  initialZoomLink = "",
  initialTeamsLink = "",
  initialScheduledAt
}: MeetingPlatformProps) {
  const [zoomLink, setZoomLink] = useState(initialZoomLink);
  const [teamsLink, setTeamsLink] = useState(initialTeamsLink);
  const [scheduledDate, setScheduledDate] = useState(
    initialScheduledAt ? initialScheduledAt.toISOString().slice(0, 16) : ""
  );
  const [isScheduled, setIsScheduled] = useState(!!initialScheduledAt);
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSave = () => {
    const scheduled = isScheduled ? new Date(scheduledDate) : undefined;
    onSaveLinks?.(zoomLink, teamsLink, scheduled);
    setIsOpen(false);
    toast({
      title: "회의 링크 저장 완료",
      description: "회의 플랫폼 정보가 저장되었습니다.",
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(type);
      toast({
        title: "링크 복사 완료",
        description: `${type} 링크가 클립보드에 복사되었습니다.`,
      });
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  // 회의 링크는 보드 내에서 공유 목적으로만 사용

  const hasLinks = zoomLink || teamsLink;
  const isScheduledMeeting = isScheduled && scheduledDate;

  return (
    <div className="space-y-4">
      {/* 현재 설정된 회의 링크 표시 */}
      {hasLinks && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="h-5 w-5 text-primary" />
              회의 플랫폼 연결
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              설정된 회의 링크를 팀원들과 공유하세요. 복사 버튼을 눌러 링크를 클립보드에 복사할 수 있습니다.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {isScheduledMeeting && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <Calendar className="h-4 w-4" />
                <span>예정된 회의: {new Date(scheduledDate).toLocaleString('ko-KR')}</span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-700">회의 플랫폼</h4>
                <Badge variant="secondary" className="text-xs">
                  빠른 참여
                </Badge>
              </div>

              <div className="grid gap-3">
                {zoomLink && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                        <Video className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Zoom 회의</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs" title={zoomLink}>
                          {zoomLink}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          팀원들과 공유된 회의 링크
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(zoomLink, 'Zoom')}
                        className="h-8"
                      >
                        {copiedLink === 'Zoom' ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(zoomLink, 'Zoom')}
                        className="h-8"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        복사
                      </Button>
                    </div>
                  </div>
                )}

                {teamsLink && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Teams 회의</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs" title={teamsLink}>
                          {teamsLink}
                        </div>
                        <div className="text-xs text-purple-600 mt-1">
                          팀원들과 공유된 회의 링크
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(teamsLink, 'Teams')}
                        className="h-8"
                      >
                        {copiedLink === 'Teams' ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(teamsLink, 'Teams')}
                        className="h-8"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        복사
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}



      {/* 회의 플랫폼 설정 버튼 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {hasLinks ? "회의 링크 수정" : "회의 플랫폼 연결"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>회의 플랫폼 연결</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* 회의 일정 설정 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="scheduled" className="text-sm font-medium">
                  회의 일정 설정
                </Label>
                <Switch
                  id="scheduled"
                  checked={isScheduled}
                  onCheckedChange={setIsScheduled}
                />
              </div>
              {isScheduled && (
                <div>
                  <Label htmlFor="scheduledDate" className="text-sm">예정 시간</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Zoom 링크 설정 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <Video className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Label htmlFor="zoomLink" className="text-sm font-medium">
                    Zoom 회의 링크
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Zoom 회의실 URL을 입력하세요
                  </p>
                </div>
              </div>
              <Input
                id="zoomLink"
                type="url"
                placeholder="https://zoom.us/j/123456789?pwd=..."
                value={zoomLink}
                onChange={(e) => setZoomLink(e.target.value)}
              />
            </div>

            <Separator />

            {/* Teams 링크 설정 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Label htmlFor="teamsLink" className="text-sm font-medium">
                    Microsoft Teams 링크
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Teams 회의실 URL을 입력하세요
                  </p>
                </div>
              </div>
              <Input
                id="teamsLink"
                type="url"
                placeholder="https://teams.microsoft.com/l/meetup-join/..."
                value={teamsLink}
                onChange={(e) => setTeamsLink(e.target.value)}
              />
            </div>

            {/* 빠른 저장 버튼 */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsOpen(false)} size="sm">
                취소
              </Button>
              <Button onClick={handleSave} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                저장
              </Button>
            </div>

            {/* 안내 메시지 */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <div className="flex gap-3">
                <Video className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    회의 플랫폼 연결 안내
                  </p>
                  <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                    <li>• 회의 링크를 저장하면 참가자들과 쉽게 공유할 수 있습니다</li>
                    <li>• 여러 플랫폼을 동시에 설정할 수 있습니다</li>
                    <li>• 예정된 회의 시간을 설정하면 알림을 받을 수 있습니다</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* AI 회의록 도구 섹션 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <h4 className="text-sm font-medium">AI 회의록 도구</h4>
              </div>
              
              {/* AI 도구들 그리드 */}
              <div className="grid grid-cols-2 gap-3">
                {/* timeOS */}
                <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">timeOS</span>
                    <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
                      AI 회의록
                    </Badge>
                  </div>
                  <p className="text-xs text-purple-700 mb-3">
                    실시간 회의 기록 및 요약 생성
                  </p>
                  <Button
                    onClick={() => window.open('https://timeos.ai', '_blank')}
                    variant="outline"
                    size="sm"
                    className="w-full text-purple-700 border-purple-300 hover:bg-purple-100"
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    사용하기
                  </Button>
                </div>

                {/* Otter.ai */}
                <div className="p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Otter.ai</span>
                    <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                      음성 인식
                    </Badge>
                  </div>
                  <p className="text-xs text-green-700 mb-3">
                    실시간 음성을 텍스트로 변환
                  </p>
                  <Button
                    onClick={() => window.open('https://otter.ai', '_blank')}
                    variant="outline"
                    size="sm"
                    className="w-full text-green-700 border-green-300 hover:bg-green-100"
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    사용하기
                  </Button>
                </div>

                {/* Notion AI */}
                <div className="p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">Notion AI</span>
                    <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                      문서화
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-700 mb-3">
                    회의록 정리 및 액션 아이템 추출
                  </p>
                  <Button
                    onClick={() => window.open('https://notion.so/product/ai', '_blank')}
                    variant="outline"
                    size="sm"
                    className="w-full text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    사용하기
                  </Button>
                </div>

                {/* Fireflies.ai */}
                <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-orange-800">Fireflies</span>
                    <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                      회의 분석
                    </Badge>
                  </div>
                  <p className="text-xs text-orange-700 mb-3">
                    회의 참여도 및 인사이트 분석
                  </p>
                  <Button
                    onClick={() => window.open('https://fireflies.ai', '_blank')}
                    variant="outline"
                    size="sm"
                    className="w-full text-orange-700 border-orange-300 hover:bg-orange-100"
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    사용하기
                  </Button>
                </div>
              </div>

              {/* AI 도구 안내 */}
              <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg">
                <div className="flex gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                      AI 회의록 도구 활용 팁
                    </p>
                    <ul className="space-y-1 text-amber-800 dark:text-amber-200">
                      <li>• 회의 시작 전에 미리 도구를 준비해두세요</li>
                      <li>• 여러 도구를 조합하여 더 완성도 높은 회의록을 만들 수 있습니다</li>
                      <li>• 중요한 결정사항은 별도로 기록해두는 것을 권장합니다</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
