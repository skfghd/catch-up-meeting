import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 번역 데이터
const translations = {
  ko: {
    // Navigation
    'nav.home': '홈',
    'nav.survey': '성격 분석',
    'nav.profile': '내 프로필',
    'nav.rooms': '회의방',
    'nav.analysis': '조직 분석',
    'nav.enterprise': '기업용',
    'nav.language': '언어',
    
    // Landing Page
    'landing.title': 'Catch Up Meeting MBTI',
    'landing.subtitle': '팀원들의 소통 스타일을 파악하고 더 효과적인 회의를 만들어보세요',
    'landing.loginButton': '이메일로 로그인',
    'landing.guestButton': '게스트로 시작',
    'landing.features.title': '주요 기능',
    'landing.features.personality': '성격 분석',
    'landing.features.personalityDesc': '16가지 MBTI 유형 기반 개인 성향 분석',
    'landing.features.meetings': '회의방 관리',
    'landing.features.meetingsDesc': '팀별 회의방 생성 및 참가자 관리',
    'landing.features.analysis': '조직 분석',
    'landing.features.analysisDesc': '팀 단위 커뮤니케이션 성향 데이터 분석',
    'landing.cta.title': '더 스마트한 미팅을 시작하세요',
    'landing.cta.subtitle': '5분 만에 팀의 소통 MBTI를 분석하고, 더 효과적인 협업을 경험해보세요.',
    'landing.cta.button': '지금 시작하기',
    
    // Rooms
    'rooms.title': '회의방',
    'rooms.subtitle': '개인용 회의방과 기업용 아이스브레이킹 세션을 선택하세요.',
    'rooms.personal.title': '개인용 회의방',
    'rooms.personal.desc': '팀원들의 소통 스타일을 확인하고 더 원활한 커뮤니케이션을 준비하세요.',
    'rooms.personal.button': '개인용 회의방 이용하기',
    'rooms.enterprise.title': '기업용 아이스브레이킹',
    'rooms.enterprise.desc': '조직의 아이스브레이킹 세션을 관리하고 참여하세요.',
    'rooms.enterprise.button': '기업용 세션 둘러보기',
    'rooms.selectOrg': '참여하고 싶은 조직을 선택하세요.',
    'rooms.createSession': '새 세션 만들기',
    'rooms.sessionParticipate': '세션에 참여하거나 새 세션을 만들어보세요.',
    'rooms.backToOrgs': '조직 목록으로',
    'rooms.loading': '세션 목록을 불러오는 중...',
    'rooms.noSessions': '아직 생성된 세션이 없습니다',
    'rooms.noSessionsDesc': '첫 번째 아이스브레이킹 세션을 만들어보세요!',
    'rooms.maxParticipants': '최대',
    'rooms.people': '명',
    'rooms.join': '참여하기',
    'rooms.copy': '초대 코드가 복사되었습니다!',
    
    // Legacy Rooms
    'roomsLegacy.title': '개인용 회의방',
    'roomsLegacy.subtitle': '회의 성향 보드에서 팀원들의 소통 스타일을 확인하고, 더 원활한 커뮤니케이션을 준비하세요.',
    'roomsLegacy.totalRooms': '총',
    'roomsLegacy.roomsCount': '개의 회의방',
    'roomsLegacy.createNew': '새 회의방 만들기',
    'roomsLegacy.noRooms': '아직 생성된 회의방이 없습니다',
    'roomsLegacy.noRoomsDesc': '첫 번째 회의방을 만들어 팀원들과 소통해보세요!',
    'roomsLegacy.createFirst': '회의방 만들기',
    'roomsLegacy.participants': '참가자',
    'roomsLegacy.timeAgo.justNow': '방금 전',
    'roomsLegacy.timeAgo.hoursAgo': '시간 전',
    'roomsLegacy.timeAgo.daysAgo': '일 전',
    'roomsLegacy.scheduled': '예정',
    'roomsLegacy.view': '보기',
    'roomsLegacy.join': '참여',
    'roomsLegacy.deleteConfirm': '정말로 이 회의방을 삭제하시겠습니까?',
    
    // Communication Types
    'commTypes.title': 'MBTI 커뮤니케이션 유형',
    'commTypes.subtitle': '16가지 MBTI 유형별 회의 스타일과 협업 가이드를 확인하세요',
    'commTypes.searchPlaceholder': '유형 이름이나 설명으로 검색...',
    'commTypes.allCategories': '모든 유형',
    'commTypes.extraversion': '외향형',
    'commTypes.introversion': '내향형',
    'commTypes.typeOverview': '유형 개요',
    'commTypes.detailedGuide': '상세 가이드',
    'commTypes.typesFound': '개 유형 발견',
    'commTypes.strengths': '강점',
    'commTypes.challenges': '주의점',
    'commTypes.meetingTips': '회의 팁',
    'commTypes.optimalSize': '최적 인원수',
    'commTypes.preferredLength': '선호 시간',
    'commTypes.communication': '소통 방식',
    'commTypes.backToOverview': '개요로 돌아가기',

    // Organization Landing
    'org.enterprise.solution': '기업용 아이스브레이킹 솔루션',
    'org.title': '팀원들의 소통 스타일을 미리 파악하는 아이스브레이킹 플랫폼',
    'org.subtitle': '신입사원 온보딩부터 프로젝트 킥오프까지, MBTI 기반 성향 분석으로 더 나은 협업을 시작하세요',
    'org.createSession': '새 세션 만들기',
    'org.joinSession': '세션 참여하기',
    'org.features.icebreaking': '효과적인 아이스브레이킹',
    'org.features.icebreakingDesc': '팀원들의 MBTI 성향을 파악하여 최적의 아이스브레이킹 활동을 제안합니다.',
    'org.features.instant': '즉시 시작 가능',
    'org.features.instantDesc': '복잡한 가입 절차 없이 초대 코드만으로 바로 시작할 수 있습니다.',
    'org.features.realtime': '실시간 분석',
    'org.features.realtimeDesc': '참가자들의 성향 분석 결과를 실시간으로 확인하고 팀 구성을 최적화합니다.',
    'org.features.flexible': '다양한 규모',
    'org.features.flexibleDesc': '소규모 팀부터 대규모 조직까지 유연하게 대응합니다.',
    'org.benefits.meeting': '회의 시작 전 팀 분위기 조성',
    'org.benefits.style': '참가자별 커뮤니케이션 스타일 파악',
    'org.benefits.role': '효과적인 역할 분배 가이드',
    'org.benefits.tips': '실시간 협업 팁 제공',
    'org.session.title': '세션 제목',
    'org.session.description': '세션 설명',
    'org.session.hostName': '호스트 이름',
    'org.session.maxParticipants': '최대 참가자 수',
    'org.session.schedule': '예정 시간',
    'org.session.create': '세션 생성',
    'org.session.inviteCode': '초대 코드',
    'org.session.name': '이름',
    'org.session.email': '이메일 (선택)',
    'org.session.join': '참여하기',
    'org.personal': '개인용으로 이동',
    'org.required': '필수 항목 누락',
    'org.requiredDesc': '세션 제목과 호스트 이름을 입력해주세요.',
    'org.requiredJoin': '초대 코드와 이름을 입력해주세요.',
    'org.created': '세션 생성 완료!',
    'org.createdDesc': '초대 코드: ',
    'org.failed': '세션 생성 실패',
    'org.failedDesc': '다시 시도해주세요.',

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
    'survey.serverErrorDesc': '다시 시도해주세요.',

    // Profile
    'profile.title': '내 프로필',
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
    'profile.subtitle': '소통 스타일과 선호도를 관리하세요',
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

    // Rooms
    'rooms.title': '회의방',
    'rooms.subtitle': '개인 회의방과 기업용 아이스브레이킹 세션 중에서 선택하세요.',
    'rooms.personal.title': '개인 회의방',
    'rooms.personal.desc': '팀원들의 소통 스타일을 확인하고 원활한 협업을 준비하세요.',
    'rooms.personal.button': '개인 회의방 사용하기',
    'rooms.enterprise.title': '기업용 아이스브레이킹',
    'rooms.enterprise.desc': '조직의 아이스브레이킹 세션을 관리하고 참여하세요.',
    'rooms.enterprise.button': '기업 세션 둘러보기',
    'rooms.selectOrg': '참여하고 싶은 조직을 선택하세요.',
    'rooms.createSession': '새 세션 만들기',
    'rooms.sessionParticipate': '세션에 참여하거나 새로 만드세요.',
    'rooms.backToOrgs': '조직 목록으로',
    'rooms.loading': '세션 목록 로딩 중...',
    'rooms.noSessions': '아직 생성된 세션이 없습니다',
    'rooms.noSessionsDesc': '첫 번째 아이스브레이킹 세션을 만들어보세요!',
    'rooms.maxParticipants': '최대',
    'rooms.people': '명',
    'rooms.join': '참여',
    'rooms.copy': '초대 코드 복사됨!'
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
    
    // Rooms - English translations removed to fix duplicates
    
    // Legacy Rooms
    'roomsLegacy.title': 'Personal Meeting Rooms',
    'roomsLegacy.subtitle': 'Check team members\' communication styles on the meeting board and prepare for smoother communication.',
    'roomsLegacy.totalRooms': 'Total',
    'roomsLegacy.roomsCount': 'meeting rooms',
    'roomsLegacy.createNew': 'Create New Meeting Room',
    'roomsLegacy.noRooms': 'No meeting rooms created yet',
    'roomsLegacy.noRoomsDesc': 'Create your first meeting room to communicate with team members!',
    'roomsLegacy.createFirst': 'Create Meeting Room',
    'roomsLegacy.participants': 'participants',
    'roomsLegacy.timeAgo.justNow': 'just now',
    'roomsLegacy.timeAgo.hoursAgo': 'hours ago',
    'roomsLegacy.timeAgo.daysAgo': 'days ago',
    'roomsLegacy.scheduled': 'Scheduled',
    'roomsLegacy.view': 'View',
    'roomsLegacy.join': 'Join',
    'roomsLegacy.deleteConfirm': 'Are you sure you want to delete this meeting room?',
    
    // Communication Types
    'commTypes.title': 'MBTI Communication Types',
    'commTypes.subtitle': 'Explore meeting styles and collaboration guides for all 16 MBTI types',
    'commTypes.searchPlaceholder': 'Search by type name or description...',
    'commTypes.allCategories': 'All Types',
    'commTypes.extraversion': 'Extraversion',
    'commTypes.introversion': 'Introversion',
    'commTypes.typeOverview': 'Type Overview',
    'commTypes.detailedGuide': 'Detailed Guide',
    'commTypes.typesFound': 'types found',
    'commTypes.strengths': 'Strengths',
    'commTypes.challenges': 'Challenges',
    'commTypes.meetingTips': 'Meeting Tips',
    'commTypes.optimalSize': 'Optimal Size',
    'commTypes.preferredLength': 'Preferred Length',
    'commTypes.communication': 'Communication Style',
    'commTypes.backToOverview': 'Back to Overview',
    
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
    'org.session.schedule': 'Scheduled Time',
    'org.session.create': 'Create Session',
    'org.session.inviteCode': 'Invite Code',
    'org.session.name': 'Name',
    'org.session.email': 'Email (Optional)',
    'org.session.join': 'Join',
    'org.personal': 'Go to Personal',
    'org.required': 'Required Fields Missing',
    'org.requiredDesc': 'Please enter session title and host name.',
    'org.requiredJoin': 'Please enter invite code and name.',
    'org.created': 'Session Created!',
    'org.createdDesc': 'Invite Code: ',
    'org.failed': 'Session Creation Failed',
    'org.failedDesc': 'Please try again.',

    // Survey
    'survey.title': 'Personality Assessment',
    'survey.guestName': 'Guest Name',
    'survey.guestNamePlaceholder': 'e.g., John Smith',
    'survey.start': 'Start Assessment',
    'survey.question': 'Question',
    'survey.of': ' of ',
    'survey.submit': 'Analyze My Communication Style',
    'survey.submitting': 'Analyzing...',
    'survey.nameRequired': 'Please enter your name.',
    'survey.allRequired': 'Please answer all questions.',
    'survey.serverError': 'An error occurred during analysis. Please try again.',

    // Profile
    'profile.title': 'My Profile',
    'profile.mbtiType': 'MBTI Personality Type',
    'profile.style': 'Communication Style',
    'profile.feedback': 'Feedback Based',
    'profile.advice': 'Collaboration Advice',
    'profile.editName': 'Edit Name',
    'profile.save': 'Save',
    'profile.cancel': 'Cancel',
    'profile.shareProfile': 'Share my profile in meetings',
    'profile.shareDesc': 'Other participants can see my communication style.',
    'profile.retakeSurvey': 'Retake Survey',
    'profile.feedbackSettings': 'Feedback Settings',
    'profile.subtitle': 'Manage your communication style and preferences',
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
    'profile.howOthersSee': 'How Others See Me',
    'profile.workingTips': 'Tips for Working with Me',

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
    'common.status.completed': 'Completed'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ko');
  
  const t = (key: string): string => {
    const translation = translations[language];
    return (translation as any)[key] || key;
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