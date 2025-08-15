import React, { memo, useMemo, useCallback } from 'react';

// 성능 최적화된 ParticipantCard 컴포넌트
export const OptimizedParticipantCard = memo(({ participant, onExpand }: any) => {
  const handleExpand = useCallback(() => {
    onExpand?.(participant.id);
  }, [participant.id, onExpand]);

  const tipCategories = useMemo(() => [
    { 
      key: 'preparation', 
      label: '회의 준비', 
      tips: participant.tips?.preparation || [] 
    },
    { 
      key: 'communication', 
      label: '소통 방식', 
      tips: participant.tips?.communication || [] 
    },
    { 
      key: 'collaboration', 
      label: '협업 스타일', 
      tips: participant.tips?.collaboration || [] 
    },
    { 
      key: 'feedback', 
      label: '피드백 선호', 
      tips: participant.tips?.feedback || [] 
    },
    { 
      key: 'environment', 
      label: '최적 환경', 
      tips: participant.tips?.environment || [] 
    }
  ], [participant.tips]);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
          {participant.name?.charAt(0) || '?'}
        </div>
        <div>
          <h3 className="font-semibold">{participant.name}</h3>
          <span className="text-sm text-gray-600">{participant.style}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        {tipCategories.map(category => (
          category.tips.length > 0 && (
            <details key={category.key} className="border rounded p-3">
              <summary className="font-medium text-sm cursor-pointer flex items-center justify-between">
                {category.label}
                <span className="text-xs text-gray-500">{category.tips.length}개</span>
              </summary>
              <ul className="mt-2 space-y-1 text-xs text-gray-600">
                {category.tips.map((tip: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </details>
          )
        ))}
      </div>
    </div>
  );
});

OptimizedParticipantCard.displayName = 'OptimizedParticipantCard';

// 로딩 스켈레톤 컴포넌트
export const LoadingSkeleton = memo(({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="border rounded-lg p-4 animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Lazy loading을 위한 Intersection Observer Hook
export const useIntersectionObserver = (callback: () => void, deps: any[] = []) => {
  const targetRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, deps);

  return targetRef;
};