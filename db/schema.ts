import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  bigint,
  boolean,
  index,
} from "drizzle-orm/pg-core";

// ============================================================
// ENUMS
// ============================================================
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const difficultyEnum = pgEnum("difficulty", ["Beginner", "Easy", "Medium", "Hard", "Expert"]);
export const challengeDifficultyEnum = pgEnum("challenge_difficulty", ["Easy", "Medium", "Hard"]);
export const questDifficultyEnum = pgEnum("quest_difficulty", ["Easy", "Medium", "Hard"]);
export const lessonTypeEnum = pgEnum("lesson_type", ["reading", "video", "interactive", "coding"]);
export const submissionStatusEnum = pgEnum("submission_status", ["pending", "accepted", "wrong_answer", "time_limit", "runtime_error", "compilation_error"]);
export const achievementCategoryEnum = pgEnum("achievement_category", ["learning", "coding", "streak", "social", "special", "course", "challenge", "secret"]);
export const chatRoleEnum = pgEnum("chat_role", ["user", "assistant"]);

// ============================================================
// USERS (OAuth users from auth system)
// ============================================================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================
// PROFILES -- Gamification data per user
// ============================================================
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number" }).notNull().unique(),
  displayName: varchar("displayName", { length: 100 }),
  bio: text("bio"),
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  coins: integer("coins").default(100).notNull(),
  energy: integer("energy").default(100).notNull(),
  maxEnergy: integer("maxEnergy").default(100).notNull(),
  currentStreak: integer("currentStreak").default(0).notNull(),
  longestStreak: integer("longestStreak").default(0).notNull(),
  lastLoginDate: varchar("lastLoginDate", { length: 10 }),
  totalLessons: integer("totalLessons").default(0).notNull(),
  totalQuizzes: integer("totalQuizzes").default(0).notNull(),
  totalChallenges: integer("totalChallenges").default(0).notNull(),
  totalAchievements: integer("totalAchievements").default(0).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  index("profiles_userId_idx").on(table.userId),
]);

export type Profile = typeof profiles.$inferSelect;

// ============================================================
// COURSES
// ============================================================
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  longDescription: text("longDescription"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }).default("#6366f1"),
  difficulty: difficultyEnum("difficulty").default("Beginner").notNull(),
  category: varchar("category", { length: 50 }).default("Frontend"),
  tags: text("tags"),
  totalLessons: integer("totalLessons").default(0).notNull(),
  totalQuizzes: integer("totalQuizzes").default(0).notNull(),
  totalChallenges: integer("totalChallenges").default(0).notNull(),
  estimatedHours: integer("estimatedHours").default(0).notNull(),
  xpReward: integer("xpReward").default(500).notNull(),
  coinReward: integer("coinReward").default(250).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});

export type Course = typeof courses.$inferSelect;

// ============================================================
// MODULES
// ============================================================
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: bigint("courseId", { mode: "number" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  order: integer("order").default(0).notNull(),
  xpReward: integer("xpReward").default(50).notNull(),
  isBossModule: boolean("isBossModule").default(false).notNull(),
});

export type Module = typeof modules.$inferSelect;

// ============================================================
// LESSONS
// ============================================================
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: bigint("moduleId", { mode: "number" }).notNull(),
  courseId: bigint("courseId", { mode: "number" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  description: text("description"),
  content: text("content").notNull(),
  codeExamples: text("codeExamples"),
  type: lessonTypeEnum("type").default("reading").notNull(),
  xpReward: integer("xpReward").default(20).notNull(),
  coinReward: integer("coinReward").default(10).notNull(),
  energyCost: integer("energyCost").default(5).notNull(),
  estimatedMinutes: integer("estimatedMinutes").default(10).notNull(),
  order: integer("order").default(0).notNull(),
}, (table) => [
  index("lessons_courseId_idx").on(table.courseId),
  index("lessons_moduleId_idx").on(table.moduleId),
]);

export type Lesson = typeof lessons.$inferSelect;

// ============================================================
// QUIZZES
// ============================================================
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: bigint("lessonId", { mode: "number" }).notNull(),
  courseId: bigint("courseId", { mode: "number" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  questions: text("questions").notNull(),
  passingScore: integer("passingScore").default(70).notNull(),
  xpReward: integer("xpReward").default(50).notNull(),
  coinReward: integer("coinReward").default(25).notNull(),
});

export type Quiz = typeof quizzes.$inferSelect;

// ============================================================
// CHALLENGES
// ============================================================
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description").notNull(),
  difficulty: challengeDifficultyEnum("difficulty").default("Easy").notNull(),
  category: varchar("category", { length: 50 }).default("Arrays"),
  problemStatement: text("problemStatement").notNull(),
  constraints: text("constraints"),
  examples: text("examples"),
  starterCode: text("starterCode"),
  hints: text("hints"),
  testCases: text("testCases"),
  xpReward: integer("xpReward").default(50).notNull(),
  coinReward: integer("coinReward").default(25).notNull(),
  solveCount: integer("solveCount").default(0).notNull(),
  attemptCount: integer("attemptCount").default(0).notNull(),
}, (table) => [
  index("challenges_difficulty_idx").on(table.difficulty),
]);

export type Challenge = typeof challenges.$inferSelect;

// ============================================================
// ACHIEVEMENTS
// ============================================================
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: achievementCategoryEnum("category").default("learning").notNull(),
  icon: varchar("icon", { length: 50 }).default("Star"),
  color: varchar("color", { length: 20 }).default("#6366f1"),
  requirementType: varchar("requirementType", { length: 50 }).default("lessons_completed"),
  requirementCount: integer("requirementCount").default(1).notNull(),
  xpReward: integer("xpReward").default(0).notNull(),
  coinReward: integer("coinReward").default(0).notNull(),
  isSecret: boolean("isSecret").default(false).notNull(),
});

export type Achievement = typeof achievements.$inferSelect;

// ============================================================
// USER ACHIEVEMENTS
// ============================================================
export const userAchievements = pgTable("userAchievements", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  achievementId: bigint("achievementId", { mode: "number" }).notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt", { withTimezone: true }),
  progress: integer("progress").default(0).notNull(),
}, (table) => [
  index("ua_userId_idx").on(table.userId),
]);

export type UserAchievement = typeof userAchievements.$inferSelect;

// ============================================================
// COURSE PROGRESS
// ============================================================
export const courseProgress = pgTable("courseProgress", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  courseId: bigint("courseId", { mode: "number" }).notNull(),
  completedLessons: text("completedLessons"),
  completedQuizzes: text("completedQuizzes"),
  completedChallenges: text("completedChallenges"),
  currentLessonId: varchar("currentLessonId", { length: 20 }),
  overallProgress: integer("overallProgress").default(0).notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("cp_userId_idx").on(table.userId),
  index("cp_courseId_idx").on(table.courseId),
]);

export type CourseProgress = typeof courseProgress.$inferSelect;

// ============================================================
// CODE SUBMISSIONS
// ============================================================
export const codeSubmissions = pgTable("codeSubmissions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  challengeId: bigint("challengeId", { mode: "number" }).notNull(),
  language: varchar("language", { length: 30 }).default("javascript").notNull(),
  sourceCode: text("sourceCode"),
  status: submissionStatusEnum("status").default("pending").notNull(),
  testResults: text("testResults"),
  xpAwarded: integer("xpAwarded").default(0).notNull(),
  coinsAwarded: integer("coinsAwarded").default(0).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("cs_userId_idx").on(table.userId),
]);

export type CodeSubmission = typeof codeSubmissions.$inferSelect;

// ============================================================
// DAILY QUESTS
// ============================================================
export const dailyQuests = pgTable("dailyQuests", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  questType: varchar("questType", { length: 50 }).default("complete_lessons"),
  requirement: integer("requirement").default(1).notNull(),
  xpReward: integer("xpReward").default(50).notNull(),
  coinReward: integer("coinReward").default(25).notNull(),
  difficulty: questDifficultyEnum("difficulty").default("Easy").notNull(),
  icon: varchar("icon", { length: 50 }).default("Target"),
});

export type DailyQuest = typeof dailyQuests.$inferSelect;

// ============================================================
// USER DAILY QUESTS
// ============================================================
export const userDailyQuests = pgTable("userDailyQuests", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  questId: bigint("questId", { mode: "number" }).notNull(),
  progress: integer("progress").default(0).notNull(),
  completed: boolean("completed").default(false).notNull(),
  claimed: boolean("claimed").default(false).notNull(),
  assignedAt: varchar("assignedAt", { length: 10 }).notNull(),
}, (table) => [
  index("udq_userId_idx").on(table.userId),
]);

export type UserDailyQuest = typeof userDailyQuests.$inferSelect;

// ============================================================
// ACTIVITY LOGS
// ============================================================
export const activityLogs = pgTable("activityLogs", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  activityType: varchar("activityType", { length: 50 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  xpEarned: integer("xpEarned").default(0).notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("al_userId_idx").on(table.userId),
]);

export type ActivityLog = typeof activityLogs.$inferSelect;

// ============================================================
// LEADERBOARD ENTRIES
// ============================================================
export const leaderboardEntries = pgTable("leaderboardEntries", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  username: varchar("username", { length: 100 }).notNull(),
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  weeklyXp: integer("weeklyXp").default(0).notNull(),
  currentStreak: integer("currentStreak").default(0).notNull(),
  challengesSolved: integer("challengesSolved").default(0).notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("le_userId_idx").on(table.userId),
  index("le_xp_idx").on(table.xp),
]);

export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;

// ============================================================
// CHAT MESSAGES (AI Mentor)
// ============================================================
export const chatMessages = pgTable("chatMessages", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  role: chatRoleEnum("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("cm_userId_idx").on(table.userId),
]);

export type ChatMessage = typeof chatMessages.$inferSelect;
