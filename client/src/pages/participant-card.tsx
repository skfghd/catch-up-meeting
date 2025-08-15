import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, MessageCircle, Clock, Target, Lightbulb, AlertTriangle } from "lucide-react";

interface ParticipantProfile {
  name: string;
  style: string;
  description: string;
  strengths: string[];
  communicationTips: string[];
  workingStyle: {
    decisionMaking: string;
    informationPreference: string;
    meetingStyle: string;
  };
  collaborationTips: string[];
  potentialChallenges: string[];
}

// 참가자별 상세 프로필 데이터
const participantProfiles: Record<string, ParticipantProfile> = {
  '김사라': {
    name: '김사라',
    style: '시각적 소통자',
    description: '차트와 시각적 데이터를 선호합니다. 명확한 결과를 가진 빠른 결정을 좋아합니다.',
    strengths: ['시각적 정보 처리', '빠른 의사결정', '데이터 분석', '효율성 추구'],
    communicationTips: [
      '차트, 그래프, 다이어그램을 활용해 정보를 전달하세요',
      '핵심 포인트를 시각적으로 강조해 주세요',
      '복잡한 내용은 단계별로 나누어 설명하세요',
      '결과와 성과를 명확하게 제시하세요'
    ],
    workingStyle: {
      decisionMaking: '신속한 결정을 선호하며, 명확한 데이터 기반으로 판단',
      informationPreference: '시각적 자료(차트, 그래프, 인포그래픽) 선호',
      meetingStyle: '간결하고 구조화된 미팅, 명확한 아젠다와 결과물 기대'
    },
    collaborationTips: [
      '미팅 전에 시각적 자료를 미리 공유하세요',
      '논의 사항을 명확한 카테고리로 분류하세요',
      '결정 사항과 액션 아이템을 시각적으로 정리하세요'
    ],
    potentialChallenges: [
      '너무 빠른 결정으로 세부사항을 놓칠 수 있음',
      '텍스트 위주의 긴 설명에 집중하기 어려워할 수 있음',
      '시각적 자료 없이는 이해도가 떨어질 수 있음'
    ]
  },
  '박마이크': {
    name: '박마이크',
    style: '세부지향적',
    description: '철저한 토론과 포괄적인 설명을 중시합니다.',
    strengths: ['세밀한 분석', '철저한 검토', '리스크 관리', '품질 보장'],
    communicationTips: [
      '충분한 배경 정보와 맥락을 제공하세요',
      '세부 사항과 잠재적 리스크를 함께 논의하세요',
      '결정 전에 충분한 검토 시간을 확보하세요',
      '단계별 계획과 체크포인트를 명확히 하세요'
    ],
    workingStyle: {
      decisionMaking: '신중한 검토 후 결정, 다양한 시나리오 고려',
      informationPreference: '상세한 문서와 텍스트 기반 정보 선호',
      meetingStyle: '심도 있는 토론, 충분한 시간 확보 필요'
    },
    collaborationTips: [
      '미팅 아젠다를 미리 상세히 공유하세요',
      '관련 자료와 문서를 사전에 검토할 시간을 주세요',
      '의사결정 과정에서 충분한 토론 시간을 확보하세요'
    ],
    potentialChallenges: [
      '너무 세부적인 검토로 진행이 느려질 수 있음',
      '빠른 결정이 필요한 상황에서 스트레스를 받을 수 있음',
      '완벽주의 성향으로 마감에 어려움을 겪을 수 있음'
    ]
  },
  '이엠마': {
    name: '이엠마',
    style: '간결한 소통자',
    description: '짧고 실행 가능한 요점을 선호합니다. 효율적인 의사결정자입니다.',
    strengths: ['명확한 소통', '빠른 실행', '효율성', '핵심 파악'],
    communicationTips: [
      '핵심 메시지를 앞에 두고 간결하게 전달하세요',
      '실행 가능한 액션 아이템을 명확히 제시하세요',
      '불필요한 세부사항은 생략하고 요점만 말하세요',
      '시간 제한을 두고 효율적으로 진행하세요'
    ],
    workingStyle: {
      decisionMaking: '빠른 판단과 즉시 실행 선호',
      informationPreference: '요약된 정보와 핵심 포인트 선호',
      meetingStyle: '짧고 집중된 미팅, 명확한 결론과 다음 단계'
    },
    collaborationTips: [
      '미팅 시간을 짧게 설정하고 집중도를 높이세요',
      '각 안건별로 명확한 시간 제한을 두세요',
      '회의록은 액션 아이템 중심으로 간단히 작성하세요'
    ],
    potentialChallenges: [
      '중요한 세부사항을 놓칠 위험이 있음',
      '충분한 논의 없이 성급한 결정을 내릴 수 있음',
      '복잡한 이슈에 대해 깊이 있는 논의를 꺼릴 수 있음'
    ]
  },
  '김데이빗': {
    name: '김데이빗',
    style: '분석적 사고자',
    description: '결정 전에 텍스트 기반 데이터와 상세한 분석을 즐깁니다.',
    strengths: ['논리적 분석', '데이터 기반 판단', '체계적 사고', '문제 해결'],
    communicationTips: [
      '논리적 근거와 데이터를 함께 제시하세요',
      '분석 과정과 결론을 체계적으로 설명하세요',
      '가정과 전제 조건을 명확히 하세요',
      '다양한 관점에서의 분석 결과를 공유하세요'
    ],
    workingStyle: {
      decisionMaking: '데이터와 분석 결과를 바탕으로 한 논리적 결정',
      informationPreference: '상세한 분석 자료와 통계 데이터 선호',
      meetingStyle: '분석적 토론, 근거 기반 의사결정 과정'
    },
    collaborationTips: [
      '분석할 데이터와 자료를 미리 준비하세요',
      '논리적 구조로 안건을 정리하세요',
      '각 옵션의 장단점을 체계적으로 비교하세요'
    ],
    potentialChallenges: [
      '분석에 너무 많은 시간을 소요할 수 있음',
      '완벽한 데이터를 요구하여 진행이 지연될 수 있음',
      '직관적 판단보다 데이터에만 의존할 수 있음'
    ]
  },
  '왕리사': {
    name: '왕리사',
    style: '시각적 전략가',
    description: '그래프가 있는 프레젠테이션을 좋아합니다. 정보를 빠르게 종합합니다.',
    strengths: ['전략적 사고', '시각적 분석', '빠른 정보 처리', '종합적 판단'],
    communicationTips: [
      '전략적 관점에서 큰 그림을 먼저 제시하세요',
      '프레젠테이션과 그래프를 활용하여 설명하세요',
      '핵심 인사이트를 명확하게 강조하세요',
      '장기적 비전과 단기 계획을 연결해서 설명하세요'
    ],
    workingStyle: {
      decisionMaking: '전략적 관점에서 빠른 종합 판단',
      informationPreference: '시각적 자료와 프레젠테이션 선호',
      meetingStyle: '전략적 논의, 비전 중심의 미팅'
    },
    collaborationTips: [
      '전략적 목표와 연결해서 설명하세요',
      '시각적 자료로 복잡한 정보를 정리하세요',
      '다양한 옵션의 전략적 영향을 분석하세요'
    ],
    potentialChallenges: [
      '세부 실행 단계에 대한 관심이 부족할 수 있음',
      '너무 큰 그림에만 집중하여 현실성을 놓칠 수 있음',
      '단기적 이슈보다 장기 전략을 우선시할 수 있음'
    ]
  },
  '스미스제임스': {
    name: '스미스제임스',
    style: '철저한 분석가',
    description: '결정을 내리기 전에 포괄적인 데이터가 필요합니다.',
    strengths: ['데이터 분석', '리스크 평가', '신중한 판단', '품질 관리'],
    communicationTips: [
      '충분한 배경 데이터와 통계를 제공하세요',
      '분석 결과의 신뢰도와 한계를 명시하세요',
      '다양한 시나리오와 가능성을 함께 논의하세요',
      '결론에 이르는 논리적 과정을 단계별로 설명하세요'
    ],
    workingStyle: {
      decisionMaking: '포괄적 데이터 분석 후 신중한 결정',
      informationPreference: '상세한 분석 보고서와 통계 자료 선호',
      meetingStyle: '데이터 기반 토론, 충분한 검토 시간 필요'
    },
    collaborationTips: [
      '분석할 데이터를 미리 공유하세요',
      '결정 과정에서 충분한 검토 시간을 확보하세요',
      '다각도 분석 결과를 체계적으로 정리하세요'
    ],
    potentialChallenges: [
      '완벽한 데이터를 요구하여 진행이 지연될 수 있음',
      '분석에 과도한 시간을 투입할 수 있음',
      '불확실성이 높은 상황에서 결정을 어려워할 수 있음'
    ]
  },
  '가르시아아나': {
    name: '가르시아아나',
    style: '효율적 협력자',
    description: '직접적인 소통 스타일. 시간과 명확성을 중시합니다.',
    strengths: ['명확한 소통', '시간 관리', '목표 지향', '실행력'],
    communicationTips: [
      '핵심 메시지를 간결하고 명확하게 전달하세요',
      '실행 가능한 액션 아이템을 구체적으로 제시하세요',
      '시간 제한을 설정하고 효율적으로 진행하세요',
      '결과와 성과를 정량적으로 측정하세요'
    ],
    workingStyle: {
      decisionMaking: '명확한 기준에 따른 빠른 결정',
      informationPreference: '요약된 핵심 정보와 실행 계획 선호',
      meetingStyle: '목표 중심의 효율적 미팅, 명확한 결론'
    },
    collaborationTips: [
      '미팅 목표와 예상 결과를 미리 공유하세요',
      '각 안건별 시간 배분을 명확히 하세요',
      '행동 계획과 책임자를 구체적으로 정하세요'
    ],
    potentialChallenges: [
      '효율성을 위해 중요한 세부사항을 놓칠 수 있음',
      '충분한 논의 없이 성급한 결정을 내릴 수 있음',
      '과정보다 결과에만 집중할 수 있음'
    ]
  },
  '윌슨톰': {
    name: '윌슨톰',
    style: '맥락 제공자',
    description: '배경 정보와 함께 완전한 설명을 제공합니다.',
    strengths: ['맥락 이해', '포괄적 설명', '배경 지식', '연결성 파악'],
    communicationTips: [
      '충분한 배경 정보와 맥락을 먼저 설명하세요',
      '현재 상황이 전체 과정에서 어떤 위치인지 명시하세요',
      '관련된 이전 경험과 사례를 함께 공유하세요',
      '다양한 관점에서의 영향과 연관성을 설명하세요'
    ],
    workingStyle: {
      decisionMaking: '충분한 맥락 이해 후 종합적 판단',
      informationPreference: '배경 정보가 풍부한 상세 자료 선호',
      meetingStyle: '맥락 중심의 토론, 전체적 이해 추구'
    },
    collaborationTips: [
      '프로젝트의 전체 맥락과 목표를 공유하세요',
      '이전 진행 과정과 현재 상황을 연결해서 설명하세요',
      '각 결정이 전체에 미치는 영향을 함께 논의하세요'
    ],
    potentialChallenges: [
      '너무 많은 배경 설명으로 핵심을 놓칠 수 있음',
      '맥락 이해에 과도한 시간을 소요할 수 있음',
      '즉각적 결정이 필요한 상황에서 어려움을 겪을 수 있음'
    ]
  },
  '박레이첼': {
    name: '박레이첼',
    style: '시각적 학습자',
    description: '차트와 다이어그램을 통해 정보를 가장 잘 처리합니다.',
    strengths: ['시각적 처리', '패턴 인식', '직관적 이해', '창의적 사고'],
    communicationTips: [
      '다이어그램과 플로우차트를 활용하여 설명하세요',
      '복잡한 개념을 시각적으로 단순화하세요',
      '색상과 도형을 사용해 중요한 정보를 강조하세요',
      '시각적 은유와 비유를 통해 이해를 돕세요'
    ],
    workingStyle: {
      decisionMaking: '시각적 정보 분석을 통한 직관적 판단',
      informationPreference: '차트, 그래프, 인포그래픽 선호',
      meetingStyle: '시각적 자료 중심의 미팅, 화이트보드 활용'
    },
    collaborationTips: [
      '아이디어를 시각적으로 스케치하며 논의하세요',
      '프로세스를 다이어그램으로 정리하세요',
      '진행 상황을 시각적 대시보드로 공유하세요'
    ],
    potentialChallenges: [
      '시각적 자료 없이는 이해도가 현저히 떨어질 수 있음',
      '텍스트 위주의 긴 문서를 처리하기 어려워할 수 있음',
      '시각적 표현에 과도하게 의존할 수 있음'
    ]
  },
  '데이비스존': {
    name: '데이비스존',
    style: '빠른 결정자',
    description: '요점과 신속한 의사결정을 선호합니다.',
    strengths: ['신속한 판단', '핵심 파악', '실행력', '리더십'],
    communicationTips: [
      '핵심 요점을 맨 앞에 배치하세요',
      '옵션과 추천사항을 명확히 제시하세요',
      '결정에 필요한 최소한의 정보만 제공하세요',
      '즉석에서 결론을 내릴 수 있도록 구조화하세요'
    ],
    workingStyle: {
      decisionMaking: '핵심 정보 기반 즉시 결정',
      informationPreference: '요약된 핵심 포인트와 권장사항 선호',
      meetingStyle: '신속한 결정 중심 미팅, 간결한 논의'
    },
    collaborationTips: [
      '결정 옵션을 2-3개로 제한하세요',
      '각 옵션의 장단점을 간략히 정리하세요',
      '즉시 실행 가능한 계획을 준비하세요'
    ],
    potentialChallenges: [
      '충분한 검토 없이 성급한 결정을 내릴 수 있음',
      '세부사항과 리스크를 간과할 수 있음',
      '다른 사람의 의견을 충분히 수렴하지 않을 수 있음'
    ]
  },
  '브라운소피': {
    name: '브라운소피',
    style: '세부 전문가',
    description: '포괄적인 토론과 철저한 분석을 중시합니다.',
    strengths: ['정밀한 분석', '품질 관리', '리스크 관리', '체계적 접근'],
    communicationTips: [
      '모든 세부사항과 예외 상황을 포함하여 설명하세요',
      '단계별 체크리스트와 검증 과정을 제시하세요',
      '잠재적 문제점과 해결책을 미리 준비하세요',
      '품질 기준과 성공 지표를 명확히 정의하세요'
    ],
    workingStyle: {
      decisionMaking: '모든 세부사항 검토 후 신중한 결정',
      informationPreference: '상세한 명세서와 체크리스트 선호',
      meetingStyle: '세부 검토 중심 미팅, 철저한 품질 관리'
    },
    collaborationTips: [
      '모든 요구사항을 문서화하여 공유하세요',
      '단계별 검토 포인트를 설정하세요',
      '품질 기준을 사전에 합의하세요'
    ],
    potentialChallenges: [
      '완벽주의로 인해 일정이 지연될 수 있음',
      '세부사항에 매몰되어 전체적 관점을 놓칠 수 있음',
      '빠른 프로토타이핑보다 완성도를 우선시할 수 있음'
    ]
  },
  '존슨알렉스': {
    name: '존슨알렉스',
    style: '전략적 사고자',
    description: '시각적 및 텍스트 데이터를 결합합니다. 균형잡힌 의사결정 접근법입니다.',
    strengths: ['전략적 사고', '균형잡힌 판단', '통합적 접근', '장기 계획'],
    communicationTips: [
      '전략적 목표와 세부 실행 계획을 연결하여 설명하세요',
      '시각적 자료와 상세 문서를 모두 활용하세요',
      '단기적 성과와 장기적 비전을 균형있게 제시하세요',
      '다양한 이해관계자의 관점을 고려하여 설명하세요'
    ],
    workingStyle: {
      decisionMaking: '전략적 목표와 실무적 고려사항의 균형잡힌 결정',
      informationPreference: '전략 문서와 실행 계획의 조합 선호',
      meetingStyle: '전략과 실행의 균형잡힌 미팅'
    },
    collaborationTips: [
      '전략적 맥락에서 세부 계획을 설명하세요',
      '다양한 형태의 자료를 조합하여 제시하세요',
      '단계별 마일스톤과 전략적 목표를 연결하세요'
    ],
    potentialChallenges: [
      '균형을 맞추려다 결정이 늦어질 수 있음',
      '모든 관점을 고려하여 복잡해질 수 있음',
      '명확한 우선순위 설정이 어려울 수 있음'
    ]
  },
  '로페즈마리아': {
    name: '로페즈마리아',
    style: '애자일 소통자',
    description: '짧고 반복적인 토론. 빠른 피드백 루프입니다.',
    strengths: ['반복적 개선', '빠른 피드백', '적응력', '협업'],
    communicationTips: [
      '짧은 주기로 진행 상황을 공유하세요',
      '피드백을 즉시 반영할 수 있는 구조로 설명하세요',
      '실험과 학습 과정을 투명하게 공유하세요',
      '변화에 대한 유연한 대응 방안을 제시하세요'
    ],
    workingStyle: {
      decisionMaking: '빠른 실험과 피드백을 통한 반복적 결정',
      informationPreference: '진행 상황 업데이트와 피드백 선호',
      meetingStyle: '짧고 집중적인 스탠드업 스타일 미팅'
    },
    collaborationTips: [
      '정기적인 체크인 일정을 설정하세요',
      '작은 단위로 나누어 진행하세요',
      '피드백을 받을 수 있는 중간 결과물을 준비하세요'
    ],
    potentialChallenges: [
      '장기적 계획보다 단기적 반복에 집중할 수 있음',
      '지속적인 변화로 인해 일관성이 부족할 수 있음',
      '충분한 계획 없이 바로 실행에 들어갈 수 있음'
    ]
  },
  '테일러크리스': {
    name: '테일러크리스',
    style: '포괄적 계획자',
    description: '장기적 맥락을 가진 상세한 설명입니다.',
    strengths: ['장기 계획', '포괄적 사고', '리스크 관리', '체계적 접근'],
    communicationTips: [
      '전체적인 맥락과 장기적 목표를 먼저 설명하세요',
      '단계별 세부 계획과 타임라인을 제시하세요',
      '잠재적 리스크와 대응 방안을 포함하세요',
      '다양한 시나리오와 대안을 함께 논의하세요'
    ],
    workingStyle: {
      decisionMaking: '포괄적 계획과 장기적 관점의 신중한 결정',
      informationPreference: '상세한 계획서와 로드맵 선호',
      meetingStyle: '포괄적 계획 수립 중심의 미팅'
    },
    collaborationTips: [
      '프로젝트 전체 로드맵을 공유하세요',
      '각 단계별 의존성과 연관성을 설명하세요',
      '장기적 영향과 지속가능성을 고려하세요'
    ],
    potentialChallenges: [
      '계획 수립에 과도한 시간을 소요할 수 있음',
      '완벽한 계획을 요구하여 실행이 지연될 수 있음',
      '변화하는 상황에 대한 적응이 느릴 수 있음'
    ]
  },
  '김민준': {
    name: '김민준',
    style: '신중한 시각 학습자',
    description: '차트와 그래프를 통해 정보를 분석하되, 충분한 검토 시간을 필요로 합니다.',
    strengths: ['시각적 분석', '신중한 판단', '패턴 인식', '품질 중시'],
    communicationTips: [
      '시각적 자료를 미리 제공하여 검토 시간을 주세요',
      '차트와 그래프의 의미를 단계별로 설명하세요',
      '복잡한 데이터는 여러 관점에서 시각화하세요',
      '결론에 이르는 분석 과정을 투명하게 공유하세요'
    ],
    workingStyle: {
      decisionMaking: '시각적 데이터 분석 후 신중한 결정',
      informationPreference: '차트, 그래프, 인포그래픽 + 충분한 검토 시간',
      meetingStyle: '시각적 분석 중심의 신중한 토론'
    },
    collaborationTips: [
      '시각적 자료를 사전에 공유하고 검토 시간을 확보하세요',
      '데이터의 신뢰성과 출처를 명확히 하세요',
      '다양한 시각화 방법으로 정보를 제시하세요'
    ],
    potentialChallenges: [
      '시각적 자료 준비에 시간이 많이 소요될 수 있음',
      '완벽한 분석을 위해 결정이 지연될 수 있음',
      '직관적 판단보다 데이터에만 의존할 수 있음'
    ]
  },
  '이서연': {
    name: '이서연',
    style: '효율적 의사결정자',
    description: '시간과 효율성을 중시하며 핵심 요점으로 빠른 결정을 선호합니다.',
    strengths: ['효율성', '시간 관리', '핵심 파악', '빠른 실행'],
    communicationTips: [
      '가장 중요한 정보를 맨 앞에 배치하세요',
      '결정에 필요한 핵심 사항만 간결하게 제시하세요',
      '명확한 옵션과 권장사항을 제공하세요',
      '시간 제한을 설정하고 효율적으로 진행하세요'
    ],
    workingStyle: {
      decisionMaking: '핵심 정보 기반의 빠르고 효율적인 결정',
      informationPreference: '요약된 핵심 포인트와 실행 계획 선호',
      meetingStyle: '시간 효율적인 집중 미팅, 명확한 결론'
    },
    collaborationTips: [
      '미팅 시간을 최적화하고 집중도를 높이세요',
      '각 안건별 명확한 시간 배분을 하세요',
      '즉시 실행 가능한 액션 아이템을 정리하세요'
    ],
    potentialChallenges: [
      '효율성을 위해 중요한 세부사항을 놓칠 수 있음',
      '충분한 논의 시간 없이 성급한 결정을 내릴 수 있음',
      '복잡한 이슈에 대한 깊이 있는 분석을 건너뛸 수 있음'
    ]
  }
};

export default function ParticipantCard() {
  const [location, setLocation] = useLocation();
  const participantName = decodeURIComponent(location.split('/participant/')[1] || '');
  const roomName = decodeURIComponent(new URLSearchParams(window.location.search).get('room') || '');
  
  const profile = participantProfiles[participantName];

  if (!profile) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-slate-500 hover:text-primary mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              이전 페이지로 돌아가기
            </Button>
          </div>
          <Card className="shadow-lg text-center">
            <CardContent className="pt-8 pb-8">
              <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">참가자를 찾을 수 없습니다</h2>
              <p className="text-slate-600 mb-6">요청하신 참가자의 정보를 찾을 수 없습니다.</p>
              <Button onClick={() => window.history.back()} className="bg-primary text-white">
                이전 페이지로 돌아가기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-slate-500 hover:text-primary mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전 페이지로 돌아가기
          </Button>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-xl mr-6">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{profile.name}</h1>
              <p className="text-xl text-primary font-medium">{profile.style}</p>
            </div>
          </div>
          <p className="text-slate-600 text-lg">{profile.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 강점 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                주요 강점
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                    <span className="text-slate-700">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 소통 방법 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                효과적인 소통 방법
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.communicationTips.map((tip, index) => (
                  <div key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm text-slate-700">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 업무 스타일 */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              업무 스타일
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-slate-800 mb-2">의사결정 방식</h4>
                <p className="text-sm text-slate-600">{profile.workingStyle.decisionMaking}</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 mb-2">정보 선호도</h4>
                <p className="text-sm text-slate-600">{profile.workingStyle.informationPreference}</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 mb-2">미팅 스타일</h4>
                <p className="text-sm text-slate-600">{profile.workingStyle.meetingStyle}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 협업 팁 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                협업할 때 도움이 되는 팁
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.collaborationTips.map((tip, index) => (
                  <div key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm text-slate-700">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 주의사항 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                협업 시 주의사항
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.potentialChallenges.map((challenge, index) => (
                  <div key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm text-slate-700">{challenge}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 피드백 남기기 버튼 */}
        <Card className="shadow-lg mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {profile.name}님과 함께 일해보셨나요?
              </h3>
              <p className="text-slate-600 mb-4">
                미팅이 끝난 후 소통 스타일에 대한 피드백을 남겨보세요.
              </p>
              <Button
                onClick={() => setLocation(`/feedback?meeting=${encodeURIComponent(roomName)}`)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                피드백 남기기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}