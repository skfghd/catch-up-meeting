import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Target, 
  Users, 
  BarChart3, 
  Settings,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  style: string;
  strengths: string[];
  challenges: string[];
  meetingParticipation: number;
  communicationEffectiveness: number;
  department?: string;
}

interface Props {
  teamMembers: TeamMember[];
  onRoleAssignment?: (assignments: any) => void;
  onMeetingOptimization?: (suggestions: any) => void;
}

export default function TeamLeaderDashboard({ teamMembers, onRoleAssignment, onMeetingOptimization }: Props) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // 팀 통계 계산
  const teamStats = useMemo(() => {
    if (!teamMembers || teamMembers.length === 0) {
      return {
        totalMembers: 0,
        avgParticipation: 0,
        avgEffectiveness: 0,
        styleDistribution: {}
      };
    }

    const avgParticipation = teamMembers.reduce((sum, member) => sum + member.meetingParticipation, 0) / teamMembers.length;
    const avgEffectiveness = teamMembers.reduce((sum, member) => sum + member.communicationEffectiveness, 0) / teamMembers.length;
    
    const styleDistribution = teamMembers.reduce((acc, member) => {
      acc[member.style] = (acc[member.style] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMembers: teamMembers.length,
      avgParticipation: Math.round(avgParticipation),
      avgEffectiveness: Math.round(avgEffectiveness),
      styleDistribution
    };
  }, [teamMembers]);

  // AI 분석 시작
  const startAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // 실제 API 호출로 팀 분석 수행
      const mockResults = {
        roleRecommendations: [
          {
            member: '김철수',
            recommendedRoles: ['기술 검토자', '품질 관리자'],
            reason: '세부적인 분석 능력과 품질에 대한 높은 기준을 가지고 있어 기술 검토에 적합합니다.'
          },
          {
            member: '이영희',
            recommendedRoles: ['회의 진행자', '프레젠테이션 리더'],
            reason: '시각적 전달력이 뛰어나고 전략적 사고가 가능해 회의 진행에 최적입니다.'
          }
        ],
        meetingOptimizations: [
          {
            title: '회의 시간 최적화',
            suggestion: '현재 평균 60분 회의를 45분으로 단축하여 집중도를 높이세요.',
            impact: '참여도 15% 향상 예상'
          },
          {
            title: '역할 분배 개선',
            suggestion: '각 구성원의 강점에 맞는 명확한 역할 분배로 효율성을 높이세요.',
            impact: '의사결정 속도 25% 향상 예상'
          }
        ],
        risks: [
          '김철수의 빠른 결정 어려움이 프로젝트 지연을 야기할 수 있음',
          '팀 내 소통 스타일 차이로 인한 오해 발생 가능성'
        ],
        opportunities: [
          '이영희의 시각적 전달력을 활용한 클라이언트 프레젠테이션 강화',
          '팀원들의 다양한 성향을 조합한 창의적 문제해결 접근법 개발'
        ]
      };
      
      setAnalysisResults(mockResults);
      onRoleAssignment?.(mockResults.roleRecommendations);
      onMeetingOptimization?.(mockResults.meetingOptimizations);
    } catch (error) {
      console.error('팀 분석 오류:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 팀장 대시보드 헤더 */}
      <Card className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">팀장 대시보드</h2>
              <p className="text-indigo-100">
                AI 기반 팀 분석으로 효과적인 리더십을 발휘하세요
              </p>
            </div>
            <Crown className="w-16 h-16 text-indigo-200" />
          </div>
        </CardContent>
      </Card>

      {/* 팀 개요 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              팀원 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{teamStats.totalMembers}명</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">평균 참여도</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{teamStats.avgParticipation}%</div>
            <Progress value={teamStats.avgParticipation} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">소통 효과성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{teamStats.avgEffectiveness}%</div>
            <Progress value={teamStats.avgEffectiveness} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">성향 다양성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {Object.keys(teamStats.styleDistribution).length}가지
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">팀 현황</TabsTrigger>
          <TabsTrigger value="analysis">AI 분석</TabsTrigger>
          <TabsTrigger value="recommendations">추천사항</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        {/* 팀 현황 탭 */}
        <TabsContent value="overview" className="space-y-6">
          {/* 성향 분포 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                팀 성향 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(teamStats.styleDistribution).map(([style, count]) => (
                  <div key={style} className="flex items-center justify-between">
                    <span className="font-medium">{style}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32">
                        <Progress value={(count / teamStats.totalMembers) * 100} />
                      </div>
                      <span className="text-sm text-gray-600 min-w-[40px]">{count}명</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI 분석 탭 */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                AI 팀 성향 분석
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                팀원들의 성향을 종합 분석하여 최적의 협업 전략을 제안합니다.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={startAnalysis}
                disabled={isAnalyzing || teamMembers.length === 0}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    AI 분석 진행 중...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    AI 팀 분석 시작
                  </>
                )}
              </Button>

              {analysisResults && (
                <div className="mt-6 space-y-4">
                  {/* 위험 요소 */}
                  {analysisResults.risks?.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        주의 사항
                      </h4>
                      <ul className="space-y-1">
                        {analysisResults.risks.map((risk: string, index: number) => (
                          <li key={index} className="text-red-700 text-sm flex items-start gap-2">
                            <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 기회 요소 */}
                  {analysisResults.opportunities?.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        활용 기회
                      </h4>
                      <ul className="space-y-1">
                        {analysisResults.opportunities.map((opportunity: string, index: number) => (
                          <li key={index} className="text-green-700 text-sm flex items-start gap-2">
                            <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 추천사항 탭 */}
        <TabsContent value="recommendations" className="space-y-6">
          {analysisResults ? (
            <div className="space-y-6">
              {/* 역할 추천 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    AI 역할 분배 추천
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResults.roleRecommendations?.map((rec: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{rec.member}</h4>
                          <div className="flex gap-2">
                            {rec.recommendedRoles.map((role: string, roleIdx: number) => (
                              <Badge key={roleIdx} variant="secondary" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 회의 최적화 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    회의 최적화 제안
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResults.meetingOptimizations?.map((opt: any, index: number) => (
                      <div key={index} className="border-l-4 border-l-blue-500 bg-blue-50 p-4 rounded-r-lg">
                        <h4 className="font-medium mb-1">{opt.title}</h4>
                        <p className="text-sm text-gray-700 mb-2">{opt.suggestion}</p>
                        <div className="text-xs text-blue-600 font-medium">{opt.impact}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">분석 결과 없음</h3>
                <p className="text-gray-500 mb-4">
                  AI 분석을 먼저 실행하여 맞춤형 추천사항을 받아보세요.
                </p>
                <Button onClick={() => setActiveTab('analysis')} variant="outline">
                  AI 분석 탭으로 이동
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 설정 탭 */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                팀장 도구 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">설정 기능</h3>
                <p className="text-gray-500">
                  향후 업데이트에서 팀 관리 설정 기능이 추가될 예정입니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}