import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, User, Lightbulb, Users, TrendingUp, AlertTriangle, MessageCircle, CheckCircle, UserPlus, Mail, Copy, X, Plus, Smartphone, Trash2, MoreVertical, BarChart3, Coffee, Clock, Zap, Search, Edit3, ChevronUp, ChevronDown } from "lucide-react";
import { getUser, getUserProfile, getShareProfile, getMeetingFeedbacks, getPreviousParticipants, PreviousParticipant } from "@/lib/storage";
import { analyzeMeetingStyles } from "@/lib/meeting-analysis";
import { aggregateSurveyData, type SurveyAggregation } from "@/lib/meeting-analysis";
import { getIcebreakingForMeeting, type IcebreakingRecommendation } from "@/lib/icebreaking-tips";
import { BackButton } from "@/components/back-button";
import { useState, useEffect, useMemo } from "react";
import MeetingPlatformIntegration from "@/components/meeting-platform-integration";
import MeetingQuickJoin from "@/components/meeting-quick-join";
import MeetingChecklist from "@/components/meeting-checklist";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { translations } from "@/lib/i18n";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Participant {
  name: string;
  style: string;
  description: string;
  workingTips?: {
    preparation?: string;
    communication?: string;
    collaboration?: string;
    feedback?: string;
    environment?: string;
  };
}

const mockParticipants: Record<string, Participant[]> = {
  '디자인 스프린트 계획': [
    { 
      name: '김사라', 
      style: '시각적 소통자', 
      description: '차트와 시각적 데이터를 선호합니다. 명확한 결과를 가진 빠른 결정을 좋아합니다.',
      workingTips: {
        preparation: '시각적 자료(차트, 그래프)를 준비해주시면 더 효과적으로 의견을 나눌 수 있습니다.',
        communication: '핵심 포인트를 시각적으로 정리해서 설명해주세요.',
        collaboration: '빠른 의사결정을 선호하며, 명확한 결론을 좋아합니다.',
        feedback: '구체적이고 행동 가능한 피드백을 선호합니다.',
        environment: '집중할 수 있는 조용한 환경에서 최고 성과를 발휘합니다.'
      }
    },
    { 
      name: '박마이크', 
      style: '세부지향적', 
      description: '철저한 토론과 포괄적인 설명을 중시합니다.',
      workingTips: {
        preparation: '상세한 배경 자료와 분석 데이터를 미리 공유해주세요.',
        communication: '충분한 시간을 두고 심도 있는 논의를 진행합시다.',
        collaboration: '모든 관점을 고려한 종합적인 접근을 선호합니다.',
        feedback: '상세하고 근거가 명확한 피드백을 주고받는 것을 좋아합니다.',
        environment: '방해받지 않는 환경에서 집중적인 토론을 선호합니다.'
      }
    },
    { 
      name: '이엠마', 
      style: '간결한 소통자', 
      description: '짧고 실행 가능한 요점을 선호합니다. 효율적인 의사결정자입니다.',
      workingTips: {
        preparation: '핵심 포인트만 간단하게 정리해주시면 됩니다.',
        communication: '결론부터 말하고, 세부사항은 필요시에만 설명해주세요.',
        collaboration: '명확한 역할 분담과 빠른 실행을 중시합니다.',
        feedback: '짧고 명확한 피드백을 선호합니다.',
        environment: '효율성을 추구하며, 시간을 절약하는 것을 중요하게 생각합니다.'
      }
    },
    { 
      name: '김데이빗', 
      style: '분석적 사고자', 
      description: '결정 전에 텍스트 기반 데이터와 상세한 분석을 즐깁니다.',
      workingTips: {
        preparation: '충분한 데이터와 분석 자료를 미리 검토할 시간을 주세요.',
        communication: '논리적 근거와 함께 단계별로 설명해주세요.',
        collaboration: '신중한 검토 과정을 거쳐 최선의 결정을 내립니다.',
        feedback: '구체적인 근거와 개선 방안이 포함된 피드백을 선호합니다.',
        environment: '자료를 충분히 검토할 수 있는 여유로운 분위기를 선호합니다.'
      }
    }
  ],
  '분기별 검토': [
    { 
      name: '왕리사', 
      style: '시각적 전략가', 
      description: '그래프가 있는 프레젠테이션을 좋아합니다. 정보를 빠르게 종합합니다.',
      workingTips: {
        preparation: '데이터를 그래프나 차트로 시각화해서 공유해주세요.',
        communication: '전체 그림을 먼저 보여주고 세부사항으로 들어가주세요.',
        collaboration: '빠른 판단력을 바탕으로 효율적인 의사결정을 선호합니다.',
        feedback: '시각적 자료를 활용한 피드백이 효과적입니다.',
        environment: '프레젠테이션이 용이한 환경에서 최적 성과를 보입니다.'
      }
    },
    { 
      name: '스미스제임스', 
      style: '철저한 분석가', 
      description: '결정을 내리기 전에 포괄적인 데이터가 필요합니다.',
      workingTips: {
        preparation: '모든 관련 데이터와 배경 자료를 상세히 준비해주세요.',
        communication: '충분한 검토 시간을 두고 단계적으로 진행해주세요.',
        collaboration: '모든 변수를 고려한 신중한 접근을 추구합니다.',
        feedback: '데이터 기반의 구체적인 피드백을 선호합니다.',
        environment: '방해받지 않는 집중 환경에서 깊이 있는 분석을 합니다.'
      }
    },
    { 
      name: '가르시아아나', 
      style: '효율적 협력자', 
      description: '직접적인 소통 스타일. 시간과 명확성을 중시합니다.',
      workingTips: {
        preparation: '핵심 안건만 명확히 정리해주시면 충분합니다.',
        communication: '직설적이고 명확한 소통을 선호합니다.',
        collaboration: '효율적인 진행과 명확한 결론 도출을 중시합니다.',
        feedback: '솔직하고 건설적인 피드백을 주고받습니다.',
        environment: '시간 효율성을 고려한 간결한 회의를 선호합니다.'
      }
    },
    { 
      name: '윌슨톰', 
      style: '맥락 제공자', 
      description: '배경 정보와 함께 완전한 설명을 제공합니다.',
      workingTips: {
        preparation: '관련 배경과 맥락 정보를 풍부하게 준비해주세요.',
        communication: '전체적인 맥락에서 이해할 수 있도록 설명해주세요.',
        collaboration: '포괄적인 관점에서 모든 측면을 고려합니다.',
        feedback: '맥락과 배경을 포함한 설명형 피드백을 선호합니다.',
        environment: '충분한 논의 시간이 확보된 여유로운 분위기를 좋아합니다.'
      }
    },
    { 
      name: '박레이첼', 
      style: '시각적 학습자', 
      description: '차트와 다이어그램을 통해 정보를 가장 잘 처리합니다.',
      workingTips: {
        preparation: '다이어그램, 플로우차트, 인포그래픽 등을 활용해주세요.',
        communication: '시각적 요소를 통해 설명하면 더 잘 이해할 수 있습니다.',
        collaboration: '아이디어를 그림으로 그려가며 토론하는 것을 좋아합니다.',
        feedback: '시각적 자료를 통한 피드백이 가장 효과적입니다.',
        environment: '화이트보드나 스크린을 활용할 수 있는 환경을 선호합니다.'
      }
    },
    { 
      name: '데이비스존', 
      style: '빠른 결정자', 
      description: '요점과 신속한 의사결정을 선호합니다.',
      workingTips: {
        preparation: '결정에 필요한 핵심 정보만 간략히 정리해주세요.',
        communication: '결론부터 제시하고 필요시 부연설명을 해주세요.',
        collaboration: '신속한 판단과 즉시 실행을 중시합니다.',
        feedback: '간결하고 즉시 적용 가능한 피드백을 선호합니다.',
        environment: '빠른 템포의 효율적인 회의 진행을 좋아합니다.'
      }
    },
    { 
      name: '브라운소피', 
      style: '세부 전문가', 
      description: '포괄적인 토론과 철저한 분석을 중시합니다.',
      workingTips: {
        preparation: '세부 사항까지 빠짐없이 준비된 자료가 필요합니다.',
        communication: '모든 세부사항을 놓치지 않고 철저히 검토합니다.',
        collaboration: '완벽한 분석을 통한 최적해 도출을 추구합니다.',
        feedback: '구체적이고 세밀한 개선점을 포함한 피드백을 선호합니다.',
        environment: '충분한 시간을 두고 모든 측면을 검토할 수 있는 환경이 필요합니다.'
      }
    }
  ],
  '제품 로드맵': [
    { 
      name: '존슨알렉스', 
      style: '전략적 사고자', 
      description: '시각적 및 텍스트 데이터를 결합합니다. 균형잡힌 의사결정 접근법입니다.',
      workingTips: {
        preparation: '시각적 자료와 텍스트 자료를 균형있게 준비해주세요.',
        communication: '다양한 관점을 종합하여 전략적으로 접근합니다.',
        collaboration: '장기적 비전과 단기적 실행력을 모두 고려합니다.',
        feedback: '전략적 관점에서의 건설적인 피드백을 추구합니다.',
        environment: '큰 그림과 세부사항을 모두 고려할 수 있는 체계적인 환경을 선호합니다.'
      }
    },
    { 
      name: '로페즈마리아', 
      style: '애자일 소통자', 
      description: '짧고 반복적인 토론. 빠른 피드백 루프입니다.',
      workingTips: {
        preparation: '간단하고 실행 가능한 아이템들로 구성해주세요.',
        communication: '짧은 주기로 빈번한 소통을 선호합니다.',
        collaboration: '유연하고 적응적인 협업 방식을 추구합니다.',
        feedback: '즉석에서 주고받는 빠른 피드백을 좋아합니다.',
        environment: '역동적이고 변화에 빠르게 대응할 수 있는 환경을 선호합니다.'
      }
    },
    { 
      name: '테일러크리스', 
      style: '포괄적 계획자', 
      description: '장기적 맥락을 가진 상세한 설명입니다.',
      workingTips: {
        preparation: '장기적 관점에서의 상세한 계획과 로드맵이 필요합니다.',
        communication: '전체적인 맥락과 장기적 영향을 고려하여 설명해주세요.',
        collaboration: '체계적이고 단계적인 접근 방식을 선호합니다.',
        feedback: '장기적 관점에서의 전략적 피드백을 추구합니다.',
        environment: '충분한 계획 수립 시간이 보장된 체계적인 환경을 좋아합니다.'
      }
    }
  ],
  '개인 프로젝트 논의': [
    { 
      name: '김민준', 
      style: '신중한 시각 학습자', 
      description: '차트와 그래프를 통해 정보를 분석하되, 충분한 검토 시간을 필요로 합니다.',
      workingTips: {
        preparation: '시각적 자료를 미리 제공하여 충분히 검토할 시간을 주세요.',
        communication: '차트나 그래프를 활용하되 설명 시간을 충분히 가져주세요.',
        collaboration: '신중하고 체계적인 분석을 통한 협업을 선호합니다.',
        feedback: '시각적 자료를 바탕으로 한 구체적인 피드백을 좋아합니다.',
        environment: '조용하고 집중할 수 있는 환경에서 자료를 꼼꼼히 검토합니다.'
      }
    },
    { 
      name: '이서연', 
      style: '효율적 의사결정자', 
      description: '시간과 효율성을 중시하며 핵심 요점으로 빠른 결정을 선호합니다.',
      workingTips: {
        preparation: '핵심 포인트와 결정사항만 명확히 정리해주세요.',
        communication: '요점 위주의 간결한 소통을 선호합니다.',
        collaboration: '명확한 목표 설정과 빠른 실행을 중시합니다.',
        feedback: '즉시 적용 가능한 실용적인 피드백을 선호합니다.',
        environment: '효율성이 극대화된 목표 지향적인 환경을 좋아합니다.'
      }
    }
  ],
  'AI 워크숍 준비': [
    {
      name: '박지원',
      style: '체험탐험가',
      description: '새로운 기술을 직접 체험하며 실험적 접근을 선호합니다.',
      workingTips: {
        preparation: '실습 환경과 체험할 수 있는 데모를 준비해주세요.',
        communication: '이론보다는 실제 사례와 체험 중심으로 설명해주세요.',
        collaboration: '프로토타입을 만들며 함께 실험하는 방식을 좋아합니다.',
        feedback: '실제 작동하는 결과물을 통한 피드백을 선호합니다.',
        environment: '자유롭게 시도해볼 수 있는 실험적인 환경을 선호합니다.'
      }
    },
    {
      name: '최민호',
      style: '세심한분석가',
      description: 'AI 기술의 원리와 구조를 깊이 있게 분석하고 이해하려 합니다.',
      workingTips: {
        preparation: '기술 문서와 구체적인 데이터를 미리 공유해주세요.',
        communication: '단계별로 논리적인 설명과 근거를 제시해주세요.',
        collaboration: '충분한 검토 시간을 갖고 신중하게 접근합니다.',
        feedback: '구체적인 근거와 함께 상세한 피드백을 제공합니다.',
        environment: '집중할 수 있는 조용한 환경에서 깊이 있는 토론을 선호합니다.'
      }
    },
    {
      name: '김유진',
      style: '즉석해결사',
      description: 'AI 도구를 활용한 빠른 문제해결과 실무 적용에 집중합니다.',
      workingTips: {
        preparation: '바로 사용할 수 있는 실용적인 도구와 템플릿을 준비해주세요.',
        communication: '결과 중심의 간결하고 명확한 소통을 선호합니다.',
        collaboration: '즉시 적용 가능한 솔루션 도출에 집중합니다.',
        feedback: '실행 가능한 구체적인 개선방안을 제시합니다.',
        environment: '효율성과 즉시성을 중시하는 실무 중심 환경을 좋아합니다.'
      }
    }
  ],
  '마케팅 전략 회의': [
    {
      name: '이지수',
      style: '하모니메이커',
      description: '팀원들의 다양한 아이디어를 조율하여 통합된 전략을 만들어냅니다.',
      workingTips: {
        preparation: '모든 참여자의 의견을 수렴할 수 있는 구조를 준비해주세요.',
        communication: '경청을 통해 서로 다른 관점을 이해하고 연결합니다.',
        collaboration: '갈등보다는 합의를 통한 협력적 의사결정을 추구합니다.',
        feedback: '건설적이고 포용적인 피드백으로 팀 분위기를 조화롭게 만듭니다.',
        environment: '모든 구성원이 편안하게 의견을 나눌 수 있는 분위기를 선호합니다.'
      }
    },
    {
      name: '강민수',
      style: '아이디어파이터',
      description: '창의적인 마케팅 아이디어를 시각적으로 표현하며 혁신을 추구합니다.',
      workingTips: {
        preparation: '아이디어를 시각화할 수 있는 도구와 자료를 준비해주세요.',
        communication: '마인드맵, 스케치 등을 활용한 시각적 소통을 선호합니다.',
        collaboration: '브레인스토밍과 창의적 발상을 통한 협업을 좋아합니다.',
        feedback: '혁신적이고 창의적인 관점에서의 피드백을 제공합니다.',
        environment: '자유로운 발상이 가능한 창의적이고 유연한 환경을 선호합니다.'
      }
    }
  ],
  'test': [
    {
      name: '홍길동',
      style: '차트마스터',
      description: '데이터와 차트를 통해 상황을 빠르게 파악하고 결정하는 분석형 리더입니다.',
      workingTips: {
        preparation: '핵심 데이터를 차트와 그래프로 준비해주세요.',
        communication: '수치와 시각 자료를 활용한 명확한 설명을 선호합니다.',
        collaboration: '데이터 기반의 객관적인 의사결정을 추구합니다.',
        feedback: '구체적인 수치와 근거를 바탕으로 한 피드백을 제공합니다.',
        environment: '정확한 정보와 체계적인 분석이 가능한 환경을 선호합니다.'
      }
    }
  ],
  '분기별 성과 검토': [
    {
      name: '정수빈',
      style: '신중한조언자',
      description: '성과 데이터를 종합적으로 분석하여 균형잡힌 조언을 제공합니다.',
      workingTips: {
        preparation: '모든 성과 지표와 관련 데이터를 충분히 검토할 시간을 확보해주세요.',
        communication: '다양한 관점을 종합하여 균형잡힌 의견을 제시합니다.',
        collaboration: '데이터 기반의 객관적이고 신중한 협업을 선호합니다.',
        feedback: '건설적이고 근거 있는 개선 방안을 제공합니다.',
        environment: '충분한 분석 시간이 보장되는 체계적인 환경을 선호합니다.'
      }
    },
    {
      name: '윤재혁',
      style: '차트마스터',
      description: '성과 지표를 시각적으로 분석하여 빠른 의사결정을 지원합니다.',
      workingTips: {
        preparation: '핵심 성과 지표를 차트와 대시보드로 준비해주세요.',
        communication: '데이터 시각화를 통한 명확한 현황 전달을 선호합니다.',
        collaboration: '수치 기반의 객관적인 성과 평가를 추구합니다.',
        feedback: '구체적인 지표와 목표 수치를 제시합니다.',
        environment: '데이터 분석 도구와 시각화 자료가 준비된 환경을 선호합니다.'
      }
    },
    {
      name: '장은미',
      style: '전략설계자',
      description: '분기 성과를 바탕으로 다음 분기 전략을 체계적으로 설계합니다.',
      workingTips: {
        preparation: '과거 성과 트렌드와 미래 계획을 연결할 수 있는 자료를 준비해주세요.',
        communication: '현재 성과와 미래 계획을 체계적으로 연결하여 설명합니다.',
        collaboration: '장기적 관점에서의 지속가능한 성장 전략을 추구합니다.',
        feedback: '전략적 관점에서의 개선 방향과 실행 계획을 제시합니다.',
        environment: '큰 그림을 그릴 수 있는 전략적 사고가 가능한 환경을 선호합니다.'
      }
    }
  ],
  '제품 로드맵 브레인스토밍': [
    {
      name: '김태욱',
      style: '아이디어파이터',
      description: '제품의 미래 비전을 창의적으로 제시하고 혁신적인 아이디어를 발굴합니다.',
      workingTips: {
        preparation: '아이디어를 자유롭게 표현할 수 있는 시각적 도구를 준비해주세요.',
        communication: '제약 없는 창의적 발상과 시각적 표현을 선호합니다.',
        collaboration: '브레인스토밍을 통한 자유로운 아이디어 교환을 추구합니다.',
        feedback: '창의성과 혁신성을 중시하는 긍정적 피드백을 선호합니다.',
        environment: '자유로운 발상이 가능한 창의적이고 개방적인 환경을 선호합니다.'
      }
    },
    {
      name: '이현진',
      style: '체험탐험가',
      description: '사용자 경험을 직접 체험하며 실용적인 제품 아이디어를 제안합니다.',
      workingTips: {
        preparation: '프로토타입이나 실제 사용 시나리오를 체험할 수 있는 환경을 준비해주세요.',
        communication: '실제 사용자 관점에서의 체험 중심 소통을 선호합니다.',
        collaboration: '사용자 여정을 함께 체험하며 아이디어를 발전시킵니다.',
        feedback: '실제 사용성과 체험을 바탕으로 한 현실적인 피드백을 제공합니다.',
        environment: '실제로 체험하고 테스트할 수 있는 실험적인 환경을 선호합니다.'
      }
    },
    {
      name: '박서준',
      style: '지속성장가',
      description: '제품의 지속적인 개선과 단계적 발전 방향을 제시합니다.',
      workingTips: {
        preparation: '기존 제품의 발전 과정과 사용자 피드백 데이터를 준비해주세요.',
        communication: '점진적 개선과 단계적 발전 계획을 체계적으로 설명합니다.',
        collaboration: '지속가능한 성장을 위한 점진적 개선을 추구합니다.',
        feedback: '실현 가능한 개선 방안과 단계적 실행 계획을 제시합니다.',
        environment: '안정적이고 체계적인 개선이 가능한 환경을 선호합니다.'
      }
    }
  ],
  '신규 기능 최종 결정': [
    {
      name: '조민석',
      style: '즉석해결사',
      description: '신규 기능의 핵심 요구사항을 파악하여 빠른 의사결정을 이끕니다.',
      workingTips: {
        preparation: '결정에 필요한 핵심 정보와 우선순위를 명확히 정리해주세요.',
        communication: '결론 중심의 간결하고 명확한 소통을 선호합니다.',
        collaboration: '신속한 의사결정과 즉시 실행을 중시합니다.',
        feedback: '실행 가능한 구체적인 결정사항과 다음 단계를 제시합니다.',
        environment: '빠른 판단과 결정이 가능한 효율적인 환경을 선호합니다.'
      }
    },
    {
      name: '한지영',
      style: '세심한분석가',
      description: '신규 기능의 영향도와 리스크를 면밀히 분석하여 신중한 결정을 지원합니다.',
      workingTips: {
        preparation: '기능별 상세 분석 자료와 리스크 평가 데이터를 준비해주세요.',
        communication: '근거와 분석 결과를 바탕으로 한 논리적 설명을 선호합니다.',
        collaboration: '충분한 검토와 신중한 분석을 통한 의사결정을 추구합니다.',
        feedback: '세밀한 검토 결과와 구체적인 근거를 제시합니다.',
        environment: '집중적인 분석과 검토가 가능한 체계적인 환경을 선호합니다.'
      }
    },
    {
      name: '임다은',
      style: '하모니메이커',
      description: '다양한 이해관계자들의 의견을 조율하여 합의된 결정을 이끌어냅니다.',
      workingTips: {
        preparation: '모든 이해관계자의 의견과 우려사항을 사전에 파악해주세요.',
        communication: '서로 다른 관점을 이해하고 연결하는 조율형 소통을 선호합니다.',
        collaboration: '갈등보다는 상호 이해와 합의를 통한 의사결정을 추구합니다.',
        feedback: '모든 관점을 고려한 균형잡힌 의견과 타협안을 제시합니다.',
        environment: '개방적이고 수평적인 소통이 가능한 협력적 환경을 선호합니다.'
      }
    }
  ],
  'Q1 프로젝트 킥오프': [
    {
      name: '오승현',
      style: '스피드비저너리',
      description: '프로젝트의 전체적인 방향성을 빠르게 제시하고 팀을 이끕니다.',
      workingTips: {
        preparation: '프로젝트 전체 그림과 핵심 목표를 시각적으로 준비해주세요.',
        communication: '명확한 비전과 방향성을 간결하게 제시하는 소통을 선호합니다.',
        collaboration: '빠른 의사결정과 확실한 방향 설정을 통한 리더십을 발휘합니다.',
        feedback: '명확한 목표 설정과 추진 방향을 제시합니다.',
        environment: '역동적이고 추진력 있는 프로젝트 시작 환경을 선호합니다.'
      }
    },
    {
      name: '신예린',
      style: '토론마스터',
      description: '프로젝트 계획에 대한 다양한 의견을 수렴하고 최적화된 방안을 도출합니다.',
      workingTips: {
        preparation: '프로젝트 계획의 다양한 관점과 검토 포인트를 준비해주세요.',
        communication: '구조화된 토론과 체계적인 의견 수렴을 선호합니다.',
        collaboration: '모든 팀원의 의견을 활발히 교환하여 최적안을 도출합니다.',
        feedback: '논리적 근거와 함께 개선된 계획안을 제시합니다.',
        environment: '활발한 토론과 의견 교환이 가능한 참여형 환경을 선호합니다.'
      }
    },
    {
      name: '권도현',
      style: '액션히어로',
      description: '프로젝트 실행 계획을 구체화하고 즉시 실행할 수 있는 방안을 제시합니다.',
      workingTips: {
        preparation: '구체적인 실행 계획과 실무 템플릿을 준비해주세요.',
        communication: '실행 중심의 구체적이고 실용적인 소통을 선호합니다.',
        collaboration: '즉시 실행할 수 있는 구체적인 업무 분담과 일정을 추구합니다.',
        feedback: '바로 적용 가능한 실행 방안과 개선 계획을 제시합니다.',
        environment: '실행력과 추진력이 강조되는 행동 중심 환경을 선호합니다.'
      }
    }
  ],
  '개인 프로젝트 검토': [
    {
      name: '송유진',
      style: '세심한분석가',
      description: '개인 프로젝트의 세부사항을 꼼꼼히 검토하고 개선점을 찾아냅니다.',
      workingTips: {
        preparation: '프로젝트의 상세 자료와 진행 과정을 체계적으로 준비해주세요.',
        communication: '단계별 검토 결과와 구체적인 분석 내용을 선호합니다.',
        collaboration: '신중하고 체계적인 검토를 통한 질 높은 피드백을 제공합니다.',
        feedback: '세밀한 관찰과 분석을 바탕으로 한 구체적인 개선방안을 제시합니다.',
        environment: '집중적인 검토와 분석이 가능한 조용하고 체계적인 환경을 선호합니다.'
      }
    },
    {
      name: '배성민',
      style: '지속성장가',
      description: '개인 프로젝트의 지속적인 발전 방향과 성장 계획을 제시합니다.',
      workingTips: {
        preparation: '프로젝트의 현재 상황과 향후 발전 가능성을 분석할 자료를 준비해주세요.',
        communication: '점진적 개선과 단계적 성장 계획을 체계적으로 설명합니다.',
        collaboration: '지속가능한 개발과 꾸준한 성장을 위한 장기적 관점을 추구합니다.',
        feedback: '실현 가능한 성장 방안과 지속적인 개선 계획을 제시합니다.',
        environment: '안정적이고 지속적인 성장이 가능한 학습 중심 환경을 선호합니다.'
      }
    }
  ]
};

export default function RoomDetail() {
  const [location, setLocation] = useLocation();

  // 안전한 URL 디코딩 처리
  const getRoomName = () => {
    try {
      const urlPart = location.split('/room/')[1] || '';
      return decodeURIComponent(urlPart);
    } catch (error) {
      console.error('URL 디코딩 오류:', error);
      return location.split('/room/')[1] || '';
    }
  };

  const roomName = getRoomName();
  const [participants, setParticipants] = useState<Participant[]>(() => mockParticipants[roomName] || []);
  const [completedFeedbacks, setCompletedFeedbacks] = useState<string[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [previousParticipants, setPreviousParticipants] = useState<PreviousParticipant[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [expandedProfiles, setExpandedProfiles] = useState<Set<string>>(new Set());
  const [newParticipantEmail, setNewParticipantEmail] = useState('');
  const [newParticipantName, setNewParticipantName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [meetingType, setMeetingType] = useState<'presentation' | 'collaboration' | 'brainstorming' | 'decision' | 'review' | 'kickoff'>('collaboration');

  // 검색 기능
  const [searchQuery, setSearchQuery] = useState('');
  
  // 방 이름 편집 관련 상태
  const [isEditingRoomName, setIsEditingRoomName] = useState(false);
  const [editRoomNameValue, setEditRoomNameValue] = useState(roomName);

  // 회의 플랫폼 링크 상태
  const [meetingLinks, setMeetingLinks] = useState({
    zoomLink: "",
    teamsLink: "",
    scheduledAt: undefined as Date | undefined
  });

  const currentUser = useMemo(() => getUser(), []);
  const userProfile = useMemo(() => getUserProfile(), []);
  const shareProfile = useMemo(() => getShareProfile(), []);

  // 미팅 분석 결과 계산
  const meetingAdvice = participants.length > 0 ? analyzeMeetingStyles(participants, meetingType) : null;

  // 팀 설문 취합 결과 계산 (참가자 변경 시 자동 업데이트)
  const [surveyData, setSurveyData] = useState<SurveyAggregation | null>(null);

  // 아이스브레이킹 추천 계산
  const [icebreakingTips, setIcebreakingTips] = useState<IcebreakingRecommendation | null>(null);

  useEffect(() => {
    // 참가자 수가 변경될 때마다 팀 설문 데이터 재계산
    if (participants.length > 0) {
      // 실제 참가자 수를 기반으로 설문 데이터 생성
      const aggregatedData = aggregateSurveyData(participants.length);
      setSurveyData(aggregatedData);

      // 아이스브레이킹 추천 계산
      const icebreaking = getIcebreakingForMeeting(participants.length, aggregatedData);
      setIcebreakingTips(icebreaking);
    } else {
      setSurveyData(null);
      setIcebreakingTips(null);
    }
  }, [participants.length]);

  const handleSaveMeetingLinks = (zoomLink: string, teamsLink: string, scheduledAt?: Date) => {
    setMeetingLinks({ zoomLink, teamsLink, scheduledAt });
    // TODO: 서버에 저장하는 로직 추가
  };

  const handleSaveRoomSettings = async () => {
    try {
      // 현재 방의 모든 변경사항을 저장
      const roomData = {
        name: roomName,
        type: meetingType,
        participants: participants,
        meetingLinks: meetingLinks
      };

      // TODO: 실제 API 호출로 변경
      // await saveRoomSettings(roomData);
      
      console.log('방 설정 저장:', roomData);
      alert('방 설정이 저장되었습니다!');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 방 이름 편집 관련 함수들
  const handleStartEditingRoomName = () => {
    setIsEditingRoomName(true);
    setEditRoomNameValue(roomName);
  };

  const handleSaveRoomName = () => {
    if (editRoomNameValue.trim() && editRoomNameValue.trim() !== roomName) {
      // TODO: 서버에 방 이름 업데이트 API 호출
      console.log('방 이름 업데이트:', editRoomNameValue.trim());
      
      // 새로운 URL로 리다이렉트
      setLocation(`/room/${encodeURIComponent(editRoomNameValue.trim())}`);
      
      alert('방 이름이 변경되었습니다!');
    }
    setIsEditingRoomName(false);
  };

  const handleCancelEditingRoomName = () => {
    setIsEditingRoomName(false);
    setEditRoomNameValue(roomName);
  };

  // 이전 참가자 필터링
  const filteredPreviousParticipants = previousParticipants.filter(participant => 
    participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 등록된 사용자 검색
  const searchRegisteredUsers = async (query: string) => {
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const users = await response.json();
        setRegisteredUsers(users);
      } else {
        console.error('사용자 검색 실패');
        setRegisteredUsers([]);
      }
    } catch (error) {
      console.error('사용자 검색 오류:', error);
      setRegisteredUsers([]);
    }
  };

  // 프로필 확장/축소 토글
  const toggleProfileExpansion = (participantName: string) => {
    const newExpanded = new Set(expandedProfiles);
    if (newExpanded.has(participantName)) {
      newExpanded.delete(participantName);
    } else {
      newExpanded.add(participantName);
    }
    setExpandedProfiles(newExpanded);
  };

  useEffect(() => {
    // 현재 미팅에서 완료된 피드백 목록 확인
    const feedbacks = getMeetingFeedbacks();
    const currentUserName = currentUser?.name || '사용자';

    const completed = feedbacks
      .filter(feedback => 
        feedback.meetingName === roomName && 
        (feedback.fromUser === currentUserName || feedback.fromUser === '익명')
      )
      .map(feedback => feedback.targetUser);

    setCompletedFeedbacks(completed);

    // 이전 참가자 목록 불러오기
    setPreviousParticipants(getPreviousParticipants());

    // 등록된 사용자 목록 초기 로드 (최근 로그인한 사용자들)
    searchRegisteredUsers('');

    // 온라인 사용자 목록은 초대 모달에서만 로드
  }, [roomName, currentUser?.name]);



  const handleViewCard = (participantName: string) => {
    setLocation(`/participant/${encodeURIComponent(participantName)}?room=${encodeURIComponent(roomName)}`);
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/room/${encodeURIComponent(roomName)}`;
    navigator.clipboard.writeText(inviteLink);
    alert('초대 링크가 복사되었습니다!');
  };

  const handleSendEmail = () => {
    const inviteLink = `${window.location.origin}/room/${encodeURIComponent(roomName)}`;
    const subject = encodeURIComponent(`[Catch-Up Meeting MBTI] "${roomName}" 미팅에 초대합니다`);
    const body = encodeURIComponent(`안녕하세요!

"${roomName}" 미팅에 초대합니다.

미팅 전에 팀원들의 소통 스타일을 확인하고, 더 원활한 커뮤니케이션을 위해 준비해보세요.

📋 미팅 참여하기: ${inviteLink}

미팅 보드에서는 다음을 할 수 있습니다:
• 참가자들의 소통 스타일 확인
• 미팅 후 서로 피드백 주고받기
• 더 나은 협업을 위한 팁 받기

감사합니다!

---
Catch-Up Meeting MBTI로 더 스마트한 미팅을 준비하세요.`);

    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const toggleParticipantSelection = (email: string) => {
    setSelectedParticipants(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleSendInviteEmail = (participantEmail: string, participantName: string) => {
    const inviteLink = `${window.location.origin}/room/${encodeURIComponent(roomName)}`;
    const subject = encodeURIComponent(`[Catch-Up Meeting MBTI] "${roomName}" 미팅에 초대합니다`);
    const body = encodeURIComponent(`안녕하세요 ${participantName}님,

"${roomName}" 미팅에 초대합니다.

미팅 전에 팀원들의 소통 스타일을 확인하고, 더 원활한 커뮤니케이션을 위해 준비해보세요.

📋 미팅 참여하기: ${inviteLink}

미팅 보드에서는 다음을 할 수 있습니다:
• 참가자들의 소통 스타일 확인
• 미팅 후 서로 피드백 주고받기
• 더 나은 협업을 위한 팁 받기

감사합니다!

---
Catch-Up Meeting MBTI로 더 스마트한 미팅을 준비하세요.`);

    // 새 참여자를 목록에 추가 (기본 프로필로)
    const newParticipant: Participant = {
      name: participantName,
      style: '새로운 참여자',
      description: '아직 성향 분석을 받지 않았습니다. 미팅 전에 진단을 받으시면 더 나은 협업이 가능합니다.'
    };

    setParticipants(prev => {
      // 중복 확인
      if (prev.some(p => p.name === participantName)) {
        return prev;
      }
      return [...prev, newParticipant];
    });

    window.open(`mailto:${participantEmail}?subject=${subject}&body=${body}`);
  };

  const handleSendSMS = (phoneNumber: string | undefined, participantName: string) => {
    const inviteLink = `${window.location.origin}/room/${encodeURIComponent(roomName)}`;
    const smsText = `안녕하세요 ${participantName}님! "${roomName}" 미팅에 초대합니다.\n\n미팅 참여: ${inviteLink}\n\n팀원들의 소통 MBTI를 확인하고 더 나은 미팅을 준비해보세요!`;

    if (phoneNumber) {
      const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(smsText)}`;
      window.open(smsUrl, '_blank');
    } else {
      const userPhone = prompt(`${participantName}님의 전화번호를 입력하세요:`);
      if (userPhone && userPhone.trim()) {
        const smsUrl = `sms:${userPhone.trim()}?body=${encodeURIComponent(smsText)}`;
        window.open(smsUrl, '_blank');
      }
    }
  };

  const handleSendInvitesToSelected = () => {
    selectedParticipants.forEach(email => {
      // 먼저 등록된 사용자에서 찾기
      const user = registeredUsers.find(u => u.email === email);
      if (user) {
        handleSendInviteEmail(user.email, user.name);
      } else {
        // 이전 참가자에서 찾기
        const participant = previousParticipants.find(p => p.email === email);
        if (participant) {
          handleSendInviteEmail(participant.email, participant.name);
        }
      }
    });

    if (selectedParticipants.length > 0) {
      alert(`${selectedParticipants.length}명에게 초대를 보냈습니다!`);
      setSelectedParticipants([]);
    }
  };

  const handleRemoveParticipant = (participantName: string) => {
    if (confirm(`${participantName}님을 미팅에서 제거하시겠습니까?`)) {
      setParticipants(prev => prev.filter(p => p.name !== participantName));

      // 완료된 피드백 목록에서도 제거
      setCompletedFeedbacks(prev => prev.filter(name => name !== participantName));

      // 실제 앱에서는 서버에도 업데이트 요청을 보내야 합니다
      // TODO: 서버 API 호출 추가
      console.log(`${participantName}님이 미팅에서 제거되었습니다.`);
    }
  };

  // 미팅 유형에 따른 추가 정보 제공 함수
  const getMeetingSpecificInsights = () => {
    switch (meetingType) {
      case 'presentation':
        return [
          "시각 자료를 활용하여 핵심 내용을 명확하게 전달하세요.",
          "청중의 참여를 유도하는 질문과 답변 시간을 가지세요.",
          "발표 후 피드백을 수집하여 개선점을 파악하세요."
        ];
      case 'collaboration':
        return [
          "참가자들의 아이디어를 적극적으로 수렴하고 존중하세요.",
          "명확한 목표와 역할 분담을 통해 협업 효율성을 높이세요.",
          "정기적인 진행 상황 공유 및 피드백을 통해 팀워크를 강화하세요."
        ];
      case 'brainstorming':
        return [
          "자유로운 분위기에서 다양한 아이디어를 발산하도록 유도하세요.",
          "비판적인 시각을 자제하고 아이디어의 양을 늘리는 데 집중하세요.",
          "아이디어들을 체계적으로 정리하고 평가하여 실행 가능한 아이디어를 선정하세요."
        ];
      case 'decision':
        return [
          "객관적인 데이터와 정보를 바탕으로 의사결정을 진행하세요.",
          "참가자들의 의견을 충분히 수렴하고 합리적인 절차를 따르세요.",
          "결정된 사항을 명확하게 전달하고 실행 계획을 수립하세요."
        ];
      case 'review':
        return [
          "객관적인 기준을 바탕으로 성과를 평가하고 개선점을 도출하세요.",
          "긍정적인 피드백과 건설적인 비판을 통해 동기 부여를 높이세요.",
          "피드백 결과를 바탕으로 향후 개선 계획을 수립하세요."
        ];
      case 'kickoff':
        return [
          "프로젝트 목표, 역할, 책임, 기대 결과 등을 명확히 정의하세요.",
          "팀원 간의 긍정적 관계 형성을 통해 협력적인 분위기를 조성하세요.",
          "프로젝트 진행 일정 및 의사소통 계획을 공유하세요."
        ];
      default:
        return [];
    }
  };

  // 미팅 유형에 따른 요약 정보 제공 함수
  const getMeetingSpecificSummary = () => {
    switch (meetingType) {
      case 'presentation':
        return "발표 목표를 명확히 설정하고, 청중의 수준에 맞는 시각 자료를 준비하세요. 발표 연습을 충분히 하여 자신감을 높이고, 예상 질문에 대한 답변을 미리 준비하세요.";
      case 'collaboration':
        return "참가자들의 다양한 의견을 존중하고, 건설적인 토론을 통해 합의점을 도출하세요. 모든 참가자가 적극적으로 참여할 수 있도록 독려하고, 진행 상황을 명확하게 공유하세요.";
      case 'brainstorming':
        return "자유로운 분위기에서 아이디어를 발산하도록 유도하고, 비판적인 시각을 자제하세요. 모든 아이디어를 기록하고, 실행 가능성과 효과성을 기준으로 평가하세요.";
      case 'decision':
        return "객관적인 데이터와 정보를 바탕으로 의사결정을 진행하고, 모든 참가자의 의견을 경청하세요. 결정된 사항을 명확하게 전달하고, 실행 계획을 수립하여 책임을 분담하세요.";
      case 'review':
        return "객관적인 기준을 바탕으로 성과를 평가하고, 긍정적인 피드백과 건설적인 비판을 제공하세요. 향후 개선 계획을 수립하고, 지속적인 성장을 위한 동기 부여를 제공하세요.";
      case 'kickoff':
        return "프로젝트 목표, 역할, 책임, 기대 결과 등을 명확히 정의하고, 팀원 간의 긍정적 관계 형성을 통해 협력적인 분위기를 조성하세요. 프로젝트 진행 일정 및 의사소통 계획을 공유하세요.";
      default:
        return "성공적인 미팅을 위해 목표를 명확히 하고, 참가자들의 적극적인 참여를 유도하세요. 다양한 의견을 수렴하고, 건설적인 토론을 통해 합의점을 도출하세요.";
    }
  };

  const getMeetingTypeTitle = () => {
    switch (meetingType) {
      case 'presentation': return "발표 미팅";
      case 'collaboration': return "협업 미팅";
      case 'brainstorming': return "아이디어 회의";
      case 'decision': return "의사결정 미팅";
      case 'review': return "검토 미팅";
      case 'kickoff': return "킥오프 미팅";
      default: return "일반 미팅";
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 bg-muted/20">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/rooms')}
            className="text-muted-foreground hover:text-foreground animate-smooth mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            보드로 돌아가기
          </Button>
          <div className="mb-4">
            <div>
              {isEditingRoomName ? (
                <div className="flex items-center gap-3 mb-2">
                  <Input
                    value={editRoomNameValue}
                    onChange={(e) => setEditRoomNameValue(e.target.value)}
                    className="text-3xl font-bold border-2 border-primary focus:border-primary/70 rounded-lg px-4 py-3"
                    placeholder="방 이름을 입력하세요"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveRoomName();
                      } else if (e.key === 'Escape') {
                        handleCancelEditingRoomName();
                      }
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveRoomName}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2"
                      disabled={!editRoomNameValue.trim()}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      저장
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEditingRoomName}
                      className="px-3 py-2"
                    >
                      <X className="w-4 h-4 mr-1" />
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-2 group">
                  <h2 className="text-display text-4xl font-bold text-foreground">
                    {roomName}
                  </h2>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleStartEditingRoomName}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground p-2"
                    title="방 이름 편집"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <p className="text-body text-muted-foreground">참가자들의 소통 스타일을 확인하여 더 나은 미팅을 준비하세요</p>
            </div>

          </div>
        </div>

        {/* 미팅 성격 선택 섹션 - 상단 배치 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 rounded-xl border-2 border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <span className="text-lg font-semibold text-blue-800">미팅 성격:</span>
            </div>
            <select
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value as any)}
              className="px-4 py-3 border-2 border-blue-300 rounded-lg text-base bg-white hover:border-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-200 focus:border-blue-500 font-semibold text-blue-900 min-w-[160px]"
            >
              <option value="presentation">프로젝트 발표</option>
              <option value="collaboration">협업 회의</option>
              <option value="brainstorming">아이디어 회의</option>
              <option value="decision">의사결정 회의</option>
              <option value="review">검토/피드백</option>
              <option value="kickoff">킥오프 미팅</option>
            </select>
            <span className="text-sm text-blue-600 bg-blue-100 px-3 py-2 rounded-full font-medium">
              맞춤 조언
            </span>
          </div>
        </div>

        {/* 미팅 준비 인사이트 섹션 */}
        {surveyData && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              미팅 준비 인사이트
            </h3>

            <Card className="shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {getMeetingSpecificInsights().map((insight, index) => (
                    <div key={index} className="p-3 bg-white bg-opacity-70 rounded-lg border border-green-200">
                      <p className="text-sm text-slate-700">{insight}</p>
                    </div>
                  ))}
                </div>

                {/* 팀 성향 요약 */}
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-2">
                    {getMeetingTypeTitle()} 준비 포인트
                  </h5>
                  <p className="text-sm text-green-700">
                    {getMeetingSpecificSummary()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 참가자 미팅 성향 취합결과 섹션 */}
        {surveyData && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              참가자 미팅 성향 취합결과
              <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {surveyData.totalResponses}명 참여
              </span>
            </h3>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* 팀 프로필 */}
              <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-semibold text-slate-800">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    팀 프로필
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 정보 선호도 */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">정보 선호도</span>
                      </div>
                      <div className="flex bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 rounded-l-full h-2"
                          style={{ width: `${(surveyData.questionBreakdown.q1.visual / surveyData.totalResponses) * 100}%` }}
                        />
                        <div 
                          className="bg-green-500 rounded-r-full h-2"
                          style={{ width: `${(surveyData.questionBreakdown.q1.text / surveyData.totalResponses) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-600 mt-1">
                        <span>시각적 {surveyData.questionBreakdown.q1.visual}명</span>
                        <span>텍스트 {surveyData.questionBreakdown.q1.text}명</span>
                      </div>
                    </div>

                    {/* 의사결정 속도 */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">의사결정 속도</span>
                      </div>
                      <div className="flex bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 rounded-l-full h-2"
                          style={{ width: `${(surveyData.questionBreakdown.q2.quick / surveyData.totalResponses) * 100}%` }}
                        />
                        <div 
                          className="bg-yellow-500 rounded-r-full h-2"
                          style={{ width: `${(surveyData.questionBreakdown.q2.detailed / surveyData.totalResponses) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-600 mt-1">
                        <span>빠른 결정 {surveyData.questionBreakdown.q2.quick}명</span>
                        <span>신중한 검토 {surveyData.questionBreakdown.q2.detailed}명</span>
                      </div>
                    </div>

                    {/* 소통 방식 */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">소통 방식</span>
                      </div>
                      <div className="flex bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 rounded-l-full h-2"
                          style={{ width: `${(surveyData.questionBreakdown.q3.short / surveyData.totalResponses) * 100}%` }}
                        />
                        <div 
                          className="bg-orange-500 rounded-r-full h-2"
                          style={{ width: `${(surveyData.questionBreakdown.q3.detailed / surveyData.totalResponses) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-600 mt-1">
                        <span>간결한 요약 {surveyData.questionBreakdown.q3.short}명</span>
                        <span>상세한 설명 {surveyData.questionBreakdown.q3.detailed}명</span>
                      </div>
                    </div>

                    {/* 그룹 vs 개별 활동 */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">그룹 vs 개별 활동</span>
                      </div>
                      <div className="flex bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 rounded-l-full h-2"
                          style={{ width: `${(surveyData.questionBreakdown.q4.group / surveyData.totalResponses) * 100}%` }}
                        />
                        <div 
                          className="bg-yellow-500 rounded-r-full h-2"
                          style={{ width: `${(surveyData.questionBreakdown.q4.individual / surveyData.totalResponses) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-600 mt-1">
                        <span>그룹 {surveyData.questionBreakdown.q4.group}명</span>
                        <span>개별 {surveyData.questionBreakdown.q4.individual}명</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* 미팅 효율성 조언 섹션 */}
        {meetingAdvice && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center mb-6">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              이 미팅의 효율성을 높이는 방법
            </h3>
            <Card className="shadow-lg border-l-4 border-l-primary">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-800 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {meetingAdvice.title}
                </CardTitle>
                <p className="text-slate-600 text-sm">{meetingAdvice.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2 text-green-600" />
                      권장사항
                    </h4>
                    <ul className="space-y-2">
                      {meetingAdvice.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
                      주의사항
                    </h4>
                    <ul className="space-y-2">
                      {meetingAdvice.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}



        {/* 내 프로필 카드 섹션 */}
        {currentUser && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">내 프로필</h3>
            {userProfile && shareProfile ? (
              <Card className="elevation-sm hover:elevation-md animate-smooth border-primary border-2 rounded-xl">
                <CardContent className="p-6">


                  <div className="flex items-center mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={localStorage.getItem('userAvatar') || ''} alt="내 프로필" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-lg">
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="ml-4">
                      <h4 className="font-semibold text-foreground">{currentUser.name} (나)</h4>
                      <p className="text-sm text-primary font-medium">{userProfile.style}</p>
                    </div>
                  </div>
                  <p className="text-body text-muted-foreground text-sm mb-4">{userProfile.tips}</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                      프로필 공유됨
                    </span>
                    <Button
                      onClick={() => setLocation('/survey')}
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-white text-xs px-3 py-1 h-7 rounded-lg"
                    >
                      새로 설문하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-dashed border-2 border-slate-300">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h4 className="font-semibold text-slate-600 mb-2">
                      {userProfile ? '프로필이 비공개 상태입니다' : '아직 소통 스타일 진단을 받지 않았습니다'}
                    </h4>
                    <p className="text-sm text-slate-500 mb-4">
                      {userProfile 
                        ? '프로필 설정에서 공유를 활성화하거나 새로운 진단을 받아보세요'
                        : '3분만 투자하여 당신의 소통 스타일을 알아보세요'
                      }
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={() => setLocation('/survey')}
                      className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white py-2 font-medium hover:shadow-lg transition-all duration-200"
                    >
                      {userProfile ? '진단 다시 받기' : '설문하러 가기'}
                    </Button>
                    {userProfile && (
                      <Button 
                        onClick={() => setLocation('/profile')}
                        variant="outline"
                        className="flex-1 border-primary text-primary hover:bg-primary hover:text-white py-2 font-medium transition-all duration-200"
                      >
                        프로필 설정
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* 아이스브레이킹 팁 섹션 */}
        {icebreakingTips && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <Coffee className="w-5 h-5 mr-2 text-orange-600" />
              아이스브레이킹 추천
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {icebreakingTips.teamStyle}에 맞춘 미팅 시작 활동을 제안합니다
            </p>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* 주요 추천 활동 */}
              <Card className="lg:col-span-2 shadow-lg bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-semibold text-slate-800">
                    <Zap className="w-5 h-5 mr-2 text-orange-600" />
                    추천: {icebreakingTips.primaryTip.title}
                  </CardTitle>
                  <p className="text-sm text-slate-600">{icebreakingTips.primaryTip.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">활동 목록</span>
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {icebreakingTips.primaryTip.timeEstimate}
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {icebreakingTips.primaryTip.activities.map((activity, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      icebreakingTips.primaryTip.difficulty === 'easy' 
                        ? 'bg-green-100 text-green-700' 
                        : icebreakingTips.primaryTip.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {icebreakingTips.primaryTip.difficulty === 'easy' ? '쉬움' : 
                       icebreakingTips.primaryTip.difficulty === 'medium' ? '보통' : '어려움'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* 일반적인 조언 */}
              <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="tips">
                      <AccordionTrigger className="flex items-center text-lg font-semibold text-slate-800 hover:no-underline">
                        <div className="flex items-center">
                          <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
                          진행 팁
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 mt-4">
                          {icebreakingTips.generalAdvice.map((advice, index) => (
                            <li key={index} className="text-sm text-slate-600 flex items-start">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              {advice}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* 대안 활동들 */}
            {icebreakingTips.alternativeTips.length > 0 && (
              <div className="mt-6">
                <Card className="shadow-md border-slate-200">
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="alternatives">
                        <AccordionTrigger className="font-semibold text-slate-800 hover:no-underline">
                          다른 옵션들
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            {icebreakingTips.alternativeTips.slice(0, 2).map((tip, index) => (
                              <Card key={index} className="shadow-md border-slate-200 hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                  Adding avatar functionality to the profile section and room detail page.                                  <CardTitle className="text-base font-semibold text-slate-800 flex items-center justify-between">
                                    {tip.title}
                                    <span className="text-xs text-slate-500 flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {tip.timeEstimate}
                                    </span>
                                  </CardTitle>
                                  <p className="text-xs text-slate-600">{tip.description}</p>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <ul className="space-y-1">
                                    {tip.activities.slice(0, 2).map((activity, actIndex) => (
                                      <li key={actIndex} className="text-xs text-slate-600 flex items-start">
                                        <span className="w-1 h-1 bg-slate-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                        {activity}
                                      </li>
                                    ))}
                                    {tip.activities.length > 2 && (
                                      <li className="text-xs text-slate-400 italic">
                                        +{tip.activities.length - 2}개 더
                                      </li>
                                    )}
                                  </ul>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}



        {/* 참가자 섹션 - 개선된 UI */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-indigo-50/80 to-white overflow-hidden mb-8">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-bold">팀 멤버</div>
                  <div className="text-indigo-100 text-sm font-medium">
                    {participants.length > 0 ? `${participants.length}명이 참여 중` : '팀원을 초대해보세요'}
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setShowInviteModal(true)}
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                초대
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {participants.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">함께할 팀원들을 초대하세요</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                  소통 스타일을 미리 파악하여 더 효과적인 미팅을 진행할 수 있습니다
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => setShowInviteModal(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white hover:from-indigo-700 hover:to-purple-800 shadow-lg px-6 py-3"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    팀원 초대하기
                  </Button>
                  <Button
                    onClick={handleCopyInviteLink}
                    variant="outline"
                    className="border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 px-6 py-3"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    초대 링크 복사
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {participants.map((participant, index) => {
                    const isFeedbackCompleted = completedFeedbacks.includes(participant.name);

                    return (
                      <div key={index} className="group relative">
                        <Card className={`h-full transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border-2 ${
                          isFeedbackCompleted 
                            ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50' 
                            : 'border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-indigo-300'
                        }`}>
                          <CardContent className="p-6 relative">
                            {/* 상태 배지 */}
                            {isFeedbackCompleted && (
                              <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                완료
                              </div>
                            )}

                            {/* 프로필 섹션 */}
                            <div className="flex items-center mb-4">
                              <div className="relative">
                                <Avatar className="w-16 h-16">
                                  <AvatarImage src="" alt={participant.name} />
                                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl">
                                    {participant.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                {/* 온라인 상태 */}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></div>
                              </div>
                              <div className="ml-4 flex-1">
                                <h3 className="font-bold text-slate-800 text-lg">{participant.name}</h3>
                                <div className="flex items-center mt-1">
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                                  <span className="text-indigo-700 text-sm font-medium">참여 중</span>
                                </div>
                              </div>
                            </div>

                            {/* 소통 스타일 */}
                            <div className="mb-4">
                              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-lg border border-indigo-200">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wide">소통 스타일</span>
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                </div>
                                <p className="text-sm font-semibold text-indigo-700">{participant.style}</p>
                              </div>
                            </div>

                            {/* 설명 */}
                            <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                              {participant.description}
                            </p>

                            {/* 액션 버튼들 */}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleProfileExpansion(participant.name)}
                                className="flex-1 text-xs bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700"
                              >
                                <User className="w-4 h-4 mr-1" />
                                프로필
                                {expandedProfiles.has(participant.name) ? (
                                  <ChevronUp className="w-3 h-3 ml-1" />
                                ) : (
                                  <ChevronDown className="w-3 h-3 ml-1" />
                                )}
                              </Button>
                              {currentUser && !isFeedbackCompleted && (
                                <Button
                                  size="sm"
                                  onClick={() => setLocation(`/feedback?meeting=${encodeURIComponent(roomName)}&participant=${encodeURIComponent(participant.name)}`)}
                                  className="flex-1 text-xs bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md"
                                >
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  피드백
                                </Button>
                              )}
                              {/* 제거 버튼 - 방장 권한 확인 후 표시 */}
                              {currentUser && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="px-2 hover:bg-slate-100"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem
                                      onClick={() => handleRemoveParticipant(participant.name)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      미팅에서 제거
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>

                            {/* Tips for Working with Me - 확장 가능한 섹션 */}
                            {expandedProfiles.has(participant.name) && (
                              <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 animate-in slide-in-from-top-2 duration-300">
                                <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                                  <Lightbulb className="w-4 h-4 mr-2" />
                                  Tips for Working with Me
                                </h4>
                                
                                <div className="space-y-3 text-sm text-slate-700">
                                  {/* 회의 준비법 */}
                                  <div>
                                    <span className="font-medium text-blue-700">🎯 회의 준비법:</span>
                                    <p className="ml-4 text-slate-600 leading-relaxed">
                                      {participant.workingTips?.preparation || 
                                       "자료를 미리 공유해주시면 더 깊이 있는 논의가 가능합니다."}
                                    </p>
                                  </div>

                                  {/* 소통 방식 */}
                                  <div>
                                    <span className="font-medium text-blue-700">💬 선호하는 소통 방식:</span>
                                    <p className="ml-4 text-slate-600 leading-relaxed">
                                      {participant.workingTips?.communication || 
                                       "직접적이고 명확한 의견 교환을 선호합니다."}
                                    </p>
                                  </div>

                                  {/* 협업 스타일 */}
                                  <div>
                                    <span className="font-medium text-blue-700">🤝 협업 스타일:</span>
                                    <p className="ml-4 text-slate-600 leading-relaxed">
                                      {participant.workingTips?.collaboration || 
                                       "팀워크를 중시하며 모든 구성원의 의견을 존중합니다."}
                                    </p>
                                  </div>

                                  {/* 피드백 스타일 */}
                                  <div>
                                    <span className="font-medium text-blue-700">📝 피드백 선호도:</span>
                                    <p className="ml-4 text-slate-600 leading-relaxed">
                                      {participant.workingTips?.feedback || 
                                       "건설적인 피드백을 주고받으며 지속적인 개선을 추구합니다."}
                                    </p>
                                  </div>

                                  {/* 최적 환경 */}
                                  <div>
                                    <span className="font-medium text-blue-700">🌟 최적 환경:</span>
                                    <p className="ml-4 text-slate-600 leading-relaxed">
                                      {participant.workingTips?.environment || 
                                       "차분하고 집중할 수 있는 환경에서 최고의 성과를 보입니다."}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 호버 효과 */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>

                {/* 추가 초대 버튼 */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <Button 
                    onClick={() => setShowInviteModal(true)}
                    variant="outline"
                    className="w-full border-dashed border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 py-6 rounded-xl transition-all duration-200 hover:border-indigo-400 group"
                  >
                    <div className="flex items-center justify-center">
                      <div className="p-2 bg-indigo-100 group-hover:bg-indigo-200 rounded-lg mr-3 transition-colors">
                        <Plus className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">더 많은 팀원 초대</div>
                        <div className="text-sm text-indigo-500">협업 효과를 극대화하세요</div>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 미팅 완료 후 피드백 섹션 */}
        <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
              미팅이 끝났나요?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              미팅 참가자들에게 소통 스타일에 대한 피드백을 남겨보세요. 
              이는 향후 더 나은 협업을 위한 소중한 자료가 됩니다.
            </p>

            {/* 피드백 진행 상황 */}
            {participants.length > 0 && (
              <div className="mb-4 p-3 bg-white bg-opacity-60 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">피드백 진행 상황</span>
                  <span className="text-sm text-slate-600">
                    {completedFeedbacks.length}/{participants.length} 완료
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedFeedbacks.length / participants.length) * 100}%` }}
                  />
                </div>
                {completedFeedbacks.length === participants.length && participants.length > 0 && (
                  <div className="flex items-center mt-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>모든 참가자에게 피드백을 남겼습니다!</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setLocation(`/feedback?meeting=${encodeURIComponent(roomName)}`)}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                참가자에게 피드백 남기기
              </Button>
              <Button
                onClick={() => setLocation('/feedback-settings')}
                variant="outline"
                className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors"
              >
                How Others See Me
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 회의 플랫폼 연동 섹션 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
            회의 플랫폼 연동
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            연결되는 온라인/오프라인 회의 정보 공유
          </p>
          <div className="grid lg:grid-cols-1 gap-6">
            <MeetingPlatformIntegration
              roomName={roomName}
              onSaveLinks={handleSaveMeetingLinks}
              initialZoomLink={meetingLinks.zoomLink}
              initialTeamsLink={meetingLinks.teamsLink}
              initialScheduledAt={meetingLinks.scheduledAt}
            />
          </div>
        </div>

        {/* Find Board 및 저장 버튼 */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation('/rooms')}
              variant="outline"
              className="px-8 py-3 text-lg font-medium border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              Find Board
            </Button>
            <Button
              onClick={handleSaveRoomSettings}
              className="px-8 py-3 text-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-200 rounded-xl"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              저장
            </Button>
          </div>
        </div>
      </div>

      {/* 초대 모달 */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-2xl elevation-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border">
            <h3 className="text-display text-xl font-semibold text-foreground mb-4">
              미팅 참가자 초대
            </h3>
            <p className="text-body text-muted-foreground mb-6">
              "{roomName}" 미팅에 다른 사람들을 초대하세요.
            </p>

            {/* 등록된 사용자 검색 및 초대 */}
            <div className="mb-6">
              <h4 className="font-medium text-slate-800 mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                등록된 사용자 초대
              </h4>

              {/* 사용자 검색창 */}
              <div className="relative mb-4">
                <Input
                  placeholder="이름 또는 이메일로 검색... (예: hongeun.lee@kt.com)"
                  value={userSearchQuery}
                  onChange={(e) => {
                    setUserSearchQuery(e.target.value);
                    searchRegisteredUsers(e.target.value);
                  }}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>

              {registeredUsers.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                  {registeredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={selectedParticipants.includes(user.email)}
                          onCheckedChange={() => toggleParticipantSelection(user.email)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`user-${user.id}`} className="font-medium text-slate-800 cursor-pointer">
                              {user.name}
                            </Label>
                            <span className="text-xs text-slate-500 px-2 py-1 bg-green-100 text-green-700 rounded">
                              등록된 사용자
                            </span>
                            {user.lastLoginAt && (
                              <span className="text-xs text-slate-400">
                                {new Date(user.lastLoginAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendInviteEmail(user.email, user.name)}
                          className="text-xs px-2 py-1 h-7"
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          초대
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : userSearchQuery.trim() ? (
                <div className="text-center py-8 text-slate-500">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>'{userSearchQuery}'와 일치하는 사용자가 없습니다</p>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>이름이나 이메일을 입력해서 사용자를 검색하세요</p>
                </div>
              )}

              {selectedParticipants.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-600">
                      {selectedParticipants.length}명 선택됨
                    </span>
                    <Button
                      onClick={handleSendInvitesToSelected}
                      size="sm"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      선택된 사용자들에게 초대 보내기
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedParticipants.map(email => {
                      const user = registeredUsers.find(u => u.email === email);
                      return user ? (
                        <div key={email} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {user.name}
                          <button
                            onClick={() => toggleParticipantSelection(email)}
                            className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 새 참가자 추가 */}
            <div className="mb-6">
              <h4 className="font-medium text-slate-800 mb-3">새 참가자 추가</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <Input
                  placeholder="이름"
                  value={newParticipantName}
                  onChange={(e) => setNewParticipantName(e.target.value)}
                />
                <Input
                  placeholder="이메일"
                  type="email"
                  value={newParticipantEmail}
                  onChange={(e) => setNewParticipantEmail(e.target.value)}
                />
              </div>
              <Button
                onClick={() => {
                  if (newParticipantName && newParticipantEmail) {
                    handleSendInviteEmail(newParticipantEmail, newParticipantName);
                    setNewParticipantName('');
                    setNewParticipantEmail('');
                  }
                }}
                disabled={!newParticipantName || !newParticipantEmail}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                새 참가자 초대하기
              </Button>
            </div>

            {/* 일반 초대 옵션 */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={handleCopyInviteLink}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Copy className="w-4 h-4 mr-2" />
                초대 링크 복사하기
              </Button>

              <Button
                onClick={handleSendEmail}
                variant="outline"
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                일반 이메일로 초대하기
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Button
                onClick={() => {
                  setShowInviteModal(false);
                  setSelectedParticipants([]);
                  setSearchQuery('');
                  setNewParticipantName('');
                  setNewParticipantEmail('');
                }}
                variant="ghost"
                className="w-full text-slate-600 hover:text-slate-800"
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}

      <BackButton fallbackPath="/rooms" />
    </div>
  );
}