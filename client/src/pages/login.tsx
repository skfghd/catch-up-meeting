import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exitGuestMode, setUser, setSurveyAnswers, setUserProfile } from "@/lib/storage";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";


export default function Login() {
  const [email, setEmail] = useState("");
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "입력 오류",
        description: "이메일을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Guest 모드 해제
      exitGuestMode();
      
      // 이메일에서 이름 추출 (@ 앞 부분)
      const name = email.split('@')[0];
      
      // 서버에 로그인 요청
      const user = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email, name },
      });

      console.log('로그인 성공:', user);

      // 사용자 정보를 localStorage에 저장 
      setUser({
        email: user.email,
        name: user.name
      });

      // 기존 프로필 데이터가 있으면 localStorage에 복원
      if (user.profileData) {
        if (user.profileData.surveyAnswers) {
          setSurveyAnswers(user.profileData.surveyAnswers);
        }
        if (user.profileData.userProfile) {
          setUserProfile(user.profileData.userProfile);
        }
      }

      toast({
        title: "로그인 성공",
        description: `환영합니다, ${user.name}님!`,
      });

      // 인증 캐시 무효화하여 새로운 상태 반영
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // 잠시 대기 후 페이지 이동 (새로고침으로 인증 상태 즉시 반영)
      setTimeout(() => {
        window.location.href = user.profileData ? '/profile' : '/survey';
      }, 800);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "로그인 실패",
        description: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center bg-muted/20">
      <Card className="w-full max-w-md mx-6 elevation-md rounded-xl glass-effect bg-background/80">
        <CardHeader className="text-center">
          <CardTitle className="text-display text-3xl font-bold mb-2">
            다시 오신 것을 환영합니다
          </CardTitle>
          <p className="text-body text-muted-foreground">이메일을 입력하여 로그인하세요</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">이메일 주소</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="px-4 py-3"
              />
            </div>

            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 font-semibold hover:shadow-lg animate-smooth elevation-md rounded-xl disabled:opacity-50"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
