import React, { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ko: {
    // Navigation
    'nav.home': '홈',
    'nav.survey': '성격 진단',
    'nav.profile': '내 프로필',
    'nav.rooms': '회의방',
    'nav.analysis': '조직 분석',
    'nav.enterprise': '기업용',
    'nav.language': '언어',
    
    // Landing Page
    'landing.title': 'Catch Up Meeting MBTI',
    'landing.subtitle': '팀원들의 소통 스타일을 이해하고 더 효과적인 회의를 만들어보세요',
    'landing.loginButton': '이메일로 로그인',
    'landing.guestButton': '게스트로 시작',
    'landing.features.title': '주요 기능',
    'landing.features.personality': '성격 분석',
    'landing.features.personalityDesc': '16가지 MBTI 유형 기반 개인 성격 분석',
    'landing.features.meetings': '회의 관리',
    'landing.features.meetingsDesc': '팀 회의방 생성과 참가자 관리',
    'landing.features.analysis': '조직 분석',
    'landing.features.analysisDesc': '팀 단위 소통 경향과 데이터 분석',
    'landing.cta.title': '오늘부터 더 스마트한 회의를 시작하세요',
    'landing.cta.subtitle': '5분 만에 팀의 소통 MBTI를 분석하고 더 효과적인 협업을 경험해보세요.',
    'landing.cta.button': '지금 시작하기',

    // Rooms (개인 회의방)
    'rooms.title': '회의방',
    'rooms.subtitle': '개인 회의방과 기업용 아이스브레이킹 세션 중에서 선택하세요.',
    'rooms.personal.title': '개인 회의방',
    'rooms.personal.desc': '팀원들의 소통 스타일을 확인하고 원활한 협업을 준비하세요.',
    'rooms.personal.button': '개인 회의방 사용하기',
    'rooms.enterprise.title': '기업용 아이스브레이킹',
    'rooms.enterprise.desc': '조직의 아이스브레이킹 세션을 관리하고 참여하세요.',
    'rooms.enterprise.button': '기업 세션 둘러보기',
    
    // Rooms Legacy (개인 회의방 세부)
    'roomsLegacy.title': '개인 회의방',
    'roomsLegacy.subtitle': '팀원들과 소통 스타일을 공유하고 더 나은 회의를 준비하세요.',
    'roomsLegacy.totalRooms': '총 회의방',
    'roomsLegacy.roomCount': '개',
    'roomsLegacy.createNew': '새 회의방 만들기',
    'roomsLegacy.participants': '참가자',
    'roomsLegacy.people': '명',
    'roomsLegacy.scheduled': '예정',
    'roomsLegacy.timeAgo': '일 전',
    'roomsLegacy.view': '보기',
    'roomsLegacy.join': '참여',
    'roomsLegacy.backButton': '이전 페이지로',
    'roomsLegacy.noRooms': '생성된 회의방이 없습니다',
    'roomsLegacy.noRoomsDesc': '새로운 회의방을 만들어 팀과 함께 소통해보세요.',
    'roomsLegacy.createFirst': '첫 번째 회의방 만들기',
    'roomsLegacy.deleteConfirm': '정말로 이 회의방을 삭제하시겠습니까?',
    'roomsLegacy.roomsCount': '개의 회의방',
    'roomsLegacy.createDesc': '새로운 회의방을 생성하여 팀원들과 소통하세요.',
    'roomsLegacy.roomName': '회의방 이름',
    'roomsLegacy.roomNamePlaceholder': '예: 마케팅팀 주간 회의',
    'roomsLegacy.description': '설명',
    'roomsLegacy.descriptionPlaceholder': '회의의 목적과 내용을 설명해주세요',
    'roomsLegacy.link': '링크',
    'roomsLegacy.cancel': '취소',
    'roomsLegacy.create': '생성',
    'roomsLegacy.creating': '생성 중...',
    'roomsLegacy.created': '회의방이 생성되었습니다!',
    'roomsLegacy.createdDesc': '새로운 회의방이 성공적으로 생성되었습니다.',
    'roomsLegacy.deleted': '회의방이 삭제되었습니다',
    'roomsLegacy.deletedDesc': '선택한 회의방이 삭제되었습니다.',
    'roomsLegacy.failed': '실패',
    'roomsLegacy.failedDesc': '작업을 완료할 수 없습니다. 다시 시도해주세요.',
    'roomsLegacy.required': '필수 항목',
    'roomsLegacy.nameRequired': '회의방 이름을 입력해주세요.',


    // Survey
    'survey.title': '성격 분석 설문',
    'survey.guestName': '게스트 이름',
    'survey.guestNamePlaceholder': '이름을 입력하세요',
    'survey.start': '설문 시작',
    'survey.question': '질문',
    'survey.of': '/',
    'survey.submit': '결과 보기',
    'survey.submitting': '분석 중...',
    'survey.nameRequired': '이름을 입력해주세요.',
    'survey.allRequired': '모든 질문에 답해주세요.',
    'survey.serverError': '서버 저장 오류',

    // Profile
    'profile.title': '내 프로필',
    'profile.subtitle': '소통 스타일과 선호도를 관리하세요',
    'profile.mbtiType': 'MBTI 성격 유형',
    'profile.style': '소통 스타일',
    'profile.feedback': '피드백 기반',
    'profile.advice': '협업 조언',
    'profile.editName': '이름 편집',
    'profile.save': '저장',
    'profile.cancel': '취소',
    'profile.shareProfile': '회의에서 내 프로필 공유',
    'profile.shareDesc': '다른 참가자들이 내 소통 스타일을 볼 수 있습니다.',
    'profile.retakeSurvey': '설문 다시 하기',
    'profile.feedbackSettings': '피드백 설정',
    'profile.howOthersSee': '다른 사람들이 보는 나',
    'profile.workingTips': '나와 일하는 팁',
    'profile.loadError': '프로필을 불러올 수 없습니다',
    'profile.userNotFound': '사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.',
    'profile.surveyRequired': '소통 스타일 진단을 먼저 받아보세요.',
    'profile.takeSurvey': '소통 스타일 진단 받기',
    'profile.loginAgain': '다시 로그인하기',
    'profile.loginMode': '(로그인)',
    'profile.guestMode': '(게스트)',
    'profile.defaultName': '사용자',
    'profile.fileSizeError': '파일 크기는 5MB 이하여야 합니다.',
    'profile.noEmail': '이메일 정보 없음',
    'profile.displayAs': '회의에서 표시될 이름',

    // Common
    'common.loading': '로딩 중...',
    'common.back': '뒤로',
    'common.next': '다음',
    'common.confirm': '확인',
    'common.cancel': '취소',
    'common.save': '저장',
    'common.delete': '삭제',
    'common.edit': '편집',
    'common.create': '생성',
    'common.status.waiting': '대기중',
    'common.status.active': '진행중',
    'common.status.completed': '완료',

    // Organization Landing
    'org.enterprise.solution': '기업용 아이스브레이킹 솔루션',
    'org.title': '팀의 소통 스타일을 이해하는 아이스브레이킹 플랫폼',
    'org.subtitle': '신입사원 온보딩부터 프로젝트 킥오프까지, MBTI 기반 성격 분석으로 더 나은 협업을 시작하세요',
    'org.createSession': '새 세션 만들기',
    'org.joinSession': '세션 참여하기',
    'org.features.icebreaking': '효과적인 아이스브레이킹',
    'org.features.icebreakingDesc': '팀원들의 MBTI 성격을 파악하고 최적의 아이스브레이킹 활동을 제안받으세요.',
    'org.features.instant': '즉시 시작',
    'org.features.instantDesc': '복잡한 가입 과정 없이 초대 코드만으로 바로 시작할 수 있습니다.',
    'org.features.realtime': '실시간 분석',
    'org.features.realtimeDesc': '참가자들의 성격 분석 결과를 실시간으로 확인하고 팀 구성을 최적화하세요.',
    'org.features.flexible': '유연한 규모',
    'org.features.flexibleDesc': '소규모 팀부터 대규모 조직까지 모든 규모를 지원합니다.',
    'org.benefits.meeting': '✓ 회의 시작 전 팀 분위기 조성',
    'org.benefits.style': '✓ 각 참가자의 소통 스타일 파악',
    'org.benefits.role': '✓ 효과적인 역할 분배 가이드',
    'org.benefits.tips': '✓ 실시간 협업 팁 제공',
    'org.session.title': '세션 제목',
    'org.session.description': '세션 설명',
    'org.session.hostName': '호스트 이름',
    'org.session.maxParticipants': '최대 참가자 수',
    'org.session.join': '참여하기',
    'org.personal': '개인용으로 이동',
    'org.required': '필수 항목 누락',
    'org.requiredDesc': '세션 제목과 호스트 이름을 입력해주세요.',
    'org.requiredJoin': '초대 코드와 이름을 입력해주세요.',
    'org.created': '세션 생성 완료!',
    'org.createdDesc': '초대 코드: ',
    'org.failed': '세션 생성 실패',
    'org.failedDesc': '다시 시도해주세요.',

    // Footer 관련 번역
    'footer.about': '사이트 소개',
    'footer.disclaimer': '면책조항',
    'footer.privacy': '개인정보처리방침',
    'footer.terms': '이용약관',
    'footer.contact': '문의하기',
    'footer.description': '팀원들의 소통 스타일을 이해하고 더 효과적인 회의를 만들어보세요',
    'footer.quickLinks': '바로가기',
    'footer.support': '지원',
    'footer.supportDesc': '문의사항이 있으시면 언제든지 연락주세요.',
    'footer.contactUs': '문의하기'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.survey': 'Personality Test',
    'nav.profile': 'My Profile',
    'nav.rooms': 'Meeting Rooms',
    'nav.analysis': 'Organization Analysis',
    'nav.enterprise': 'Enterprise',
    'nav.language': 'Language',
    
    // Landing Page
    'landing.title': 'Catch Up Meeting MBTI',
    'landing.subtitle': 'Understand your team members\' communication styles and create more effective meetings',
    'landing.loginButton': 'Login with Email',
    'landing.guestButton': 'Start as Guest',
    'landing.features.title': 'Key Features',
    'landing.features.personality': 'Personality Analysis',
    'landing.features.personalityDesc': 'Individual personality analysis based on 16 MBTI types',
    'landing.features.meetings': 'Meeting Management',
    'landing.features.meetingsDesc': 'Create team meeting rooms and manage participants',
    'landing.features.analysis': 'Organization Analysis',
    'landing.features.analysisDesc': 'Analyze team-level communication trends and data',
    'landing.cta.title': 'Start Smarter Meetings Today',
    'landing.cta.subtitle': 'Analyze your team\'s communication MBTI in 5 minutes and experience more effective collaboration.',
    'landing.cta.button': 'Get Started Now',

    // Rooms (개인 회의방)
    'rooms.title': 'Meeting Rooms',
    'rooms.subtitle': 'Choose between personal meeting rooms and enterprise icebreaking sessions.',
    'rooms.personal.title': 'Personal Meeting Rooms',
    'rooms.personal.desc': 'Check team members\' communication styles and prepare for smooth collaboration.',
    'rooms.personal.button': 'Use Personal Meeting Room',
    'rooms.enterprise.title': 'Enterprise Icebreaking',
    'rooms.enterprise.desc': 'Manage and participate in organizational icebreaking sessions.',
    'rooms.enterprise.button': 'Explore Enterprise Sessions',
    
    // Rooms Legacy (개인 회의방 세부)
    'roomsLegacy.title': 'Meeting Room Management',
    'roomsLegacy.subtitle': 'Create and manage meeting rooms for team communication.',
    'roomsLegacy.totalRooms': 'Total',
    'roomsLegacy.roomsCount': 'meeting rooms',
    'roomsLegacy.createNew': 'Create New Room',
    'roomsLegacy.createFirst': 'Create First Room',
    'roomsLegacy.noRooms': 'No meeting rooms created',
    'roomsLegacy.noRoomsDesc': 'Create a new meeting room to start collaborating with your team.',
    'roomsLegacy.participants': 'Participants',
    'roomsLegacy.people': 'people',
    'roomsLegacy.scheduled': 'Scheduled time',
    'roomsLegacy.timeAgo': 'days ago',
    'roomsLegacy.view': 'View',
    'roomsLegacy.join': 'Join',
    'roomsLegacy.deleteConfirm': 'Are you sure you want to delete this meeting room?',
    'roomsLegacy.timeAgo.justNow': 'Just now',
    'roomsLegacy.timeAgo.hoursAgo': 'hours ago',
    'roomsLegacy.timeAgo.daysAgo': 'days ago',
    'roomsLegacy.createDesc': 'Create a new meeting room to communicate with your team.',
    'roomsLegacy.roomName': 'Room Name',
    'roomsLegacy.roomNamePlaceholder': 'e.g., Marketing Team Weekly Meeting',
    'roomsLegacy.description': 'Description',
    'roomsLegacy.descriptionPlaceholder': 'Describe the purpose and content of this meeting',
    'roomsLegacy.link': 'Link',
    'roomsLegacy.cancel': 'Cancel',
    'roomsLegacy.create': 'Create',
    'roomsLegacy.creating': 'Creating...',
    'roomsLegacy.created': 'Meeting room created!',
    'roomsLegacy.createdDesc': 'A new meeting room has been successfully created.',
    'roomsLegacy.deleted': 'Meeting room deleted',
    'roomsLegacy.deletedDesc': 'The selected meeting room has been deleted.',
    'roomsLegacy.failed': 'Failed',
    'roomsLegacy.failedDesc': 'Unable to complete the operation. Please try again.',
    'roomsLegacy.required': 'Required Fields',
    'roomsLegacy.nameRequired': 'Please enter a room name.',
    
    'rooms.selectOrg': 'Select the organization you want to join.',
    'rooms.createSession': 'Create New Session',
    'rooms.sessionParticipate': 'Join a session or create a new one.',
    'rooms.backToOrgs': 'Back to Organizations',
    'rooms.loading': 'Loading session list...',
    'rooms.noSessions': 'No sessions created yet',
    'rooms.noSessionsDesc': 'Create your first icebreaking session!',
    'rooms.maxParticipants': 'Max',
    'rooms.people': 'people',
    'rooms.join': 'Join',
    'rooms.copy': 'Invite code copied!',

    // Survey
    'survey.title': 'Personality Assessment',
    'survey.guestName': 'Guest Name',
    'survey.guestNamePlaceholder': 'Enter your name',
    'survey.start': 'Start Assessment',
    'survey.question': 'Question',
    'survey.of': '/',
    'survey.submit': 'View Results',
    'survey.submitting': 'Analyzing...',
    'survey.nameRequired': 'Please enter your name.',
    'survey.allRequired': 'Please answer all questions.',
    'survey.serverError': 'Server save error',

    // Profile
    'profile.title': 'My Profile',
    'profile.subtitle': 'Manage your communication style and preferences',
    'profile.mbtiType': 'MBTI Personality Type',
    'profile.style': 'Communication Style',
    'profile.feedback': 'Feedback Based',
    'profile.advice': 'Collaboration Advice',
    'profile.editName': 'Edit Name',
    'profile.save': 'Save',
    'profile.cancel': 'Cancel',
    'profile.shareProfile': 'Share My Profile in Meetings',
    'profile.shareDesc': 'Other participants can see my communication style.',
    'profile.retakeSurvey': 'Retake Assessment',
    'profile.feedbackSettings': 'Feedback Settings',
    'profile.howOthersSee': 'How Others See Me',
    'profile.workingTips': 'Tips for Working with Me',
    'profile.loadError': 'Unable to load profile',
    'profile.userNotFound': 'User information not found. Please log in again.',
    'profile.surveyRequired': 'Please take the communication style assessment first.',
    'profile.takeSurvey': 'Take Communication Style Assessment',
    'profile.loginAgain': 'Log In Again',
    'profile.loginMode': '(Logged In)',
    'profile.guestMode': '(Guest)',
    'profile.defaultName': 'User',
    'profile.fileSizeError': 'File size must be 5MB or less.',
    'profile.noEmail': 'No email information',
    'profile.displayAs': 'Display name in meetings',

    // Common
    'common.loading': 'Loading...',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.status.waiting': 'Waiting',
    'common.status.active': 'Active',
    'common.status.completed': 'Completed',

    // Organization Landing
    'org.enterprise.solution': 'Enterprise Icebreaking Solution',
    'org.title': 'Understand Team Communication Styles with Our Icebreaking Platform',
    'org.subtitle': 'From new employee onboarding to project kickoffs, start better collaboration with MBTI-based personality analysis',
    'org.createSession': 'Create New Session',
    'org.joinSession': 'Join Session',
    'org.features.icebreaking': 'Effective Icebreaking',
    'org.features.icebreakingDesc': 'Understand team members\' MBTI personalities and get optimal icebreaking activities.',
    'org.features.instant': 'Start Instantly',
    'org.features.instantDesc': 'No complex signup process - start immediately with just an invite code.',
    'org.features.realtime': 'Real-time Analysis',
    'org.features.realtimeDesc': 'View participants\' personality analysis results in real-time and optimize team composition.',
    'org.features.flexible': 'Flexible Scale',
    'org.features.flexibleDesc': 'Supports everything from small teams to large organizations.',
    'org.benefits.meeting': '✓ Create team atmosphere before meetings start',
    'org.benefits.style': '✓ Understand each participant\'s communication style',
    'org.benefits.role': '✓ Effective role distribution guidance',
    'org.benefits.tips': '✓ Real-time collaboration tips',
    'org.session.title': 'Session Title',
    'org.session.description': 'Session Description',
    'org.session.hostName': 'Host Name',
    'org.session.maxParticipants': 'Max Participants',
    'org.session.join': 'Join',
    'org.personal': 'Go to Personal',
    'org.required': 'Required Fields Missing',
    'org.requiredDesc': 'Please enter session title and host name.',
    'org.requiredJoin': 'Please enter invite code and name.',
    'org.created': 'Session Created!',
    'org.createdDesc': 'Invite Code: ',
    'org.failed': 'Session Creation Failed',
    'org.failedDesc': 'Please try again.',

    // Footer 관련 번역
    'footer.about': 'About',
    'footer.disclaimer': 'Disclaimer', 
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact',
    'footer.description': 'Understand team communication styles and create more effective meetings',
    'footer.quickLinks': 'Quick Links',
    'footer.support': 'Support',
    'footer.supportDesc': 'Contact us anytime if you have questions.',
    'footer.contactUs': 'Contact Us'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ko');
  
  const t = (key: string): string => {
    try {
      const translation = translations[language];
      return translation[key as keyof typeof translation] || key;
    } catch (error) {
      console.warn('Translation error:', error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}