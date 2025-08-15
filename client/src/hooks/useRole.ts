import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export interface UserRole {
  role: 'admin' | 'manager' | 'member' | 'guest';
  organizationId?: number;
  organizationName?: string;
  isTeamLeader: boolean;
}

export function useRole() {
  const { user, isAuthenticated } = useAuth();
  
  const { data: roleData, isLoading } = useQuery({
    queryKey: ['/api/user/role', user?.id],
    enabled: !!user && isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10분 캐시
  });

  const isTeamLeader = roleData?.role === 'admin' || roleData?.role === 'manager';
  const isAdmin = roleData?.role === 'admin';
  
  return {
    role: roleData?.role || 'guest',
    organizationId: roleData?.organizationId,
    organizationName: roleData?.organizationName,
    isTeamLeader,
    isAdmin,
    isLoading,
    roleData
  };
}