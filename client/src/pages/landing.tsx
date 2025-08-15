import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { User, ArrowRight, Users, MessageCircle, TrendingUp, ExternalLink } from "lucide-react";
import { Footer } from "@/components/footer";
import MBTIIcon from "@/components/mbti-icon";
import { initGuestMode } from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { LanguageSelector } from "@/components/language-selector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Landing() {
  const [, setLocation] = useLocation();
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // 로그인된 사용자 처리는 App.tsx의 Router에서 통합 관리
  // 이 페이지에서는 별도 리다이렉션 로직을 제거하여 중복 방지

  const handleGuestMode = () => {
    initGuestMode();
    setLocation('/survey');
  };

  const handleFindBoard = () => {
    initGuestMode();
    setLocation('/rooms');
  };

  // 로그인 상태 확인 중이면 로딩 표시
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
            <MBTIIcon className="w-4 h-4 text-white" />
          </div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 z-40 glass-effect border-b" style={{top: '60px'}}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <MBTIIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-display text-lg font-semibold">{t('landing.title')}</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Navigation Menu Items - Desktop Only */}
              <div className="hidden xl:flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation('/communication-types')}
                  className="font-medium text-muted-foreground hover:text-foreground"
                >
                  유형소개
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation('/survey')}
                  className="font-medium text-muted-foreground hover:text-foreground"
                >
                  진단
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation('/rooms')}
                  className="font-medium text-muted-foreground hover:text-foreground"
                >
                  회의방
                </Button>
              </div>
              
              <LanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/organization')}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                <Users className="w-4 h-4 mr-1" />
                <span className="hidden lg:inline">{t('nav.enterprise')}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/login')}
                className="font-medium text-muted-foreground hover:text-foreground"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={handleGuestMode}
                className="bg-primary text-primary-foreground hover:bg-primary/90 animate-smooth"
              >
                {t('landing.guestButton')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-display text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Catch-Up </span>
              <span className="text-primary">Meeting MBTI</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Prepare smart. Communicate better.
            </p>
            <p className="text-body text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              {t('landing.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setLocation('/login')}
                className="bg-primary text-primary-foreground hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:shadow-lg animate-smooth elevation-md px-8 py-6 text-lg font-semibold rounded-xl w-full sm:w-[160px]"
              >
                {t('landing.loginButton')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleGuestMode}
                className="border-2 border-muted-foreground/30 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-muted-foreground animate-smooth px-8 py-6 text-lg font-semibold rounded-xl w-full sm:w-[160px]"
              >
                {t('landing.guestButton')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleFindBoard}
                className="border-2 border-primary text-primary hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-200 hover:text-rose-800 hover:border-rose-300 animate-smooth px-8 py-6 text-lg font-semibold rounded-xl w-full sm:w-[160px]"
              >
                Find Board
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-display text-4xl font-bold mb-4">{t('landing.features.title')}</h2>
            <p className="text-body text-lg text-muted-foreground">
              {t('landing.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 elevation-sm hover:elevation-md animate-smooth border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('landing.features.personality')}</h3>
              <p className="text-body text-muted-foreground">
                {t('landing.features.personalityDesc')}
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 elevation-sm hover:elevation-md animate-smooth border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('landing.features.meetings')}</h3>
              <p className="text-body text-muted-foreground">
                {t('landing.features.meetingsDesc')}
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 elevation-sm hover:elevation-md animate-smooth border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('landing.features.analysis')}</h3>
              <p className="text-body text-muted-foreground">
                {t('landing.features.analysisDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-center text-white elevation-lg">
            <h2 className="text-display text-4xl font-bold mb-4">{t('landing.cta.title')}</h2>
            <p className="text-xl mb-8 opacity-90">
              {t('landing.cta.subtitle')}
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setLocation('/survey')}
              className="bg-white text-primary hover:bg-white/90 animate-smooth elevation-md px-8 py-6 text-lg font-semibold rounded-xl"
            >
              {t('landing.cta.button')}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}