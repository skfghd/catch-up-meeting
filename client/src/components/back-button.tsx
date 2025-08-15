import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  className?: string;
  fallbackPath?: string;
}

export function BackButton({ className = "", fallbackPath = "/" }: BackButtonProps) {
  const handleGoBack = () => {
    // 브라우저 히스토리가 있는지 확인
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // 히스토리가 없으면 fallback 경로로 이동
      window.location.href = fallbackPath;
    }
  };

  return (
    <div className={`flex justify-center pt-8 pb-4 ${className}`}>
      <Button
        variant="outline"
        onClick={handleGoBack}
        className="bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700 px-6 py-2"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        이전 페이지로
      </Button>
    </div>
  );
}