const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const { z } = require("zod");

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Express firebaseApp setup
const firebaseApp = express();

// Middleware
firebaseApp.use(cors({ 
  origin: true,
  credentials: true 
}));
firebaseApp.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
firebaseApp.use("/api/", limiter);

// Session configuration
const MemoryStore = require("memorystore")(session);
firebaseApp.use(session({
  secret: functions.config().app?.session_secret || "fallback-secret-for-dev",
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Validation schemas
const AppUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  profileData: z.any().optional(),
  feedbackData: z.any().optional(),
  isLoggedIn: z.boolean().default(false)
});

const OrganizationSchema = z.object({
  name: z.string().min(1),
  domain: z.string().optional(),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  settings: z.any().optional()
});

const IcebreakingSessionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  hostName: z.string().min(1),
  maxParticipants: z.number().default(20),
  isPublic: z.boolean().default(true),
  organizationId: z.string().optional(),
  scheduledAt: z.string().optional()
});

const MeetingRoomSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  zoomLink: z.string().optional(),
  teamsLink: z.string().optional(),
  hasPassword: z.boolean().default(false),
  password: z.string().optional(),
  organizationId: z.string().optional(),
  scheduledAt: z.string().optional()
});

// Helper function to generate unique codes
function generateCode(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper function to ensure unique invite code
async function generateUniqueInviteCode(collection: string): Promise<string> {
  let code: string;
  let exists = true;
  
  while (exists) {
    code = generateCode();
    const snapshot = await db.collection(collection)
      .where('inviteCode', '==', code)
      .limit(1)
      .get();
    exists = !snapshot.empty;
  }
  
  return code!;
}

// Routes

// Health check
firebaseApp.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// App Users endpoints
firebaseApp.post("/api/users", async (req, res) => {
  try {
    const userData = AppUserSchema.parse(req.body);
    const userRef = await db.collection('appUsers').add({
      ...userData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: userData.isLoggedIn ? admin.firestore.FieldValue.serverTimestamp() : null
    });
    
    const user = await userRef.get();
    res.json({ id: userRef.id, ...user.data() });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: "Invalid user data" });
  }
});

firebaseApp.get("/api/users", async (req, res) => {
  try {
    const { search } = req.query;
    let query = db.collection('appUsers');
    
    if (search) {
      // Firestore doesn't support case-insensitive search, so we'll do basic filtering
      query = query.where('name', '>=', search).where('name', '<=', search + '\uf8ff');
    }
    
    const snapshot = await query.get();
    const users = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

firebaseApp.get("/api/users/:id", async (req, res) => {
  try {
    const userDoc = await db.collection('appUsers').doc(req.params.id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

firebaseApp.put("/api/users/:id", async (req, res) => {
  try {
    const updates = req.body;
    await db.collection('appUsers').doc(req.params.id).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Organizations endpoints
firebaseApp.post("/api/organizations", async (req, res) => {
  try {
    const orgData = OrganizationSchema.parse(req.body);
    const inviteCode = await generateUniqueInviteCode('organizations');
    
    const orgRef = await db.collection('organizations').add({
      ...orgData,
      inviteCode,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const org = await orgRef.get();
    res.json({ id: orgRef.id, ...org.data() });
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(400).json({ error: "Invalid organization data" });
  }
});

firebaseApp.get("/api/organizations", async (req, res) => {
  try {
    const snapshot = await db.collection('organizations').get();
    const organizations = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    res.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ error: "Failed to fetch organizations" });
  }
});

firebaseApp.get("/api/organizations/:id", async (req, res) => {
  try {
    const orgDoc = await db.collection('organizations').doc(req.params.id).get();
    if (!orgDoc.exists) {
      return res.status(404).json({ error: "Organization not found" });
    }
    res.json({ id: orgDoc.id, ...orgDoc.data() });
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ error: "Failed to fetch organization" });
  }
});

// Icebreaking Sessions endpoints
firebaseApp.post("/api/icebreaking-sessions", async (req, res) => {
  try {
    const sessionData = IcebreakingSessionSchema.parse(req.body);
    const inviteCode = await generateUniqueInviteCode('icebreakingSessions');
    
    const sessionRef = await db.collection('icebreakingSessions').add({
      ...sessionData,
      inviteCode,
      status: 'waiting',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      scheduledAt: sessionData.scheduledAt ? new Date(sessionData.scheduledAt) : null
    });
    
    const session = await sessionRef.get();
    res.json({ id: sessionRef.id, ...session.data() });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(400).json({ error: "Invalid session data" });
  }
});

firebaseApp.get("/api/icebreaking-sessions", async (req, res) => {
  try {
    const { organizationId } = req.query;
    let query = db.collection('icebreakingSessions');
    
    if (organizationId) {
      query = query.where('organizationId', '==', organizationId);
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const sessions = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

firebaseApp.get("/api/icebreaking-sessions/:id", async (req, res) => {
  try {
    const sessionDoc = await db.collection('icebreakingSessions').doc(req.params.id).get();
    if (!sessionDoc.exists) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json({ id: sessionDoc.id, ...sessionDoc.data() });
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

// Meeting Rooms endpoints
firebaseApp.post("/api/meeting-rooms", async (req, res) => {
  try {
    const roomData = MeetingRoomSchema.parse(req.body);
    
    const roomRef = await db.collection('meetingRooms').add({
      ...roomData,
      participantCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      scheduledAt: roomData.scheduledAt ? new Date(roomData.scheduledAt) : null
    });
    
    const room = await roomRef.get();
    res.json({ id: roomRef.id, ...room.data() });
  } catch (error) {
    console.error("Error creating meeting room:", error);
    res.status(400).json({ error: "Invalid meeting room data" });
  }
});

firebaseApp.get("/api/meeting-rooms", async (req, res) => {
  try {
    const { organizationId } = req.query;
    let query = db.collection('meetingRooms');
    
    if (organizationId) {
      query = query.where('organizationId', '==', organizationId);
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const rooms = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching meeting rooms:", error);
    res.status(500).json({ error: "Failed to fetch meeting rooms" });
  }
});

firebaseApp.get("/api/meeting-rooms/:id", async (req, res) => {
  try {
    const roomDoc = await db.collection('meetingRooms').doc(req.params.id).get();
    if (!roomDoc.exists) {
      return res.status(404).json({ error: "Meeting room not found" });
    }
    res.json({ id: roomDoc.id, ...roomDoc.data() });
  } catch (error) {
    console.error("Error fetching meeting room:", error);
    res.status(500).json({ error: "Failed to fetch meeting room" });
  }
});

// Export the firebaseApp as a Firebase Function
module.exports = {
  app: functions.region('asia-northeast3').https.onRequest(firebaseApp)
};