import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Survey from "@/pages/survey";
import Results from "@/pages/results";
import Rooms from "@/pages/rooms";
import RoomDetail from "@/pages/room-detail";
import Profile from "@/pages/profile";
import Feedback from "@/pages/feedback";
import FeedbackSettingsPage from "@/pages/feedback-settings";
import ParticipantCard from "@/pages/participant-card";
import WorkingWithMe from "@/pages/working-with-me";
import TeamLeader from "@/pages/team-leader";
import OrganizationAdmin from "@/pages/organization-admin";
import OrganizationLanding from "@/pages/organization-landing";
import IcebreakingSession from "@/pages/icebreaking-session";
import RoomsLegacy from "@/pages/rooms-legacy";
import { LanguageProvider } from "@/contexts/LanguageContext";

import CommunicationTypes from "@/pages/communication-types";
import Navigation from "@/components/navigation";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { isGuestMode, getUser, getUserProfile } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const [location, setLocation] = useLocation();
  const showNavigation = !['/', '/login'].includes(location);
  const { toast } = useToast();
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth();

  // 인증 상태에 따른 라우팅 처리
  useEffect(() => {
    // 서버 인증 로딩 중이면 대기
    if (authLoading) return;
    
    // 서버 인증된 사용자 처리 (로그인 모드)
    if (isAuthenticated && authUser) {
      // 랜딩 페이지에 있는 로그인 사용자는 적절한 페이지로 리다이렉트
      if (location === '/') {
        if (authUser.profileData) {
          console.log('로그인 사용자 리다이렉트: 프로필 페이지로 이동');
          setLocation('/profile');
        } else {
          console.log('로그인 사용자 리다이렉트: 설문 페이지로 이동');
          setLocation('/survey');
        }
      }
      return; // 로그인 사용자는 게스트 로직 실행하지 않음
    }

    // 서버 인증이 없는 경우에만 게스트 모드 세션 복구 실행
    if (!isAuthenticated && location === '/' && isGuestMode()) {
      const user = getUser();
      const profile = getUserProfile();
      
      // 이미 설문을 완료한 게스트라면 결과 페이지로 이동
      if (profile && user?.name && user.name !== '게스트 사용자') {
        console.log('게스트 모드 세션 복구: 결과 페이지로 이동');
        toast({
          title: "게스트 세션 복구됨",
          description: `${user.name}님의 분석 결과를 불러왔습니다.`,
        });
        setLocation('/results');
      }
      // 이름은 설정했지만 설문을 완료하지 않은 게스트라면 설문 페이지로 이동
      else if (user?.name && user.name !== '게스트 사용자') {
        console.log('게스트 모드 세션 복구: 설문 페이지로 이동');
        toast({
          title: "게스트 세션 복구됨",
          description: `${user.name}님, 설문을 이어서 진행하세요.`,
        });
        setLocation('/survey');
      }
    }
  }, [authLoading, isAuthenticated, authUser, location, setLocation, toast]);

  return (
    <div className="min-h-screen font-inter">
      {showNavigation && <Navigation />}
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/survey" component={Survey} />
        <Route path="/results" component={Results} />
        <Route path="/rooms" component={Rooms} />
        <Route path="/rooms/new" component={Rooms} />
        <Route path="/rooms-legacy" component={RoomsLegacy} />
        <Route path="/room/:roomName" component={RoomDetail} />
        <Route path="/participant/:participantName" component={ParticipantCard} />
        <Route path="/profile" component={Profile} />
        <Route path="/feedback" component={Feedback} />
        <Route path="/feedback-settings" component={FeedbackSettingsPage} />
        <Route path="/working-with-me" component={WorkingWithMe} />
        <Route path="/team-leader" component={TeamLeader} />
        <Route path="/organization-admin" component={OrganizationAdmin} />

        <Route path="/communication-types" component={CommunicationTypes} />
        <Route path="/organization" component={OrganizationLanding} />
        <Route path="/icebreaking/:inviteCode" component={IcebreakingSession} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
