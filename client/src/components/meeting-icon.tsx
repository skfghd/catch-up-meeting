interface MeetingIconProps {
  className?: string;
}

export default function MeetingIcon({ className = "w-8 h-8" }: MeetingIconProps) {
  return (
    <svg 
      className={className} 
      fill="currentColor" 
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 회의실 테이블 (타원형) */}
      <ellipse cx="12" cy="12" rx="8" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      
      {/* 테이블 위 문서/자료 */}
      <rect x="10" y="10" width="4" height="3" rx="0.5" fill="currentColor"/>
      <rect x="9" y="11" width="1.5" height="0.5" fill="currentColor"/>
      <rect x="13.5" y="11" width="1.5" height="0.5" fill="currentColor"/>
      
      {/* 사람들 (머리만 단순화) */}
      {/* 위쪽 사람 */}
      <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
      
      {/* 왼쪽 사람 */}
      <circle cx="6" cy="10" r="1.5" fill="currentColor"/>
      
      {/* 오른쪽 사람 */}
      <circle cx="18" cy="10" r="1.5" fill="currentColor"/>
      
      {/* 아래쪽 사람 */}
      <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
      
      {/* 대화 표시 (작은 점들) */}
      <circle cx="8" cy="8" r="0.5" fill="currentColor"/>
      <circle cx="9" cy="7.5" r="0.3" fill="currentColor"/>
      <circle cx="10" cy="7" r="0.2" fill="currentColor"/>
    </svg>
  );
}