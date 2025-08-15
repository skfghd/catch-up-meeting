import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Star, Send, CheckCircle, User, Users, Check } from "lucide-react";
import { addMeetingFeedback, MeetingFeedback, getUser, getMeetingFeedbacks, isGuestMode } from "@/lib/storage";
import Navigation from "@/components/navigation";
import { BackButton } from "@/components/back-button";
import { useAuth } from "@/hooks/useAuth";

const strengthOptions = [
  "명확한 의사소통", "시간 준수", "적극적 참여", "좋은 아이디어 제시", 
  "다른 의견 존중", "체계적 정리", "문제 해결 능력", "팀워크", "경청"
];

const improvementOptions = [
  "더 명확한 설명", "시간 관리", "더 많은 참여", "사전 준비", 
  "간결한 발언", "다른 의견 수용", "구체적 제안", "집중도 향상"
];

// 샘플 참가자 목록 (실제로는 미팅 룸에서 가져와야 함)
const sampleParticipants = [
  { email: 'sarah.kim@company.com', name: '김사라' },
  { email: 'maria.lopez@company.com', name: '로페즈마리아' },
  { email: 'lisa.wang@company.com', name: '왕리사' },
  { email: 'john.park@company.com', name: '박존' }
];

export default function Feedback() {
  const [location, setLocation] = useLocation();
  const [responses, setResponses] = useState({
    communicationClarity: 0,
    timeManagement: 0,
    collaboration: 0,
    preparation: 0,
    listening: 0
  });
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [completedFeedbacks, setCompletedFeedbacks] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const { isAuthenticated } = useAuth();

  // URL에서 미팅 이름 가져오기
  const meetingName = new URLSearchParams(window.location.search).get('meeting') || '미팅';
  const currentUser = getUser();

  useEffect(() => {
    // 로그아웃 상태에서는 접근 불가
    if (!isAuthenticated && !isGuestMode()) {
      console.log('피드백 페이지 - 로그아웃 상태, 홈으로 리다이렉트');
      setLocation('/');
      return;
    }

    const currentUser = getUser();
    if (!currentUser) {
      setLocation('/');
      return;
    }
  }, [isAuthenticated, isGuestMode, setLocation]);

  useEffect(() => {
    // 이미 완료된 피드백 목록 로드
    const existingFeedbacks = getMeetingFeedbacks();
    const currentUserName = currentUser?.username || '사용자';
    const completed = existingFeedbacks
      .filter(feedback => feedback.meetingName === meetingName && 
               (feedback.fromUser === currentUserName || feedback.fromUser === '익명'))
      .map(feedback => feedback.targetUser);
    setCompletedFeedbacks(completed);
  }, [meetingName, currentUser?.username]);

  const handleRatingChange = (category: keyof typeof responses, value: number) => {
    setResponses(prev => ({ ...prev, [category]: value }));
  };

  const handleStrengthToggle = (strength: string) => {
    setSelectedStrengths(prev => 
      prev.includes(strength) 
        ? prev.filter(s => s !== strength)
        : [...prev, strength]
    );
  };

  const handleImprovementToggle = (improvement: string) => {
    setSelectedImprovements(prev => 
      prev.includes(improvement) 
        ? prev.filter(s => s !== improvement)
        : [...prev, improvement]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedParticipant) {
      alert('피드백을 받을 참가자를 선택해주세요.');
      return;
    }

    const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
    if (totalScore === 0) {
      alert('최소 하나의 항목에 점수를 주세요.');
      return;
    }

    const participant = sampleParticipants.find(p => p.email === selectedParticipant);
    const fromUserName = isAnonymous ? '익명' : (
      isGuestMode() 
        ? `게스트_${currentUser?.name || '사용자'}`
        : (currentUser?.username || '사용자')
    );

    const feedback: MeetingFeedback = {
      id: Date.now().toString(),
      meetingName,
      fromUser: fromUserName,
      targetUser: selectedParticipant,
      responses,
      strengths: selectedStrengths,
      improvements: selectedImprovements,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
      isVisible: true
    };

    addMeetingFeedback(feedback);

    // 완료된 피드백 목록에 추가
    setCompletedFeedbacks(prev => [...prev, selectedParticipant]);

    // 폼 초기화
    setResponses({
      communicationClarity: 0,
      timeManagement: 0,
      collaboration: 0,
      preparation: 0,
      listening: 0
    });
    setSelectedStrengths([]);
    setSelectedImprovements([]);
    setComment("");
    setSelectedParticipant("");

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="shadow-lg text-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">피드백이 전송되었습니다!</h2>
              <p className="text-slate-600 mb-6">
                소중한 의견 감사합니다. 더 나은 미팅을 위해 활용하겠습니다.
              </p>

              {/* 추가 피드백 진행 상황 */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">피드백 진행 상황</span>
                  <span className="text-sm text-slate-600">
                    {completedFeedbacks.length}/{sampleParticipants.length} 완료
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedFeedbacks.length / sampleParticipants.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {completedFeedbacks.length < sampleParticipants.length ? (
                  <Button 
                    onClick={() => setSubmitted(false)}
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    다른 참가자에게도 피드백 남기기
                  </Button>
                ) : null}
                <Button 
                  onClick={() => setLocation('/rooms')}
                  variant={completedFeedbacks.length < sampleParticipants.length ? "outline" : "default"}
                  className={completedFeedbacks.length < sampleParticipants.length ? 
                    "flex-1 border-primary text-primary hover:bg-primary hover:text-white" :
                    "bg-primary text-white hover:bg-primary/90"
                  }
                >
                  미팅 목록으로 돌아가기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleGoBack = () => {
    // 브라우저 히스토리를 사용해서 이전 페이지로
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // 히스토리가 없으면 미팅룸으로
      setLocation(`/room/${meetingName}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        title="미팅 피드백" 
        showBack={true} 
        useHistory={true}
        backTo={`/room/${meetingName}`}
      />
      <div className="pt-20 pb-8 bg-muted/20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-display text-3xl font-bold mb-2">미팅 피드백</h1>
            <p className="text-body text-lg text-muted-foreground">"{meetingName}" 미팅은 어떠셨나요?</p>
          </div>

        <Card className="elevation-lg rounded-xl glass-effect bg-background/90">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800">
              미팅 참가자에게 피드백 남기기
            </CardTitle>
            {isGuestMode() && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-blue-700 font-medium text-sm">🎭 게스트 모드</span>
                </div>
                <p className="text-xs text-blue-600">
                  게스트로서 참가한 미팅에서 다른 참가자들에게 소중한 피드백을 남겨주세요. 피드백은 게스트 모드 종료 시 삭제됩니다.
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 참가자 선택 */}
              <div>
                <Label className="text-base font-medium text-slate-800 mb-4 block">
                  피드백을 받을 참가자를 선택해주세요
                </Label>
                <div className="grid gap-3">
                  {sampleParticipants.map(participant => {
                    const isCompleted = completedFeedbacks.includes(participant.email);
                    const isSelected = selectedParticipant === participant.email;

                    return (
                      <div
                        key={participant.email}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : isCompleted
                            ? 'border-green-300 bg-green-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => !isCompleted && setSelectedParticipant(isSelected ? "" : participant.email)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected 
                                ? 'border-primary bg-primary' 
                                : isCompleted
                                ? 'border-green-500 bg-green-500'
                                : 'border-slate-300'
                            }`}>
                              {(isSelected || isCompleted) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{participant.name}</p>
                              <p className="text-sm text-slate-500">{participant.email}</p>
                            </div>
                          </div>
                          {isCompleted && (
                            <div className="flex items-center text-green-600 text-sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              완료
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 익명/실명 선택 */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-800">피드백 작성자 공개</h3>
                  <p className="text-sm text-slate-600">
                    {isAnonymous ? '익명으로 피드백이 전송됩니다' : '내 이름이 함께 전송됩니다'}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <User className={`w-4 h-4 ${!isAnonymous ? 'text-primary' : 'text-slate-400'}`} />
                  <Switch
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                  <Users className={`w-4 h-4 ${isAnonymous ? 'text-primary' : 'text-slate-400'}`} />
                </div>
              </div>

              {selectedParticipant && (
                <div className="space-y-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-slate-800">
                    {sampleParticipants.find(p => p.email === selectedParticipant)?.name}님에 대한 피드백
                  </h3>

                  {/* 5가지 영역 평가 */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-slate-800">미팅 참여 평가</h4>

                    {[
                      { key: 'communicationClarity', label: '소통이 명확했나요?', icon: '💬' },
                      { key: 'timeManagement', label: '시간 관리가 좋았나요?', icon: '⏰' },
                      { key: 'collaboration', label: '협업이 잘 되었나요?', icon: '🤝' },
                      { key: 'preparation', label: '미팅 준비가 잘 되어 있었나요?', icon: '📋' },
                      { key: 'listening', label: '경청을 잘 했나요?', icon: '👂' }
                    ].map((item) => (
                      <div key={item.key} className="bg-white p-4 rounded-lg">
                        <div className="flex items-center mb-3">
                          <span className="text-xl mr-2">{item.icon}</span>
                          <label className="text-sm font-medium text-slate-700">
                            {item.label}
                          </label>
                        </div>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => handleRatingChange(item.key as keyof typeof responses, score)}
                              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                responses[item.key as keyof typeof responses] >= score
                                  ? 'bg-primary border-primary text-white'
                                  : 'border-slate-300 hover:border-primary text-slate-600'
                              }`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 강점 선택 */}
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      이 분의 강점을 선택해주세요 (복수 선택 가능)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {strengthOptions.map((strength) => (
                        <div key={strength} className="flex items-center space-x-2">
                          <Checkbox
                            id={`strength-${strength}`}
                            checked={selectedStrengths.includes(strength)}
                            onCheckedChange={() => handleStrengthToggle(strength)}
                          />
                          <label
                            htmlFor={`strength-${strength}`}
                            className="text-sm text-slate-700 cursor-pointer"
                          >
                            {strength}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 개선점 선택 */}
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      앞으로 더 좋아질 수 있는 부분 (선택사항)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {improvementOptions.map((improvement) => (
                        <div key={improvement} className="flex items-center space-x-2">
                          <Checkbox
                            id={`improvement-${improvement}`}
                            checked={selectedImprovements.includes(improvement)}
                            onCheckedChange={() => handleImprovementToggle(improvement)}
                          />
                          <label
                            htmlFor={`improvement-${improvement}`}
                            className="text-sm text-slate-700 cursor-pointer"
                          >
                            {improvement}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 자유 의견 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      추가 의견 (선택사항)
                    </label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="이 분과의 협업에 대한 자유로운 의견을 남겨주세요..."
                      rows={3}
                      className="px-4 py-3"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>개인정보 보호:</strong> 이 피드백은 기본적으로 비공개로 설정됩니다. 
                      받는 분이 나중에 다른 미팅에서 공개할지 선택할 수 있습니다.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoBack}
                      className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      이전 단계
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary text-white hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      피드백 전송
                    </Button>
                  </div>
                </div>
              )}

              {/* 제출 버튼 - 참가자 선택 안했을 때 */}
              {!selectedParticipant && (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">참가자를 선택하면 피드백을 작성할 수 있습니다</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoBack}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    이전 단계로 돌아가기
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
        </div>
        <BackButton fallbackPath="/rooms" />
      </div>
    </div>
  );
}