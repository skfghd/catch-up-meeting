import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserProfile, getUser, getMeetingFeedbacks, generateFeedbackSummary } from "@/lib/storage";
import { ArrowLeft, CheckCircle, XCircle, MessageCircle, Clock, Users, Target, Lightbulb, Share2 } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { useState, useEffect } from "react";

export default function WorkingWithMe() {
  const [, setLocation] = useLocation();
  const user = getUser();
  const profile = getUserProfile();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackSummary, setFeedbackSummary] = useState<any>(null);

  useEffect(() => {
    const userFeedbacks = getMeetingFeedbacks();
    const summary = generateFeedbackSummary();
    setFeedbacks(userFeedbacks);
    setFeedbackSummary(summary);
  }, []);

  // 프로필이 없어도 기본 미팅 가이드 제공
  const displayProfile = profile || {
    style: "기본 협업자",
    tips: "효과적인 미팅을 위한 기본 가이드를 제공합니다.",
    emotionalStyle: "균형잡힌 소통형",
    collaborationTips: "명확한 소통과 상호 존중을 바탕으로 협업합니다."
  };

  const displayUser = user || {
    name: "미팅 참가자",
    displayName: "미팅 참가자",
    email: ""
  };

  // 피드백 기반으로 맞춤형 가이드 생성
  const generateMeetingGuide = () => {
    const scores = feedbackSummary?.averageScores;

    const dosList = [];
    const dontsList = [];

    // 기본 스타일 기반 가이드
    if (displayProfile.style.includes('시각적')) {
      dosList.push("📊 차트, 그래프 활용해서 설명");
      dosList.push("🖼️ 시각적 자료로 정리해서 제시");
      dontsList.push("📝 긴 텍스트만으로 설명");
      dontsList.push("🗣️ 시각적 자료 없이 구두 설명");
    }

    if (displayProfile.style.includes('신속') || displayProfile.style.includes('간결')) {
      dosList.push("⚡ 핵심 포인트 먼저, 간결하게");
      dosList.push("⏰ 짧고 효율적인 미팅 진행");
      dontsList.push("⏳ 불필요한 세부사항으로 시간 끌기");
      dontsList.push("🔄 같은 내용 반복 설명");
    }

    if (displayProfile.style.includes('신중') || displayProfile.style.includes('분석')) {
      dosList.push("📋 미팅 전 자료 미리 공유");
      dosList.push("🤔 충분한 검토 시간 제공");
      dontsList.push("⚡ 즉석에서 중요한 결정 요구");
      dontsList.push("📊 근거 없이 결론만 제시");
    }

    // 피드백 기반 추가 가이드
    if (scores && feedbacks.length > 0) {
      if (scores.communicationClarity < 3) {
        dosList.push("💬 이해했는지 중간중간 확인");
        dontsList.push("🤷 애매한 표현 사용");
      }

      if (scores.timeManagement < 3) {
        dosList.push("⏰ 명확한 아젠다 사전 공유");
        dontsList.push("🏃 시간에 쫓겨 급하게 진행");
      }

      if (scores.collaboration < 3) {
        dosList.push("🤝 의견 듣고 함께 논의");
        dontsList.push("👑 혼자 결정하고 일방적 전달");
      }

      if (scores.listening < 3) {
        dosList.push("🎯 중요 포인트 반복 강조");
        dontsList.push("💨 너무 빠르게 넘어가기");
      }
    }

    // 감정적 스타일 기반
    if (displayProfile.emotionalStyle.includes('감성적')) {
      dosList.push("😊 팀 분위기 고려한 대화");
      dontsList.push("🤖 차갑고 기계적인 태도");
    }

    if (displayProfile.emotionalStyle.includes('이성적')) {
      dosList.push("📈 논리적 근거와 데이터 제시");
      dontsList.push("💭 감정적 어필보다 사실 중심");
    }

    return { dosList, dontsList };
  };

  const { dosList, dontsList } = generateMeetingGuide();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl bg-muted/20">
        {/* 헤더 */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/profile')}
            className="text-muted-foreground hover:text-foreground animate-smooth mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            프로필로 돌아가기
          </Button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {displayUser.name.charAt(0)}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Tips for Working with Me
            </h1>
            <p className="text-lg text-muted-foreground">
              나와 협업하는 방법 알려주기
            </p>
          </div>
        </div>

        {/* 미팅 선호사항 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              미팅 선호사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-foreground mb-1">소통 방식</h3>
                <p className="text-sm text-muted-foreground">
                  {displayProfile.style.includes('시각적') ? '시각적 자료 활용' :
                   displayProfile.style.includes('신속') ? '간결하고 명확하게' :
                   displayProfile.style.includes('신중') ? '충분한 설명과 시간' : '상황에 맞게 유연하게'}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-foreground mb-1">미팅 시간</h3>
                <p className="text-sm text-muted-foreground">
                  {displayProfile.style.includes('신속') || displayProfile.style.includes('간결') ? '짧고 집중적으로' :
                   displayProfile.style.includes('신중') ? '충분한 시간 확보' : '적절한 시간 배분'}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-foreground mb-1">결정 방식</h3>
                <p className="text-sm text-muted-foreground">
                  {displayProfile.emotionalStyle.includes('이성적') ? '데이터 기반 결정' :
                   displayProfile.emotionalStyle.includes('감성적') ? '팀 합의 중시' : '상황에 맞는 결정'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 나의 소통 스타일 요약 */}
        <Card className="mb-8 border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-primary" />
              나의 소통 스타일
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2 text-primary">{displayProfile.style}</h3>
                <p className="text-muted-foreground text-sm">{displayProfile.tips}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2 text-primary">{displayProfile.emotionalStyle}</h3>
                <p className="text-muted-foreground text-sm">{displayProfile.collaborationTips}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Do's and Don'ts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Do's - 이렇게 해주세요 */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-green-700 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                이렇게 해주세요 ✅
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dosList.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-800">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Don'ts - 이렇게 하지 마세요 */}
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-red-700 flex items-center">
                <XCircle className="w-6 h-6 mr-2 text-red-600" />
                이렇게 하지 마세요 ❌
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dontsList.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-red-800">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        

        {/* 공유하기 섹션 */}
        <Card className="text-center border-2 border-primary/30">
          <CardContent className="p-8">
            <Share2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-4">
              이 가이드 공유하기
            </h3>
            <p className="text-muted-foreground mb-6">
              팀원들과 공유해서 더 효과적인 미팅을 만들어보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  alert('링크가 복사되었습니다!');
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Share2 className="w-4 h-4 mr-2" />
                링크 복사하기
              </Button>
              <Button
                onClick={() => setLocation('/rooms')}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                미팅 보드로 이동
              </Button>
            </div>
          </CardContent>
        </Card>
        <BackButton fallbackPath="/profile" />
      </div>
    </div>
  );
}