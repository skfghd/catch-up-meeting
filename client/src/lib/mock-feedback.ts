import { MeetingFeedback } from "@/lib/storage";

// 개발 및 데모용 샘플 피드백 데이터 (새로운 체크리스트 방식)
export const sampleFeedbacks: MeetingFeedback[] = [
  {
    id: '1',
    meetingName: '디자인 스프린트 계획',
    fromUser: '김사라',
    targetUser: 'user@example.com',
    responses: {
      communicationClarity: 5,
      timeManagement: 4,
      collaboration: 5,
      preparation: 5,
      listening: 4
    },
    strengths: ['명확한 의사소통', '체계적 정리', '좋은 아이디어 제시', '팀워크'],
    improvements: [],
    comment: '정말 체계적이고 명확하게 의견을 정리해주셔서 회의가 매우 효율적이었어요.',
    date: '2025-01-17',
    isVisible: true
  },
  {
    id: '2',
    meetingName: '제품 로드맵',
    fromUser: '로페즈마리아',
    targetUser: 'user@example.com',
    responses: {
      communicationClarity: 4,
      timeManagement: 3,
      collaboration: 4,
      preparation: 4,
      listening: 5
    },
    strengths: ['다른 의견 존중', '경청', '문제 해결 능력'],
    improvements: ['시간 관리'],
    comment: '다양한 관점에서 생각해보는 능력이 뛰어나시네요.',
    date: '2025-01-15',
    isVisible: false
  },
  {
    id: '3',
    meetingName: '분기별 검토',
    fromUser: '왕리사',
    targetUser: 'user@example.com',
    responses: {
      communicationClarity: 5,
      timeManagement: 5,
      collaboration: 4,
      preparation: 5,
      listening: 4
    },
    strengths: ['사전 준비', '명확한 의사소통', '체계적 정리', '시간 준수'],
    improvements: [],
    comment: '데이터 기반의 논리적인 접근이 정말 도움이 되었습니다.',
    date: '2025-01-10',
    isVisible: true
  }
];

// 샘플 피드백을 localStorage에 추가하는 함수 (개발용)
export const addSampleFeedbacks = () => {
  const existingFeedbacks = localStorage.getItem('meetingFeedbacks');
  if (!existingFeedbacks || JSON.parse(existingFeedbacks).length === 0) {
    localStorage.setItem('meetingFeedbacks', JSON.stringify(sampleFeedbacks));
    console.log('샘플 피드백 데이터가 추가되었습니다.');
  }
};
export const getMockFeedbacks = (): MeetingFeedback[] => {
  return [];
};