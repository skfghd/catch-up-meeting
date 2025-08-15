import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Crown, Users, Settings, Lock } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function OrganizationAdminPage() {
  const { user, isAuthenticated } = useAuth();
  const { isAdmin, organizationName } = useRole();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 팀 멤버 목록 조회
  const { data: members, isLoading } = useQuery({
    queryKey: ['/api/team/members'],
    enabled: isAuthenticated && isAdmin,
  });

  // 역할 변경 mutation
  const roleUpdateMutation = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: number; role: string }) => {
      await apiRequest(`/api/team/members/${memberId}/role`, {
        method: 'PATCH',
        body: { role },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      toast({
        title: "성공",
        description: "멤버 역할이 변경되었습니다",
      });
    },
    onError: (error) => {
      toast({
        title: "오류",
        description: "역할 변경에 실패했습니다",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-6">조직 관리 페이지는 로그인한 사용자만 접근할 수 있습니다.</p>
          <Button asChild>
            <Link href="/login">로그인하기</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4">관리자 권한이 필요합니다</h2>
          <p className="text-gray-600 mb-6">
            이 페이지는 조직 관리자(Admin) 권한이 있는 사용자만 접근할 수 있습니다.
          </p>
          <Button asChild variant="outline">
            <Link href="/rooms">돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'manager': return 'default';
      case 'member': return 'secondary';
      case 'guest': return 'outline';
      default: return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return '관리자';
      case 'manager': return '팀장';
      case 'member': return '멤버';
      case 'guest': return '게스트';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">조직 관리</h1>
              <p className="text-gray-600">
                {organizationName} 조직의 멤버 역할을 관리하세요
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/team-leader">팀장 대시보드</Link>
            </Button>
          </div>
        </div>

        {/* 역할 설명 카드 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              역할 권한 안내
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <Badge variant="destructive" className="mb-2">관리자</Badge>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 모든 멤버 역할 변경</li>
                  <li>• 조직 설정 관리</li>
                  <li>• 팀장 권한 포함</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <Badge variant="default" className="mb-2">팀장</Badge>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 팀 대시보드 접근</li>
                  <li>• 팀원 분석 확인</li>
                  <li>• 회의 관리</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Badge variant="secondary" className="mb-2">멤버</Badge>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 기본 기능 사용</li>
                  <li>• 회의 참여</li>
                  <li>• 프로필 관리</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Badge variant="outline" className="mb-2">게스트</Badge>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 임시 참여</li>
                  <li>• 제한적 접근</li>
                  <li>• 기본 기능만</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 멤버 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              조직 멤버 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">멤버 목록을 불러오는 중...</p>
              </div>
            ) : !members || members.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">조직에 등록된 멤버가 없습니다.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>부서</TableHead>
                    <TableHead>현재 역할</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead>역할 변경</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(members || []).map((member: any) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.userName || member.guestName || '이름 없음'}
                      </TableCell>
                      <TableCell>
                        {member.userEmail || member.guestEmail || '-'}
                      </TableCell>
                      <TableCell>{member.department || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(member.role)}>
                          {getRoleLabel(member.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={member.role}
                          onValueChange={(newRole) => {
                            roleUpdateMutation.mutate({
                              memberId: member.id,
                              role: newRole,
                            });
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">관리자</SelectItem>
                            <SelectItem value="manager">팀장</SelectItem>
                            <SelectItem value="member">멤버</SelectItem>
                            <SelectItem value="guest">게스트</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}