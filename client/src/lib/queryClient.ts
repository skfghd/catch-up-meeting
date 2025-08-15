import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  }
): Promise<any> {
  // Import Firebase API function dynamically to avoid dependency issues
  const { firebaseApiRequest } = await import('./firebase');
  
  return firebaseApiRequest(url, {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
  });
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      // Import Firebase API function dynamically
      const { firebaseApiRequest } = await import('./firebase');
      
      return await firebaseApiRequest(queryKey.join("/") as string, {
        credentials: "include",
      });
    } catch (error: any) {
      if (unauthorizedBehavior === "returnNull" && error.message.includes('401')) {
        return null;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }), // 401 시 null 반환으로 안정성 확보
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
      gcTime: 10 * 60 * 1000, // 10분간 데이터 보관
      retry: 1, // 1회 재시도
      retryDelay: 1000, // 1초 후 재시도
      networkMode: 'online',
    },
    mutations: {
      retry: 1, // 실패 시 1회 재시도
      retryDelay: 1000,
      networkMode: 'online',
    },
  },
});
