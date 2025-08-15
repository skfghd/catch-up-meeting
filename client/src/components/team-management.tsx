import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, UserPlus, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import type { Team, TeamMember } from '@shared/schema';

interface TeamManagementProps {
  onTeamsChanged?: (teams: Team[]) => void;
}

export default function TeamManagement({ onTeamsChanged }: TeamManagementProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Communication styles for dropdown
  const communicationStyles = [
    'Visual Leader 🎯 (VFS)', 'Analytical Thinker 📊 (AFS)', 'Action Hero 🚀 (KFS)',
    'Trend Scout 🌊 (VFW)', 'Detail Master 🔍 (AFW)', 'Collaborator 🤝 (KFW)',
    'Strategic Visionary 🎨 (VDS)', 'Logic Processor 💡 (ADS)', 'Execution Expert ⚡ (KDS)'
  ];

  // Load user's teams
  useEffect(() => {
    if (isAuthenticated) {
      loadTeams();
    }
  }, [isAuthenticated]);

  const loadTeams = async () => {
    try {
      if (!isAuthenticated) {
        console.log('로그인이 필요합니다.');
        toast({ title: "로그인 필요", description: "팀 관리 기능을 사용하려면 로그인이 필요합니다.", variant: "destructive" });
        return;
      }
      
      const data = await apiRequest('/api/teams');
      setTeams(data);
      onTeamsChanged?.(data);
    } catch (error: any) {
      console.error('Failed to load teams:', error);
      
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        toast({ title: "인증 오류", description: "로그인이 필요합니다. 다시 로그인해주세요.", variant: "destructive" });
      } else {
        toast({ title: "오류", description: "팀 목록을 불러오는데 실패했습니다.", variant: "destructive" });
      }
    }
  };

  const loadTeamMembers = async (teamId: number) => {
    try {
      const data = await apiRequest(`/api/teams/${teamId}/members`);
      setTeamMembers(data);
    } catch (error) {
      console.error('Failed to load team members:', error);
      toast({ title: "오류", description: "팀원 목록을 불러오는데 실패했습니다.", variant: "destructive" });
    }
  };

  const createTeam = async (formData: FormData) => {
    if (!isAuthenticated) {
      toast({ title: "로그인 필요", description: "팀을 생성하려면 로그인이 필요합니다.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const teamData = {
        name: formData.get('name') as string,
        department: formData.get('department') as string,
        description: formData.get('description') as string,
      };

      console.log('팀 생성 시도:', teamData);

      await apiRequest('/api/teams', {
        method: 'POST',
        body: JSON.stringify(teamData),
        headers: { 'Content-Type': 'application/json' }
      });

      toast({ title: "성공", description: "새 팀이 생성되었습니다." });
      setIsCreateTeamOpen(false);
      loadTeams();
    } catch (error: any) {
      console.error('Failed to create team:', error);
      
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        toast({ title: "인증 오류", description: "로그인이 필요합니다. 다시 로그인해주세요.", variant: "destructive" });
      } else if (error.message?.includes('400')) {
        toast({ title: "입력 오류", description: "팀 정보를 다시 확인해주세요.", variant: "destructive" });
      } else {
        toast({ title: "오류", description: "팀 생성에 실패했습니다.", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async (formData: FormData) => {
    if (!selectedTeam) return;
    
    setLoading(true);
    try {
      const memberData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        department: formData.get('department') as string,
        position: formData.get('position') as string,
        communicationStyle: formData.get('communicationStyle') as string,
        strengths: (formData.get('strengths') as string).split(',').map(s => s.trim()).filter(s => s),
        challenges: (formData.get('challenges') as string).split(',').map(s => s.trim()).filter(s => s),
      };

      await apiRequest(`/api/teams/${selectedTeam.id}/members`, {
        method: 'POST',
        body: JSON.stringify(memberData),
        headers: { 'Content-Type': 'application/json' }
      });

      toast({ title: "성공", description: "새 팀원이 추가되었습니다." });
      setIsAddMemberOpen(false);
      loadTeamMembers(selectedTeam.id);
    } catch (error) {
      console.error('Failed to add team member:', error);
      toast({ title: "오류", description: "팀원 추가에 실패했습니다.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (memberId: number) => {
    if (!selectedTeam) return;
    
    try {
      await apiRequest(`/api/teams/${selectedTeam.id}/members/${memberId}`, {
        method: 'DELETE'
      });
      
      toast({ title: "성공", description: "팀원이 삭제되었습니다." });
      loadTeamMembers(selectedTeam.id);
    } catch (error) {
      console.error('Failed to delete member:', error);
      toast({ title: "오류", description: "팀원 삭제에 실패했습니다.", variant: "destructive" });
    }
  };

  const selectTeam = (team: Team) => {
    setSelectedTeam(team);
    loadTeamMembers(team.id);
  };

  return (
    <div className="space-y-6">
      {/* 팀 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              내 팀 관리
            </div>
            <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  새 팀 생성
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>새 팀 생성</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  createTeam(new FormData(e.currentTarget));
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="name">팀 이름</Label>
                    <Input name="name" required placeholder="예: 개발팀" />
                  </div>
                  <div>
                    <Label htmlFor="department">부서</Label>
                    <Input name="department" placeholder="예: IT사업부" />
                  </div>
                  <div>
                    <Label htmlFor="description">설명</Label>
                    <Textarea name="description" placeholder="팀에 대한 간단한 설명을 입력하세요" />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? '생성 중...' : '팀 생성'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teams.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>생성된 팀이 없습니다.</p>
              <p className="text-sm">새 팀을 생성하여 구성원을 관리해보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTeam?.id === team.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => selectTeam(team)}
                >
                  <h3 className="font-semibold text-gray-900">{team.name}</h3>
                  {team.department && (
                    <p className="text-sm text-gray-600">{team.department}</p>
                  )}
                  {team.description && (
                    <p className="text-xs text-gray-500 mt-1">{team.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 선택된 팀의 구성원 관리 */}
      {selectedTeam && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                {selectedTeam.name} 구성원
              </div>
              <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    구성원 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>새 구성원 추가</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    addTeamMember(new FormData(e.currentTarget));
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">이름</Label>
                        <Input name="name" required placeholder="홍길동" />
                      </div>
                      <div>
                        <Label htmlFor="email">이메일</Label>
                        <Input name="email" type="email" placeholder="hong@company.com" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="department">부서</Label>
                        <Input name="department" placeholder="개발팀" />
                      </div>
                      <div>
                        <Label htmlFor="position">직급</Label>
                        <Input name="position" placeholder="선임연구원" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="communicationStyle">커뮤니케이션 스타일</Label>
                      <Select name="communicationStyle">
                        <SelectTrigger>
                          <SelectValue placeholder="스타일을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {communicationStyles.map((style) => (
                            <SelectItem key={style} value={style}>
                              {style}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="strengths">강점 (쉼표로 구분)</Label>
                      <Input name="strengths" placeholder="데이터 분석, 문제 해결, 팀워크" />
                    </div>
                    <div>
                      <Label htmlFor="challenges">개선점 (쉼표로 구분)</Label>
                      <Input name="challenges" placeholder="시간 관리, 발표 스킬" />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? '추가 중...' : '구성원 추가'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>등록된 구성원이 없습니다.</p>
                <p className="text-sm">첫 번째 구성원을 추가해보세요.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{member.name}</h4>
                          {member.communicationStyle && (
                            <Badge variant="secondary">{member.communicationStyle}</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          {member.email && (
                            <div>
                              <span className="font-medium">이메일:</span> {member.email}
                            </div>
                          )}
                          {member.position && (
                            <div>
                              <span className="font-medium">직급:</span> {member.position}
                            </div>
                          )}
                          {member.department && (
                            <div>
                              <span className="font-medium">부서:</span> {member.department}
                            </div>
                          )}
                        </div>

                        {member.strengths && member.strengths.length > 0 && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-green-700">강점: </span>
                            <span className="text-sm text-green-600">
                              {member.strengths.join(', ')}
                            </span>
                          </div>
                        )}

                        {member.challenges && member.challenges.length > 0 && (
                          <div className="mt-1">
                            <span className="text-sm font-medium text-orange-700">개선점: </span>
                            <span className="text-sm text-orange-600">
                              {member.challenges.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMember(member.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}