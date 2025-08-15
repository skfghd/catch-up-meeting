import { apiRequest } from "@/lib/queryClient";

export interface Room {
  id?: number;
  name: string;
  participants: number;
  hasPassword?: boolean;
  password?: string;
  createdAt: string;
  zoomLink?: string;
  teamsLink?: string;
  scheduledAt?: Date;
  participantCount?: number;
  type?: string;
  duration?: string;
  urgency?: 'low' | 'medium' | 'high';
  createdBy?: number;
}

export interface CreateRoomRequest {
  name: string;
  hasPassword?: boolean;
  password?: string;
  zoomLink?: string;
  teamsLink?: string;
  scheduledAt?: Date;
}

// API functions for authenticated users
export const createRoom = async (roomData: CreateRoomRequest): Promise<Room> => {
  return apiRequest('/api/rooms', {
    method: 'POST',
    body: JSON.stringify(roomData),
  });
};

export const getRooms = async (): Promise<Room[]> => {
  return apiRequest('/api/rooms');
};

export const updateRoom = async (roomId: number, updates: Partial<Room>): Promise<void> => {
  return apiRequest(`/api/rooms/${roomId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

export const deleteRoom = async (roomId: number): Promise<void> => {
  return apiRequest(`/api/rooms/${roomId}`, {
    method: 'DELETE',
  });
};

// Local storage functions for guest users and sample rooms
const SAMPLE_ROOMS_KEY = 'sampleRooms';
const USER_ROOMS_KEY = 'userRooms';

export const getSampleRooms = (): Room[] => {
  const stored = localStorage.getItem(SAMPLE_ROOMS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default sample rooms
  const sampleRooms: Room[] = [
    { 
      name: '디자인 스프린트 계획', 
      participants: 4, 
      hasPassword: false, 
      createdAt: new Date().toISOString(),
      type: 'collaboration',
      duration: '2시간',
      urgency: 'high'
    },
    { 
      name: '분기별 성과 검토', 
      participants: 7, 
      hasPassword: false, 
      createdAt: new Date().toISOString(),
      type: 'review',
      duration: '1시간 30분',
      urgency: 'medium'
    },
    { 
      name: '제품 로드맵 브레인스토밍', 
      participants: 3, 
      hasPassword: false, 
      createdAt: new Date().toISOString(),
      type: 'brainstorming',
      duration: '1시간',
      urgency: 'low'
    },
    { 
      name: '신규 기능 최종 결정', 
      participants: 5, 
      hasPassword: false, 
      createdAt: new Date().toISOString(),
      type: 'decision',
      duration: '45분',
      urgency: 'high'
    },
    { 
      name: 'Q1 프로젝트 킥오프', 
      participants: 8, 
      hasPassword: false, 
      createdAt: new Date().toISOString(),
      type: 'kickoff',
      duration: '2시간',
      urgency: 'medium'
    },
    { 
      name: '개인 프로젝트 검토', 
      participants: 2, 
      hasPassword: true, 
      createdAt: new Date().toISOString(),
      type: 'review',
      duration: '30분',
      urgency: 'low'
    }
  ];
  
  localStorage.setItem(SAMPLE_ROOMS_KEY, JSON.stringify(sampleRooms));
  return sampleRooms;
};

export const getUserCreatedRooms = (): Room[] => {
  const stored = localStorage.getItem(USER_ROOMS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveUserCreatedRoom = (room: Room): void => {
  const rooms = getUserCreatedRooms();
  rooms.unshift(room); // Add to beginning of array
  localStorage.setItem(USER_ROOMS_KEY, JSON.stringify(rooms));
};

export const deleteUserCreatedRoom = (roomName: string): void => {
  const rooms = getUserCreatedRooms();
  const filtered = rooms.filter(room => room.name !== roomName);
  localStorage.setItem(USER_ROOMS_KEY, JSON.stringify(filtered));
};

export const updateUserCreatedRoom = (roomName: string, updates: Partial<Room>): void => {
  const rooms = getUserCreatedRooms();
  const index = rooms.findIndex(room => room.name === roomName);
  if (index !== -1) {
    rooms[index] = { ...rooms[index], ...updates };
    localStorage.setItem(USER_ROOMS_KEY, JSON.stringify(rooms));
  }
};

// Helper function to check if a room is user-created (for deletion permissions)
export const isUserCreatedRoom = (roomName: string): boolean => {
  const userRooms = getUserCreatedRooms();
  return userRooms.some(room => room.name === roomName);
};

// Combined function to get all rooms (sample + user-created + server rooms)
export const getAllRooms = async (isAuthenticated: boolean): Promise<Room[]> => {
  const sampleRooms = getSampleRooms();
  const userCreatedRooms = getUserCreatedRooms();
  
  if (isAuthenticated) {
    try {
      const serverRooms = await getRooms();
      // Combine all rooms and remove duplicates by name
      const allRooms = [...userCreatedRooms, ...serverRooms, ...sampleRooms];
      return allRooms.filter((room, index, self) => 
        index === self.findIndex(r => r.name === room.name)
      );
    } catch (error) {
      console.error('Failed to fetch server rooms:', error);
      return [...userCreatedRooms, ...sampleRooms];
    }
  }
  
  return [...userCreatedRooms, ...sampleRooms];
};