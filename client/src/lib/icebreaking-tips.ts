// 아이스브레이킹 팁 생성 라이브러리

export interface IcebreakingTip {
  title: string;
  description: string;
  activities: string[];
  timeEstimate: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface IcebreakingRecommendation {
  teamStyle: string;
  primaryTip: IcebreakingTip;
  alternativeTips: IcebreakingTip[];
  generalAdvice: string[];
}

// 기본 아이스브레이킹 활동들
const icebreakingActivities = {
  visual: {
    title: "시각적 자기소개",
    description: "그림이나 이모지를 활용한 소통 중심의 아이스브레이킹",
    activities: [
      "각자 자신을 표현하는 이모지 3개 선택하고 설명하기",
      "간단한 그림으로 자신의 취미나 관심사 그려보기",
      "화면 공유로 자신의 작업 공간이나 좋아하는 장소 보여주기",
      "색깔로 현재 기분 표현하고 이유 설명하기"
    ],
    timeEstimate: "5-10분",
    difficulty: 'easy' as const
  },
  
  analytical: {
    title: "구조화된 소개",
    description: "체계적이고 정보 중심적인 아이스브레이킹",
    activities: [
      "MBTI나 DISC 유형 공유하고 간단히 설명하기",
      "최근 배운 것 하나씩 공유하기 (기술, 업무, 개인적 경험)",
      "각자의 전문 분야나 강점 한 가지씩 소개하기",
      "이번 달 목표 하나씩 공유하고 응원 메시지 주고받기"
    ],
    timeEstimate: "8-12분",
    difficulty: 'medium' as const
  },
  
  collaborative: {
    title: "협력적 활동",
    description: "함께 참여하는 상호작용 중심의 아이스브레이킹",
    activities: [
      "공통점 찾기 게임 (취미, 경험, 선호도 등)",
      "릴레이 스토리 만들기 (한 사람씩 한 문장씩 추가)",
      "팀 단어 연상 게임하기",
      "가상 여행지 함께 계획하기 (5분간 브레인스토밍)"
    ],
    timeEstimate: "10-15분",
    difficulty: 'medium' as const
  },
  
  quick: {
    title: "빠른 시작",
    description: "간단하고 효율적인 아이스브레이킹",
    activities: [
      "한 단어로 현재 기분 표현하기",
      "좋아하는 음식 하나씩 빠르게 공유하기",
      "오늘의 날씨를 감정으로 표현하기",
      "최근에 본 영화/드라마/책 제목 하나씩 말하기"
    ],
    timeEstimate: "3-5분",
    difficulty: 'easy' as const
  },
  
  creative: {
    title: "창의적 소개",
    description: "독창적이고 재미있는 아이스브레이킹",
    activities: [
      "자신을 동물/식물/음식으로 표현하고 이유 설명하기",
      "가상의 슈퍼파워 하나씩 선택하고 어떻게 사용할지 말하기",
      "자신의 인생을 영화 장르로 표현하기 (로맨스, 액션, 코미디 등)",
      "미래의 자신에게 보내는 한 줄 메시지 공유하기"
    ],
    timeEstimate: "7-12분",
    difficulty: 'medium' as const
  },
  
  professional: {
    title: "업무 중심 소개",
    description: "전문적이고 목적 지향적인 아이스브레이킹",
    activities: [
      "각자의 역할과 이번 미팅에서의 기대사항 공유하기",
      "최근 업무에서 해결한 문제나 성과 간단히 소개하기",
      "이번 프로젝트에 대한 한 줄 기대감 표현하기",
      "자신의 업무 스타일 키워드 3개 공유하기"
    ],
    timeEstimate: "6-10분",
    difficulty: 'easy' as const
  }
};

export function generateIcebreakingRecommendations(
  teamSize: number,
  dominantStyles: string[],
  meetingType: 'casual' | 'work' | 'mixed' = 'mixed'
): IcebreakingRecommendation {
  
  // 팀 성향 분석
  const hasVisualLearners = dominantStyles.some(style => 
    style.includes('시각적') || style.includes('차트') || style.includes('그래프')
  );
  
  const hasAnalyticalTypes = dominantStyles.some(style => 
    style.includes('분석적') || style.includes('체계적') || style.includes('신중')
  );
  
  const hasCollaborativeTypes = dominantStyles.some(style => 
    style.includes('협력') || style.includes('팀워크') || style.includes('소통')
  );
  
  const prefersQuickStart = dominantStyles.some(style => 
    style.includes('빠른') || style.includes('효율') || style.includes('간단')
  );

  // 주요 추천 활동 결정
  let primaryTip: IcebreakingTip;
  let teamStyleDescription: string;
  
  if (teamSize <= 3) {
    if (hasVisualLearners && meetingType !== 'work') {
      primaryTip = icebreakingActivities.visual;
      teamStyleDescription = "소규모 시각적 소통 선호 팀";
    } else if (prefersQuickStart || meetingType === 'work') {
      primaryTip = icebreakingActivities.professional;
      teamStyleDescription = "효율성 중시 소규모 팀";
    } else {
      primaryTip = icebreakingActivities.quick;
      teamStyleDescription = "간단한 소개 선호 소규모 팀";
    }
  } else if (teamSize <= 6) {
    if (hasCollaborativeTypes) {
      primaryTip = icebreakingActivities.collaborative;
      teamStyleDescription = "협력적 중간 규모 팀";
    } else if (hasAnalyticalTypes) {
      primaryTip = icebreakingActivities.analytical;
      teamStyleDescription = "체계적 사고 중심 팀";
    } else {
      primaryTip = icebreakingActivities.creative;
      teamStyleDescription = "창의적 아이디어 공유 팀";
    }
  } else {
    // 대규모 팀
    if (meetingType === 'work') {
      primaryTip = icebreakingActivities.professional;
      teamStyleDescription = "대규모 업무 중심 팀";
    } else {
      primaryTip = icebreakingActivities.quick;
      teamStyleDescription = "효율적 진행이 필요한 대규모 팀";
    }
  }
  
  // 대안 활동들 선택
  const alternativeTips: IcebreakingTip[] = [];
  const allActivities = Object.values(icebreakingActivities);
  
  allActivities.forEach(activity => {
    if (activity.title !== primaryTip.title && alternativeTips.length < 2) {
      alternativeTips.push(activity);
    }
  });
  
  // 일반적인 조언
  const generalAdvice = [
    `${teamSize}명 규모에 적합한 시간 배분을 고려하세요`,
    "모든 참여자가 편안하게 참여할 수 있는 분위기를 만드세요",
    "시간이 부족하면 가장 간단한 활동부터 시작하세요",
    "참여자들의 반응을 보며 유연하게 조정하세요"
  ];
  
  if (teamSize > 6) {
    generalAdvice.push("대규모 팀은 소그룹으로 나누어 진행하는 것을 고려하세요");
  }
  
  if (hasAnalyticalTypes) {
    generalAdvice.push("구체적인 질문이나 구조화된 형식을 활용하세요");
  }
  
  if (hasVisualLearners) {
    generalAdvice.push("화면 공유나 시각적 도구를 적극 활용하세요");
  }

  return {
    teamStyle: teamStyleDescription,
    primaryTip,
    alternativeTips,
    generalAdvice
  };
}

// 미팅 성향 데이터를 기반으로 아이스브레이킹 추천
export function getIcebreakingForMeeting(
  participantCount: number,
  surveyData?: any
): IcebreakingRecommendation {
  
  const dominantStyles: string[] = [];
  
  if (surveyData) {
    // 설문 데이터가 있는 경우 분석
    if (surveyData.questionBreakdown.q1.visual > surveyData.questionBreakdown.q1.text) {
      dominantStyles.push("시각적 선호");
    }
    
    if (surveyData.questionBreakdown.q2.quick > surveyData.questionBreakdown.q2.detailed) {
      dominantStyles.push("빠른 결정 선호");
    } else {
      dominantStyles.push("신중한 검토 선호");
    }
    
    if (surveyData.questionBreakdown.q3.short > surveyData.questionBreakdown.q3.detailed) {
      dominantStyles.push("간단한 소통 선호");
    } else {
      dominantStyles.push("상세한 설명 선호");
    }
    
    if (surveyData.questionBreakdown.q4?.group > surveyData.questionBreakdown.q4?.individual) {
      dominantStyles.push("협력적 활동 선호");
    }
  }
  
  return generateIcebreakingRecommendations(
    participantCount,
    dominantStyles,
    'mixed'
  );
}