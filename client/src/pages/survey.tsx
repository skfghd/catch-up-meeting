import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

import { setSurveyAnswers, setUserProfile, SurveyAnswers, isGuestMode, getGuestName, setGuestName } from "@/lib/storage";
import { generateStyleSummary, surveyQuestions, getAdaptiveQuestion } from "@/lib/survey";
import Navigation from "@/components/navigation";
import LoadingSpinner from "@/components/loading-spinner";
import { BackButton } from "@/components/back-button";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";
import { Footer } from "@/components/footer";

export default function Survey() {
  const [answers, setAnswers] = useState<Partial<SurveyAnswers>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestName, setGuestNameState] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [, setLocation] = useLocation();
  const { user: authUser, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    // 게스트 모드일 때만 이름 입력 확인
    if (isGuestMode()) {
      const existingName = getGuestName();
      if (!existingName || existingName === '게스트 사용자') {
        setShowNameInput(true);
      } else {
        setGuestNameState(existingName);
      }
    }
  }, []);

  const handleAnswerChange = (questionId: keyof SurveyAnswers, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim()) {
      setGuestName(guestName.trim());
      setShowNameInput(false);
    }
  };

  const handleSubmit = async () => {

    const currentMode = isAuthenticated ? 'login' : (isGuestMode() ? 'guest' : 'none');
    console.log('설문 제출 시작', { 
      answersCount: Object.keys(answers).length, 
      mode: currentMode,
      userId: isAuthenticated ? authUser?.id : 'guest'
    });

    if (Object.keys(answers).length === 15) {
      setIsSubmitting(true);

      try {
        // 분석 중임을 사용자에게 알리기 위한 지연
        await new Promise(resolve => setTimeout(resolve, 1500));

        const surveyAnswers = answers as SurveyAnswers;
        console.log('설문 답변 (모드:', currentMode, '):', surveyAnswers);

        const styleResult = generateStyleSummary(surveyAnswers);
        console.log('분석 결과 (모드:', currentMode, '):', styleResult);

        // 로컬 스토리지에 항상 저장 (백업용)
        setSurveyAnswers(surveyAnswers);
        // Ensure all required UserProfile properties are included
        const completeProfile = {
          style: styleResult.style,
          tips: styleResult.tips,
          emotionalStyle: styleResult.emotionalStyle,
          collaborationTips: styleResult.collaborationTips,
          stressManagement: styleResult.stressManagement || '',
          feedbackStyle: styleResult.feedbackStyle || '',
          conflictResolution: styleResult.conflictResolution || '',
          problemSolving: styleResult.problemSolving || '',
          workStyle: styleResult.workStyle || '',
          communicationChannel: styleResult.communicationChannels || '',
          riskProfile: styleResult.riskTolerance || '',
          learningPreference: styleResult.learningPreferences || ''
        };
        await setUserProfile(completeProfile);

        // 로그인 모드인 경우에만 서버에 저장
        if (currentMode === 'login' && authUser) {
          try {
            console.log('서버에 프로필 저장 시도');
            const profileData = {
              surveyAnswers,
              userProfile: styleResult
            };

            await apiRequest('/api/user/profile', {
              method: 'POST',
              body: JSON.stringify({
                profileData
              }),
            });
            console.log('서버에 프로필 저장 완료');
          } catch (error) {
            console.error('서버 저장 실패:', error);
            // 실패해도 로컬 저장은 되었으므로 계속 진행
          }
        }

        console.log('프로필 저장 완료, 결과 페이지로 이동');
        setLocation('/results');
      } catch (error) {
        console.error('분석 중 오류 발생:', error);
        alert(t('survey.serverError'));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('설문 미완료', { answersCount: Object.keys(answers).length, required: 7 });
      alert(t('survey.allRequired'));
    }
  };

  const isComplete = Object.keys(answers).length === 15;

  const progressValue = (Object.keys(answers).length / 15) * 100;

  if (isSubmitting) {
    return (
      <div className="min-h-screen">
        <Navigation title={t('survey.submitting')} />
        <div className="pt-20">
          <LoadingSpinner size="lg" text="당신의 고도화된 소통 MBTI를 분석하고 있습니다..." />
        </div>
      </div>
    );
  }

  // 게스트 이름 입력 모달
  if (showNameInput) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation title={t('survey.guestName')} />
        <div className="pt-20 pb-8 bg-muted/20">
          <div className="max-w-md mx-auto px-6">
            <Card className="elevation-md rounded-xl glass-effect bg-background/80">
              <CardHeader>
                <CardTitle className="text-center text-xl text-slate-800">
                  {isGuestMode() && "🎭 게스트 모드"}
                </CardTitle>
                <p className="text-center text-slate-600">
                  미팅에서 표시될 이름을 입력해주세요
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNameSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="guestName" className="text-sm font-medium text-slate-700">
                      {t('survey.guestName')}
                    </Label>
                    <Input
                      id="guestName"
                      value={guestName}
                      onChange={(e) => setGuestNameState(e.target.value)}
                      placeholder={t('survey.guestNamePlaceholder')}
                      className="mt-1"
                      autoFocus
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={!guestName.trim()}
                  >
                    {t('survey.start')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        showBack 
        title={`소통 스타일 진단 ${isAuthenticated ? '(로그인)' : '(게스트)'}`}
      />
      <div className="pt-20 pb-8 bg-muted/20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-display text-4xl font-bold mb-4">소통 스타일 진단</h2>
            <p className="text-body text-lg text-muted-foreground mb-6">더 나은 협업을 위해 당신의 선호도를 알려주세요</p>
            {isGuestMode() && guestName && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700">
                  🎭 {guestName}님으로 진단
                </span>
              </div>
            )}

            {/* Progress Bar */}
            <div className="max-w-lg mx-auto mb-4">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>진행률</span>
                <span>{Object.keys(answers).length}/15</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressValue}%` }}
                ></div>
              </div>
            </div>
          </div>

          <Card className="elevation-lg rounded-xl glass-effect bg-background/90">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {surveyQuestions.map((question, index) => {
                  // 적응형 질문 적용
                  const adaptedQuestion = getAdaptiveQuestion(question.id, answers) || question;
                  
                  return (
                    <div key={question.id} className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {index + 1}. {adaptedQuestion.question}
                      </h3>
                      <RadioGroup
                        value={answers[question.id as keyof SurveyAnswers] || ""}
                        onValueChange={(value) => handleAnswerChange(question.id as keyof SurveyAnswers, value)}
                      >
                        {adaptedQuestion.options.map((option) => (
                          <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-slate-200 hover:border-primary cursor-pointer transition-colors">
                            <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                            <Label 
                              htmlFor={`${question.id}-${option.value}`}
                              className="text-slate-700 cursor-pointer flex-1"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  );
                })}

                <Button 
                  type="submit" 
                  disabled={!isComplete || isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 text-white py-4 font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? t('survey.submitting') : t('survey.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>

          <BackButton fallbackPath="/" />
        </div>
      </div>

      <Footer variant="minimal" />
    </div>
  );
}