export interface User {
  email: string;
  name: string;
  displayName?: string; // 회의에서 표시될 이름
}

export interface SurveyAnswers {
  // 기존 7개 질문
  q1: 'visual' | 'text';
  q2: 'quick' | 'detailed';
  q3: 'short' | 'full';
  q4: 'individual' | 'group';
  q5: 'flexible' | 'structured';
  q6: 'logical' | 'emotional';
  q7: 'calm' | 'energetic';

  // 확장된 8개 질문
  q8: 'proactive' | 'reactive';        // 스트레스 대응 방식
  q9: 'direct' | 'diplomatic';         // 피드백 스타일
  q10: 'compromise' | 'assertive';     // 갈등 해결 방식
  q11: 'creative' | 'practical';       // 문제 해결 접근
  q12: 'multitask' | 'focus';         // 업무 처리 방식
  q13: 'verbal' | 'written';          // 소통 채널 선호
  q14: 'risk_taking' | 'cautious';     // 위험 선호도
  q15: 'learning' | 'executing';       // 학습 vs 실행 선호
}

export interface UserProfile {
  style: string;
  tips: string;
  emotionalStyle: string;
  collaborationTips: string;
  // 확장된 프로필 정보
  stressManagement: string;      // 스트레스 관리 방식
  feedbackStyle: string;         // 피드백 수용/전달 스타일
  conflictResolution: string;    // 갈등 해결 방식
  problemSolving: string;        // 문제 해결 접근법
  workStyle: string;             // 업무 처리 스타일
  communicationChannel: string;  // 선호 소통 채널
  riskProfile: string;           // 위험 감수 성향
  learningPreference: string;    // 학습/실행 균형
}

export interface MeetingFeedback {
  id: string;
  meetingName: string;
  fromUser: string;
  targetUser: string; // 피드백을 받는 사람
  responses: {
    communicationClarity: number; // 1-5: 소통이 명확했나요?
    timeManagement: number; // 1-5: 시간 관리가 좋았나요?
    collaboration: number; // 1-5: 협업이 잘 되었나요?
    preparation: number; // 1-5: 미팅 준비가 잘 되어 있었나요?
    listening: number; // 1-5: 경청을 잘 했나요?
  };
  strengths: string[]; // 선택된 강점들
  improvements: string[]; // 개선점들
  comment: string; // 자유 의견
  date: string;
  isVisible: boolean; // 다른 미팅에서 공개할지 여부
}

export interface FeedbackSummary {
  averageScores: {
    communicationClarity: number;
    timeManagement: number;
    collaboration: number;
    preparation: number;
    listening: number;
  };
  topStrengths: { strength: string; count: number }[];
  commonImprovements: { improvement: string; count: number }[];
  totalFeedbacks: number;
  meetingPersona: string; // 생성된 미팅 성향 카드
}

export interface FeedbackSettings {
  showFeedbackToOthers: boolean; // 전체 피드백 공개 설정
}

export interface ProfileDisplaySettings {
  dataSource: 'survey' | 'feedback' | 'auto'; // 프로필 데이터 소스 선택
}

export interface PreviousParticipant {
  email: string;
  name: string;
  lastMeetingDate: string;
  meetingCount: number;
  phone?: string;
}

export const getUser = (): User | null => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const setUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export function clearUser(): void {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userProfile');
  localStorage.removeItem('shareProfile');
  localStorage.removeItem('userAvatar');
  localStorage.removeItem('guestMode');
  localStorage.removeItem('guestMeetingFeedbacks');
  localStorage.removeItem('guestFeedbackSettings');
  isGuestModeEnabled = false;
}

// Room 관련 기능
export interface Room {
  name: string;
  participants: number;
  hasPassword: boolean;
  createdAt: string;
  createdBy?: string;
}

export function saveRoom(room: Room): void {
  const rooms = getRooms();
  const existingIndex = rooms.findIndex(r => r.name === room.name);

  if (existingIndex >= 0) {
    rooms[existingIndex] = room;
  } else {
    rooms.unshift(room);
  }

  localStorage.setItem('meetingRooms', JSON.stringify(rooms));
}

export function getRooms(): Room[] {
  try {
    const roomsData = localStorage.getItem('meetingRooms');
    return roomsData ? JSON.parse(roomsData) : [];
  } catch (error) {
    console.error('방 목록 로드 실패:', error);
    return [];
  }
}

export function deleteRoom(roomName: string): void {
  const rooms = getRooms();
  const filteredRooms = rooms.filter(r => r.name !== roomName);
  localStorage.setItem('meetingRooms', JSON.stringify(filteredRooms));
}

// Guest 모드용 데이터 초기화 (기존 데이터 유지하면서 임시 상태로 전환)
export const initGuestMode = (): void => {
  // Guest 사용자로 설정하되 기존 데이터는 유지
  const guestUser = {
    email: 'guest@example.com',
    name: '게스트 사용자'
  };
  localStorage.setItem('guestMode', 'true');
  localStorage.setItem('user', JSON.stringify(guestUser));
  // 프로필과 설문 답변은 초기화하지 않음 (로그인 사용자 데이터 보존)
};

// Guest 모드 확인
export const isGuestMode = (): boolean => {
  return localStorage.getItem('guestMode') === 'true';
};

// Guest 모드 해제
export const exitGuestMode = (): void => {
  localStorage.removeItem('guestMode');
  localStorage.removeItem('user');
  // 게스트 모드 관련 데이터 정리
  localStorage.removeItem('guestMeetingFeedbacks');
  localStorage.removeItem('guestFeedbackSettings');
};

// Guest 사용자 이름 설정
export const setGuestName = (name: string): void => {
  if (isGuestMode()) {
    const guestUser: User = {
      email: 'guest@example.com',
      name: name,
      displayName: name
    };
    setUser(guestUser);

    // 게스트 모드에서는 프로필 공개를 기본값으로 설정
    if (localStorage.getItem('shareProfile') === null) {
      setShareProfile(true);
    }
  }
};

// Guest 이름 가져오기
export const getGuestName = (): string | null => {
  if (isGuestMode()) {
    const user = getUser();
    return user?.name || null;
  }
  return null;
};

export const getSurveyAnswers = (): SurveyAnswers | null => {
  const answers = localStorage.getItem('surveyAnswers');
  return answers ? JSON.parse(answers) : null;
};

export const setSurveyAnswers = (answers: SurveyAnswers): void => {
  localStorage.setItem('surveyAnswers', JSON.stringify(answers));
};

export const getUserProfile = (): UserProfile | null => {
  // Guest 모드에서도 프로필 조회 가능 (게스트용 임시 프로필)
  const profile = localStorage.getItem('userProfile');
  return profile ? JSON.parse(profile) : null;
};

// 서버에서 사용자 데이터를 로드하는 함수 추가
export const loadUserDataFromServer = async (): Promise<void> => {
  if (isGuestMode()) return;

  try {
    const response = await fetch('/api/auth/user');
    if (response.ok) {
      const userData = await response.json();

      // 서버에서 받은 데이터를 localStorage에 동기화
      if (userData.profileData) {
        localStorage.setItem('userProfile', JSON.stringify(userData.profileData));
        console.log('서버에서 프로필 데이터를 불러왔습니다.');
            }

      if (userData.feedbackData) {
        localStorage.setItem('meetingFeedbacks', JSON.stringify(userData.feedbackData));
        console.log('서버에서 피드백 데이터를 불러왔습니다.');
      }
    }
  } catch (error) {
    console.error('서버 데이터 로드 중 오류:', error);
  }
};

export const setUserProfile = async (profile: UserProfile): Promise<void> => {
  localStorage.setItem('userProfile', JSON.stringify(profile));

  // 로그인 사용자인 경우 서버에도 저장
  if (!isGuestMode()) {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileData: profile }),
      });

      if (!response.ok) {
        console.error('프로필 서버 저장 실패:', response.status);
      } else {
        console.log('프로필이 서버에 성공적으로 저장되었습니다.');
      }
    } catch (error) {
      console.error('프로필 서버 저장 중 오류:', error);
    }
  }
};

export const getShareProfile = (): boolean => {
  // 게스트 모드에서는 기본적으로 공개
  if (isGuestMode()) {
    const share = localStorage.getItem('shareProfile');
    return share !== 'false'; // 명시적으로 false가 아닌 경우 true (기본값)
  }

  const share = localStorage.getItem('shareProfile');
  return share === 'true';
};

export const setShareProfile = (share: boolean): void => {
  localStorage.setItem('shareProfile', share.toString());
};

// 피드백 관련 함수들
export const getMeetingFeedbacks = (): MeetingFeedback[] => {
  // 게스트 모드에서도 피드백 조회 가능 (게스트용 임시 피드백)
  const storageKey = isGuestMode() ? 'guestMeetingFeedbacks' : 'meetingFeedbacks';
  const feedbacks = localStorage.getItem(storageKey);
  return feedbacks ? JSON.parse(feedbacks) : [];
};

export const addMeetingFeedback = async (feedback: MeetingFeedback): Promise<void> => {
  // 게스트 모드에서도 피드백 저장 가능 (게스트용 임시 피드백)
  const storageKey = isGuestMode() ? 'guestMeetingFeedbacks' : 'meetingFeedbacks';
  const feedbacks = localStorage.getItem(storageKey);
  const currentFeedbacks = feedbacks ? JSON.parse(feedbacks) : [];
  currentFeedbacks.push(feedback);
  localStorage.setItem(storageKey, JSON.stringify(currentFeedbacks));

  // 로그인 사용자인 경우 서버에도 저장
  if (!isGuestMode()) {
    try {
      const response = await fetch('/api/user/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedbackData: currentFeedbacks }),
      });

      if (!response.ok) {
        console.error('피드백 서버 저장 실패:', response.status);
      } else {
        console.log('피드백이 서버에 성공적으로 저장되었습니다.');
      }
    } catch (error) {
      console.error('피드백 서버 저장 중 오류:', error);
    }
  }
};

export const updateFeedbackVisibility = (feedbackId: string, isVisible: boolean): void => {
  const storageKey = isGuestMode() ? 'guestMeetingFeedbacks' : 'meetingFeedbacks';
  const feedbacks = getMeetingFeedbacks();
  const updated = feedbacks.map(f => 
    f.id === feedbackId ? { ...f, isVisible } : f
  );
  localStorage.setItem(storageKey, JSON.stringify(updated));
};

export const getFeedbackSettings = (): FeedbackSettings => {
  // 게스트 모드에서도 피드백 설정 사용 가능 (기본값: 비공개)
  const storageKey = isGuestMode() ? 'guestFeedbackSettings' : 'feedbackSettings';
  const settings = localStorage.getItem(storageKey);
  return settings ? JSON.parse(settings) : { showFeedbackToOthers: false };
};

export const setFeedbackSettings = (settings: FeedbackSettings): void => {
  const storageKey = isGuestMode() ? 'guestFeedbackSettings' : 'feedbackSettings';
  localStorage.setItem(storageKey, JSON.stringify(settings));
};

// 피드백 요약 생성 함수
export const generateFeedbackSummary = (): FeedbackSummary => {
  const feedbacks = getMeetingFeedbacks();
  const currentUser = getUser();

  const defaultSummary: FeedbackSummary = {
    averageScores: {
      communicationClarity: 0,
      timeManagement: 0,
      collaboration: 0,
      preparation: 0,
      listening: 0
    },
    topStrengths: [],
    commonImprovements: [],
    totalFeedbacks: 0,
    meetingPersona: "새로운 미팅 참가자"
  };

  if (!currentUser) {
    return defaultSummary;
  }

  // 현재 사용자에 대한 피드백만 필터링
  const userFeedbacks = feedbacks.filter(f => f.targetUser === currentUser?.email || f.targetUser === currentUser?.name);

  if (userFeedbacks.length === 0) {
    return {
      ...defaultSummary,
      meetingPersona: "아직 충분한 피드백이 없습니다"
    };
  }

  // 평균 점수 계산 - null/undefined 체크 추가
  const totalScores = { communicationClarity: 0, timeManagement: 0, collaboration: 0, preparation: 0, listening: 0 };
  let validFeedbacksCount = 0;

  userFeedbacks.forEach(f => {
    if (f.responses && typeof f.responses === 'object') {
      const responses = f.responses;
      if (responses.communicationClarity !== undefined) {
        totalScores.communicationClarity += responses.communicationClarity || 0;
        totalScores.timeManagement += responses.timeManagement || 0;
        totalScores.collaboration += responses.collaboration || 0;
        totalScores.preparation += responses.preparation || 0;
        totalScores.listening += responses.listening || 0;
        validFeedbacksCount++;
      }
    }
  });

  const averageScores = validFeedbacksCount > 0 ? {
    communicationClarity: totalScores.communicationClarity / validFeedbacksCount,
    timeManagement: totalScores.timeManagement / validFeedbacksCount,
    collaboration: totalScores.collaboration / validFeedbacksCount,
    preparation: totalScores.preparation / validFeedbacksCount,
    listening: totalScores.listening / validFeedbacksCount
  } : defaultSummary.averageScores;

  // 강점 취합
  const strengthsCount: Record<string, number> = {};
  userFeedbacks.forEach(f => {
    if (Array.isArray(f.strengths)) {
      f.strengths.forEach(strength => {
        strengthsCount[strength] = (strengthsCount[strength] || 0) + 1;
      });
    }
  });

  const topStrengths = Object.entries(strengthsCount)
    .map(([strength, count]) => ({ strength, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 개선점 취합
  const improvementsCount: Record<string, number> = {};
  userFeedbacks.forEach(f => {
    if (Array.isArray(f.improvements)) {
      f.improvements.forEach(improvement => {
        improvementsCount[improvement] = (improvementsCount[improvement] || 0) + 1;
      });
    }
  });

  const commonImprovements = Object.entries(improvementsCount)
    .map(([improvement, count]) => ({ improvement, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // 미팅 성향 카드 생성
  const meetingPersona = generateMeetingPersona(averageScores, topStrengths);

  return {
    averageScores,
    topStrengths,
    commonImprovements,
    totalFeedbacks: userFeedbacks.length,
    meetingPersona
  };
};

// 미팅 성향 카드 생성 함수
const generateMeetingPersona = (scores: FeedbackSummary['averageScores'], strengths: { strength: string; count: number }[]): string => {
  const avgScore = (scores.communicationClarity + scores.timeManagement + scores.collaboration + scores.preparation + scores.listening) / 5;

  if (avgScore >= 4.5) {
    return "완벽한 미팅 리더";
  } else if (avgScore >= 4.0) {
    if (scores.communicationClarity >= 4.5) return "명확한 소통 전문가";
    if (scores.collaboration >= 4.5) return "협업의 달인";
    if (scores.preparation >= 4.5) return "철저한 준비왕";
    return "믿음직한 미팅 파트너";
  } else if (avgScore >= 3.5) {
    if (scores.listening >= 4.0) return "경청하는 조력자";
    if (scores.timeManagement >= 4.0) return "시간 관리 마스터";
    return "성장하는 협력자";
  } else {
    return "발전 가능성이 큰 미팅 참가자";
  }
};

// 이전 참여자 관리 함수들
export const getPreviousParticipants = (): PreviousParticipant[] => {
  const participants = localStorage.getItem('previousParticipants');
  return participants ? JSON.parse(participants) : [];
};

export const addPreviousParticipant = (participant: PreviousParticipant): void => {
  const participants = getPreviousParticipants();
  const existingIndex = participants.findIndex(p => p.email === participant.email);

  if (existingIndex >= 0) {
    // 기존 참여자면 미팅 횟수 증가 및 최근 미팅 날짜 업데이트
    participants[existingIndex].meetingCount += 1;
    participants[existingIndex].lastMeetingDate = participant.lastMeetingDate;
  } else {
    // 새 참여자면 추가
    participants.push(participant);
  }

  localStorage.setItem('previousParticipants', JSON.stringify(participants));
};

export const getFrequentParticipants = (): PreviousParticipant[] => {
  return getPreviousParticipants()
    .sort((a, b) => b.meetingCount - a.meetingCount)
    .slice(0, 10); // 최대 10명
};

// 프로필 표시 설정 관리
export const getProfileDisplaySettings = (): ProfileDisplaySettings => {
  const settings = localStorage.getItem('profileDisplaySettings');
  return settings ? JSON.parse(settings) : { dataSource: 'auto' };
};

export const setProfileDisplaySettings = (settings: ProfileDisplaySettings): void => {
  localStorage.setItem('profileDisplaySettings', JSON.stringify(settings));
};

// 피드백 기반 프로필 생성
export const generateFeedbackBasedProfile = (): UserProfile | null => {
  const summary = generateFeedbackSummary();

  if (summary.totalFeedbacks < 3) {
    return null; // 충분한 피드백이 없으면 null 반환
  }

  const avgScore = (
    summary.averageScores.communicationClarity +
    summary.averageScores.timeManagement +
    summary.averageScores.collaboration +
    summary.averageScores.preparation +
    summary.averageScores.listening
  ) / 5;

  // 피드백 점수와 강점을 기반으로 프로필 생성
  let style = "피드백 기반 소통자";
  let tips = "동료들의 피드백을 바탕으로 한 실제 소통 스타일입니다.";
  let emotionalStyle = "협업 검증형";
  let collaborationTips = "실제 협업 경험을 통해 검증된 소통 방식을 보여줍니다.";

  // 평균 점수에 따른 스타일 결정
  if (avgScore >= 4.5) {
    style = "검증된 리더십 소통자";
    tips = "동료들로부터 일관되게 높은 평가를 받는 뛰어난 소통 능력을 보유하고 있습니다.";
    emotionalStyle = "신뢰받는 협력자";
    collaborationTips = "팀원들이 인정하는 탁월한 협업 능력으로 프로젝트를 성공으로 이끕니다.";
  } else if (avgScore >= 4.0) {
    if (summary.averageScores.communicationClarity >= 4.5) {
      style = "명확한 의사소통 전문가";
      tips = "동료들이 인정하는 뛰어난 의사소통 능력을 가지고 있습니다.";
    } else if (summary.averageScores.collaboration >= 4.5) {
      style = "협업 마스터";
      tips = "팀워크와 협업에서 특히 강점을 보이는 소통자입니다.";
    } else if (summary.averageScores.preparation >= 4.5) {
      style = "체계적 준비형 리더";
      tips = "철저한 준비와 계획으로 미팅의 효율성을 높입니다.";
    }
  } else if (avgScore >= 3.5) {
    style = "성장하는 협력자";
    tips = "지속적으로 발전하고 있는 소통 능력을 보여줍니다.";
    emotionalStyle = "발전형 팀원";
    collaborationTips = "피드백을 바탕으로 계속 성장하는 협업 스타일을 가지고 있습니다.";
  }

  // 주요 강점 반영
  if (summary.topStrengths.length > 0) {
    const topStrength = summary.topStrengths[0].strength;
    collaborationTips = `특히 "${topStrength}" 부분에서 동료들로부터 높은 평가를 받고 있습니다. ${collaborationTips}`;
  }

  return {
    style,
    tips,
    emotionalStyle,
    collaborationTips,
    stressManagement: "피드백 기반 스트레스 관리",
    feedbackStyle: "실제 경험 기반 피드백",
    conflictResolution: "검증된 갈등 해결",
    problemSolving: "협업 검증된 문제 해결",
    workStyle: "팀 인정 업무 스타일",
    communicationChannel: "효과적인 소통 채널",
    riskProfile: "균형잡힌 위험 관리",
    learningPreference: "경험 기반 학습"
  };
};

// 표시할 프로필 결정
export const getDisplayProfile = (): UserProfile | null => {
  const settings = getProfileDisplaySettings();
  const surveyProfile = getUserProfile();
  const feedbackProfile = generateFeedbackBasedProfile();

  switch (settings.dataSource) {
    case 'survey':
      return surveyProfile;
    case 'feedback':
      return feedbackProfile;
    case 'auto':
    default:
      // 충분한 피드백이 있으면 피드백 기반, 없으면 설문 기반
      return feedbackProfile || surveyProfile;
  }
};



// 온라인 사용자 조회 (초대 기능용)
export const getOnlineUsers = async (): Promise<AppUser[]> => {
  const response = await fetch('/api/users/online', {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch online users');
  }

  return response.json();
};

// 미팅룸 생성
export const createMeetingRoom = async (roomData: {
  name: string;
  hasPassword?: boolean;
  password?: string;
  zoomLink?: string;
  teamsLink?: string;
  scheduledAt?: Date;
}): Promise<MeetingRoom> => {
  const response = await fetch('/api/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(roomData),
  });

  if (!response.ok) {
    throw new Error('Failed to create room');
  }

  return response.json();
};

// 미팅룸 목록 조회
export const getMeetingRooms = async (): Promise<MeetingRoom[]> => {
  const response = await fetch('/api/rooms', {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch rooms');
  }

  return response.json();
};

// 미팅룸 상세 조회
export const getMeetingRoomById = async (id: number): Promise<MeetingRoom> => {
  const response = await fetch(`/api/rooms/${id}`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch room');
  }

  return response.json();
};

// 미팅룸 업데이트
export const updateMeetingRoom = async (id: number, updates: Partial<MeetingRoom>): Promise<void> => {
  const response = await fetch(`/api/rooms/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update room');
  }
};

// 미팅룸 삭제
export const deleteMeetingRoom = async (id: number): Promise<void> => {
  const response = await fetch(`/api/rooms/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to delete room');
  }
};

// MeetingRoom 타입 정의 (서버 스키마와 일치)
export interface MeetingRoom {
  id: number;
  name: string;
  createdBy?: number;
  hasPassword: boolean;
  password?: string;
  zoomLink?: string;
  teamsLink?: string;
  participantCount: number;
  roomData?: any;
  createdAt?: Date;
  scheduledAt?: Date;
}

export interface AppUser {
  id: number;
  email: string;
  name: string;
  profileData?: any;
  feedbackData?: any;
  isLoggedIn?: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
}

let isGuestModeEnabled = false;