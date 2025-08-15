import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Plus, Copy, Clock, User, ChevronRight } from "lucide-react";
import Navigation from "@/components/navigation";
import { BackButton } from "@/components/back-button";
import { useQuery } from "@tanstack/react-query";

export default function Rooms() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('personal');

  // 기업용 세션 목록 조회
  const { data: icebreakingSessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/icebreaking/sessions'],
    enabled: activeTab === 'enterprise'
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="회의방" />
      <div className="pt-20 pb-8 bg-muted/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-display text-4xl font-bold mb-4">회의방</h2>
            <p className="text-body text-lg text-muted-foreground">개인용 회의방과 기업용 아이스브레이킹 세션을 관리하세요.</p>
          </div>

          {/* 탭 메뉴 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="personal" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>개인용 회의방</span>
              </TabsTrigger>
              <TabsTrigger value="enterprise" className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>기업용 세션</span>
              </TabsTrigger>
            </TabsList>

            {/* 개인용 회의방 탭 */}
            <TabsContent value="personal">
              <div className="text-center mb-8">
                <p className="text-muted-foreground">회의 성향 보드에서 팀원들의 소통 스타일을 확인하고, 더 원활한 커뮤니케이션을 준비하세요.</p>
                <div className="mt-4">
                  <Button onClick={() => setLocation('/rooms-legacy')} variant="outline">
                    기존 회의방 보기
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* 기업용 세션 탭 */}
            <TabsContent value="enterprise">
              <div className="text-center mb-8">
                <p className="text-muted-foreground">조직의 아이스브레이킹 세션을 관리하고 참여하세요.</p>
                <div className="mt-4">
                  <Button
                    onClick={() => setLocation('/organization')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    새 세션 만들기
                  </Button>
                </div>
              </div>

              {/* 기업용 세션 목록 */}
              <div className="space-y-4">
                {sessionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-gray-500">세션 목록을 불러오는 중...</p>
                  </div>
                ) : icebreakingSessions.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">아직 생성된 세션이 없습니다</h3>
                      <p className="text-gray-500 mb-4">첫 번째 아이스브레이킹 세션을 만들어보세요!</p>
                      <Button
                        onClick={() => setLocation('/organization')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        새 세션 만들기
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {icebreakingSessions.map((session: any) => (
                      <Card key={session.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                                <Badge 
                                  variant={session.status === 'active' ? 'default' : 'secondary'}
                                  className={session.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                                >
                                  {session.status === 'waiting' ? '대기중' : 
                                   session.status === 'active' ? '진행중' : '완료'}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-3">{session.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  최대 {session.maxParticipants}명
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {new Date(session.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  <User className="w-4 h-4 mr-1" />
                                  {session.hostName}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  navigator.clipboard.writeText(session.inviteCode);
                                  alert('초대 코드가 복사되었습니다!');
                                }}
                              >
                                <Copy className="w-4 h-4 mr-1" />
                                {session.inviteCode}
                              </Button>
                              <Button
                                onClick={() => setLocation(`/icebreaking/${session.inviteCode}`)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                참여하기
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <BackButton fallbackPath="/" />
        </div>
      </div>
    </div>
  );
}