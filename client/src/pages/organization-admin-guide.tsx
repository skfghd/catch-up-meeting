import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function OrganizationAdminGuide() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">조직 관리자 가이드</h1>
          <p className="text-gray-600 text-lg">
            기업용 조직에서 관리자와 팀장 권한이 어떻게 설정되는지 알아보세요
          </p>
        </div>

        {/* 관리자 설정 프로세스 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              조직 관리자 설정 프로세스
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">1</div>
                <h3 className="font-semibold mb-2">첫 번째 가입자</h3>
                <p className="text-sm text-gray-600">조직에 처음 가입한 사람이 자동으로 관리자가 됩니다</p>
                <Badge variant="destructive" className="mt-2">관리자</Badge>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">2</div>
                <h3 className="font-semibold mb-2">추가 가입자들</h3>
                <p className="text-sm text-gray-600">그 이후 가입하는 모든 사람은 멤버 권한으로 시작</p>
                <Badge variant="secondary" className="mt-2">멤버</Badge>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">3</div>
                <h3 className="font-semibold mb-2">팀장 승격</h3>
                <p className="text-sm text-gray-600">관리자가 멤버를 팀장으로 승격 가능</p>
                <Badge variant="default" className="mt-2">팀장</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 권한별 기능 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              권한별 사용 가능한 기능
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-red-600" />
                  <Badge variant="destructive">관리자</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    모든 멤버 역할 변경
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    조직 설정 관리
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    팀장 대시보드 접근
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    아이스브레이킹 세션 생성
                  </li>
                </ul>
              </div>

              <div className="p-4 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <Badge variant="default">팀장</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    팀 대시보드 접근
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    팀원 분석 확인
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    회의 관리
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    아이스브레이킹 세션 참여
                  </li>
                </ul>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <Badge variant="secondary">멤버</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    기본 기능 사용
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    회의 참여
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    프로필 관리
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    아이스브레이킹 세션 참여
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 실제 사용 예시 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>실제 사용 예시: ABC 회사</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div className="flex-1">
                  <p className="font-semibold">김팀장이 ABC 회사 조직에 첫 번째로 가입</p>
                  <p className="text-sm text-gray-600">자동으로 <Badge variant="destructive" className="inline">관리자</Badge> 권한 부여</p>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div className="flex-1">
                  <p className="font-semibold">이과장, 박대리가 나중에 가입</p>
                  <p className="text-sm text-gray-600">모두 <Badge variant="secondary" className="inline">멤버</Badge> 권한으로 시작</p>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div className="flex-1">
                  <p className="font-semibold">김팀장이 조직 관리 페이지에서 이과장을 팀장으로 승격</p>
                  <p className="text-sm text-gray-600">이과장이 <Badge variant="default" className="inline">팀장</Badge> 권한으로 승격, 팀장 대시보드 사용 가능</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/organization-admin">조직 관리 페이지</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/team-leader">팀장 대시보드</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/rooms">세션 관리</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}