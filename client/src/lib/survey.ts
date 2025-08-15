import { SurveyAnswers, UserProfile } from './storage';
import { determineMBTIType, MEETING_MBTI_TYPES } from './meeting-mbti-types';

export const generateStyleSummary = (answers: SurveyAnswers): UserProfile => {
  // MBTI 4차원 분석을 통한 유형 결정
  const mbtiCode = determineMBTIType(answers);
  const mbtiType = MEETING_MBTI_TYPES[mbtiCode];
  
  // MBTI 결과를 기반으로 프로필 생성
  const style = `${mbtiType.name} (${mbtiType.code})`;
  const tips = mbtiType.meetingTips;
  const collaborationTips = mbtiType.collaborationGuide;

  // 15가지 질문을 종합하여 추가 성향 분석
  const isVisual = answers.q1 === 'visual';
  const isQuick = answers.q2 === 'quick';
  const isShort = answers.q3 === 'short';
  const isIndividual = answers.q4 === 'individual';
  const isStructured = answers.q5 === 'structured';
  const isLogical = answers.q6 === 'logical';
  const isCalm = answers.q7 === 'calm';
  
  // 확장된 8개 질문 분석
  const isProactive = answers.q8 === 'proactive';
  const isDirect = answers.q9 === 'direct';
  const isCompromise = answers.q10 === 'compromise';
  const isCreative = answers.q11 === 'creative';
  const isMultitask = answers.q12 === 'multitask';
  const isVerbal = answers.q13 === 'verbal';
  const isRiskTaking = answers.q14 === 'risk_taking';
  const isLearning = answers.q15 === 'learning';

  // 세부 성향들 분석
  let emotionalStyle = '';
  let stressManagement = '';
  let feedbackStyle = '';
  let conflictResolution = '';
  let problemSolving = '';
  let workStyle = '';
  let communicationChannel = '';
  let riskProfile = '';
  let learningPreference = '';

  // 감정적 스타일 분석
  if (isLogical && isCalm) {
    emotionalStyle = '이성적 안정형';
  } else if (isLogical && !isCalm) {
    emotionalStyle = '이성적 역동형';
  } else if (!isLogical && isCalm) {
    emotionalStyle = '감성적 안정형';
  } else {
    emotionalStyle = '감성적 역동형';
  }

  // 확장된 성향 분석
  // 스트레스 관리 방식
  if (isProactive) {
    stressManagement = '예방적 대응형 - 미리 계획하고 대비하여 스트레스를 최소화하는 스타일';
  } else {
    stressManagement = '적응적 대응형 - 상황에 맞게 유연하게 대응하며 임기응변에 뛰어난 스타일';
  }

  // 피드백 스타일
  if (isDirect) {
    feedbackStyle = '직접적 소통형 - 명확하고 솔직한 피드백을 선호하며 효율적인 소통을 중시';
  } else {
    feedbackStyle = '배려적 소통형 - 상대방의 감정을 배려하며 간접적이고 세심한 표현을 선호';
  }

  // 갈등 해결 방식
  if (isCompromise) {
    conflictResolution = '조화 추구형 - 모든 당사자의 의견을 수용하여 win-win 해결책을 모색';
  } else {
    conflictResolution = '주장 관철형 - 자신의 신념을 명확히 표현하며 논리적 설득을 통한 해결 선호';
  }

  // 문제 해결 접근법
  if (isCreative) {
    problemSolving = '혁신적 사고형 - 창의적이고 독창적인 해결책을 통해 새로운 관점 제시';
  } else {
    problemSolving = '실용적 접근형 - 검증된 방법과 현실적 해결책을 통한 안정적 문제 해결';
  }

  // 업무 처리 스타일
  if (isMultitask) {
    workStyle = '다중 업무형 - 여러 작업을 동시에 처리하며 역동적인 업무 환경을 선호';
  } else {
    workStyle = '집중 완료형 - 한 번에 하나씩 깊이 있게 집중하여 완벽한 결과물 추구';
  }

  // 선호 소통 채널
  if (isVerbal) {
    communicationChannel = '대면 소통형 - 직접 대화를 통한 즉석 소통과 실시간 피드백 선호';
  } else {
    communicationChannel = '문서 소통형 - 기록을 통한 체계적 소통과 명확한 문서화 선호';
  }

  // 위험 감수 성향
  if (isRiskTaking) {
    riskProfile = '도전 지향형 - 새로운 시도와 혁신을 추구하며 변화를 기회로 인식';
  } else {
    riskProfile = '안정 추구형 - 신중한 검토와 단계적 접근을 통한 안전한 의사결정 선호';
  }

  // 학습/실행 균형
  if (isLearning) {
    learningPreference = '지속 학습형 - 새로운 지식 습득과 역량 개발에 높은 동기와 만족감';
  } else {
    learningPreference = '실행 완성형 - 계획된 업무의 실행과 완료를 통한 성취감과 만족감';
  }

  return { 
    style, 
    tips, 
    emotionalStyle, 
    collaborationTips,
    stressManagement,
    feedbackStyle,
    conflictResolution,
    problemSolving,
    workStyle,
    communicationChannel,
    riskProfile,
    learningPreference
  };
};

// 상황별 적응형 질문 로직
export const getAdaptiveQuestion = (questionId: string, answers: Partial<SurveyAnswers>) => {
  const question = surveyQuestions.find(q => q.id === questionId);
  if (!question) return null;
  
  // 기본 질문 유지하되, 특정 상황에서 설명 추가
  let adaptedQuestion = { ...question };
  
  // 예시: 이전 답변에 따른 질문 맥락 조정
  if (questionId === 'q8' && answers.q2 === 'quick') {
    adaptedQuestion.question = '빠른 결정을 선호하시는 분이시군요! 그렇다면 스트레스나 압박 상황에서는 어떻게 대응하시나요?';
  } else if (questionId === 'q8' && answers.q2 === 'detailed') {
    adaptedQuestion.question = '신중한 결정을 선호하시는 분이시군요! 그렇다면 스트레스나 압박 상황에서는 어떻게 대응하시나요?';
  }
  
  if (questionId === 'q9' && answers.q6 === 'logical') {
    adaptedQuestion.question = '논리적 사고를 중시하시는군요! 피드백을 주고받을 때는 어떤 방식을 선호하시나요?';
  } else if (questionId === 'q9' && answers.q6 === 'emotional') {
    adaptedQuestion.question = '감정과 분위기를 중시하시는군요! 피드백을 주고받을 때는 어떤 방식을 선호하시나요?';
  }
  
  if (questionId === 'q12' && answers.q4 === 'individual') {
    adaptedQuestion.question = '개별 작업을 선호하시는군요! 그런 환경에서 업무를 처리할 때 어떤 방식이 더 편하신가요?';
  } else if (questionId === 'q12' && answers.q4 === 'group') {
    adaptedQuestion.question = '그룹 협업을 선호하시는군요! 팀과 함께 업무를 처리할 때 어떤 방식이 더 편하신가요?';
  }
  
  return adaptedQuestion;
};

export const surveyQuestions = [
  {
    id: 'q1',
    question: '정보를 어떻게 받는 것을 선호하시나요?',
    options: [
      { value: 'visual', label: '시각적 데이터 (차트, 그래프, 다이어그램)' },
      { value: 'text', label: '텍스트 기반 데이터 (문서, 목록, 서면 보고서)' }
    ]
  },
  {
    id: 'q2',
    question: '선호하는 의사결정 스타일은 무엇인가요?',
    options: [
      { value: 'quick', label: '핵심 포인트로 빠른 결정' },
      { value: 'detailed', label: '상세한 토론과 철저한 분석' }
    ]
  },
  {
    id: 'q3',
    question: '미팅에서 어떻게 소통하는 것을 좋아하시나요?',
    options: [
      { value: 'short', label: '짧고 간결한 요점' },
      { value: 'full', label: '맥락이 포함된 완전한 설명' }
    ]
  },
  {
    id: 'q4',
    question: '업무 진행 방식은 어떤 것을 선호하시나요?',
    options: [
      { value: 'individual', label: '개별적으로 집중해서 작업' },
      { value: 'group', label: '그룹 협업과 실시간 소통' }
    ]
  },
  {
    id: 'q5',
    question: '미팅 구조에 대한 선호도는 무엇인가요?',
    options: [
      { value: 'structured', label: '명확한 아젠다와 체계적인 진행' },
      { value: 'flexible', label: '유연하고 자유로운 토론 방식' }
    ]
  },
  {
    id: 'q6',
    question: '의사결정 시 어떤 요소를 더 중시하나요?',
    options: [
      { value: 'logical', label: '논리적 분석과 객관적 데이터' },
      { value: 'emotional', label: '팀의 감정과 분위기, 직관적 판단' }
    ]
  },
  {
    id: 'q7',
    question: '미팅에서 선호하는 에너지 수준은?',
    options: [
      { value: 'calm', label: '차분하고 안정적인 분위기' },
      { value: 'energetic', label: '활발하고 역동적인 분위기' }
    ]
  },
  
  // 확장된 질문들 - 스트레스 및 갈등 관리
  {
    id: 'q8',
    question: '업무 스트레스나 압박 상황에서 어떻게 대응하시나요?',
    options: [
      { value: 'proactive', label: '미리 예측하고 사전에 대비책을 마련' },
      { value: 'reactive', label: '상황이 발생하면 그때그때 유연하게 대응' }
    ]
  },
  {
    id: 'q9',
    question: '피드백을 주고받을 때 선호하는 방식은?',
    options: [
      { value: 'direct', label: '직접적이고 명확한 피드백' },
      { value: 'diplomatic', label: '배려 있고 간접적인 표현' }
    ]
  },
  {
    id: 'q10',
    question: '팀 내 의견 충돌이나 갈등 상황에서 어떻게 행동하시나요?',
    options: [
      { value: 'compromise', label: '상호 양보를 통한 합의점 찾기' },
      { value: 'assertive', label: '자신의 의견을 명확히 주장하며 설득' }
    ]
  },
  
  // 업무 스타일 및 소통 방식
  {
    id: 'q11',
    question: '문제 해결 시 어떤 접근 방식을 선호하시나요?',
    options: [
      { value: 'creative', label: '창의적이고 혁신적인 해결책 모색' },
      { value: 'practical', label: '검증된 방법과 실용적 접근' }
    ]
  },
  {
    id: 'q12',
    question: '업무를 처리할 때 어떤 방식이 더 편하신가요?',
    options: [
      { value: 'multitask', label: '여러 일을 동시에 처리' },
      { value: 'focus', label: '한 번에 하나씩 집중해서 완료' }
    ]
  },
  {
    id: 'q13',
    question: '중요한 내용을 소통할 때 선호하는 방식은?',
    options: [
      { value: 'verbal', label: '말로 직접 대화하기' },
      { value: 'written', label: '문서나 메시지로 기록하여 전달' }
    ]
  },
  
  // 의사결정 및 학습 스타일
  {
    id: 'q14',
    question: '새로운 도전이나 변화에 대한 태도는?',
    options: [
      { value: 'risk_taking', label: '적극적으로 새로운 시도를 좋아함' },
      { value: 'cautious', label: '신중하게 검토한 후 안전하게 접근' }
    ]
  },
  {
    id: 'q15',
    question: '업무에서 어떤 활동에 더 만족감을 느끼시나요?',
    options: [
      { value: 'learning', label: '새로운 지식이나 기술 습득' },
      { value: 'executing', label: '계획된 일을 실행하고 완료하기' }
    ]
  }
];
