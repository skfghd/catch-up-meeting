import { SurveyAnswers } from './storage';

// 회의 DNA 3가지 핵심 축 정의 (완전히 새로운 분류 체계)
export interface MeetingDNAProfile {
  // 축 1: 정보 흡수 스타일 (Information Absorption)
  absorptionStyle: 'VISUAL' | 'VERBAL' | 'KINESTHETIC'; // 시각형, 청각형, 체험형
  
  // 축 2: 의사결정 리듬 (Decision Rhythm) 
  decisionRhythm: 'FLASH' | 'FLOW' | 'DEEP'; // 번개형, 흐름형, 심층형
  
  // 축 3: 에너지 패턴 (Energy Pattern)
  energyPattern: 'SPARK' | 'STEADY' | 'WAVE'; // 폭발형, 지속형, 파도형
}

// 12가지 회의 DNA 유형 (3x2x2 조합)
export interface MeetingDNAType {
  code: string; // 3글자 축약형 (예: VFS = Visual-Flash-Spark)
  name: string; // 유형 이름
  emoji: string; // 대표 이모지
  description: string; // 한줄 설명
  
  // 회의 특성
  meetingStrength: string[]; // 회의에서의 강점
  meetingChallenge: string[]; // 회의에서의 약점
  optimalRole: string; // 최적 역할
  
  // 실용적 가이드
  preparation: string; // 회의 준비법
  participation: string; // 참여 방식
  followUp: string; // 후속 조치
  
  // 환경 설정
  idealEnvironment: string; // 이상적 회의 환경
  preferredSize: string; // 선호 인원
  bestDuration: string; // 최적 시간
  
  // 협업 가이드
  workingWithTips: string; // 이 유형과 함께 일하는 법
  communicationStyle: string; // 소통 방식
}

// 12가지 회의 DNA 유형 정의
export const MEETING_DNA_TYPES: Record<string, MeetingDNAType> = {
  // VISUAL 기반 유형들 (시각형)
  'VFS': { // Visual-Flash-Spark (시각-번개-폭발)
    code: 'VFS',
    name: '차트 마스터',
    emoji: '📊',
    description: '시각 자료로 빠르게 핵심을 파악하고 즉석에서 에너지를 폭발시키는 유형',
    meetingStrength: ['즉석 차트 해석', '빠른 시각적 통찰', '순간 집중력', '핵심 파악'],
    meetingChallenge: ['긴 설명 지루함', '에너지 급감', '세부사항 놓침'],
    optimalRole: '비주얼 프레젠터, 데이터 분석가',
    preparation: '핵심 차트 3개만 준비, 복잡한 자료는 피하기',
    participation: '시각 자료 중심으로 발표, 15분 단위로 집중',
    followUp: '핵심 인사이트를 한 장 요약으로 정리',
    idealEnvironment: '대형 스크린, 화이트보드, 밝은 조명',
    preferredSize: '5-7명',
    bestDuration: '30분 이내',
    workingWithTips: '복잡한 텍스트보다 다이어그램으로 소통하고, 에너지 있을 때 핵심 결정',
    communicationStyle: '시각적이고 직관적'
  },

  'VFT': { // Visual-Flash-Steady (시각-번개-지속)
    code: 'VFT',
    name: '스피드 플래너',
    emoji: '🚀',
    description: '시각 자료로 빠르게 계획을 세우고 꾸준히 실행하는 유형',
    meetingStrength: ['빠른 계획 수립', '로드맵 작성', '일정 관리', '목표 시각화'],
    meetingChallenge: ['즉흥 변경 부담', '완벽주의 성향'],
    optimalRole: '프로젝트 매니저, 일정 관리자',
    preparation: '타임라인과 체크리스트 준비',
    participation: '구체적 일정과 담당자 명시',
    followUp: '진행 상황 추적 대시보드 작성',
    idealEnvironment: '프로젝터, 캘린더 공유 화면',
    preferredSize: '4-6명',
    bestDuration: '45분',
    workingWithTips: '명확한 마일스톤을 설정하고 정기적 체크인',
    communicationStyle: '체계적이고 계획적'
  },

  'VFW': { // Visual-Flash-Wave (시각-번개-파도)
    code: 'VFW',
    name: '트렌드 스카우터',
    emoji: '🌊',
    description: '시각적 트렌드를 빠르게 포착하고 상황에 따라 에너지가 변하는 유형',
    meetingStrength: ['트렌드 분석', '기회 포착', '유연한 사고', '직관적 판단'],
    meetingChallenge: ['일관성 부족', '기분 변화'],
    optimalRole: '마케터, 전략 기획자',
    preparation: '최신 트렌드 자료 수집',
    participation: '상황에 맞춰 아이디어 제시',
    followUp: '트렌드 변화 모니터링',
    idealEnvironment: '자유로운 분위기, 편안한 좌석',
    preferredSize: '3-5명',
    bestDuration: '30-60분 (유동적)',
    workingWithTips: '분위기를 읽고 적절한 타이밍에 의견 요청',
    communicationStyle: '유연하고 상황적응적'
  },

  'VLS': { // Visual-Flow-Spark (시각-흐름-폭발)
    code: 'VLS',
    name: '크리에이티브 버스터',
    emoji: '🎨',
    description: '시각적 흐름을 따라가다가 갑자기 창의적 아이디어를 폭발시키는 유형',
    meetingStrength: ['창의적 아이디어', '브레인스토밍', '혁신적 사고'],
    meetingChallenge: ['예측 불가능', '실행력 부족'],
    optimalRole: '크리에이티브 디렉터, 아이디어 기획자',
    preparation: '영감을 위한 레퍼런스 수집',
    participation: '자유로운 발상, 시각적 스케치',
    followUp: '아이디어 구체화 작업',
    idealEnvironment: '창의적 공간, 그림 도구 구비',
    preferredSize: '4-8명',
    bestDuration: '60-90분',
    workingWithTips: '창의적 분위기 조성하고 아이디어 실현 가능성 함께 검토',
    communicationStyle: '창의적이고 자유로운'
  },

  // VERBAL 기반 유형들 (청각형)
  'BFS': { // Verbal-Flash-Spark (청각-번개-폭발)
    code: 'BFS',
    name: '토론 파이터',
    emoji: '💬',
    description: '말로 빠르게 소통하며 순간적으로 강한 에너지를 발산하는 유형',
    meetingStrength: ['즉석 토론', '빠른 반응', '열정적 발표', '설득력'],
    meetingChallenge: ['감정 조절', '독점 발언', '성급한 결론'],
    optimalRole: '토론 리더, 세일즈 담당',
    preparation: '핵심 논점 3개 정리',
    participation: '적극적 발언, 반대 의견 교환',
    followUp: '합의 사항 음성 메모',
    idealEnvironment: '원형 테이블, 좋은 음향',
    preferredSize: '6-10명',
    bestDuration: '45분',
    workingWithTips: '열정을 인정하되 발언 시간 조절 필요',
    communicationStyle: '열정적이고 직접적'
  },

  'BFT': { // Verbal-Flash-Steady (청각-번개-지속)
    code: 'BFT',
    name: '커뮤니케이션 엔진',
    emoji: '📞',
    description: '명확한 커뮤니케이션으로 빠르게 결론을 내고 꾸준히 실행하는 유형',
    meetingStrength: ['명확한 소통', '빠른 결론', '실행 중심', '책임감'],
    meetingChallenge: ['융통성 부족', '일방적 진행'],
    optimalRole: '팀 리더, 진행자',
    preparation: '명확한 아젠다와 목표 설정',
    participation: '체계적 진행, 결론 도출',
    followUp: '액션 아이템 전화 확인',
    idealEnvironment: '회의실, 명확한 좌석 배치',
    preferredSize: '5-8명',
    bestDuration: '30-45분',
    workingWithTips: '명확한 역할과 기대치를 소통하고 정해진 시간 엄수',
    communicationStyle: '명확하고 목표지향적'
  },

  'BFW': { // Verbal-Flash-Wave (청각-번개-파도)
    code: 'BFW',
    name: '소셜 네트워커',
    emoji: '🤝',
    description: '사람들과 빠르게 소통하며 상황에 따라 에너지가 변하는 유형',
    meetingStrength: ['네트워킹', '분위기 조성', '갈등 중재', '유연한 소통'],
    meetingChallenge: ['일관성 부족', '우선순위 혼란'],
    optimalRole: '관계 관리자, 중재자',
    preparation: '참석자 관계 파악',
    participation: '분위기 리딩, 의견 조율',
    followUp: '개별 팔로업 전화',
    idealEnvironment: '편안한 분위기, 자연스러운 배치',
    preferredSize: '4-12명',
    bestDuration: '60분',
    workingWithTips: '관계 중심적 접근하고 개인적 연결점 찾기',
    communicationStyle: '친근하고 포용적'
  },

  'BLS': { // Verbal-Flow-Spark (청각-흐름-폭발)  
    code: 'BLS',
    name: '스토리 위버',
    emoji: '📚',
    description: '이야기의 흐름을 따라가다가 갑자기 핵심 통찰을 제시하는 유형',
    meetingStrength: ['스토리텔링', '맥락 이해', '통찰력', '설득력'],
    meetingChallenge: ['시간 관리', '요점 정리'],
    optimalRole: '컨설턴트, 코치',
    preparation: '관련 사례와 스토리 준비',
    participation: '경험 공유, 맥락 설명',
    followUp: '이야기로 요약 정리',
    idealEnvironment: '편안한 대화 공간',
    preferredSize: '3-6명',
    bestDuration: '90분',
    workingWithTips: '충분한 시간을 주고 핵심을 간추려 달라고 요청',
    communicationStyle: '서사적이고 통찰적'
  },

  // KINESTHETIC 기반 유형들 (체험형)
  'KFS': { // Kinesthetic-Flash-Spark (체험-번개-폭발)
    code: 'KFS',
    name: '액션 히어로',
    emoji: '⚡',
    description: '직접 해보면서 빠르게 판단하고 순간적으로 강한 추진력을 보이는 유형',
    meetingStrength: ['즉시 실행', '문제 해결', '현실적 판단', '추진력'],
    meetingChallenge: ['계획 부족', '성급함', '지속성 부족'],
    optimalRole: '실행 담당자, 문제 해결사',
    preparation: '실제 사례와 경험 중심',
    participation: '프로토타입, 실습 중심',
    followUp: '즉시 테스트 실행',
    idealEnvironment: '활동 공간, 화이트보드',
    preferredSize: '3-5명',
    bestDuration: '30분',
    workingWithTips: '구체적 행동과 실험을 통해 소통',
    communicationStyle: '실용적이고 행동중심적'
  },

  'KFT': { // Kinesthetic-Flash-Steady (체험-번개-지속)
    code: 'KFT',
    name: '빌드 마스터',
    emoji: '🔧',
    description: '손으로 만들고 테스트하며 꾸준히 개선해나가는 유형',
    meetingStrength: ['실행 가능성', '구체적 계획', '품질 관리', '지속성'],
    meetingChallenge: ['추상적 토론 어려움', '변화 저항'],
    optimalRole: '개발자, 운영 매니저',
    preparation: '구체적 실행 방안 준비',
    participation: '실현 가능성 검토',
    followUp: '단계별 실행 계획',
    idealEnvironment: '작업 도구 구비된 공간',
    preferredSize: '4-6명',
    bestDuration: '60분',
    workingWithTips: '구체적이고 실행 가능한 계획으로 접근',
    communicationStyle: '실용적이고 체계적'
  },

  'KFW': { // Kinesthetic-Flash-Wave (체험-번개-파도)
    code: 'KFW',
    name: '어댑터',
    emoji: '🌀',
    description: '상황에 맞춰 빠르게 적응하며 유연하게 대응하는 유형',
    meetingStrength: ['유연한 대응', '상황 적응', '실용적 해결', '변화 수용'],
    meetingChallenge: ['일관성 부족', '우선순위 변동'],
    optimalRole: '프로젝트 어댑터, 변화 관리자',
    preparation: '여러 시나리오 준비',
    participation: '상황별 대안 제시',
    followUp: '변화에 따른 조정',
    idealEnvironment: '유연한 공간 구성',
    preferredSize: '4-8명',
    bestDuration: '45-90분',
    workingWithTips: '변화를 긍정적으로 받아들이고 함께 적응',
    communicationStyle: '적응적이고 유연한'
  },

  'KLS': { // Kinesthetic-Flow-Spark (체험-흐름-폭발)
    code: 'KLS',
    name: '이노베이터',
    emoji: '🚁',
    description: '체험과 실험을 통해 흐름을 만들어가다가 혁신적 돌파구를 찾는 유형',
    meetingStrength: ['혁신적 실험', '창의적 해결', '돌파구 발견'],
    meetingChallenge: ['예측 불가능', '위험성'],
    optimalRole: '혁신 담당자, R&D 리더',
    preparation: '실험적 아이디어 준비',
    participation: '프로토타이핑, 테스트',
    followUp: '혁신 실험 계획',
    idealEnvironment: '실험 공간, 다양한 도구',
    preferredSize: '3-7명',
    bestDuration: '2시간',
    workingWithTips: '실험 정신을 지지하되 리스크 관리 필요',
    communicationStyle: '실험적이고 혁신적'
  }
};

// 설문 답변을 기반으로 회의 DNA 유형 결정
export const determineMeetingDNAType = (answers: SurveyAnswers): MeetingDNAType => {
  // 축 1: 정보 흡수 스타일 분석
  let absorptionStyle: 'VISUAL' | 'VERBAL' | 'KINESTHETIC' = 'VISUAL';
  
  const visualScore = [
    answers.q1 === 'visual' ? 2 : 0,
    answers.q13 === 'written' ? 1 : 0,
  ].reduce((a, b) => a + b);
  
  const verbalScore = [
    answers.q13 === 'verbal' ? 2 : 0,
    answers.q4 === 'group' ? 1 : 0,
    answers.q9 === 'diplomatic' ? 1 : 0,
  ].reduce((a, b) => a + b);
  
  const kinestheticScore = [
    answers.q11 === 'practical' ? 2 : 0,
    answers.q14 === 'risk_taking' ? 1 : 0,
    answers.q12 === 'multitask' ? 1 : 0,
  ].reduce((a, b) => a + b);

  if (kinestheticScore >= Math.max(visualScore, verbalScore)) {
    absorptionStyle = 'KINESTHETIC';
  } else if (verbalScore >= visualScore) {
    absorptionStyle = 'VERBAL';
  }

  // 축 2: 의사결정 리듬 분석
  let decisionRhythm: 'FLASH' | 'FLOW' | 'DEEP' = 'FLOW';
  
  const flashScore = [
    answers.q2 === 'quick' ? 2 : 0,
    answers.q3 === 'short' ? 1 : 0,
    answers.q8 === 'proactive' ? 1 : 0,
  ].reduce((a, b) => a + b);
  
  const flowScore = [
    answers.q5 === 'flexible' ? 1 : 0,
    answers.q10 === 'compromise' ? 1 : 0,
    answers.q11 === 'creative' ? 1 : 0,
  ].reduce((a, b) => a + b);
  
  const deepScore = [
    answers.q2 === 'detailed' ? 2 : 0,
    answers.q3 === 'full' ? 1 : 0,
    answers.q4 === 'individual' ? 1 : 0,
  ].reduce((a, b) => a + b);

  if (flashScore >= Math.max(flowScore, deepScore)) {
    decisionRhythm = 'FLASH';
  } else if (deepScore >= flowScore) {
    decisionRhythm = 'DEEP';
  }

  // 축 3: 에너지 패턴 분석
  let energyPattern: 'SPARK' | 'STEADY' | 'WAVE' = 'STEADY';
  
  const sparkScore = [
    answers.q7 === 'energetic' ? 2 : 0,
    answers.q9 === 'direct' ? 1 : 0,
    answers.q14 === 'risk_taking' ? 1 : 0,
  ].reduce((a, b) => a + b);
  
  const steadyScore = [
    answers.q5 === 'structured' ? 1 : 0,
    answers.q8 === 'proactive' ? 1 : 0,
    answers.q12 === 'focus' ? 1 : 0,
    answers.q15 === 'executing' ? 1 : 0,
  ].reduce((a, b) => a + b);
  
  const waveScore = [
    answers.q6 === 'emotional' ? 1 : 0,
    answers.q10 === 'compromise' ? 1 : 0,
    answers.q11 === 'creative' ? 1 : 0,
  ].reduce((a, b) => a + b);

  if (sparkScore >= Math.max(steadyScore, waveScore)) {
    energyPattern = 'SPARK';
  } else if (waveScore >= steadyScore) {
    energyPattern = 'WAVE';
  }

  // 3축 조합으로 코드 생성
  const absorptionCode = absorptionStyle === 'VISUAL' ? 'V' : absorptionStyle === 'VERBAL' ? 'B' : 'K';
  const rhythmCode = decisionRhythm === 'FLASH' ? 'F' : decisionRhythm === 'FLOW' ? 'L' : 'D';  
  const energyCode = energyPattern === 'SPARK' ? 'S' : energyPattern === 'STEADY' ? 'T' : 'W';
  
  const dnaCode = `${absorptionCode}${rhythmCode}${energyCode}`;
  
  // 해당 유형 반환, 없으면 기본 유형
  return MEETING_DNA_TYPES[dnaCode] || MEETING_DNA_TYPES['VLS'];
};

// 유형별 색상 테마
export const DNA_COLORS: Record<string, string> = {
  // Visual 계열 (파랑 톤)
  'VFS': 'bg-blue-100 text-blue-800 border-blue-200',
  'VFT': 'bg-blue-200 text-blue-900 border-blue-300',
  'VFW': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'VLS': 'bg-sky-100 text-sky-800 border-sky-200',
  
  // Verbal 계열 (초록 톤)
  'BFS': 'bg-green-100 text-green-800 border-green-200',
  'BFT': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'BFW': 'bg-teal-100 text-teal-800 border-teal-200',
  'BLS': 'bg-lime-100 text-lime-800 border-lime-200',
  
  // Kinesthetic 계열 (오렌지 톤)
  'KFS': 'bg-orange-100 text-orange-800 border-orange-200',
  'KFT': 'bg-amber-100 text-amber-800 border-amber-200',
  'KFW': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'KLS': 'bg-red-100 text-red-800 border-red-200',
};

// 3축 설명
export const DNA_AXES_EXPLANATION = {
  absorption: {
    title: '정보 흡수 스타일',
    description: '회의에서 정보를 어떻게 받아들이고 처리하는지',
    types: {
      VISUAL: '시각형 📊 - 차트, 그래프, 다이어그램을 통해 정보를 빠르게 이해',
      VERBAL: '청각형 💬 - 말과 토론을 통해 정보를 효과적으로 흡수',
      KINESTHETIC: '체험형 ⚡ - 직접 해보고 만져보면서 정보를 체득'
    }
  },
  rhythm: {
    title: '의사결정 리듬',
    description: '회의에서 결정을 내리는 속도와 방식',
    types: {
      FLASH: '번개형 ⚡ - 빠르고 즉석에서 결정을 내림',
      FLOW: '흐름형 🌊 - 상황에 따라 유연하게 결정',
      DEEP: '심층형 🔍 - 깊이 있게 분석한 후 신중히 결정'
    }
  },
  energy: {
    title: '에너지 패턴',
    description: '회의 중 에너지가 어떻게 변화하는지',
    types: {
      SPARK: '폭발형 💥 - 순간적으로 강한 에너지 발산',
      STEADY: '지속형 🔥 - 일정한 에너지를 꾸준히 유지',
      WAVE: '파도형 🌊 - 상황에 따라 에너지가 변동'
    }
  }
};