import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { useQuery } from '@tanstack/react-query';
import TeamLeaderDashboard from '@/components/team-leader-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, AlertCircle, Users, Lock } from 'lucide-react';
import { Link } from 'wouter';

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

export default function TeamLeaderPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isTeamLeader, isLoading: roleLoading, organizationName } = useRole();
  const [mockTeamData, setMockTeamData] = useState<TeamMember[]>([]);

  // 권한 체크: 로그인되어 있고 팀장 권한이 있는 경우만 접근 허용
  if (isLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">권한을 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-6">팀장 페이지는 로그인한 사용자만 접근할 수 있습니다.</p>
          <Button asChild>
            <Link href="/login">로그인하기</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!isTeamLeader) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Crown className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4">팀장 권한이 필요합니다</h2>
          <p className="text-gray-600 mb-6">
            이 페이지는 팀장(Manager) 또는 관리자(Admin) 권한이 있는 사용자만 접근할 수 있습니다.
            조직 관리자에게 권한 부여를 요청하세요.
          </p>
          <Button asChild variant="outline">
            <Link href="/rooms">돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  // 팀 데이터 가져오기 (실제 구현에서는 API 호출)
  const { data: teamData, isLoading: teamLoading } = useQuery({
    queryKey: ['/api/team/members', user?.id],
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    select: (data: TeamMember[]) => data || generateMockTeamData(),
  });

  // 목업 데이터 생성 (실제 구현에서는 제거)
  const generateMockTeamData = (): TeamMember[] => {
    return [
      {
        id: '1',
        name: '김철수',
        style: '세부분석형',
        strengths: ['데이터 분석', '품질 검토', '논리적 사고'],
        challenges: ['시간 관리', '빠른 결정'],
        meetingParticipation: 85,
        communicationEffectiveness: 78,
        department: '개발팀'
      },
      {
        id: '2', 
        name: '이영희',
        style: '시각전략형',
        strengths: ['아이디어 발표', '전략 수립', '시각화'],
        challenges: ['세부사항', '지속력'],
        meetingParticipation: 92,
        communicationEffectiveness: 88,
        department: 'PM팀'
      },
      {
        id: '3',
        name: '박민수',
        style: '효율실행형',
        strengths: ['빠른 실행', '시간 관리', '결정력'],
        challenges: ['신중한 검토', '타인 배려'],
        meetingParticipation: 76,
        communicationEffectiveness: 82,
        department: '사업팀'
      },
      {
        id: '4',
        name: '최지영',
        style: '포괄조화형',
        strengths: ['팀 조율', '전체적 시각', '배려'],
        challenges: ['확고한 의견', '빠른 결정'],
        meetingParticipation: 89,
        communicationEffectiveness: 91,
        department: '디자인팀'
      }
    ];
  };

  useEffect(() => {
    setMockTeamData(generateMockTeamData());
  }, []);

  const handleRoleAssignment = (assignments: any) => {
    console.log('역할 분배:', assignments);
    // 실제 구현: API 호출로 역할 분배 저장
  };

  const handleMeetingOptimization = (suggestions: any) => {
    console.log('회의 최적화:', suggestions);
    // 실제 구현: 최적화 설정 저장
  };

  if (isLoading || teamLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-2" />
            <CardTitle>팀장 전용 페이지</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              팀장 대시보드에 접근하려면 로그인이 필요합니다.
            </p>
            <Link href="/login">
              <Button className="w-full">로그인하기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentTeamData = teamData || mockTeamData;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 브레드크럼 */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">홈</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">팀장 대시보드</span>
        </nav>

        {/* 환영 메시지 */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-6 h-6" />
              <h1 className="text-2xl font-bold">환영합니다, {user?.name || '팀장'}님</h1>
            </div>
            <p className="text-blue-100">
              AI 기반 팀 분석을 통해 효과적인 협업 전략을 수립하고 팀 성과를 향상시켜보세요.
            </p>
          </CardContent>
        </Card>

        {/* 팀 현황 요약 */}
        {currentTeamData && currentTeamData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  팀원 수
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{currentTeamData?.length || 0}명</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">평균 참여도</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {currentTeamData && currentTeamData.length > 0 
                    ? Math.round(currentTeamData.reduce((sum, member) => sum + member.meetingParticipation, 0) / currentTeamData.length)
                    : 0}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">소통 효과성</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {currentTeamData && currentTeamData.length > 0
                    ? Math.round(currentTeamData.reduce((sum, member) => sum + member.communicationEffectiveness, 0) / currentTeamData.length)
                    : 0}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">성향 다양성</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {currentTeamData ? new Set(currentTeamData.map(m => m.style)).size : 0}가지
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 팀장 대시보드 컴포넌트 */}
        <TeamLeaderDashboard
          teamMembers={currentTeamData || []}
          onRoleAssignment={handleRoleAssignment}
          onMeetingOptimization={handleMeetingOptimization}
        />
      </div>
    </div>
  );
}