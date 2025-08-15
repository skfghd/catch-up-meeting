import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Search, 
  Users, 
  BookOpen,
  ArrowRight,
  Star
} from 'lucide-react';
import { Link } from 'wouter';
import Navigation from '@/components/navigation';
import { MEETING_MBTI_TYPES } from '@/lib/meeting-mbti-types';
import { useLanguage } from '@/contexts/LanguageContext';

// MBTI 유형별 영어 번역 데이터
const MBTI_ENGLISH_TRANSLATIONS = {
  ESTJ: {
    name: "The Executive",
    nickname: "Efficient Leader",
    description: "Practical and fact-minded, reliable in achieving goals.",
    strengths: ["Leadership", "Organization", "Efficiency", "Reliability"],
    meetingTips: "Prefers structured agendas and clear objectives",
    optimalMeetingSize: "5-8 people",
    preferredMeetingLength: "60-90 minutes",
    communicationPreference: "Direct and goal-oriented"
  },
  ISFP: {
    name: "The Adventurer", 
    nickname: "Gentle Artist",
    description: "Quiet, friendly, sensitive, and kind with strong values.",
    strengths: ["Creativity", "Empathy", "Flexibility", "Authenticity"],
    meetingTips: "Values personal connection and authentic discussion",
    optimalMeetingSize: "3-5 people",
    preferredMeetingLength: "30-60 minutes", 
    communicationPreference: "Personal and value-driven"
  },
  ENFP: {
    name: "The Campaigner",
    nickname: "Enthusiastic Motivator", 
    description: "Enthusiastic, creative, and sociable free spirits.",
    strengths: ["Innovation", "Enthusiasm", "People Skills", "Inspiration"],
    meetingTips: "Thrives in brainstorming and collaborative sessions",
    optimalMeetingSize: "4-8 people",
    preferredMeetingLength: "45-90 minutes",
    communicationPreference: "Energetic and idea-focused"
  },
  INTJ: {
    name: "The Architect",
    nickname: "Strategic Mastermind",
    description: "Imaginative and strategic thinkers with plans for everything.",
    strengths: ["Strategy", "Independence", "Innovation", "Determination"],
    meetingTips: "Prefers well-prepared meetings with clear purposes",
    optimalMeetingSize: "3-6 people", 
    preferredMeetingLength: "60-120 minutes",
    communicationPreference: "Analytical and strategic"
  },
  ESTP: {
    name: "The Entrepreneur",
    nickname: "Dynamic Facilitator",
    description: "Smart, energetic and perceptive people who enjoy living on the edge.",
    strengths: ["Adaptability", "Energy", "Practicality", "Spontaneity"],
    meetingTips: "Thrives in fast-paced, interactive discussions",
    optimalMeetingSize: "4-6 people",
    preferredMeetingLength: "30-60 minutes",
    communicationPreference: "Direct and action-oriented"
  },
  ESFP: {
    name: "The Entertainer", 
    nickname: "Enthusiastic Connector",
    description: "Spontaneous, energetic and enthusiastic people who enjoy life.",
    strengths: ["Enthusiasm", "Communication", "Flexibility", "Team Spirit"],
    meetingTips: "Values personal connections and positive atmosphere",
    optimalMeetingSize: "3-8 people",
    preferredMeetingLength: "45-75 minutes",
    communicationPreference: "Warm and engaging"
  },
  ENTJ: {
    name: "The Commander",
    nickname: "Natural Leader",
    description: "Bold, imaginative and strong-willed leaders who find solutions.",
    strengths: ["Leadership", "Strategic Thinking", "Decisiveness", "Efficiency"],
    meetingTips: "Drives towards clear outcomes and decisions",
    optimalMeetingSize: "5-10 people",
    preferredMeetingLength: "60-90 minutes",
    communicationPreference: "Authoritative and goal-focused"
  },
  ENTP: {
    name: "The Debater",
    nickname: "Innovative Brainstormer",
    description: "Smart and curious thinkers who love intellectual challenges.",
    strengths: ["Innovation", "Quick Thinking", "Enthusiasm", "Versatility"],
    meetingTips: "Enjoys exploring multiple possibilities and ideas",
    optimalMeetingSize: "4-8 people",
    preferredMeetingLength: "60-120 minutes",
    communicationPreference: "Intellectually stimulating"
  },
  ESFJ: {
    name: "The Consul",
    nickname: "Supportive Harmonizer", 
    description: "Caring, social and popular people who are always eager to help.",
    strengths: ["Harmony", "Organization", "Support", "Cooperation"],
    meetingTips: "Focuses on team consensus and positive relationships",
    optimalMeetingSize: "4-8 people",
    preferredMeetingLength: "45-75 minutes",
    communicationPreference: "Collaborative and considerate"
  },
  ENFJ: {
    name: "The Protagonist",
    nickname: "Inspirational Coach",
    description: "Charismatic and inspiring leaders who motivate others.",
    strengths: ["Inspiration", "Communication", "Empathy", "Vision"],
    meetingTips: "Creates engaging and motivational discussions",
    optimalMeetingSize: "5-10 people",
    preferredMeetingLength: "60-90 minutes", 
    communicationPreference: "Inspiring and people-focused"
  },
  ISTJ: {
    name: "The Logistician",
    nickname: "Reliable Organizer",
    description: "Practical and fact-minded, reliable and responsible.",
    strengths: ["Reliability", "Detail-oriented", "Organization", "Consistency"],
    meetingTips: "Prefers structured agendas and thorough preparation",
    optimalMeetingSize: "3-6 people",
    preferredMeetingLength: "45-75 minutes",
    communicationPreference: "Methodical and factual"
  },
  ISFJ: {
    name: "The Protector",
    nickname: "Caring Supporter",
    description: "Warm-hearted and dedicated, always ready to protect loved ones.",
    strengths: ["Support", "Attention to Detail", "Loyalty", "Patience"],
    meetingTips: "Values harmony and considers everyone's needs",
    optimalMeetingSize: "3-6 people",
    preferredMeetingLength: "45-75 minutes",
    communicationPreference: "Gentle and supportive"
  },
  ISTP: {
    name: "The Virtuoso",
    nickname: "Practical Problem Solver",
    description: "Bold and practical experimenters, masters of all tools.",
    strengths: ["Problem Solving", "Adaptability", "Logic", "Independence"],
    meetingTips: "Prefers hands-on discussions and practical solutions",
    optimalMeetingSize: "3-5 people",
    preferredMeetingLength: "30-60 minutes",
    communicationPreference: "Direct and solution-focused"
  },
  INFP: {
    name: "The Mediator",
    nickname: "Idealistic Harmonizer",
    description: "Poetic, kind and altruistic, always eager to help good causes.",
    strengths: ["Creativity", "Values-driven", "Empathy", "Open-mindedness"],
    meetingTips: "Values authentic discussion and meaningful purposes",
    optimalMeetingSize: "3-6 people",
    preferredMeetingLength: "45-90 minutes",
    communicationPreference: "Thoughtful and value-centered"
  },
  INFJ: {
    name: "The Advocate",
    nickname: "Insightful Visionary",
    description: "Creative and insightful, inspired and independent.",
    strengths: ["Vision", "Insight", "Creativity", "Determination"],
    meetingTips: "Brings long-term perspective and deep insights",
    optimalMeetingSize: "3-5 people",
    preferredMeetingLength: "60-90 minutes",
    communicationPreference: "Thoughtful and future-oriented"
  },
  INTP: {
    name: "The Thinker",
    nickname: "Logical Innovator", 
    description: "Innovative inventors with an unquenchable thirst for knowledge.",
    strengths: ["Logic", "Innovation", "Independence", "Objectivity"],
    meetingTips: "Values intellectual discussion and theoretical exploration",
    optimalMeetingSize: "3-5 people",
    preferredMeetingLength: "60-120 minutes",
    communicationPreference: "Analytical and theoretical"
  },
  ESTF: {
    name: "The Executive",
    nickname: "Efficient Leader", 
    description: "Excellent administrators, unsurpassed at managing things or people.",
    strengths: ["Leadership", "Organization", "Decisiveness", "Tradition"],
    meetingTips: "Prefers clear structure and efficient outcomes",
    optimalMeetingSize: "5-8 people",
    preferredMeetingLength: "45-75 minutes",
    communicationPreference: "Direct and organized"
  }
};

// MBTI 유형 배열 생성
const getMeetingMBTITypes = (language: string) => {
  return Object.values(MEETING_MBTI_TYPES).map((type) => {
    if (language === 'en' && MBTI_ENGLISH_TRANSLATIONS[type.code as keyof typeof MBTI_ENGLISH_TRANSLATIONS]) {
      const englishData = MBTI_ENGLISH_TRANSLATIONS[type.code as keyof typeof MBTI_ENGLISH_TRANSLATIONS];
      return {
        id: type.code,
        name: englishData.name,
        code: type.code,
        nickname: englishData.nickname,
        category: getMBTICategory(type.code),
        color: getMBTIColor(type.code),
        shortDesc: englishData.description,
        fullDesc: `${englishData.name} - ${englishData.description}`,
        strengths: englishData.strengths,
        challenges: type.challenges, // 한국어 버전 사용 (추후 번역)
        meetingTips: englishData.meetingTips,
        optimalMeetingSize: englishData.optimalMeetingSize,
        preferredMeetingLength: englishData.preferredMeetingLength,
        communicationPreference: englishData.communicationPreference
      };
    }
    
    // 한국어 기본값
    return {
      id: type.code,
      name: type.name,
      code: type.code,
      nickname: type.nickname,
      category: getMBTICategory(type.code),
      color: getMBTIColor(type.code),
      shortDesc: type.description,
      fullDesc: `${type.name}은 ${type.description} 이 유형은 ${type.meetingTips.split('\n')[0]}와 같은 방식으로 회의에 임합니다.`,
      strengths: type.strengths,
      challenges: type.challenges,
      meetingTips: type.meetingTips,
      optimalMeetingSize: type.optimalMeetingSize,
      preferredMeetingLength: type.preferredMeetingLength,
      communicationPreference: type.communicationPreference
    };
  });
};

// MBTI 카테고리 함수
function getMBTICategory(code: string): string {
  const firstLetter = code[0];
  return firstLetter === 'E' ? 'Extraversion' : 'Introversion';
}

// MBTI 색상 함수
function getMBTIColor(code: string): string {
  if (code.startsWith('E')) return 'blue';
  return 'purple';
}

// 카테고리별 색상 매핑
const categoryColors = {
  Extraversion: 'bg-blue-100 text-blue-800 border-blue-200',
  Introversion: 'bg-purple-100 text-purple-800 border-purple-200'
};

export default function CommunicationTypesPage() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 현재 언어에 맞는 MBTI 유형들
  const meetingMBTITypes = getMeetingMBTITypes(language);

  // 필터링된 유형들
  const filteredTypes = meetingMBTITypes.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || type.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 카테고리별 통계
  const categoryStats = {
    Extraversion: meetingMBTITypes.filter(t => t.category === 'Extraversion').length,
    Introversion: meetingMBTITypes.filter(t => t.category === 'Introversion').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation showBack={true} backTo="/" title="MBTI 유형" />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* 헤더 섹션 */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="w-10 h-10 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-900">{t('commTypes.title')}</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('commTypes.subtitle')}
            </p>
            
            {/* 4차원 설명 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <Card className="border-blue-200">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    {language === 'en' ? 'Energy Direction' : '에너지 방향'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'en' ? 'E(Extraversion) vs I(Introversion)' : 'E(외향) vs I(내향)'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-green-200">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-green-900 mb-2">
                    {language === 'en' ? 'Information Perception' : '정보 인식'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'en' ? 'S(Sensing) vs N(Intuition)' : 'S(현실) vs N(직관)'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-orange-200">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-orange-900 mb-2">
                    {language === 'en' ? 'Decision Making' : '의사결정'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'en' ? 'T(Thinking) vs F(Feeling)' : 'T(논리) vs F(감정)'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    {language === 'en' ? 'Lifestyle Orientation' : '생활 양식'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'en' ? 'J(Judging) vs P(Perceiving)' : 'J(계획) vs P(유연)'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 검색 및 필터 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={t('commTypes.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('all')}
                    size="sm"
                  >
{t('commTypes.allCategories')} ({meetingMBTITypes.length})
                  </Button>
                  <Button
                    variant={selectedCategory === 'Extraversion' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('Extraversion')}
                    size="sm"
                  >
{t('commTypes.extraversion')} ({categoryStats.Extraversion})
                  </Button>
                  <Button
                    variant={selectedCategory === 'Introversion' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('Introversion')}
                    size="sm"
                  >
{t('commTypes.introversion')} ({categoryStats.Introversion})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 유형 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTypes.map((type) => (
              <Card key={type.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`${categoryColors[type.category as keyof typeof categoryColors]} border`}>
                      {type.code}
                    </Badge>
                    <Star className="w-4 h-4 text-gray-400" />
                  </div>
                  <CardTitle className="text-lg">{type.name}</CardTitle>
                  <p className="text-sm text-gray-600">{type.nickname}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{type.shortDesc}</p>
                  
                  {/* 강점 */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">{t('commTypes.strengths')}</h4>
                    <div className="flex flex-wrap gap-1">
                      {type.strengths.slice(0, 3).map((strength, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* 미팅 정보 */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">{t('commTypes.optimalSize')}:</span>
                      <div className="font-medium">{type.optimalMeetingSize}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">{t('commTypes.preferredLength')}:</span>
                      <div className="font-medium">{type.preferredMeetingLength}</div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
{t('commTypes.detailedGuide')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 결과 없음 */}
          {filteredTypes.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'en' ? 'No search results' : '검색 결과가 없습니다'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'en' ? 'Try different search terms' : '다른 검색어를 시도해보세요'}
                </p>
                <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                  {language === 'en' ? 'Clear Search' : '검색 초기화'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* 진단 받기 링크 */}
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'en' ? 'Discover Your MBTI Type' : '나의 MBTI 유형은?'}
              </h2>
              <p className="text-indigo-100 mb-4">
                {language === 'en' 
                  ? 'Analyze your personality type with 15 questions'
                  : '15개 질문으로 나의 성격 유형을 분석해보세요'
                }
              </p>
              <p className="text-indigo-200 text-sm mb-6">
                {language === 'en'
                  ? '* This is an informal assessment for collaboration and meeting style analysis, not an official MBTI test.'
                  : '* 본 진단은 협업 및 회의 스타일 분석을 위한 참고용 검사로, 공식 MBTI 검사가 아닙니다.'
                }
              </p>
              <Link href="/survey">
                <Button size="lg" variant="secondary" className="text-indigo-600 hover:text-indigo-700">
                  <Users className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Take Assessment' : 'MBTI 진단 받기'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}