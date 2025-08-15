import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, index, uuid, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from 'drizzle-orm';

// Session storage table for login sessions
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Organizations (기업/조직) table
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  domain: text("domain"), // 기업 도메인 (예: kt.com)
  inviteCode: text("invite_code").notNull().unique(), // 초대 코드
  logoUrl: text("logo_url"),
  description: text("description"),
  isPublic: boolean("is_public").default(false), // 공개 조직 여부
  settings: jsonb("settings"), // 조직 설정
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Organization members table
export const organizationMembers = pgTable("organization_members", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id"), // nullable for guest users
  guestName: text("guest_name"), // 게스트 사용자 이름
  guestEmail: text("guest_email"), // 게스트 사용자 이메일
  role: text("role").notNull().default("member"), // admin, manager, member, guest
  department: text("department"),
  position: text("position"),
  profileData: jsonb("profile_data"), // MBTI 분석 결과
  joinedAt: timestamp("joined_at").defaultNow(),
  lastActiveAt: timestamp("last_active_at"),
}, (table) => [
  unique().on(table.organizationId, table.userId),
]);

// User storage table for app users
export const appUsers = pgTable("app_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  profileData: jsonb("profile_data"), // 설문 결과와 프로필 저장
  feedbackData: jsonb("feedback_data"), // 피드백 데이터 저장
  isLoggedIn: boolean("is_logged_in").default(false),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Icebreaking sessions table
export const icebreakingSessions = pgTable("icebreaking_sessions", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id),
  title: text("title").notNull(),
  description: text("description"),
  inviteCode: text("invite_code").notNull().unique(), // 세션별 초대 코드
  hostId: integer("host_id"), // nullable for guest hosts
  hostName: text("host_name").notNull(), // 호스트 이름
  maxParticipants: integer("max_participants").default(20),
  isPublic: boolean("is_public").default(true), // 공개 세션 여부
  status: text("status").notNull().default("waiting"), // waiting, active, completed
  activities: jsonb("activities"), // 아이스브레이킹 활동 설정
  settings: jsonb("settings"), // 세션 설정
  createdAt: timestamp("created_at").defaultNow(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  scheduledAt: timestamp("scheduled_at"),
});

// Icebreaking participants table
export const icebreakingParticipants = pgTable("icebreaking_participants", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => icebreakingSessions.id).notNull(),
  userId: integer("user_id"), // nullable for guest participants
  guestName: text("guest_name"), // 게스트 참가자 이름
  guestEmail: text("guest_email"), // 게스트 참가자 이메일 (선택)
  profileData: jsonb("profile_data"), // MBTI 분석 결과
  surveyCompleted: boolean("survey_completed").default(false),
  joinedAt: timestamp("joined_at").defaultNow(),
  lastActiveAt: timestamp("last_active_at"),
}, (table) => [
  unique().on(table.sessionId, table.userId),
  unique().on(table.sessionId, table.guestName),
]);

// Meeting rooms table (기존 유지, 조직 연결 추가)
export const meetingRooms = pgTable("meeting_rooms", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id),
  name: text("name").notNull(),
  createdBy: integer("created_by").references(() => appUsers.id),
  hasPassword: boolean("has_password").default(false),
  password: text("password"),
  zoomLink: text("zoom_link"),
  teamsLink: text("teams_link"),
  participantCount: integer("participant_count").default(0),
  roomData: jsonb("room_data"), // 참가자 및 설정 저장
  createdAt: timestamp("created_at").defaultNow(),
  scheduledAt: timestamp("scheduled_at"),
});

// Teams table for organization analysis
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  department: text("department"),
  description: text("description"),
  createdBy: integer("created_by").references(() => appUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Team members table for team analysis
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  name: text("name").notNull(),
  email: text("email"),
  department: text("department"),
  position: text("position"),
  communicationStyle: text("communication_style"),
  strengths: text("strengths").array(),
  challenges: text("challenges").array(),
  profileData: jsonb("profile_data"), // Survey results
  createdAt: timestamp("created_at").defaultNow(),
});

// 기존 users 테이블 (backward compatibility)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Schema types and validators
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAppUserSchema = createInsertSchema(appUsers).pick({
  email: true,
  name: true,
});

export const insertOrganizationSchema = createInsertSchema(organizations).pick({
  name: true,
  domain: true,
  description: true,
  isPublic: true,
});

export const insertOrganizationMemberSchema = createInsertSchema(organizationMembers).pick({
  organizationId: true,
  guestName: true,
  guestEmail: true,
  role: true,
  department: true,
  position: true,
});

export const insertIcebreakingSessionSchema = createInsertSchema(icebreakingSessions).pick({
  title: true,
  description: true,
  hostName: true,
  maxParticipants: true,
  isPublic: true,
}).extend({
  organizationId: z.number().optional(),
  scheduledAt: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

export const insertIcebreakingParticipantSchema = createInsertSchema(icebreakingParticipants).pick({
  sessionId: true,
  guestName: true,
  guestEmail: true,
});

export const insertMeetingRoomSchema = createInsertSchema(meetingRooms).pick({
  name: true,
  zoomLink: true,
  teamsLink: true,
}).extend({
  description: z.string().optional(),
  organizationId: z.number().optional(),
  hasPassword: z.boolean().optional(),
  password: z.string().optional(),
  scheduledAt: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  department: true,
  description: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  teamId: true,
  name: true,
  email: true,
  department: true,
  position: true,
  communicationStyle: true,
  strengths: true,
  challenges: true,
  profileData: true,
});

// 회의 기록 테이블
export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  roomName: varchar("room_name", { length: 100 }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  objectives: text("objectives").array(), // 회의 목표들
  actualDuration: integer("actual_duration"), // 실제 소요 시간 (분)
  plannedDuration: integer("planned_duration"), // 계획된 시간 (분)
  organizerId: integer("organizer_id").references(() => appUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// 회의 참가자 테이블
export const meetingParticipants = pgTable("meeting_participants", {
  id: serial("id").primaryKey(),
  meetingId: integer("meeting_id").references(() => meetings.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => appUsers.id),
  attendanceStatus: varchar("attendance_status", { length: 20 }).default("attended"), // attended, absent, late
  joinTime: timestamp("join_time"),
  leaveTime: timestamp("leave_time"),
});

// 회의 피드백 테이블
export const meetingFeedback = pgTable("meeting_feedback", {
  id: serial("id").primaryKey(),
  meetingId: integer("meeting_id").references(() => meetings.id, { onDelete: "cascade" }),
  participantId: integer("participant_id").references(() => appUsers.id),
  satisfactionScore: integer("satisfaction_score"), // 1-5점
  objectiveAchievement: integer("objective_achievement"), // 목표 달성도 1-5점
  timeEfficiency: integer("time_efficiency"), // 시간 효율성 1-5점
  communicationQuality: integer("communication_quality"), // 소통 품질 1-5점
  comments: text("comments"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMeetingSchema = createInsertSchema(meetings);
export const insertMeetingParticipantSchema = createInsertSchema(meetingParticipants);
export const insertMeetingFeedbackSchema = createInsertSchema(meetingFeedback);

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type AppUser = typeof appUsers.$inferSelect;
export type InsertAppUser = z.infer<typeof insertAppUserSchema>;
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type InsertOrganizationMember = z.infer<typeof insertOrganizationMemberSchema>;
export type IcebreakingSession = typeof icebreakingSessions.$inferSelect;
export type InsertIcebreakingSession = z.infer<typeof insertIcebreakingSessionSchema>;
export type IcebreakingParticipant = typeof icebreakingParticipants.$inferSelect;
export type InsertIcebreakingParticipant = z.infer<typeof insertIcebreakingParticipantSchema>;
export type MeetingRoom = typeof meetingRooms.$inferSelect;
export type InsertMeetingRoom = z.infer<typeof insertMeetingRoomSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = typeof meetings.$inferInsert;
export type MeetingParticipant = typeof meetingParticipants.$inferSelect;
export type InsertMeetingParticipant = typeof meetingParticipants.$inferInsert;
export type MeetingFeedback = typeof meetingFeedback.$inferSelect;
export type InsertMeetingFeedback = typeof meetingFeedback.$inferInsert;
