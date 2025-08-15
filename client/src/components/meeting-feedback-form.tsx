import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Clock, Target, MessageSquare, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface MeetingFeedbackFormProps {
  meetingId: number;
  participantId: number;
  onSubmit?: (feedback: any) => void;
}

const MeetingFeedbackForm: React.FC<MeetingFeedbackFormProps> = ({
  meetingId,
  participantId,
  onSubmit
}) => {
  const [feedback, setFeedback] = useState({
    satisfactionScore: 0,
    objectiveAchievement: 0,
    timeEfficiency: 0,
    communicationQuality: 0,
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const StarRating = ({ 
    value, 
    onChange, 
    label, 
    icon: Icon 
  }: { 
    value: number; 
    onChange: (rating: number) => void; 
    label: string;
    icon: any;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-blue-600" />
        <Label className="text-sm font-medium">{label}</Label>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1 rounded transition-colors ${
              star <= value 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <Star size={20} fill={star <= value ? 'currentColor' : 'none'} />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {value > 0 ? `${value}/5` : '평가해주세요'}
        </span>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (feedback.satisfactionScore === 0 || feedback.objectiveAchievement === 0 || 
        feedback.timeEfficiency === 0 || feedback.communicationQuality === 0) {
      toast({
        title: "평가 누락",
        description: "모든 항목에 대해 평가해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiRequest('/api/meetings/feedback', {
        method: 'POST',
        body: JSON.stringify({
          meetingId,
          participantId,
          ...feedback
        })
      });

      toast({
        title: "피드백 제출 완료",
        description: "회의 피드백이 성공적으로 제출되었습니다.",
      });

      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error) {
      toast({
        title: "제출 실패",
        description: "피드백 제출 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          회의 피드백
        </CardTitle>
        <p className="text-sm text-gray-600">
          방금 참여한 회의에 대한 솔직한 평가를 부탁드립니다. 
          조직의 회의 문화 개선에 도움이 됩니다.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 전체 만족도 */}
          <StarRating
            value={feedback.satisfactionScore}
            onChange={(rating) => setFeedback(prev => ({ ...prev, satisfactionScore: rating }))}
            label="전체 만족도 (25% 반영)"
            icon={ThumbsUp}
          />

          {/* 목표 달성도 */}
          <StarRating
            value={feedback.objectiveAchievement}
            onChange={(rating) => setFeedback(prev => ({ ...prev, objectiveAchievement: rating }))}
            label="목표 달성도 (35% 반영)"
            icon={Target}
          />

          {/* 시간 효율성 */}
          <StarRating
            value={feedback.timeEfficiency}
            onChange={(rating) => setFeedback(prev => ({ ...prev, timeEfficiency: rating }))}
            label="시간 효율성 (25% 반영)"
            icon={Clock}
          />

          {/* 소통 품질 */}
          <StarRating
            value={feedback.communicationQuality}
            onChange={(rating) => setFeedback(prev => ({ ...prev, communicationQuality: rating }))}
            label="소통 품질 (15% 반영)"
            icon={MessageSquare}
          />

          {/* 추가 의견 */}
          <div className="space-y-2">
            <Label htmlFor="comments">추가 의견 (선택사항)</Label>
            <Textarea
              id="comments"
              placeholder="회의에서 좋았던 점이나 개선이 필요한 부분을 자유롭게 작성해주세요..."
              value={feedback.comments}
              onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6"
            >
              {isSubmitting ? '제출 중...' : '피드백 제출'}
            </Button>
          </div>
        </form>

        {/* 가중치 안내 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">평가 가중치 안내</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <div>• 목표 달성도 35% - 회의 목적이 얼마나 잘 달성되었는지</div>
            <div>• 전체 만족도 25% - 회의 전반에 대한 만족도</div>
            <div>• 시간 효율성 25% - 시간 대비 성과와 진행의 효율성</div>
            <div>• 소통 품질 15% - 참가자 간 소통의 원활함과 질</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingFeedbackForm;