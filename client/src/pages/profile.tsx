import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getUserProfile, getShareProfile, setShareProfile, getUser, setUser, UserProfile, User as UserType, isGuestMode, loadUserDataFromServer, setUserProfile, getDisplayProfile, generateFeedbackBasedProfile, getProfileDisplaySettings, setProfileDisplaySettings, ProfileDisplaySettings, generateFeedbackSummary, getSurveyAnswers } from "@/lib/storage";
import { determineMBTIType, MEETING_MBTI_TYPES } from "@/lib/meeting-mbti-types";
import { User as UserIcon, MessageCircle, Lightbulb, Plus, Edit3, Users, Camera, BarChart3 } from "lucide-react";
import Navigation from "@/components/navigation";
import { BackButton } from "@/components/back-button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Footer } from "@/components/footer";

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [shareEnabled, setShareEnabled] = useState(false);
  const [user, setUserState] = useState<UserType | null>(null);
  const [, setLocation] = useLocation();
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [displaySettings, setDisplaySettingsState] = useState<ProfileDisplaySettings>({ dataSource: 'auto' });
  const [feedbackProfile, setFeedbackProfile] = useState<UserProfile | null>(null);
  const [surveyProfile, setSurveyProfile] = useState<UserProfile | null>(null);
  const [displayProfile, setDisplayProfile] = useState<UserProfile | null>(null);
  const [feedbackSummary, setFeedbackSummary] = useState<any>(null);
  const { user: authUser, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    console.log('Profile 페이지 로드 - 모드 확인:', { 
      isAuthenticated, 
      hasAuthUser: !!authUser, 
      isGuestMode: isGuestMode() 
    });

    // 로그아웃 상태에서는 모든 데이터 초기화
    if (!isAuthenticated && !isGuestMode()) {
      console.log('로그아웃 상태 - 홈으로 리다이렉트');
      setUserState(null);
      setProfile(null);
      setDisplayName('');
      setShareEnabled(false);
      setLocation('/');
      return;
    }

    // 명확한 모드별 처리
    if (isAuthenticated && authUser) {
      // 로그인 모드 - 서버 데이터 우선
      console.log('로그인 모드 - 서버 데이터 사용');
      setUserState({ email: authUser.email, name: authUser.name });

      // 설문 기반 프로필 로드
      const localProfile = getUserProfile();
      if (localProfile) {
        console.log('로컬 프로필 발견:', localProfile);
        setSurveyProfile(localProfile);
      } else if (authUser.profileData?.styleResult) {
        console.log('서버 프로필 사용:', authUser.profileData.styleResult);
        setUserProfile(authUser.profileData.styleResult);
        setSurveyProfile(authUser.profileData.styleResult);
      }

      // 피드백 기반 프로필 생성
      const feedbackBasedProfile = generateFeedbackBasedProfile();
      setFeedbackProfile(feedbackBasedProfile);
      
      // 피드백 요약 생성
      const summary = generateFeedbackSummary();
      setFeedbackSummary(summary);

      // 표시 설정 로드
      const settings = getProfileDisplaySettings();
      setDisplaySettingsState(settings);

      // 표시할 프로필 결정
      const profileToDisplay = getDisplayProfile();
      setProfile(profileToDisplay);
      setDisplayProfile(profileToDisplay);

      setDisplayName(authUser.name);
      setShareEnabled(getShareProfile());
      setAvatarUrl(localStorage.getItem('userAvatar') || '');
    } else if (isGuestMode()) {
      // 게스트 모드 - 로컬 데이터 사용
      console.log('게스트 모드 - 로컬 데이터 사용');
      const userData = getUser();
      const userProfile = getUserProfile();

      if (!userData) {
        console.log('게스트 데이터 없음 - 홈으로 리다이렉트');
        setLocation('/');
        return;
      }

      setUserState(userData);
      setProfile(userProfile);
      setShareEnabled(getShareProfile());
      setDisplayName(userData.displayName || userData.name || '');
      setAvatarUrl(localStorage.getItem('userAvatar') || '');
    } else {
      // 인증도 게스트도 아닌 경우
      console.log('인증 상태 불분명 - 홈으로 리다이렉트');
      setLocation('/');
      return;
    }
  }, [setLocation, isAuthenticated, authUser]);

  const handleShareToggle = (checked: boolean) => {
    setShareEnabled(checked);
    setShareProfile(checked);
  };

  const handleSaveDisplayName = () => {
    if (user && displayName.trim()) {
      const updatedUser = { ...user, displayName: displayName.trim() };
      setUser(updatedUser); // localStorage에 저장
      setUserState(updatedUser); // 컴포넌트 상태 업데이트
      setIsEditingName(false);
    }
  };

  const handleCancelEdit = () => {
    setDisplayName(user?.displayName || user?.name || '');
    setIsEditingName(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        alert(t('profile.fileSizeError') || '파일 크기는 5MB 이하여야 합니다.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarUrl(result);
        localStorage.setItem('userAvatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarUrl('');
    localStorage.removeItem('userAvatar');
  };

  const handleDataSourceChange = (newSource: 'survey' | 'feedback' | 'auto') => {
    const newSettings = { dataSource: newSource };
    setDisplaySettingsState(newSettings);
    setProfileDisplaySettings(newSettings);

    // 새로운 설정에 따라 프로필 업데이트
    let newProfile: UserProfile | null = null;
    switch (newSource) {
      case 'survey':
        newProfile = surveyProfile;
        break;
      case 'feedback':
        newProfile = feedbackProfile;
        break;
      case 'auto':
      default:
        newProfile = feedbackProfile || surveyProfile;
        break;
    }
    
    setProfile(newProfile);
    setDisplayProfile(newProfile);
  };

  if (!profile || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation title={t('profile.title')} />
        <div className="pt-48 pb-8 bg-muted/20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-display text-3xl font-bold mb-4">{t('profile.loadError')}</h2>
            <p className="text-slate-600 mb-6">
              {!user 
                ? t('profile.userNotFound') 
                : t('profile.surveyRequired')}
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => setLocation('/survey')}
                className="bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-3"
              >
                {t('profile.takeSurvey')}
              </Button>
              {!user && (
                <div>
                  <Button 
                    variant="outline"
                    onClick={() => setLocation('/login')}
                    className="ml-4"
                  >
                    {t('profile.loginAgain')}
                  </Button>
                </div>
              )}
            </div>
            <BackButton fallbackPath="/" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation title={`${t('profile.title')} ${isAuthenticated ? t('profile.loginMode') : t('profile.guestMode')}`} />
      <div className="pt-48 pb-8 bg-muted/20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-display text-4xl font-bold mb-4">{t('profile.title')}</h2>
            <p className="text-body text-lg text-muted-foreground">{t('profile.subtitle')}</p>

          {/* 사용자 정보 표시 */}
          <div className="mt-6 p-6 glass-effect bg-gradient-to-r from-background to-muted/30 rounded-xl border elevation-md">
            <div className="flex items-center justify-center mb-4">
              <div className="relative group">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={avatarUrl} alt="프로필 사진" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-2xl">
                    {(user?.displayName || user?.name || user?.email)?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                
                {/* 사진 업로드/변경 버튼 */}
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <label className="cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* 사진 제거 버튼 */}
                {avatarUrl && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    ×
                  </Button>
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2 justify-center">
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="text-center font-semibold text-slate-800 max-w-48"
                      placeholder="회의에서 사용할 이름"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveDisplayName}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1"
                    >
                      {t('profile.save')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="px-3 py-1"
                    >
                      {t('profile.cancel')}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center">
                    <h3 className="text-xl font-semibold text-slate-800">
                      {user?.displayName || user?.name || t('profile.defaultName')}
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingName(true)}
                      className="text-slate-500 hover:text-slate-700 p-1"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-slate-600 text-sm">
                {user?.email || t('profile.noEmail')}
              </p>
              <p className="text-slate-500 text-xs mt-1">
                {t('profile.displayAs')}: "{user?.displayName || user?.name || t('profile.defaultName')}"
              </p>
            </div>
          </div>
        </div>

        {/* 로그인 사용자만 프로필 데이터 소스 선택 가능 */}
        {isAuthenticated && !isGuestMode() && feedbackSummary && feedbackSummary.totalFeedbacks > 0 && (
          <Card className="elevation-md mb-6 rounded-xl border glass-effect bg-background/80">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                프로필 데이터 소스 선택
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                어떤 데이터를 기반으로 프로필을 표시할지 선택하세요.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 자동 선택 */}
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    displaySettings.dataSource === 'auto' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-slate-200 hover:border-primary/50'
                  }`}
                  onClick={() => handleDataSourceChange('auto')}
                >
                  <div className="flex items-center mb-2">
                    <input 
                      type="radio" 
                      checked={displaySettings.dataSource === 'auto'}
                      onChange={() => handleDataSourceChange('auto')}
                      className="mr-2"
                    />
                    <span className="font-medium text-slate-800">자동 선택</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    충분한 피드백이 있으면 피드백 기반, 없으면 설문 기반으로 자동 선택
                  </p>
                </div>

                {/* 설문 기반 */}
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    displaySettings.dataSource === 'survey' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleDataSourceChange('survey')}
                >
                  <div className="flex items-center mb-2">
                    <input 
                      type="radio" 
                      checked={displaySettings.dataSource === 'survey'}
                      onChange={() => handleDataSourceChange('survey')}
                      className="mr-2"
                    />
                    <span className="font-medium text-slate-800">설문 기반</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    내가 직접 답변한 설문조사 결과를 기반으로 한 스타일
                  </p>
                </div>

                {/* 피드백 기반 */}
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    displaySettings.dataSource === 'feedback' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-slate-200 hover:border-green-300'
                  } ${!feedbackProfile ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => feedbackProfile && handleDataSourceChange('feedback')}
                >
                  <div className="flex items-center mb-2">
                    <input 
                      type="radio" 
                      checked={displaySettings.dataSource === 'feedback'}
                      onChange={() => feedbackProfile && handleDataSourceChange('feedback')}
                      disabled={!feedbackProfile}
                      className="mr-2"
                    />
                    <span className="font-medium text-slate-800">피드백 기반</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {feedbackProfile 
                      ? `동료들의 ${feedbackSummary.totalFeedbacks}개 피드백을 기반으로 한 실제 스타일`
                      : '충분한 피드백이 없습니다 (최소 3개 필요)'
                    }
                  </p>
                </div>
              </div>

              {/* 현재 선택된 데이터 소스 정보 */}
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700">
                  <strong>현재 표시 중:</strong> {
                    displaySettings.dataSource === 'auto' 
                      ? (feedbackProfile ? '피드백 기반 (자동)' : '설문 기반 (자동)')
                      : displaySettings.dataSource === 'survey' 
                        ? '설문 기반' 
                        : '피드백 기반'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Sharing Toggle */}
        <Card className="elevation-md mb-8 rounded-xl border glass-effect bg-background/80">
          <CardContent className="p-6">
            {isGuestMode() && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-orange-700 font-medium text-sm">🎭 게스트 모드</span>
                </div>
                <p className="text-xs text-orange-600">
                  게스트 모드에서는 프로필이 기본적으로 공개됩니다. 비공개로 변경하고 싶다면 아래 스위치를 끄세요.
                </p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">회의에서 프로필 공유</h3>
                <p className="text-sm text-slate-600">
                  {isGuestMode() 
                    ? "게스트로서 미팅 참가자들에게 당신의 소통 스타일을 공개할지 선택하세요"
                    : "다른 사람들이 Catch-Up Meeting MBTI에서 당신의 소통 스타일을 볼 수 있도록 허용"
                  }
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="share-toggle"
                  checked={shareEnabled}
                  onCheckedChange={handleShareToggle}
                />
                <Label htmlFor="share-toggle" className="sr-only">프로필 공유</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MBTI 스타일 카드 - 하나로 통합 */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="text-center">
                {(() => {
                  const answers = getSurveyAnswers();
                  if (answers) {
                    const mbtiType = determineMBTIType(answers);
                    const typeInfo = MEETING_MBTI_TYPES[mbtiType];
                    if (typeInfo) {
                      return (
                        <div className="space-y-6">
                          {/* MBTI 유형 표시 */}
                          <div className="flex items-center justify-center gap-4">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {mbtiType}
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                  {typeInfo.code}
                                </span>
                                <h3 className="text-2xl font-bold text-slate-800">{typeInfo.name}</h3>
                              </div>
                              <p className="text-slate-600 text-sm mt-1">{typeInfo.nickname} - {typeInfo.description}</p>
                            </div>
                          </div>

                        {/* 핵심 회의 가이드 */}
                        <div className="grid md:grid-cols-2 gap-6 text-left">
                          <div>
                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                              <Lightbulb className="w-4 h-4 mr-2 text-blue-600" />
                              회의 운영 팁
                            </h4>
                            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                              {typeInfo.meetingTips}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                              <Users className="w-4 h-4 mr-2 text-green-600" />
                              협업 가이드
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {typeInfo.collaborationGuide}
                            </p>
                          </div>
                        </div>

                        {/* 강점과 주의사항 */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-slate-50 rounded-lg p-4">
                            <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
                              <Lightbulb className="w-4 h-4 mr-2 text-amber-500" />
                              회의 강점
                            </h4>
                            <div className="text-slate-600 text-sm space-y-1">
                              {typeInfo.strengths.map((strength: string, idx: number) => (
                                <div key={idx} className="flex items-start">
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  <span>{strength}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="bg-slate-50 rounded-lg p-4">
                            <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
                              <Users className="w-4 h-4 mr-2 text-blue-500" />
                              주의사항
                            </h4>
                            <div className="text-slate-600 text-sm space-y-1">
                              {typeInfo.challenges.map((challenge: string, idx: number) => (
                                <div key={idx} className="flex items-start">
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  <span>{challenge}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 최적 환경 */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-indigo-600">{typeInfo.optimalMeetingSize}</div>
                              <div className="text-xs text-slate-600">최적 미팅 규모</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-indigo-600">{typeInfo.preferredMeetingLength}</div>
                              <div className="text-xs text-slate-600">선호 미팅 시간</div>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-indigo-600">{typeInfo.communicationPreference}</div>
                              <div className="text-xs text-slate-600">소통 스타일</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
                return (
                  <div className="text-center py-8">
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">{profile.style || '회의 스타일 미완료'}</h4>
                    <p className="text-slate-600 text-sm">{profile.tips || '설문을 완료하여 MBTI 유형을 확인하세요'}</p>
                  </div>
                );
              })()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-6">
          {/* 액션 버튼들 - 명확한 버튼 스타일 */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 진단 다시 받기 */}
              <Button 
                onClick={() => setLocation('/survey')}
                className="group relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold mb-1">진단 다시 받기</h3>
                    <p className="text-sm text-white/90">새로운 진단으로 스타일 업데이트</p>
                  </div>
                </div>
              </Button>

              {/* How Others See Me */}
              <Button 
                onClick={() => setLocation('/feedback-settings')}
                className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold mb-1">How Others See Me</h3>
                    <p className="text-sm text-white/90">피드백 확인하고 관리하기</p>
                  </div>
                </div>
              </Button>

              {/* Work with Me */}
              <Button 
                onClick={() => setLocation('/working-with-me')}
                className="group relative bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold mb-1">Tips for Working with Me</h3>
                    <p className="text-sm text-white/90">나와 협업하는 방법 가이드</p>
                  </div>
                </div>
              </Button>

              {/* Find Board */}
              <Button 
                onClick={() => setLocation('/rooms')}
                className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold mb-1">Find Board</h3>
                    <p className="text-sm text-white/90">미팅 보드 찾기 및 참여하기</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        <BackButton fallbackPath="/" />
        </div>
      </div>

      <Footer variant="minimal" />
    </div>
  );
}