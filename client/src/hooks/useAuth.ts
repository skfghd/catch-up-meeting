import { useQuery } from "@tanstack/react-query";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  profileData?: any;
  feedbackData?: any;
}

export function useAuth() {
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: true, // 윈도우 포커스 시 다시 확인
    refetchOnMount: true, // 마운트 시 다시 확인  
    staleTime: 2 * 60 * 1000, // 2분으로 단축하여 로그인 상태 빠르게 반영
    gcTime: 5 * 60 * 1000, // 5분으로 단축
    networkMode: 'online',
  });

  return {
    user: user as AuthUser | undefined,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
    refetch, // 수동 재요청을 위한 함수 추가
  };
}