import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Download,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface OrganizationData {
  totalEmployees: number;
  totalMeetings: number;
  avgMeetingEfficiency: number;
  communicationTrends: {
    month: string;
    efficiency: number;
    satisfaction: number;
    conflictReduction: number;
  }[];
  departmentAnalysis: {
    department: string;
    employeeCount: number;
    dominantStyles: string[];
    collaborationScore: number;
    meetingFrequency: number;
  }[];
  styleDistribution: {
    style: string;
    count: number;
    percentage: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }[];
}

interface Props {
  organizationData: OrganizationData;
  onDataExport?: (data: any) => void;
}

export default function OrganizationAnalytics({ organizationData, onDataExport }: Props) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState('overview');

  // 부서별 필터링된 데이터
  const filteredDepartments = selectedDepartment === 'all' 
    ? organizationData.departmentAnalysis 
    : organizationData.departmentAnalysis.filter(dept => dept.department === selectedDepartment);

  // 트렌드 계산
  const latestTrend = organizationData.communicationTrends[organizationData.communicationTrends.length - 1];
  const previousTrend = organizationData.communicationTrends[organizationData.communicationTrends.length - 2];
  
  const efficiencyChange = latestTrend && previousTrend 
    ? latestTrend.efficiency - previousTrend.efficiency
    : 0;

  const handleExportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      organizationData,
      summary: {
        totalEmployees: organizationData.totalEmployees,
        avgEfficiency: organizationData.avgMeetingEfficiency,
        topPerformingDepartment: organizationData.departmentAnalysis
          .reduce((prev, current) => prev.collaborationScore > current.collaborationScore ? prev : current),
        recommendedActions: [
          '저성과 부서 대상 맞춤형 코칭 프로그램 실시',
          '우수 부서의 협업 방식을 다른 부서에 전파',
          '성향 다양성이 낮은 팀에 다른 성향 구성원 보완'
        ]
      }
    };
    
    onDataExport?.(exportData);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <Building2 className="w-8 h-8" />
                조직 협업 인사이트
              </h2>
              <p className="text-indigo-100">
                KT DS 전체 조직의 커뮤니케이션 패턴과 협업 효율성을 분석합니다
              </p>
            </div>
            <Button
              onClick={handleExportData}
              variant="secondary"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <Download className="w-4 h-4 mr-2" />
              데이터 내보내기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              전체 직원 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {organizationData.totalEmployees.toLocaleString()}명
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              총 회의 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {organizationData.totalMeetings.toLocaleString()}회
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Target className="w-4 h-4" />
              평균 회의 효율성
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {organizationData.avgMeetingEfficiency}%
            </div>
            <Progress value={organizationData.avgMeetingEfficiency} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              효율성 변화
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${efficiencyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {efficiencyChange >= 0 ? '+' : ''}{efficiencyChange}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              전월 대비
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 탭 네비게이션 */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">전체 현황</TabsTrigger>
          <TabsTrigger value="departments">부서별 분석</TabsTrigger>
          <TabsTrigger value="trends">트렌드 분석</TabsTrigger>
        </TabsList>

        {/* 전체 현황 탭 */}
        <TabsContent value="overview" className="space-y-6">
          {/* 성향 분포 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                조직 전체 성향 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {organizationData.styleDistribution.map((style, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium min-w-[120px]">{style.style}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          style.trend === 'increasing' ? 'text-green-700 bg-green-50' :
                          style.trend === 'decreasing' ? 'text-red-700 bg-red-50' :
                          'text-gray-700 bg-gray-50'
                        }`}
                      >
                        {style.trend === 'increasing' ? '증가' : 
                         style.trend === 'decreasing' ? '감소' : '안정'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 flex-1 max-w-md">
                      <div className="flex-1">
                        <Progress value={style.percentage} className="h-2" />
                      </div>
                      <div className="text-sm text-gray-600 min-w-[80px] text-right">
                        {style.count}명 ({style.percentage}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 주요 인사이트 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  강점 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>세부분석형이 22.3%로 가장 높아 정확한 업무 처리가 가능</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>시각전략형이 18.6%로 두 번째로 높아 전략적 사고 능력 우수</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>다양한 성향의 균형적 분포로 창의적 문제해결 가능</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertCircle className="w-5 h-5" />
                  개선 포인트
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span>실행력 중심 성향(효율실행형)의 비율이 상대적으로 낮음</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span>빠른 의사결정을 선호하는 구성원이 부족할 수 있음</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span>부서 간 성향 편중으로 인한 협업 마찰 가능성</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 부서별 분석 탭 */}
        <TabsContent value="departments" className="space-y-6">
          {/* 부서 필터 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedDepartment === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDepartment('all')}
                >
                  전체 부서
                </Button>
                {organizationData.departmentAnalysis.map((dept) => (
                  <Button
                    key={dept.department}
                    variant={selectedDepartment === dept.department ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDepartment(dept.department)}
                  >
                    {dept.department}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 부서별 상세 정보 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDepartments.map((dept, index) => (
              <Card key={index} className="border-l-4 border-l-indigo-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{dept.department}</span>
                    <Badge variant="secondary">{dept.employeeCount}명</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">협업 점수</div>
                    <div className="flex items-center gap-3">
                      <Progress value={dept.collaborationScore} className="flex-1" />
                      <span className="text-sm font-medium">{dept.collaborationScore}점</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">주요 성향</div>
                    <div className="flex flex-wrap gap-1">
                      {dept.dominantStyles.map((style, styleIdx) => (
                        <Badge key={styleIdx} variant="outline" className="text-xs">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">월평균 회의 수</span>
                    <span className="font-medium">{dept.meetingFrequency}회</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 트렌드 분석 탭 */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                월별 협업 효율성 트렌드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {organizationData.communicationTrends.map((trend, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{trend.month}</span>
                      <div className="flex gap-4 text-sm">
                        <span>효율성: {trend.efficiency}%</span>
                        <span>만족도: {trend.satisfaction}%</span>
                        <span>갈등감소: {trend.conflictReduction}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Progress value={trend.efficiency} className="h-2" />
                      <Progress value={trend.satisfaction} className="h-2" />
                      <Progress value={trend.conflictReduction} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}