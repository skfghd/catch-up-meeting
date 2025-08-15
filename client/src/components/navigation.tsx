import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, User, FileText, Users, Settings, ArrowLeft, LogOut, Crown, BookOpen, Menu, X, BarChart3, ExternalLink } from "lucide-react";
import MBTIIcon from "@/components/mbti-icon";
import { isGuestMode, exitGuestMode, getUserProfile, clearUser } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { LanguageSelector } from "@/components/language-selector";

interface NavigationProps {
  showBack?: boolean;
  backTo?: string;
  title?: string;
  useHistory?: boolean; // 브라우저 히스토리 사용 여부
}

export default function Navigation({ showBack = false, backTo = "/", title, useHistory = false }: NavigationProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user: authUser, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleBackClick = () => {
    if (useHistory && window.history.length > 1) {
      window.history.back();
    } else {
      setLocation(backTo);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });

      clearUser();

      window.location.reload();

      toast({
        title: "로그아웃 완료",
        description: "성공적으로 로그아웃되었습니다.",
      });

      setLocation('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      clearUser();
      window.location.reload();
      setLocation('/');
    }
  };

  const handleLogoClick = () => {
    if (isGuestMode()) {
      const profile = getUserProfile();
      if (profile) {
        setLocation('/results');
      } else {
        setLocation('/survey');
      }
    } else {
      setLocation('/');
    }
  };

  const navigationItems = [
    { icon: Home, label: "홈", path: "/" },
    { icon: User, label: "프로필", path: "/profile" },
    { icon: FileText, label: "진단", path: "/survey" },
    { icon: BookOpen, label: "유형소개", path: "/communication-types" },
    { icon: Users, label: "회의방", path: "/rooms" },
    { icon: BarChart3, label: "조직 분석", path: "/team-leader" },
    { icon: Crown, label: "기업용", path: "/organization" },
    { icon: Settings, label: "설정", path: "/feedback-settings" },
  ];

  return (
    <nav className="fixed left-0 right-0 z-40 glass-effect border-b bg-white/80 backdrop-blur-sm" style={{top: '60px'}}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Logo and Title */}
          <div className="flex items-center space-x-3">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setLocation('/')}
              >
                <MBTIIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                {title ? (
                  <span className="text-display text-lg font-semibold">
                    {title}
                  </span>
                ) : (
                  <span 
                    className="text-display text-lg font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleLogoClick}
                  >
                    Meeting MBTI
                  </span>
                )}
                {isAuthenticated && authUser && (
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                      {authUser.name}님
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                      }}
                      className="p-1 h-6 w-6 text-blue-700 hover:text-blue-900 hover:bg-blue-200"
                      title="로그아웃"
                    >
                      <LogOut className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                {isGuestMode() && !isAuthenticated && (
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-medium">
                      게스트모드참여
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        exitGuestMode();
                        toast({
                          title: "게스트 모드 종료",
                          description: "게스트 모드를 종료했습니다. 새로운 게스트로 다시 시작할 수 있습니다.",
                        });
                        setLocation('/');
                      }}
                      className="p-1 h-6 w-6 text-orange-700 hover:text-orange-900 hover:bg-orange-200"
                      title="게스트 모드 종료"
                    >
                      <LogOut className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Navigation Items */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={location === item.path ? "default" : "ghost"}
                size="sm"
                onClick={() => setLocation(item.path)}
                className={`flex items-center space-x-2 ${
                  location === item.path 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Button>
            ))}
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setLocation(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start flex items-center space-x-3 py-3 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-base">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}