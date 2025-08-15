import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Star, Eye, EyeOff, Settings, BarChart3, Users, TrendingUp } from "lucide-react";
import { 
  getMeetingFeedbacks, 
  updateFeedbackVisibility, 
  getFeedbackSettings, 
  setFeedbackSettings,
  generateFeedbackSummary,
  MeetingFeedback,
  FeedbackSettings,
  FeedbackSummary
} from "@/lib/storage";
import { aggregateSurveyData, SurveyAggregation } from "@/lib/meeting-analysis";
import { BackButton } from "@/components/back-button";

export default function FeedbackSettingsPage() {
  const [, setLocation] = useLocation();
  const [feedbacks, setFeedbacks] = useState<MeetingFeedback[]>([]);
  const [settings, setSettingsState] = useState<FeedbackSettings>({ showFeedbackToOthers: false });
  const [summary, setSummary] = useState<FeedbackSummary | null>(null);
  const [surveyData, setSurveyData] = useState<SurveyAggregation | null>(null);

  useEffect(() => {
    setFeedbacks(getMeetingFeedbacks());
    setSettingsState(getFeedbackSettings());
    setSummary(generateFeedbackSummary());
    setSurveyData(aggregateSurveyData());
  }, []);

  const handleVisibilityToggle = (feedbackId: string, isVisible: boolean) => {
    updateFeedbackVisibility(feedbackId, isVisible);
    setFeedbacks(prev => 
      prev.map(f => f.id === feedbackId ? { ...f, isVisible } : f)
    );
  };

  const handleGlobalSettingToggle = (showFeedbackToOthers: boolean) => {
    const newSettings = { showFeedbackToOthers };
    setFeedbackSettings(newSettings);
    setSettingsState(newSettings);
  };

  const renderScoreBar = (score: number, maxScore: number = 5) => {
    const percentage = (score / maxScore) * 100;
    return (
      <div className="flex items-center gap-2">
        <div className="w-24 bg-slate-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-slate-600 w-8">{score.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background py-20 bg-muted/20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/profile')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            프로필로 돌아가기
          </Button>
          <h1 className="text-display text-4xl font-bold mb-2">How Others See Me</h1>
          <p className="text-body text-lg text-muted-foreground">다른 사람이 본 나의 회의 스타일</p>
        </div>

        <div className="grid gap-6">
          {/* 피드백이 없을 때 안내 메시지 */}
          {(!summary || summary.totalFeedbacks === 0) && (
            <Card className="shadow-lg bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-slate-800">
                  <BarChart3 className="w-5 h-5 mr-2 text-slate-600" />
                  피드백 기반 나의 회의 스타일
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">아직 동료들의 피드백이 없어요</h3>
                  <p className="text-sm text-slate-600 mb-4 max-w-md mx-auto">
                    미팅 완료 후 동료들로부터 피드백을 받으면, 
                    여기에 나의 회의 스타일과 강점이 표시됩니다.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 max-w-lg mx-auto">
                    <p className="text-xs text-blue-700 mb-2 font-medium">💡 피드백을 받는 방법</p>
                    <ul className="text-xs text-blue-600 text-left space-y-1">
                      <li>• 미팅 참여 후 참가자들에게 피드백 요청</li>
                      <li>• 동료들이 나의 소통 스타일과 협업 방식을 평가</li>
                      <li>• 3-5명 이상의 피드백이 모이면 스타일 분석 제공</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 피드백 기반 회의 스타일 카드 */}
          {summary && summary.totalFeedbacks > 0 && (
            <Card className="shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-slate-800">
                  <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                  피드백 기반 나의 회의 스타일
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white bg-opacity-60 rounded-xl p-6 mb-4">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-white font-bold">{summary.meetingPersona.charAt(0)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{summary.meetingPersona}</h3>
                    <p className="text-sm text-slate-600">
                      {summary.totalFeedbacks}명의 동료 평가 기반
                    </p>
                  </div>

                  {/* 회의 스타일 특성 */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-indigo-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-indigo-700">
                        {summary.averageScores.communicationClarity >= 4 ? '명확한 소통' : '소통 개선 필요'}
                      </div>
                      <div className="text-xs text-indigo-600">소통 스타일</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-purple-700">
                        {summary.averageScores.collaboration >= 4 ? '협업형' : '독립형'}
                      </div>
                      <div className="text-xs text-purple-600">업무 스타일</div>
                    </div>
                  </div>

                  {/* 주요 특징 */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">🎯 나의 회의 특징</h4>
                    <div className="space-y-1 text-sm">
                      {summary.averageScores.preparation >= 4 && (
                        <p className="text-slate-700">• 미팅 준비가 철저한 계획형 스타일</p>
                      )}
                      {summary.averageScores.timeManagement >= 4 && (
                        <p className="text-slate-700">• 시간 관리가 뛰어난 효율형 스타일</p>
                      )}
                      {summary.averageScores.listening >= 4 && (
                        <p className="text-slate-700">• 다른 의견을 잘 듣는 경청형 스타일</p>
                      )}
                      {summary.averageScores.communicationClarity >= 4 && (
                        <p className="text-slate-700">• 명확한 의사소통을 하는 직관형 스타일</p>
                      )}
                      {summary.averageScores.collaboration >= 4 && (
                        <p className="text-slate-700">• 팀워크를 중시하는 협력형 스타일</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {summary && summary.totalFeedbacks > 0 && (
            <Card className="shadow-lg bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-slate-800">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  동료들이 평가한 나의 회의 스타일
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white font-bold">👥</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{summary.meetingPersona}</h3>
                  <p className="text-slate-600">
                    총 {summary.totalFeedbacks}명의 동료가 평가한 나의 회의 스타일
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-4">동료들의 평가 점수</h4>
                    <div className="space-y-3">
                      {summary.averageScores && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">💬 소통 명확성</span>
                            {renderScoreBar(summary.averageScores.communicationClarity || 0)}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">⏰ 시간 관리</span>
                            {renderScoreBar(summary.averageScores.timeManagement || 0)}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">🤝 협업 능력</span>
                            {renderScoreBar(summary.averageScores.collaboration || 0)}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">📋 미팅 준비</span>
                            {renderScoreBar(summary.averageScores.preparation || 0)}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">👂 경청 능력</span>
                            {renderScoreBar(summary.averageScores.listening || 0)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 mb-4">동료들이 인정한 나의 강점</h4>
                    <div className="space-y-2">
                      {summary.topStrengths && summary.topStrengths.slice(0, 5).map((strength, index) => (
                        <div key={index} className="flex items-center justify-between bg-white bg-opacity-50 rounded-lg p-2">
                          <span className="text-sm text-slate-700">{strength.strength}</span>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {strength.count}명이 평가
                          </span>
                        </div>
                      ))}
                      {(!summary.topStrengths || summary.topStrengths.length === 0) && (
                        <p className="text-sm text-slate-500">아직 동료들의 평가가 없습니다.</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 피드백 공개 설정 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold text-slate-800">
                <Settings className="w-5 h-5 mr-2" />
                나의 회의 스타일 공개 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-800">새로운 미팅에서 나의 회의 스타일 공개</h3>
                  <p className="text-sm text-slate-600">
                    활성화하면 동료들의 피드백을 바탕으로 한 나의 회의 스타일이 새로운 미팅 참가자들에게 미리 공개됩니다.
                  </p>
                </div>
                <Switch
                  checked={settings.showFeedbackToOthers}
                  onCheckedChange={handleGlobalSettingToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* 동료들의 피드백 기반 팁 */}
          {summary && summary.totalFeedbacks > 0 && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-700">
                  💡 동료들의 피드백 기반 팁
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800 mb-4">
                  최근 {summary.totalFeedbacks}개의 피드백을 바탕으로 한 개선된 가이드입니다.
                </p>
                <div className="grid md:grid-cols-5 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{summary.averageScores.communicationClarity.toFixed(1)}/5</div>
                    <div className="text-xs text-blue-700">소통 명확성</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{summary.averageScores.timeManagement.toFixed(1)}/5</div>
                    <div className="text-xs text-blue-700">시간 관리</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{summary.averageScores.collaboration.toFixed(1)}/5</div>
                    <div className="text-xs text-blue-700">협업 능력</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{summary.averageScores.preparation.toFixed(1)}/5</div>
                    <div className="text-xs text-blue-700">미팅 준비</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{summary.averageScores.listening.toFixed(1)}/5</div>
                    <div className="text-xs text-blue-700">경청 능력</div>
                  </div>
                </div>

                {/* 맞춤형 개선 가이드 */}
                <div className="mt-4 p-3 bg-white bg-opacity-60 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">🎯 나를 위한 맞춤 개선 가이드</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    {/* 강화할 점 */}
                    <div>
                      <h5 className="font-medium text-blue-700 mb-1">더 강화하면 좋을 점</h5>
                      {summary.averageScores.communicationClarity < 4 && (
                        <p className="text-blue-600 mb-1">• 핵심 내용을 먼저 말하고 세부사항은 나중에 설명해보세요</p>
                      )}
                      {summary.averageScores.timeManagement < 4 && (
                        <p className="text-blue-600 mb-1">• 미팅 시작 전 간단한 아젠다를 공유해보세요</p>
                      )}
                      {summary.averageScores.collaboration < 4 && (
                        <p className="text-blue-600 mb-1">• 다른 의견에 "그렇다면..." 같은 연결어로 응답해보세요</p>
                      )}
                      {summary.averageScores.preparation < 4 && (
                        <p className="text-blue-600 mb-1">• 미팅 전 참고자료를 미리 공유해보세요</p>
                      )}
                      {summary.averageScores.listening < 4 && (
                        <p className="text-blue-600 mb-1">• "이해한 바로는..." 같은 요약으로 확인해보세요</p>
                      )}
                    </div>

                    {/* 지속할 점 */}
                    <div>
                      <h5 className="font-medium text-blue-700 mb-1">계속 유지하면 좋을 점</h5>
                      {summary.averageScores.communicationClarity >= 4 && (
                        <p className="text-blue-600 mb-1">• 명확한 소통 스타일을 계속 유지하세요</p>
                      )}
                      {summary.averageScores.timeManagement >= 4 && (
                        <p className="text-blue-600 mb-1">• 시간 관리 능력이 훌륭합니다</p>
                      )}
                      {summary.averageScores.collaboration >= 4 && (
                        <p className="text-blue-600 mb-1">• 협업 능력이 뛰어납니다</p>
                      )}
                      {summary.averageScores.preparation >= 4 && (
                        <p className="text-blue-600 mb-1">• 미팅 준비가 철저합니다</p>
                      )}
                      {summary.averageScores.listening >= 4 && (
                        <p className="text-blue-600 mb-1">• 경청 능력이 우수합니다</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 동료들이 남긴 개별 피드백 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">
                동료들이 남긴 개별 피드백 ({feedbacks.length}개)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {feedbacks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">아직 동료들의 피드백이 없습니다.</p>
                  <p className="text-sm text-slate-400 mt-2">
                    미팅 완료 후 동료들이 나의 회의 스타일에 대해 남긴 피드백이 여기에 표시됩니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedbacks.map((feedback) => {
                    // 새로운 데이터 구조 확인
                    const hasResponses = feedback.responses && typeof feedback.responses === 'object';
                    const averageScore = hasResponses && feedback.responses ? 
                      Object.values(feedback.responses).reduce((sum: number, score: number) => sum + score, 0) / 5 : 
                      (feedback as any).rating || 0;

                    return (
                      <div
                        key={feedback.id}
                        className="border border-slate-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-slate-800">
                                {feedback.meetingName}
                              </h3>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm text-slate-600">
                                  {averageScore.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600">
                              {feedback.fromUser} • {feedback.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">
                              {feedback.isVisible ? '공개' : '비공개'}
                            </span>
                            <Switch
                              checked={feedback.isVisible}
                              onCheckedChange={(checked) => 
                                handleVisibilityToggle(feedback.id, checked)
                              }
                            />
                            {feedback.isVisible ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* 세부 평가 점수 표시 */}
                        {hasResponses && (
                          <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                            <p className="text-xs text-slate-500 mb-2">세부 평가:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span>💬 소통 명확성</span>
                                <span className="font-medium">{feedback.responses.communicationClarity}/5</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>⏰ 시간 관리</span>
                                <span className="font-medium">{feedback.responses.timeManagement}/5</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>🤝 협업 능력</span>
                                <span className="font-medium">{feedback.responses.collaboration}/5</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>📋 미팅 준비</span>
                                <span className="font-medium">{feedback.responses.preparation}/5</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>👂 경청 능력</span>
                                <span className="font-medium">{feedback.responses.listening}/5</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 강점 표시 */}
                        {feedback.strengths && feedback.strengths.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-slate-500 mb-1">강점:</p>
                            <div className="flex flex-wrap gap-1">
                              {feedback.strengths.map((strength, index) => (
                                <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 개선점 표시 */}
                        {feedback.improvements && feedback.improvements.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-slate-500 mb-1">개선점:</p>
                            <div className="flex flex-wrap gap-1">
                              {feedback.improvements.map((improvement, index) => (
                                <span key={index} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                  {improvement}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {feedback.comment && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-xs text-slate-500 mb-1">코멘트:</p>
                            <p className="text-sm text-slate-700">{feedback.comment}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 회의 스타일 공개의 이점 */}
          <Card className="shadow-lg bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-medium text-blue-800 mb-2">나의 회의 스타일 공개의 장점</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 새로운 팀원들이 나와의 협업 방식을 미리 이해하여 더 효율적인 미팅이 가능해요</li>
                <li>• 동료들의 긍정적 평가는 신뢰도를 높이고 팀워크를 강화해요</li>
                <li>• 나의 강점을 활용한 역할 분담으로 더 나은 성과를 얻을 수 있어요</li>
                <li>• 개별 피드백의 공개/비공개는 언제든지 조정할 수 있어요</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <BackButton fallbackPath="/profile" />
      </div>
    </div>
  );
}