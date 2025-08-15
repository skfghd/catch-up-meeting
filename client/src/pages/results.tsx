import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUserProfile, UserProfile, isGuestMode, getSurveyAnswers } from "@/lib/storage";
import { determineMBTIType, MEETING_MBTI_TYPES } from "@/lib/meeting-mbti-types";
import { User, Lightbulb, Target, MessageSquare, Users, Briefcase } from "lucide-react";
import Navigation from "@/components/navigation";
import { BackButton } from "@/components/back-button";

export default function Results() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mbtiType, setMbtiType] = useState<any>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const userProfile = getUserProfile();
    if (userProfile) {
      setProfile(userProfile);
      
      // 설문 답변으로부터 MBTI 유형 결정
      const answers = getSurveyAnswers();
      if (answers) {
        const mbtiCode = determineMBTIType(answers);
        setMbtiType(MEETING_MBTI_TYPES[mbtiCode]);
      }
    } else {
      setLocation('/survey');
    }
  }, [setLocation]);

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="분석 결과" />
      <div className="pt-20 pb-8 bg-muted/20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-display text-4xl font-bold mb-4">당신의 MBTI 유형</h2>
            {mbtiType && (
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {mbtiType.code}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {mbtiType.code}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-800">{mbtiType.name}</h3>
                  </div>
                  <p className="text-slate-600 text-sm mt-1">{mbtiType.nickname}</p>
                </div>
              </div>
            )}
            <p className="text-body text-lg text-muted-foreground">{mbtiType?.description || "당신의 MBTI 성격 유형에 대해 알아본 내용입니다"}</p>
          </div>
          
          {/* MBTI 4차원 분석 */}
          {mbtiType && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center mb-8 text-slate-800">🧠 MBTI 4차원 분석</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="elevation-lg rounded-xl glass-effect bg-background/90">
                  <CardContent className="p-4">
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">에너지 방향</h4>
                    <div className={`p-2 rounded ${mbtiType.code[0] === 'E' ? 'bg-blue-50 border border-blue-200 text-blue-800' : 'bg-purple-50 border border-purple-200 text-purple-800'}`}>
                      <span className="text-sm font-medium">
                        {mbtiType.code[0] === 'E' ? 'E (외향형)' : 'I (내향형)'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="elevation-lg rounded-xl glass-effect bg-background/90">
                  <CardContent className="p-4">
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">정보 인식</h4>
                    <div className={`p-2 rounded ${mbtiType.code[1] === 'S' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-orange-50 border border-orange-200 text-orange-800'}`}>
                      <span className="text-sm font-medium">
                        {mbtiType.code[1] === 'S' ? 'S (현실형)' : 'N (직관형)'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="elevation-lg rounded-xl glass-effect bg-background/90">
                  <CardContent className="p-4">
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">의사결정</h4>
                    <div className={`p-2 rounded ${mbtiType.code[2] === 'T' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-pink-50 border border-pink-200 text-pink-800'}`}>
                      <span className="text-sm font-medium">
                        {mbtiType.code[2] === 'T' ? 'T (논리형)' : 'F (감정형)'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="elevation-lg rounded-xl glass-effect bg-background/90">
                  <CardContent className="p-4">
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">생활 양식</h4>
                    <div className={`p-2 rounded ${mbtiType.code[3] === 'J' ? 'bg-indigo-50 border border-indigo-200 text-indigo-800' : 'bg-teal-50 border border-teal-200 text-teal-800'}`}>
                      <span className="text-sm font-medium">
                        {mbtiType.code[3] === 'J' ? 'J (계획형)' : 'P (유연형)'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* MBTI 유형 상세 정보 */}
          {mbtiType && (
            <div className="mb-12">
              <div className="grid md:grid-cols-2 gap-8">
                {/* 강점 카드 */}
                <Card className="elevation-lg rounded-xl glass-effect bg-background/90">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800 ml-4">강점</h3>
                    </div>
                    <ul className="space-y-3">
                      {mbtiType.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-slate-600">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* 주의사항 카드 */}
                <Card className="elevation-lg rounded-xl glass-effect bg-background/90">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800 ml-4">주의사항</h3>
                    </div>
                    <ul className="space-y-3">
                      {mbtiType.challenges.map((challenge: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-slate-600">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* 회의 실전 가이드 */}
          {mbtiType && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center mb-8 text-slate-800">🎯 회의 실전 가이드</h3>
              <div className="grid md:grid-cols-1 gap-8">
                <Card className="elevation-lg rounded-xl glass-effect bg-background/90">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800 ml-4">회의 운영 가이드</h3>
                    </div>
                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {mbtiType.meetingTips}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* 최적 회의 환경 */}
          {mbtiType && (
            <div className="mb-12">
              <Card className="elevation-lg rounded-xl glass-effect bg-background/90">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 ml-4">최적 회의 환경</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600 mb-2">{mbtiType.optimalMeetingSize}</div>
                      <div className="text-sm text-slate-600">선호 인원</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600 mb-2">{mbtiType.preferredMeetingLength}</div>
                      <div className="text-sm text-slate-600">최적 시간</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-sm font-bold text-indigo-600 mb-2">{mbtiType.communicationPreference}</div>
                      <div className="text-sm text-slate-600">소통 스타일</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="text-center space-y-6">
            {isGuestMode() ? (
              // 게스트 모드: 미팅룸 참여하기 버튼만 표시
              <div className="flex justify-center">
                <Button 
                  onClick={() => setLocation('/rooms')}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent text-white px-12 py-4 text-lg font-semibold hover:shadow-lg transition-all duration-200 rounded-xl"
                >
                  미팅룸 참여하기
                </Button>
              </div>
            ) : (
              // 일반 사용자: 모든 버튼 표시
              <>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                  <Button 
                    onClick={() => {
                      // 현재 스타일을 localStorage에 저장하는 기능
                      const currentProfile = getUserProfile();
                      if (currentProfile) {
                        localStorage.setItem('savedProfile', JSON.stringify(currentProfile));
                        alert('현재 스타일이 저장되었습니다!');
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    이 스타일 유지하기
                  </Button>
                  <Button 
                    onClick={() => setLocation('/survey')}
                    variant="outline"
                    className="flex-1 bg-white text-primary px-6 py-3 font-semibold border-2 border-primary hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    진단 다시 받기
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                  <Button 
                    onClick={() => setLocation('/rooms')}
                    className="flex-1 bg-gradient-to-r from-accent to-accent/80 text-white px-6 py-3 font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    미팅룸 참여하기
                  </Button>
                  <Button 
                    onClick={() => setLocation('/profile')}
                    variant="outline"
                    className="flex-1 bg-white text-slate-700 px-6 py-3 font-semibold border-2 border-slate-200 hover:border-accent hover:text-accent transition-all duration-200"
                  >
                    전체 프로필 보기
                  </Button>
                </div>
                
                <p className="text-sm text-slate-500 mt-2">
                  스타일을 유지하면 다음 진단 후에도 이전 결과를 참조할 수 있습니다
                </p>
              </>
            )}
          </div>
          
          <BackButton fallbackPath="/" />
        </div>
      </div>
    </div>
  );
}
