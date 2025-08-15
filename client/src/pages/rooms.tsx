import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Plus, Copy, Clock, User, ChevronRight } from "lucide-react";

import { BackButton } from "@/components/back-button";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Footer } from "@/components/footer";


export default function Rooms() {
  const [, setLocation] = useLocation();
  const [view, setView] = useState<'main' | 'enterprise-orgs' | 'enterprise-sessions'>('main');
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);
  const { t } = useLanguage();

  // URL 파라미터 확인하여 초기 view 설정
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam === 'enterprise-orgs') {
      setView('enterprise-orgs');
    }
  }, []);

  // 조직 목록 조회
  const { data: organizations = [] } = useQuery<any[]>({
    queryKey: ['/api/organizations'],
    enabled: view !== 'main'
  });

  // 기업용 세션 목록 조회 (조직별)
  const { data: icebreakingSessions = [], isLoading: sessionsLoading } = useQuery<any[]>({
    queryKey: ['/api/icebreaking/sessions', selectedOrganization?.id],
    queryFn: () => {
      return fetch(`/api/icebreaking/sessions?organizationId=${selectedOrganization.id}`).then(res => res.json());
    },
    enabled: view === 'enterprise-sessions' && selectedOrganization
  });

  // 메인 페이지 렌더링
  const renderMainView = () => (
    <div className="grid md:grid-cols-2 gap-8">
      {/* 개인용 회의방 카드 */}
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/rooms-legacy')}>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('rooms.personal.title')}</h3>
          <p className="text-gray-600 mb-4">{t('rooms.personal.desc')}</p>
          <Button variant="outline" className="w-full">
            {t('rooms.personal.button')}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* 기업용 아이스브레이킹 카드 */}
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView('enterprise-orgs')}>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('rooms.enterprise.title')}</h3>
          <p className="text-gray-600 mb-4">{t('rooms.enterprise.desc')}</p>
          <Button variant="outline" className="w-full">
            {t('rooms.enterprise.button')}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // 조직 목록 페이지 렌더링
  const renderOrganizationsView = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold">{t('rooms.enterprise.title')}</h3>
          <p className="text-gray-600">{t('rooms.selectOrg')}</p>
        </div>
        <Button
          onClick={() => setLocation('/organization')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('rooms.createSession')}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org: any) => (
          <Card 
            key={org.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedOrganization(org);
              setView('enterprise-sessions');
            }}
          >
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">{org.name}</h4>
              <p className="text-gray-600 text-sm mb-4">{org.description}</p>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{org.domain}</Badge>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // 세션 목록 페이지 렌더링
  const renderSessionsView = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('enterprise-orgs')}
            className="text-gray-600"
          >
← {t('rooms.backToOrgs')}
          </Button>
          <div>
            <h3 className="text-2xl font-bold">{selectedOrganization?.name} 세션</h3>
            <p className="text-gray-600">{selectedOrganization?.description}</p>
          </div>
        </div>
      </div>

      {sessionsLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-500">{t('rooms.loading')}</p>
        </div>
      ) : icebreakingSessions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">{t('rooms.noSessions')}</h3>
            <p className="text-gray-500 mb-4">{t('rooms.noSessionsDesc')}</p>
            <Button
              onClick={() => setLocation('/organization')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              새 세션 만들기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {icebreakingSessions.map((session: any) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{session.title}</h4>
                      <Badge 
                        variant={session.status === 'active' ? 'default' : 'secondary'}
                        className={session.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                      >
                        {session.status === 'waiting' ? '대기중' : 
                         session.status === 'active' ? '진행중' : '완료'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{session.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
{t('rooms.maxParticipants')} {session.maxParticipants}{t('rooms.people')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {session.hostName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(session.inviteCode);
                        alert(t('rooms.copy'));
                      }}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {session.inviteCode}
                    </Button>
                    <Button
                      onClick={() => setLocation(`/icebreaking/${session.inviteCode}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
{t('rooms.join')}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8 pb-8 bg-muted/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-display text-4xl font-bold mb-4">{t('rooms.title')}</h2>
            <p className="text-body text-lg text-muted-foreground">
              {view === 'main' ? t('rooms.subtitle') :
               view === 'enterprise-orgs' ? t('rooms.selectOrg') :
               t('rooms.sessionParticipate')}
            </p>
          </div>

          {/* 뷰에 따른 콘텐츠 렌더링 */}
          {view === 'main' && renderMainView()}
          {view === 'enterprise-orgs' && renderOrganizationsView()}
          {view === 'enterprise-sessions' && renderSessionsView()}

          <BackButton fallbackPath="/" />
        </div>
      </div>

      <Footer variant="minimal" />
    </div>
  );
}