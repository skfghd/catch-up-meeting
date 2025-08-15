interface Participant {
  name: string;
  style: string;
  description: string;
}

export interface MeetingAdvice {
  title: string;
  description: string;
  tips: string[];
  warnings: string[];
}

export const analyzeMeetingStyles = (
  participants: Participant[], 
  meetingType: 'presentation' | 'collaboration' | 'brainstorming' | 'decision' | 'review' | 'kickoff' = 'collaboration'
): MeetingAdvice => {
  const styles = participants.map(p => p.style);
  
  // 스타일 분류
  const visualTypes = styles.filter(s => 
    s.includes('시각적') || s.includes('전략가') || s.includes('학습자')
  ).length;
  
  const quickTypes = styles.filter(s => 
    s.includes('빠른') || s.includes('신속') || s.includes('효율적') || s.includes('결정자')
  ).length;
  
  const detailTypes = styles.filter(s => 
    s.includes('세부') || s.includes('철저한') || s.includes('분석') || s.includes('포괄적') || s.includes('전문가')
  ).length;
  
  const collaborativeTypes = styles.filter(s => 
    s.includes('협력') || s.includes('소통') || s.includes('협업')
  ).length;
  
  const structuredTypes = styles.filter(s => 
    s.includes('체계적') || s.includes('계획') || s.includes('구조') || s.includes('전략적')
  ).length;
  
  const total = participants.length;
  const isVisualDominant = visualTypes / total > 0.5;
  const isQuickDominant = quickTypes / total > 0.5;
  const isDetailDominant = detailTypes / total > 0.5;
  const isCollaborativeDominant = collaborativeTypes / total > 0.5;
  const isStructuredDominant = structuredTypes / total > 0.5;
  const isMixed = Math.max(visualTypes, quickTypes, detailTypes, collaborativeTypes, structuredTypes) / total < 0.6;

  let advice: MeetingAdvice;

  // 미팅 유형별 기본 조언 먼저 결정
  const getBaseAdviceByType = (): Partial<MeetingAdvice> => {
    switch (meetingType) {
      case 'presentation':
        return {
          title: "프로젝트 발표 미팅",
          description: "성과를 효과적으로 전달하고 피드백을 수집하는 발표 자리입니다.",
        };
      case 'collaboration':
        return {
          title: "협업 중심 미팅",
          description: "함께 문제를 해결하고 아이디어를 나누는 협업 자리입니다.",
        };
      case 'brainstorming':
        return {
          title: "창의적 아이디어 미팅",
          description: "자유로운 발상과 창의적 해결책을 모색하는 자리입니다.",
        };
      case 'decision':
        return {
          title: "의사결정 중심 미팅",
          description: "중요한 결정을 내리고 방향을 정하는 자리입니다.",
        };
      case 'review':
        return {
          title: "검토 및 피드백 미팅",
          description: "진행 상황을 점검하고 개선점을 찾는 자리입니다.",
        };
      case 'kickoff':
        return {
          title: "프로젝트 시작 미팅",
          description: "새로운 프로젝트를 시작하며 목표와 역할을 정하는 자리입니다.",
        };
      default:
        return {
          title: "협업 중심 미팅",
          description: "함께 문제를 해결하고 아이디어를 나누는 협업 자리입니다.",
        };
    }
  };

  const baseAdvice = getBaseAdviceByType();

  if (isMixed) {
    const mixedTips = getMeetingTypeTips(meetingType, true);
    const mixedWarnings = getMeetingTypeWarnings(meetingType, true);
    
    advice = {
      title: `다양한 스타일 조화형 ${baseAdvice.title}`,
      description: `${baseAdvice.description} 참여자들의 소통 스타일이 다양하므로 모든 사람을 배려한 진행이 필요합니다.`,
      tips: [
        "PPT와 문서 둘 다 준비하기",
        "빠른 결정할 것과 천천히 논의할 것 구분하기",
        ...mixedTips
      ],
      warnings: [
        "한 가지 방식만 고집하면 소외되는 사람이 생겨요",
        "시간 관리를 잘 해야 모든 사람을 배려할 수 있어요",
        ...mixedWarnings
      ]
    };
  } else if (isVisualDominant && isQuickDominant) {
    const typeTips = getMeetingTypeTips(meetingType);
    const typeWarnings = getMeetingTypeWarnings(meetingType);
    
    advice = {
      title: `시각적 신속 실행형 ${baseAdvice.title}`,
      description: `${baseAdvice.description} 차트와 빠른 결정을 선호하는 팀이에요.`,
      tips: [
        "차트, 그래프 많이 준비하기",
        "핵심 데이터 한눈에 보는 대시보드 만들기",
        "안건마다 시간 제한 정하기",
        ...typeTips.slice(0, 2)
      ],
      warnings: [
        "너무 빨리 진행하면 중요한 내용을 놓칠 수 있어요",
        "그림만 보지 말고 중요한 숫자도 꼭 말해주세요",
        ...typeWarnings.slice(0, 1)
      ]
    };
  } else if (isDetailDominant && isStructuredDominant) {
    const typeTips = getMeetingTypeTips(meetingType);
    const typeWarnings = getMeetingTypeWarnings(meetingType);
    
    advice = {
      title: `체계적 심층 분석형 ${baseAdvice.title}`,
      description: `${baseAdvice.description} 꼼꼼한 분석과 체계적 진행을 선호하는 팀이에요.`,
      tips: [
        "미팅 전에 자세한 자료 미리 공유하기",
        "안건마다 충분한 토론 시간 주기",
        "데이터 근거와 분석 과정 자세히 설명하기",
        ...typeTips.slice(0, 2)
      ],
      warnings: [
        "시간이 오래 걸릴 수 있으니 여유있게 잡아주세요",
        "너무 세부사항에 빠지면 큰 그림을 놓칠 수 있어요",
        ...typeWarnings.slice(0, 1)
      ]
    };
  } else if (isCollaborativeDominant) {
    const typeTips = getMeetingTypeTips(meetingType);
    const typeWarnings = getMeetingTypeWarnings(meetingType);
    
    advice = {
      title: `협력적 소통 중심형 ${baseAdvice.title}`,
      description: `${baseAdvice.description} 협업과 소통을 중시하는 팀이에요.`,
      tips: [
        "브레인스토밍과 자유토론 시간 충분히 주기",
        "모든 사람이 골고루 발언하도록 유도하기",
        ...typeTips.slice(0, 2)
      ],
      warnings: [
        "이야기가 너무 샐 수 있으니 적절히 정리해주세요",
        "조용한 분들도 참여할 수 있게 배려해주세요",
        ...typeWarnings.slice(0, 1)
      ]
    };
  } else if (isVisualDominant) {
    const typeTips = getMeetingTypeTips(meetingType);
    const typeWarnings = getMeetingTypeWarnings(meetingType);
    
    advice = {
      title: `시각적 자료 중심형 ${baseAdvice.title}`,
      description: `${baseAdvice.description} 시각적 정보를 선호하는 팀이에요.`,
      tips: [
        "PPT, 차트, 다이어그램 많이 준비하기",
        "복잡한 내용은 그림으로 간단하게 만들기",
        ...typeTips.slice(0, 2)
      ],
      warnings: [
        "그림만으로는 전달 안 되는 부분이 있을 수 있어요",
        ...typeWarnings.slice(0, 1)
      ]
    };
  } else if (isQuickDominant) {
    const typeTips = getMeetingTypeTips(meetingType);
    const typeWarnings = getMeetingTypeWarnings(meetingType);
    
    advice = {
      title: `효율적 의사결정 중심형 ${baseAdvice.title}`,
      description: `${baseAdvice.description} 빠른 결정과 효율성을 중시하는 팀이에요.`,
      tips: [
        "명확한 아젠다와 시간 제한 정하기",
        "핵심 포인트만 간추려서 말하기",
        ...typeTips.slice(0, 2)
      ],
      warnings: [
        "너무 급하게 결정하면 중요한 걸 놓칠 수 있어요",
        ...typeWarnings.slice(0, 1)
      ]
    };
  } else {
    const typeTips = getMeetingTypeTips(meetingType);
    const typeWarnings = getMeetingTypeWarnings(meetingType);
    
    advice = {
      title: `균형잡힌 ${baseAdvice.title}`,
      description: `${baseAdvice.description} 다양한 스타일이 조화된 팀이에요.`,
      tips: [
        "일반적인 미팅 방식으로 진행하되 유연하게 하기",
        "그림 자료와 문서 자료 적당히 섞어서 사용하기",
        ...typeTips.slice(0, 2)
      ],
      warnings: [
        "특별히 조심할 건 없지만 개별 피드백을 받아보세요",
        ...typeWarnings.slice(0, 1)
      ]
    };
  }

  return advice;
};

// 미팅 유형별 추가 팁 생성 함수
const getMeetingTypeTips = (meetingType: string, isMixed: boolean = false): string[] => {
  const tips: Record<string, string[]> = {
    presentation: [
      "발표 시간과 Q&A 시간을 명확히 구분하기",
      "핵심 메시지를 먼저 말하고 세부사항은 나중에",
      "청중의 반응을 확인하며 속도 조절하기",
      "질문 받을 포인트를 미리 정해두기"
    ],
    collaboration: [
      "모든 참여자가 골고루 의견을 낼 수 있도록 진행",
      "아이디어를 실시간으로 정리하고 공유하기",
      "역할과 책임을 명확히 나누기",
      "다음 액션 아이템을 구체적으로 정하기"
    ],
    brainstorming: [
      "비판하지 않는 자유로운 분위기 만들기",
      "양보다 질, 많은 아이디어 수집하기",
      "시각적 도구(포스트잇, 마인드맵) 적극 활용",
      "기존 틀에서 벗어나 생각하도록 격려하기"
    ],
    decision: [
      "결정해야 할 사항들을 명확히 리스트업",
      "각 선택지의 장단점을 객관적으로 검토",
      "결정 기준과 우선순위를 사전에 합의",
      "결정 후 실행 계획까지 함께 정하기"
    ],
    review: [
      "구체적인 피드백 기준을 사전에 공유",
      "좋은 점과 개선점을 균형있게 다루기",
      "건설적인 비판과 해결책 제시하기",
      "다음 단계 개선 계획 수립하기"
    ],
    kickoff: [
      "프로젝트 목표와 성공 기준 명확히 하기",
      "각자의 역할과 책임 범위 정의하기",
      "일정과 마일스톤을 함께 검토하기",
      "소통 방식과 보고 체계 정하기"
    ]
  };
  
  return tips[meetingType] || tips.collaboration;
};

// 미팅 유형별 주의사항 생성 함수
const getMeetingTypeWarnings = (meetingType: string, isMixed: boolean = false): string[] => {
  const warnings: Record<string, string[]> = {
    presentation: [
      "일방적인 발표보다는 상호작용을 늘려보세요",
      "너무 많은 정보를 한번에 전달하지 마세요"
    ],
    collaboration: [
      "목적 없는 토론으로 시간이 길어질 수 있어요",
      "의견 충돌 시 중재자 역할이 중요해요"
    ],
    brainstorming: [
      "너무 일찍 비판하면 창의성이 위축돼요",
      "실현 가능성만 따지면 혁신적 아이디어를 놓쳐요"
    ],
    decision: [
      "감정적 판단보다는 객관적 근거에 기반해주세요",
      "중요한 결정을 성급하게 내리지 마세요"
    ],
    review: [
      "개인 공격이 아닌 업무에 집중한 피드백이 중요해요",
      "비판만 하고 대안을 제시하지 않으면 도움이 안 돼요"
    ],
    kickoff: [
      "너무 세부적인 계획보다는 큰 그림을 먼저 그려주세요",
      "역할 분담이 애매하면 나중에 책임 소재가 불분명해져요"
    ]
  };
  
  return warnings[meetingType] || warnings.collaboration;
};

export interface SurveyAggregation {
  totalResponses: number;
  questionBreakdown: {
    q1: { visual: number; text: number };
    q2: { quick: number; detailed: number };
    q3: { short: number; detailed: number };
    q4: { individual: number; group: number };
    q5: { flexible: number; structured: number };
  };
  teamProfile: {
    communicationStyle: string;
    decisionMaking: string;
    workStyle: string;
    teamType: string;
    adaptability: string;
  };
  insights: string[];
  dominantStyle: string;
}

// 팀의 지배적 성향을 결정하는 함수
const generateDominantStyle = (breakdown: any, total: number): string => {
  const scores = {
    visual: breakdown.q1.visual / total,
    quick: breakdown.q2.quick / total,
    collaborative: breakdown.q4.group / total,
    structured: breakdown.q5.structured / total
  };

  if (scores.visual > 0.6 && scores.quick > 0.6) {
    return '시각적 신속 실행형';
  } else if (scores.visual > 0.6 && scores.collaborative > 0.6) {
    return '시각적 협업형';
  } else if (scores.quick > 0.6 && scores.structured > 0.6) {
    return '효율적 체계형';
  } else if (scores.collaborative > 0.6 && scores.structured > 0.6) {
    return '협업 체계형';
  } else if (scores.visual > 0.5) {
    return '시각적 소통형';
  } else if (scores.quick > 0.5) {
    return '신속 결정형';
  } else if (scores.collaborative > 0.5) {
    return '협업 중심형';
  } else {
    return '균형 조화형';
  }
};

export const aggregateSurveyData = (participantCount?: number): SurveyAggregation | null => {
  // 참가자 수 기반으로 동적 설문 데이터 생성
  const count = participantCount || 4;
  
  // 참가자 수에 따라 다양한 설문 데이터 생성
  const generateSurveyData = (totalCount: number) => {
    const surveys = [];
    const patterns = [
      { q1: 'visual', q2: 'quick', q3: 'short', q4: 'group', q5: 'structured' },
      { q1: 'text', q2: 'detailed', q3: 'detailed', q4: 'individual', q5: 'flexible' },
      { q1: 'visual', q2: 'detailed', q3: 'short', q4: 'group', q5: 'structured' },
      { q1: 'text', q2: 'quick', q3: 'detailed', q4: 'individual', q5: 'flexible' },
      { q1: 'visual', q2: 'quick', q3: 'detailed', q4: 'group', q5: 'flexible' },
      { q1: 'text', q2: 'detailed', q3: 'short', q4: 'individual', q5: 'structured' }
    ];
    
    for (let i = 0; i < totalCount; i++) {
      surveys.push(patterns[i % patterns.length]);
    }
    
    return surveys;
  };
  
  const sampleSurveys = generateSurveyData(count);

  if (sampleSurveys.length === 0) {
    return null;
  }

  // 각 질문별 답변 집계
  const breakdown = {
    q1: { visual: 0, text: 0 },
    q2: { quick: 0, detailed: 0 },
    q3: { short: 0, detailed: 0 },
    q4: { individual: 0, group: 0 },
    q5: { flexible: 0, structured: 0 }
  };

  sampleSurveys.forEach(survey => {
    breakdown.q1[survey.q1 as 'visual' | 'text']++;
    breakdown.q2[survey.q2 as 'quick' | 'detailed']++;
    breakdown.q3[survey.q3 as 'short' | 'detailed']++;
    breakdown.q4[survey.q4 as 'individual' | 'group']++;
    breakdown.q5[survey.q5 as 'flexible' | 'structured']++;
  });

  // 팀 프로필 생성
  const total = sampleSurveys.length;
  const teamProfile = {
    communicationStyle: breakdown.q1.visual > breakdown.q1.text ? '시각적 소통 선호' : '텍스트 소통 선호',
    decisionMaking: breakdown.q2.quick > breakdown.q2.detailed ? '빠른 결정 선호' : '신중한 결정 선호',
    workStyle: breakdown.q3.short > breakdown.q3.detailed ? '간결한 설명 선호' : '상세한 설명 선호',
    teamType: breakdown.q4.group > breakdown.q4.individual ? '그룹 활동 선호' : '개별 작업 선호',
    adaptability: breakdown.q5.flexible > breakdown.q5.structured ? '유연한 진행 선호' : '체계적 진행 선료'
  };

  // 팀의 지배적 성향 결정
  const dominantStyle = generateDominantStyle(breakdown, total);

  // 인사이트 생성
  const insights = [];
  
  if (breakdown.q1.visual / total > 0.7) {
    insights.push('팀의 70% 이상이 시각적 자료를 선호합니다. 차트와 그래프를 적극 활용하세요.');
  } else if (breakdown.q1.text / total > 0.7) {
    insights.push('팀의 70% 이상이 텍스트 정보를 선호합니다. 상세한 문서 자료를 준비하세요.');
  } else {
    insights.push('시각적 자료와 텍스트 자료를 균형있게 준비하여 모든 참가자를 배려하세요.');
  }
  
  if (breakdown.q2.quick / total > 0.6) {
    insights.push('빠른 의사결정을 선호하는 팀입니다. 명확한 안건과 시간 제한을 설정하세요.');
  } else if (breakdown.q2.detailed / total > 0.6) {
    insights.push('신중한 검토를 선호하는 팀입니다. 충분한 토론 시간을 확보하세요.');
  }
  
  if (breakdown.q3.short / total > 0.6) {
    insights.push('간결한 소통을 선호합니다. 핵심 포인트 위주로 정리해서 전달하세요.');
  } else if (breakdown.q3.detailed / total > 0.6) {
    insights.push('상세한 설명을 선호합니다. 배경 정보와 맥락을 충분히 제공하세요.');
  }
  
  if (breakdown.q4.group / total > 0.6) {
    insights.push('그룹 활동을 선호하는 팀입니다. 브레인스토밍과 협업 세션을 활용하세요.');
  } else if (breakdown.q4.individual / total > 0.6) {
    insights.push('개별 작업을 선호합니다. 개인 검토 시간과 개별 의견 수렴 시간을 마련하세요.');
  }

  // 최소 3개의 인사이트 보장
  if (insights.length < 3) {
    insights.push('다양한 성향이 조화된 팀입니다. 유연한 미팅 진행으로 모든 참가자를 배려하세요.');
  }

  return {
    totalResponses: total,
    questionBreakdown: breakdown,
    teamProfile,
    insights,
    dominantStyle
  };
};