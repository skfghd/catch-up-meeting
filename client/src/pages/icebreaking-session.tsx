import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Clock, 
  Share2, 
  User,
  Coffee,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  UserPlus,
  PlayCircle,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { IcebreakingSession, IcebreakingParticipant } from "@shared/schema";

interface SessionParticipant extends IcebreakingParticipant {
  mbtiType?: string;
  profileComplete?: boolean;
}

export default function IcebreakingSessionPage() {
  const [, params] = useRoute("/icebreaking/:inviteCode");
  const { toast } = useToast();
  const [joinData, setJoinData] = useState({
    guestName: "",
    guestEmail: ""
  });
  const [hasJoined, setHasJoined] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);

  // URL 파라미터에서 이름/이메일 자동 입력
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    
    if (name) {
      setJoinData(prev => ({ ...prev, guestName: decodeURIComponent(name) }));
    }
    if (email) {
      setJoinData(prev => ({ ...prev, guestEmail: decodeURIComponent(email) }));
    }
  }, []);

  // 세션 정보 조회
  const { data: session, isLoading: sessionLoading, error: sessionError } = useQuery<IcebreakingSession>({
    queryKey: ['/api/icebreaking/sessions', params?.inviteCode],
    enabled: !!params?.inviteCode,
  });

  // 참가자 목록 조회
  const { data: participants = [], isLoading: participantsLoading } = useQuery<SessionParticipant[]>({
    queryKey: ['/api/icebreaking/participants', params?.inviteCode],
    enabled: !!params?.inviteCode && hasJoined,
  });

  // 세션 참여 뮤테이션
  const joinMutation = useMutation({
    mutationFn: async (data: { guestName: string; guestEmail?: string }) => {
      return await apiRequest(`/api/icebreaking/sessions/${params?.inviteCode}/join`, {
        method: 'POST',
        body: data
      });
    },
    onSuccess: () => {
      setHasJoined(true);
      queryClient.invalidateQueries({ queryKey: ['/api/icebreaking/participants'] });
      toast({
        title: "참여 완료!",
        description: "아이스브레이킹 세션에 참여했습니다.",
      });
    },
    onError: (error) => {
      console.error('Join session error:', error);
      toast({
        title: "참여 실패",
        description: "세션 참여에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  });

  const handleJoinSession = () => {
    if (!joinData.guestName.trim()) {
      toast({
        title: "이름을 입력해주세요",
        description: "세션 참여를 위해 이름이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    joinMutation.mutate(joinData);
  };

  const handleStartSurvey = () => {
    setShowSurvey(true);
  };

  const copyInviteLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    toast({
      title: "링크 복사됨",
      description: "초대 링크가 클립보드에 복사되었습니다.",
    });
  };

  const getParticipantStats = () => {
    if (!Array.isArray(participants)) return { total: 0, completed: 0, progress: 0 };
    
    const total = participants.length;
    const completed = participants.filter((p: SessionParticipant) => p.surveyCompleted).length;
    return { total, completed, progress: total > 0 ? (completed / total) * 100 : 0 };
  };

  const getMBTIDistribution = () => {
    if (!Array.isArray(participants)) return [];
    
    const mbtiTypes = participants
      .filter((p: SessionParticipant) => p.profileData && typeof p.profileData === 'object' && 'mbtiType' in p.profileData)
      .map((p: SessionParticipant) => (p.profileData as any).mbtiType)
      .filter(Boolean);
    
    const distribution = mbtiTypes.reduce((acc: Record<string, number>, type: string) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5);
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">세션 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">세션을 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-6">
              초대 코드를 다시 확인하거나 세션 관리자에게 문의하세요.
            </p>
            <Button onClick={() => window.history.back()}>
              뒤로 가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = getParticipantStats();
  const mbtiDistribution = getMBTIDistribution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* 헤더 */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{session.title}</h1>
              <p className="text-gray-600 mt-1">호스트: {session.hostName}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {session.status === 'waiting' ? '대기 중' : 
                 session.status === 'active' ? '진행 중' : '완료'}
              </Badge>
              <Button variant="outline" size="sm" onClick={copyInviteLink} className="w-full sm:w-auto">
                <Share2 className="w-4 h-4 mr-2" />
                초대 링크 공유
              </Button>
            </div>
          </div>
          
          {session.description && (
            <p className="text-gray-700">{session.description}</p>
          )}
        </div>

        {!hasJoined ? (
          /* 참여 폼 */
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
                  세션 참여하기
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="guestName">이름 *</Label>
                  <Input
                    id="guestName"
                    placeholder="세션에서 사용할 이름"
                    value={joinData.guestName}
                    onChange={(e) => setJoinData({...joinData, guestName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="guestEmail">이메일 (선택)</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    placeholder="결과 공유를 위한 이메일"
                    value={joinData.guestEmail}
                    onChange={(e) => setJoinData({...joinData, guestEmail: e.target.value})}
                  />
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleJoinSession}
                  disabled={joinMutation.isPending}
                >
                  {joinMutation.isPending ? "참여 중..." : "세션 참여"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* 메인 대시보드 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* 왼쪽: 세션 진행 상황 */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* 진행 상황 카드 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    세션 진행 현황
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">MBTI 설문 완료 현황</span>
                      <span className="text-sm font-medium">{stats.completed}/{stats.total}명</span>
                    </div>
                    <Progress value={stats.progress} className="h-2" />
                    <div className="text-xs text-gray-500">
                      {stats.progress === 100 ? "모든 참가자가 설문을 완료했습니다!" : 
                       "모든 참가자가 설문을 완료하면 아이스브레이킹을 시작할 수 있습니다."}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* MBTI 분포 카드 */}
              {mbtiDistribution.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>팀 MBTI 분포</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mbtiDistribution.map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="w-16 justify-center">
                              {type}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {type === 'ESTJ' ? '경영자형' :
                               type === 'ENFP' ? '재기발랄한 활동가' :
                               type === 'INTJ' ? '용의주도한 전략가' :
                               type === 'ISFP' ? '호기심 많은 예술가' : ''}
                            </span>
                          </div>
                          <span className="font-medium">{count as number}명</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 아이스브레이킹 활동 제안 */}
              {stats.progress >= 50 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Coffee className="w-5 h-5 mr-2 text-blue-600" />
                      추천 아이스브레이킹 활동
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">🎯 MBTI 추측 게임</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          서로의 MBTI 유형을 맞춰보는 게임으로 자연스럽게 성향을 공유해보세요.
                        </p>
                        <div className="text-xs text-blue-600">
                          예상 시간: 10-15분 | 난이도: ⭐⭐
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">💬 역할별 자기소개</h4>
                        <p className="text-sm text-green-700 mb-3">
                          각자의 MBTI 특성에 맞는 역할로 프로젝트에서의 강점을 소개해보세요.
                        </p>
                        <div className="text-xs text-green-600">
                          예상 시간: 15-20분 | 난이도: ⭐⭐⭐
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 오른쪽: 참가자 목록 */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      참가자 ({participants.length}/{session.maxParticipants})
                    </span>
                    {!showSurvey && (
                      <Button 
                        size="sm" 
                        onClick={handleStartSurvey}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <PlayCircle className="w-4 h-4 mr-1" />
                        설문 시작
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.isArray(participants) && participants.map((participant: SessionParticipant) => (
                      <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{participant.guestName}</p>
                            {participant.profileData && typeof participant.profileData === 'object' && 'mbtiType' in participant.profileData && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {(participant.profileData as any).mbtiType}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          {participant.surveyCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {(!Array.isArray(participants) || participants.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>아직 참가자가 없습니다</p>
                        <p className="text-sm mt-1">초대 링크를 공유해보세요!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* MBTI 설문 모달 */}
        {showSurvey && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>MBTI 성향 분석</CardTitle>
                <p className="text-sm text-gray-600">
                  아이스브레이킹을 위한 간단한 성향 분석을 진행합니다.
                </p>
              </CardHeader>
              <CardContent>
                {/* 여기에 설문 컴포넌트 추가 */}
                <div className="text-center py-8">
                  <PlayCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">설문 준비 중</h3>
                  <p className="text-gray-600 mb-6">
                    MBTI 성향 분석을 통해 팀원들과 더 효과적으로 소통할 수 있는 방법을 알아보세요.
                  </p>
                  <div className="flex space-x-3 justify-center">
                    <Button variant="outline" onClick={() => setShowSurvey(false)}>
                      나중에 하기
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      설문 시작
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}