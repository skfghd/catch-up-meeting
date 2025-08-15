import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  Zap, 
  Target, 
  Clock, 
  CheckCircle,
  Globe,
  Plus,
  ArrowRight,
  Coffee,
  MessageCircle,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Footer } from "@/components/footer";
import { LanguageSelector } from "@/components/language-selector";

export default function OrganizationLanding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState({
    // 세션 생성용 (필수 3개 필드만)
    title: "",
    description: "",
    hostName: "",

  });

  const handleCreateSession = async () => {
    if (!formData.title || !formData.hostName) {
      toast({
        title: t('org.required'),
        description: t('org.requiredDesc'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const session = await apiRequest('/api/icebreaking/sessions', {
        method: 'POST',
        body: {
          title: formData.title,
          description: formData.description,
          hostName: formData.hostName,
          maxParticipants: 20, // 기본값 20명
          isPublic: true,
          scheduledAt: null
        }
      });

      toast({
        title: t('org.created'),
        description: `${t('org.createdDesc')}${session.inviteCode}`,
      });

      setLocation(`/icebreaking/${session.inviteCode}`);
    } catch (error) {
      console.error('Session creation error:', error);
      toast({
        title: t('org.failed'),
        description: t('org.failedDesc'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  const features = [
    {
      icon: Coffee,
      title: t('org.features.icebreaking'),
      description: t('org.features.icebreakingDesc')
    },
    {
      icon: MessageCircle,
      title: t('org.features.instant'),
      description: t('org.features.instantDesc')
    },
    {
      icon: BarChart3,
      title: t('org.features.realtime'),
      description: t('org.features.realtimeDesc')
    },
    {
      icon: Users,
      title: t('org.features.flexible'),
      description: t('org.features.flexibleDesc')
    }
  ];

  const benefits = [
    t('org.benefits.meeting'),
    t('org.benefits.style'),
    t('org.benefits.role'),
    t('org.benefits.tips')
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 헤더 */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Meeting MBTI Enterprise
              </span>
              <div className="text-xs text-gray-500 font-medium">조직 전용 아이스브레이킹 플랫폼</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-3 py-1 font-medium">
              Enterprise Solution
            </Badge>
            <LanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              {t('org.personal')}
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 섹션 */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Badge className="bg-blue-600 text-white px-4 py-2 mb-6 text-sm font-medium rounded-full">
              🏢 {t('org.enterprise.solution')}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            {t('org.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-16 leading-relaxed max-w-4xl mx-auto">
            {t('org.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="w-4 md:w-5 h-4 md:h-5 mr-2" />
              {t('org.createSession')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto"
              onClick={() => setLocation('/rooms?view=enterprise-orgs')}
            >
              <ArrowRight className="w-4 md:w-5 h-4 md:h-5 mr-2" />
              {t('org.joinSession')}
            </Button>
          </div>

          {/* 주요 기능 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ROI 섹션 */}
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-slate-800 to-blue-900 text-white mb-16">
            <CardContent className="p-8 md:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-blue-300 mb-2">85%</div>
                  <p className="text-lg text-gray-300">회의 효율성 개선</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-indigo-300 mb-2">60%</div>
                  <p className="text-lg text-gray-300">프로젝트 완료 시간 단축</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-purple-300 mb-2">92%</div>
                  <p className="text-lg text-gray-300">직원 만족도 증가</p>
                </div>
              </div>
              <div className="border-t border-gray-600 mt-8 pt-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">기업용 핵심 혜택</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  <div className="text-left">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center mb-4">
                        <CheckCircle className="w-6 h-6 mr-4 text-green-400 flex-shrink-0" />
                        <span className="text-lg">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center md:text-right">
                    <Building2 className="w-40 h-40 text-white/10 mx-auto md:ml-auto mb-4" />
                    <div className="text-xl font-semibold mb-2">Enterprise-Grade Security</div>
                    <p className="text-gray-300 leading-relaxed">
                      ISO 27001 인증 및 GDPR 완전 준수
                      <br />
                      대기업 수준의 데이터 보안 보장
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 세션 생성 모달 */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-600" />
{t('org.createSession')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">{t('org.session.title')} *</Label>
                <Input
                  id="title"
                  placeholder="예: 마케팅팀 주간 회의 아이스브레이킹"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="hostName">{t('org.session.hostName')} *</Label>
                <Input
                  id="hostName"
                  placeholder="진행자 이름을 입력하세요"
                  value={formData.hostName}
                  onChange={(e) => setFormData({...formData, hostName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="description">{t('org.session.description')}</Label>
                <Textarea
                  id="description"
                  placeholder="세션에 대한 간단한 설명을 입력하세요"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowCreateForm(false)}
                >
                  {t('common.cancel')}
                </Button>
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleCreateSession}
                  disabled={loading}
                >
                  {loading ? t('common.loading') : t('org.session.create')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}



      <Footer />
    </div>
  );
}