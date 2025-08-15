import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Clock, Users, FileText, Camera, Mic } from 'lucide-react';

interface MeetingChecklistProps {
  meetingType: 'planning' | 'brainstorming' | 'decision' | 'review' | 'kickoff' | 'presentation';
  participantCount: number;
  duration: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  category: 'tech' | 'content' | 'team';
  priority: 'high' | 'medium' | 'low';
  icon: any;
}

export default function MeetingChecklist({ meetingType, participantCount, duration }: MeetingChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const getChecklistItems = (): ChecklistItem[] => {
    const baseItems: ChecklistItem[] = [
      { id: 'camera', text: '카메라와 마이크 테스트', category: 'tech', priority: 'high', icon: Camera },
      { id: 'network', text: '인터넷 연결 확인', category: 'tech', priority: 'high', icon: Mic },
      { id: 'participants', text: '모든 참여자에게 초대 발송', category: 'team', priority: 'high', icon: Users },
    ];

    const typeSpecificItems: Record<string, ChecklistItem[]> = {
      planning: [
        { id: 'agenda', text: '상세한 의제 준비', category: 'content', priority: 'high', icon: FileText },
        { id: 'timeline', text: '프로젝트 타임라인 검토', category: 'content', priority: 'medium', icon: Clock },
        { id: 'resources', text: '필요한 리소스 목록 작성', category: 'content', priority: 'medium', icon: FileText }
      ],
      brainstorming: [
        { id: 'whiteboard', text: '온라인 화이트보드 준비 (Miro, Figma 등)', category: 'tech', priority: 'high', icon: FileText },
        { id: 'icebreaker', text: '아이스브레이킹 활동 준비', category: 'team', priority: 'medium', icon: Users },
        { id: 'templates', text: '브레인스토밍 템플릿 준비', category: 'content', priority: 'medium', icon: FileText }
      ],
      decision: [
        { id: 'options', text: '결정할 옵션들 명확히 정리', category: 'content', priority: 'high', icon: FileText },
        { id: 'criteria', text: '의사결정 기준 수립', category: 'content', priority: 'high', icon: CheckCircle },
        { id: 'stakeholders', text: '핵심 이해관계자 참여 확인', category: 'team', priority: 'high', icon: Users }
      ],
      review: [
        { id: 'materials', text: '검토할 자료 사전 공유', category: 'content', priority: 'high', icon: FileText },
        { id: 'feedback', text: '피드백 양식 준비', category: 'content', priority: 'medium', icon: FileText },
        { id: 'action_items', text: '이전 액션 아이템 진행상황 정리', category: 'content', priority: 'medium', icon: CheckCircle }
      ],
      kickoff: [
        { id: 'goals', text: '프로젝트 목표와 범위 명확화', category: 'content', priority: 'high', icon: CheckCircle },
        { id: 'roles', text: '팀원별 역할과 책임 정의', category: 'team', priority: 'high', icon: Users },
        { id: 'schedule', text: '전체 일정과 마일스톤 준비', category: 'content', priority: 'high', icon: Clock }
      ],
      presentation: [
        { id: 'slides', text: '발표 자료 최종 검토', category: 'content', priority: 'high', icon: FileText },
        { id: 'demo', text: '데모/시연 환경 준비', category: 'tech', priority: 'high', icon: Camera },
        { id: 'qa', text: '예상 질문과 답변 준비', category: 'content', priority: 'medium', icon: FileText }
      ]
    };

    const teamSizeItems: ChecklistItem[] = participantCount > 5 ? [
      { id: 'moderator', text: '진행자 역할 지정', category: 'team', priority: 'high', icon: Users },
      { id: 'breakout', text: '소그룹 활동 계획', category: 'team', priority: 'medium', icon: Users }
    ] : [];

    const durationItems: ChecklistItem[] = duration.includes('2시간') || duration.includes('3시간') ? [
      { id: 'breaks', text: '휴식 시간 계획', category: 'team', priority: 'medium', icon: Clock },
      { id: 'snacks', text: '간식/음료 준비 안내', category: 'team', priority: 'low', icon: Users }
    ] : [];

    return [...baseItems, ...typeSpecificItems[meetingType], ...teamSizeItems, ...durationItems];
  };

  const items = getChecklistItems();
  const completedCount = checkedItems.length;
  const totalCount = items.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (itemId: string) => {
    setCheckedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tech': return '⚙️';
      case 'content': return '📄';
      case 'team': return '👥';
      default: return '📋';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>미팅 준비 체크리스트</span>
          </div>
          <div className="text-sm text-slate-600">
            {completedCount}/{totalCount} ({progressPercentage}%)
          </div>
        </CardTitle>
        
        {/* 진행률 바 */}
        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* 우선순위별 그룹화 */}
        {['high', 'medium', 'low'].map(priority => {
          const priorityItems = items.filter(item => item.priority === priority);
          if (priorityItems.length === 0) return null;

          return (
            <div key={priority} className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(priority)}`}>
                  {priority === 'high' ? '🔴 필수' : priority === 'medium' ? '🟡 권장' : '🟢 선택'}
                </span>
              </div>
              
              {priorityItems.map(item => {
                const Icon = item.icon;
                const isChecked = checkedItems.includes(item.id);
                
                return (
                  <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleToggle(item.id)}
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="text-lg">{getCategoryIcon(item.category)}</span>
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className={`text-sm ${isChecked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {item.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* 완료 상태 */}
        {progressPercentage === 100 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-medium">모든 준비가 완료되었습니다!</p>
            <p className="text-green-600 text-sm">성공적인 미팅을 진행하세요.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}