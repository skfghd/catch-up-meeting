import { SurveyAnswers } from './storage';

// MBTI 4가지 핵심 차원 정의
export interface MBTIDimensions {
  // E(외향)/I(내향) - 에너지 방향
  energyDirection: 'E' | 'I'; // E: 외향적/그룹지향, I: 내향적/개별지향
  
  // S(감각)/N(직관) - 정보 인식
  informationPerception: 'S' | 'N'; // S: 현실적/구체적, N: 직관적/추상적
  
  // T(사고)/F(감정) - 의사결정 
  decisionMaking: 'T' | 'F'; // T: 논리적/객관적, F: 감정적/관계지향
  
  // J(판단)/P(인식) - 생활 양식
  lifestyleOrientation: 'J' | 'P'; // J: 계획적/체계적, P: 유연적/적응적
}

// MBTI 유형 결정 함수
export const determineMBTIType = (answers: SurveyAnswers): string => {
  // E/I: 개별 vs 그룹 선호도, 에너지 수준
  const E_I = answers.q4 === 'group' || answers.q7 === 'energetic' ? 'E' : 'I';
  
  // S/N: 구체적 vs 창의적 접근, 실용적 vs 혁신적
  const S_N = answers.q11 === 'practical' || answers.q14 === 'cautious' ? 'S' : 'N';
  
  // T/F: 논리적 vs 감정적 의사결정, 직접적 vs 배려적 소통
  const T_F = answers.q6 === 'logical' || answers.q9 === 'direct' ? 'T' : 'F';
  
  // J/P: 체계적 vs 유연한 구조, 계획적 vs 적응적
  const J_P = answers.q5 === 'structured' || answers.q8 === 'proactive' ? 'J' : 'P';
  
  return `${E_I}${S_N}${T_F}${J_P}`;
};

// 16가지 미팅 MBTI 유형 정의
export interface MeetingMBTIType {
  code: string; // 4글자 코드 (예: ESTJ)
  name: string; // 유형 이름
  nickname: string; // 별칭
  description: string; // 설명
  strengths: string[]; // 강점
  challenges: string[]; // 주의사항
  meetingTips: string; // 미팅 운영 팁
  collaborationGuide: string; // 협업 가이드
  optimalMeetingSize: string; // 최적 미팅 규모
  preferredMeetingLength: string; // 선호 미팅 시간
  communicationPreference: string; // 소통 선호
}

// 16가지 미팅 MBTI 유형 데이터
export const MEETING_MBTI_TYPES: Record<string, MeetingMBTIType> = {
  // E-S-T-J: 외향-신속-논리-체계
  'ESTJ': {
    code: 'ESTJ',
    name: '실행형 리더',
    nickname: '미팅 마스터',
    description: '명확한 목표와 체계적인 진행으로 효율적인 미팅을 이끕니다',
    strengths: ['명확한 아젠다 설정', '시간 관리 능력', '즉석 의사결정', '팀 동기부여'],
    challenges: ['융통성 부족 가능성', '다양한 의견 수렴 시간 부족', '완벽주의 성향'],
    meetingTips: '• 미팅 시작 전 명확한 아젠다 공유\n• 각 안건별 시간 할당과 엄격한 진행\n• 결론과 액션 아이템 즉시 정리\n• 팀원들의 역할과 책임 명확히 분담',
    collaborationGuide: '체계적인 계획과 빠른 실행을 중시하므로 구체적인 일정과 담당자를 명확히 하세요',
    optimalMeetingSize: '5-8명',
    preferredMeetingLength: '30-45분',
    communicationPreference: '직접적이고 목표지향적'
  },

  // E-S-T-P: 외향-신속-논리-유연
  'ESTP': {
    code: 'ESTP',
    name: '역동적 촉진자',
    nickname: '액션 히어로',
    description: '즉석에서 문제를 해결하고 팀을 활기차게 이끕니다',
    strengths: ['현장 대응력', '분위기 메이킹', '실용적 해결책', '유연한 진행'],
    challenges: ['장기 계획 부족', '세부사항 놓칠 가능성', '일관성 유지 어려움'],
    meetingTips: '• 실시간 브레인스토밍과 즉석 아이디어 교환\n• 화이트보드나 디지털 툴 적극 활용\n• 구체적 사례와 경험 중심 토론\n• 유연한 시간 운영으로 자연스러운 흐름 유지',
    collaborationGuide: '즉흥적이고 실용적인 접근을 선호하므로 융통성 있는 계획과 현실적 해결책에 집중하세요',
    optimalMeetingSize: '3-6명',
    preferredMeetingLength: '20-40분',
    communicationPreference: '활발하고 상호작용적'
  },

  // E-S-F-J: 외향-신속-감정-체계  
  'ESFJ': {
    code: 'ESFJ',
    name: '배려형 조율자',
    nickname: '팀 하모니',
    description: '팀원들의 의견을 조화롭게 조율하며 모두가 참여하는 미팅을 만듭니다',
    strengths: ['팀 화합 조성', '개별 의견 수렴', '갈등 중재', '배려깊은 진행'],
    challenges: ['결정 지연 가능성', '비판적 피드백 어려움', '개인적 감정 개입'],
    meetingTips: '• 미팅 시작 시 간단한 아이스브레이킹\n• 모든 참가자의 의견 균등하게 듣기\n• 갈등 상황 시 중립적 입장에서 중재\n• 긍정적 분위기 유지와 격려',
    collaborationGuide: '팀의 화합과 개인의 감정을 중시하므로 상호 존중하는 분위기에서 협업하세요',
    optimalMeetingSize: '4-7명',
    preferredMeetingLength: '30-50분',
    communicationPreference: '따뜻하고 포용적'
  },

  // E-S-F-P: 외향-신속-감정-유연
  'ESFP': {
    code: 'ESFP',
    name: '활력형 동기부여자',
    nickname: '미팅 에너지',
    description: '긍정적 에너지로 팀을 활기차게 하고 창의적 아이디어를 이끌어냅니다',
    strengths: ['분위기 활성화', '창의적 사고', '팀원 동기부여', '열정적 참여'],
    challenges: ['체계적 정리 부족', '세부 계획 약함', '일관성 유지 어려움'],
    meetingTips: '• 자유로운 아이디어 발산과 브레인스토밍\n• 시각적 도구와 게임 요소 활용\n• 개인의 창의성과 특별함 인정\n• 즐거운 분위기에서 자연스러운 진행',
    collaborationGuide: '창의적이고 자율적인 환경을 선호하므로 자유로운 발상과 유연한 실행에 집중하세요',
    optimalMeetingSize: '3-5명',
    preferredMeetingLength: '25-35분',
    communicationPreference: '열정적이고 창의적'
  },

  // E-N-T-J: 외향-신중-논리-체계
  'ENTJ': {
    code: 'ENTJ',
    name: '전략형 지휘관',
    nickname: '비전 리더',
    description: '큰 그림을 그리며 전략적 사고로 팀을 이끕니다',
    strengths: ['전략적 사고', '장기 비전 제시', '강력한 리더십', '효율적 조직'],
    challenges: ['세부사항 간과', '다른 의견 수용 어려움', '성급한 결정'],
    meetingTips: '• 전체적인 비전과 목표 먼저 제시\n• 데이터 기반의 논리적 분석\n• 중장기 계획과 로드맵 구체화\n• 각 팀원의 역할과 기여도 명확히 정의',
    collaborationGuide: '큰 그림과 전략적 목표를 중시하므로 비전 공유와 체계적 실행계획에 집중하세요',
    optimalMeetingSize: '6-10명',
    preferredMeetingLength: '45-60분',
    communicationPreference: '전략적이고 목표지향적'
  },

  // E-N-T-P: 외향-신중-논리-유연
  'ENTP': {
    code: 'ENTP',
    name: '혁신형 토론가',
    nickname: '아이디어 뱅크',
    description: '창의적 아이디어와 다양한 관점으로 혁신적 해결책을 제시합니다',
    strengths: ['창의적 사고', '다양한 관점 제시', '논리적 분석', '혁신적 접근'],
    challenges: ['실행력 부족', '결론 도출 지연', '세부사항 무시'],
    meetingTips: '• 열린 토론과 자유로운 아이디어 교환\n• 다양한 가능성과 대안 탐색\n• 창의적 문제해결 기법 활용\n• 브레인스토밍과 컨셉 발전에 집중',
    collaborationGuide: '새로운 아이디어와 혁신을 추구하므로 창의적 사고와 실험적 접근을 장려하세요',
    optimalMeetingSize: '4-8명',
    preferredMeetingLength: '40-60분',
    communicationPreference: '창의적이고 탐구적'
  },

  // E-N-F-J: 외향-신중-감정-체계
  'ENFJ': {
    code: 'ENFJ',
    name: '영감형 멘토',
    nickname: '팀 인스파이어러',
    description: '팀원들에게 영감을 주고 개인의 성장을 도우며 협력적 문화를 만듭니다',
    strengths: ['팀 동기부여', '개인 성장 지원', '협력적 분위기', '비전 공유'],
    challenges: ['객관적 판단 어려움', '개인적 감정 개입', '완벽주의 성향'],
    meetingTips: '• 각 팀원의 강점과 기여도 인정\n• 개인적 성장과 학습 기회 제공\n• 협력적이고 지지적인 분위기 조성\n• 장기적 비전과 개인 목표 연결',
    collaborationGuide: '사람 중심적 접근과 성장을 중시하므로 개인의 발전과 팀의 조화에 집중하세요',
    optimalMeetingSize: '5-8명',
    preferredMeetingLength: '40-55분',
    communicationPreference: '영감적이고 지지적'
  },

  // E-N-F-P: 외향-신중-감정-유연
  'ENFP': {
    code: 'ENFP',
    name: '열정형 영감가',
    nickname: '가능성 탐험가',
    description: '무한한 가능성을 탐색하고 팀에 새로운 에너지를 불어넣습니다',
    strengths: ['열정적 참여', '창의적 영감', '팀 활성화', '유연한 사고'],
    challenges: ['집중력 분산', '실행력 부족', '체계성 부족'],
    meetingTips: '• 자유로운 분위기에서 창의적 발상\n• 개인의 열정과 관심사 연결\n• 다양한 가능성 탐색과 실험\n• 유연한 시간 운영과 자율적 참여',
    collaborationGuide: '열정과 가능성을 추구하므로 자유로운 환경에서 창의적 실험을 장려하세요',
    optimalMeetingSize: '3-6명',
    preferredMeetingLength: '30-45분',
    communicationPreference: '열정적이고 영감적'
  },

  // I-S-T-J: 내향-신속-논리-체계
  'ISTJ': {
    code: 'ISTJ',
    name: '신뢰형 관리자',
    nickname: '안정적 플래너',
    description: '체계적이고 신뢰할 수 있는 계획으로 안정적인 미팅을 이끕니다',
    strengths: ['체계적 준비', '신뢰할 수 있는 진행', '세부사항 관리', '일관성 유지'],
    challenges: ['변화 적응 어려움', '창의적 사고 부족', '융통성 부족'],
    meetingTips: '• 미팅 전 충분한 준비 시간 확보\n• 상세한 아젠다와 자료 사전 배포\n• 체계적이고 순서대로 진행\n• 명확한 결론과 후속조치 정리',
    collaborationGuide: '안정성과 체계성을 중시하므로 명확한 계획과 단계별 진행에 집중하세요',
    optimalMeetingSize: '4-6명',
    preferredMeetingLength: '45-60분',
    communicationPreference: '체계적이고 신중한'
  },

  // I-S-T-P: 내향-신속-논리-유연
  'ISTP': {
    code: 'ISTP',
    name: '실용형 해결사',
    nickname: '문제 해결 마스터',
    description: '실용적이고 효율적인 방법으로 문제를 해결합니다',
    strengths: ['실용적 해결책', '효율적 접근', '객관적 분석', '유연한 대응'],
    challenges: ['장기 계획 부족', '팀 소통 약함', '감정적 배려 부족'],
    meetingTips: '• 구체적 문제와 실용적 해결책에 집중\n• 불필요한 이론보다 실행 가능한 방안\n• 개별 작업 시간과 집중할 수 있는 환경\n• 간결하고 효율적인 진행',
    collaborationGuide: '실용성과 효율성을 추구하므로 구체적 문제 해결과 실행에 집중하세요',
    optimalMeetingSize: '3-5명',
    preferredMeetingLength: '20-35분',
    communicationPreference: '간결하고 실용적'
  },

  // I-S-F-J: 내향-신속-감정-체계
  'ISFJ': {
    code: 'ISFJ',
    name: '헌신형 지원자',
    nickname: '따뜻한 조력자',
    description: '팀원들을 세심하게 배려하며 안정적인 지원을 제공합니다',
    strengths: ['세심한 배려', '안정적 지원', '갈등 완화', '신뢰감 조성'],
    challenges: ['자기 의견 표현 어려움', '갈등 회피 성향', '변화 저항'],
    meetingTips: '• 편안하고 안전한 분위기 조성\n• 모든 의견을 경청하고 존중\n• 갈등 상황 시 조화로운 해결책 모색\n• 개인적 관심과 배려 표현',
    collaborationGuide: '조화와 안정을 중시하므로 상호 배려하는 환경에서 점진적 변화를 추진하세요',
    optimalMeetingSize: '3-6명',
    preferredMeetingLength: '35-50분',
    communicationPreference: '배려깊고 조화로운'
  },

  // I-S-F-P: 내향-신속-감정-유연
  'ISFP': {
    code: 'ISFP',
    name: '온화형 협력자',
    nickname: '조용한 기여자',
    description: '조용하지만 중요한 기여를 하며 팀의 가치를 지킵니다',
    strengths: ['조용한 기여', '가치 중심 사고', '유연한 협력', '개인 존중'],
    challenges: ['의견 표현 어려움', '주도적 참여 부족', '갈등 회피'],
    meetingTips: '• 개별 의견 표현 기회 적극 제공\n• 압박 없는 자연스러운 분위기\n• 가치와 의미 중심의 토론\n• 충분한 생각할 시간 허용',
    collaborationGuide: '개인의 가치와 자율성을 중시하므로 자유로운 환경에서 개별적 기여를 인정하세요',
    optimalMeetingSize: '2-4명',
    preferredMeetingLength: '25-40분',
    communicationPreference: '온화하고 개별적'
  },

  // I-N-T-J: 내향-직관-사고-판단
  'INTJ': {
    code: 'INTJ',
    name: '전략형 설계자',
    nickname: '시스템 아키텍트',
    description: '체계적이고 전략적인 접근으로 장기적 비전을 구현합니다',
    strengths: ['전략적 사고', '독립적 분석', '시스템적 접근', '장기 계획'],
    challenges: ['세부 소통 부족', '융통성 부족', '감정적 배려 부족'],
    meetingTips: '• 미팅 전 충분한 사전 자료와 분석 시간\n• 전략적 목표와 전체 구조 먼저 설명\n• 논리적 근거와 데이터 기반 토론\n• 명확한 결론과 체계적인 실행 계획',
    collaborationGuide: '전략적 사고와 독립성을 중시하므로 체계적 계획과 자율적 실행을 보장하세요',
    optimalMeetingSize: '3-5명',
    preferredMeetingLength: '45-75분',
    communicationPreference: '전략적이고 체계적'
  },

  // I-N-T-P: 내향-직관-사고-인식
  'INTP': {
    code: 'INTP',
    name: '논리형 사색가',
    nickname: '아이디어 분석가',
    description: '깊이 있는 분석과 창의적 사고로 혁신적 해결책을 모색합니다',
    strengths: ['논리적 분석', '창의적 사고', '독창적 아이디어', '객관적 접근'],
    challenges: ['실행력 부족', '결정 지연', '소통 어려움'],
    meetingTips: '• 충분한 탐구와 분석 시간 제공\n• 개념적 토론과 이론적 접근 허용\n• 창의적 아이디어 발상에 집중\n• 압박 없는 자유로운 사고 환경',
    collaborationGuide: '논리적 분석과 창의성을 중시하므로 깊이 있는 탐구와 자유로운 발상을 지원하세요',
    optimalMeetingSize: '2-4명',
    preferredMeetingLength: '40-60분',
    communicationPreference: '논리적이고 탐구적'
  },

  // I-N-F-J: 내향-직관-감정-판단
  'INFJ': {
    code: 'INFJ',
    name: '통찰형 조언자',
    nickname: '비전 가이드',
    description: '깊은 통찰력으로 팀의 방향성을 제시하고 개인을 이해합니다',
    strengths: ['깊은 통찰력', '장기 비전', '개인 이해', '조화로운 리더십'],
    challenges: ['완벽주의 성향', '과도한 이상주의', '갈등 회피'],
    meetingTips: '• 의미 있는 목표와 가치 중심 토론\n• 개인의 성장과 팀의 비전 연결\n• 조용하고 집중할 수 있는 환경\n• 깊이 있는 대화와 충분한 성찰 시간',
    collaborationGuide: '가치와 의미를 중시하므로 개인적 성장과 팀의 목적의식을 강화하세요',
    optimalMeetingSize: '3-6명',
    preferredMeetingLength: '35-55분',
    communicationPreference: '통찰적이고 의미중심적'
  },

  // I-N-F-P: 내향-직관-감정-인식
  'INFP': {
    code: 'INFP',
    name: '이상형 중재자',
    nickname: '가치 수호자',
    description: '개인의 가치와 이상을 바탕으로 조화로운 협력을 추구합니다',
    strengths: ['가치 중심 사고', '창의적 접근', '개인 존중', '유연한 협력'],
    challenges: ['의견 표현 어려움', '갈등 회피', '실행력 부족'],
    meetingTips: '• 개인의 가치와 관심사 인정\n• 자유롭고 압박 없는 분위기\n• 창의적 아이디어와 가능성 탐색\n• 개별적 기여와 고유성 존중',
    collaborationGuide: '개인의 가치와 창의성을 중시하므로 자율적 환경에서 의미 있는 기여를 격려하세요',
    optimalMeetingSize: '2-5명',
    preferredMeetingLength: '30-45분',
    communicationPreference: '가치중심적이고 창의적'
  }
};