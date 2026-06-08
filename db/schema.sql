-- ============================================================
-- BITXY SCHEMA FOR SUPABASE
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS "chatMessages" CASCADE;
DROP TABLE IF EXISTS "leaderboardEntries" CASCADE;
DROP TABLE IF EXISTS "activityLogs" CASCADE;
DROP TABLE IF EXISTS "userDailyQuests" CASCADE;
DROP TABLE IF EXISTS "dailyQuests" CASCADE;
DROP TABLE IF EXISTS "codeSubmissions" CASCADE;
DROP TABLE IF EXISTS "courseProgress" CASCADE;
DROP TABLE IF EXISTS "userAchievements" CASCADE;
DROP TABLE IF EXISTS "achievements" CASCADE;
DROP TABLE IF EXISTS "challenges" CASCADE;
DROP TABLE IF EXISTS "quizzes" CASCADE;
DROP TABLE IF EXISTS "lessons" CASCADE;
DROP TABLE IF EXISTS "modules" CASCADE;
DROP TABLE IF EXISTS "courses" CASCADE;
DROP TABLE IF EXISTS "profiles" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Drop enums
DROP TYPE IF EXISTS "chat_role" CASCADE;
DROP TYPE IF EXISTS "achievement_category" CASCADE;
DROP TYPE IF EXISTS "submission_status" CASCADE;
DROP TYPE IF EXISTS "lesson_type" CASCADE;
DROP TYPE IF EXISTS "quest_difficulty" CASCADE;
DROP TYPE IF EXISTS "challenge_difficulty" CASCADE;
DROP TYPE IF EXISTS "difficulty" CASCADE;
DROP TYPE IF EXISTS "role" CASCADE;

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE "role" AS ENUM ('user', 'admin');
CREATE TYPE "difficulty" AS ENUM ('Beginner', 'Easy', 'Medium', 'Hard', 'Expert');
CREATE TYPE "challenge_difficulty" AS ENUM ('Easy', 'Medium', 'Hard');
CREATE TYPE "quest_difficulty" AS ENUM ('Easy', 'Medium', 'Hard');
CREATE TYPE "lesson_type" AS ENUM ('reading', 'video', 'interactive', 'coding');
CREATE TYPE "submission_status" AS ENUM ('pending', 'accepted', 'wrong_answer', 'time_limit', 'runtime_error', 'compilation_error');
CREATE TYPE "achievement_category" AS ENUM ('learning', 'coding', 'streak', 'social', 'special', 'course', 'challenge', 'secret');
CREATE TYPE "chat_role" AS ENUM ('user', 'assistant');

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "unionId" VARCHAR(255) NOT NULL UNIQUE,
  "name" VARCHAR(255),
  "email" VARCHAR(320),
  "avatar" TEXT,
  "role" "role" DEFAULT 'user' NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "lastSignInAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE "profiles" (
  "id" SERIAL PRIMARY KEY,
  "userId" BIGINT NOT NULL UNIQUE,
  "displayName" VARCHAR(100),
  "bio" TEXT,
  "level" INTEGER DEFAULT 1 NOT NULL,
  "xp" INTEGER DEFAULT 0 NOT NULL,
  "coins" INTEGER DEFAULT 100 NOT NULL,
  "energy" INTEGER DEFAULT 100 NOT NULL,
  "maxEnergy" INTEGER DEFAULT 100 NOT NULL,
  "currentStreak" INTEGER DEFAULT 0 NOT NULL,
  "longestStreak" INTEGER DEFAULT 0 NOT NULL,
  "lastLoginDate" VARCHAR(10),
  "totalLessons" INTEGER DEFAULT 0 NOT NULL,
  "totalQuizzes" INTEGER DEFAULT 0 NOT NULL,
  "totalChallenges" INTEGER DEFAULT 0 NOT NULL,
  "totalAchievements" INTEGER DEFAULT 0 NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX "profiles_userId_idx" ON "profiles" ("userId");

-- ============================================================
-- COURSES
-- ============================================================
CREATE TABLE "courses" (
  "id" SERIAL PRIMARY KEY,
  "slug" VARCHAR(100) NOT NULL UNIQUE,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL,
  "longDescription" TEXT,
  "icon" VARCHAR(50),
  "color" VARCHAR(20) DEFAULT '#6366f1',
  "difficulty" "difficulty" DEFAULT 'Beginner' NOT NULL,
  "category" VARCHAR(50) DEFAULT 'Frontend',
  "tags" TEXT,
  "totalLessons" INTEGER DEFAULT 0 NOT NULL,
  "totalQuizzes" INTEGER DEFAULT 0 NOT NULL,
  "totalChallenges" INTEGER DEFAULT 0 NOT NULL,
  "estimatedHours" INTEGER DEFAULT 0 NOT NULL,
  "xpReward" INTEGER DEFAULT 500 NOT NULL,
  "coinReward" INTEGER DEFAULT 250 NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- MODULES
-- ============================================================
CREATE TABLE "modules" (
  "id" SERIAL PRIMARY KEY,
  "courseId" BIGINT NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "order" INTEGER DEFAULT 0 NOT NULL,
  "xpReward" INTEGER DEFAULT 50 NOT NULL,
  "isBossModule" BOOLEAN DEFAULT FALSE NOT NULL
);

-- ============================================================
-- LESSONS
-- ============================================================
CREATE TABLE "lessons" (
  "id" SERIAL PRIMARY KEY,
  "moduleId" BIGINT NOT NULL,
  "courseId" BIGINT NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "content" TEXT NOT NULL,
  "codeExamples" TEXT,
  "type" "lesson_type" DEFAULT 'reading' NOT NULL,
  "xpReward" INTEGER DEFAULT 20 NOT NULL,
  "coinReward" INTEGER DEFAULT 10 NOT NULL,
  "energyCost" INTEGER DEFAULT 5 NOT NULL,
  "estimatedMinutes" INTEGER DEFAULT 10 NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL
);
CREATE INDEX "lessons_courseId_idx" ON "lessons" ("courseId");
CREATE INDEX "lessons_moduleId_idx" ON "lessons" ("moduleId");

-- ============================================================
-- QUIZZES
-- ============================================================
CREATE TABLE "quizzes" (
  "id" SERIAL PRIMARY KEY,
  "lessonId" BIGINT NOT NULL,
  "courseId" BIGINT NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "questions" TEXT NOT NULL,
  "passingScore" INTEGER DEFAULT 70 NOT NULL,
  "xpReward" INTEGER DEFAULT 50 NOT NULL,
  "coinReward" INTEGER DEFAULT 25 NOT NULL
);

-- ============================================================
-- CHALLENGES
-- ============================================================
CREATE TABLE "challenges" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(100) NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "difficulty" "challenge_difficulty" DEFAULT 'Easy' NOT NULL,
  "category" VARCHAR(50) DEFAULT 'Arrays',
  "problemStatement" TEXT NOT NULL,
  "constraints" TEXT,
  "examples" TEXT,
  "starterCode" TEXT,
  "hints" TEXT,
  "testCases" TEXT,
  "xpReward" INTEGER DEFAULT 50 NOT NULL,
  "coinReward" INTEGER DEFAULT 25 NOT NULL,
  "solveCount" INTEGER DEFAULT 0 NOT NULL,
  "attemptCount" INTEGER DEFAULT 0 NOT NULL
);
CREATE INDEX "challenges_difficulty_idx" ON "challenges" ("difficulty");

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
CREATE TABLE "achievements" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL UNIQUE,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL,
  "category" "achievement_category" DEFAULT 'learning' NOT NULL,
  "icon" VARCHAR(50) DEFAULT 'Star',
  "color" VARCHAR(20) DEFAULT '#6366f1',
  "requirementType" VARCHAR(50) DEFAULT 'lessons_completed',
  "requirementCount" INTEGER DEFAULT 1 NOT NULL,
  "xpReward" INTEGER DEFAULT 0 NOT NULL,
  "coinReward" INTEGER DEFAULT 0 NOT NULL,
  "isSecret" BOOLEAN DEFAULT FALSE NOT NULL
);

-- ============================================================
-- USER ACHIEVEMENTS
-- ============================================================
CREATE TABLE "userAchievements" (
  "id" SERIAL PRIMARY KEY,
  "userId" BIGINT NOT NULL,
  "achievementId" BIGINT NOT NULL,
  "completed" BOOLEAN DEFAULT FALSE NOT NULL,
  "completedAt" TIMESTAMPTZ,
  "progress" INTEGER DEFAULT 0 NOT NULL
);
CREATE INDEX "ua_userId_idx" ON "userAchievements" ("userId");

-- ============================================================
-- COURSE PROGRESS
-- ============================================================
CREATE TABLE "courseProgress" (
  "id" SERIAL PRIMARY KEY,
  "userId" BIGINT NOT NULL,
  "courseId" BIGINT NOT NULL,
  "completedLessons" TEXT,
  "completedQuizzes" TEXT,
  "completedChallenges" TEXT,
  "currentLessonId" VARCHAR(20),
  "overallProgress" INTEGER DEFAULT 0 NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX "cp_userId_idx" ON "courseProgress" ("userId");
CREATE INDEX "cp_courseId_idx" ON "courseProgress" ("courseId");

-- ============================================================
-- CODE SUBMISSIONS
-- ============================================================
CREATE TABLE "codeSubmissions" (
  "id" SERIAL PRIMARY KEY,
  "userId" BIGINT NOT NULL,
  "challengeId" BIGINT NOT NULL,
  "language" VARCHAR(30) DEFAULT 'javascript' NOT NULL,
  "sourceCode" TEXT,
  "status" "submission_status" DEFAULT 'pending' NOT NULL,
  "testResults" TEXT,
  "xpAwarded" INTEGER DEFAULT 0 NOT NULL,
  "coinsAwarded" INTEGER DEFAULT 0 NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX "cs_userId_idx" ON "codeSubmissions" ("userId");

-- ============================================================
-- DAILY QUESTS
-- ============================================================
CREATE TABLE "dailyQuests" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "questType" VARCHAR(50) DEFAULT 'complete_lessons',
  "requirement" INTEGER DEFAULT 1 NOT NULL,
  "xpReward" INTEGER DEFAULT 50 NOT NULL,
  "coinReward" INTEGER DEFAULT 25 NOT NULL,
  "difficulty" "quest_difficulty" DEFAULT 'Easy' NOT NULL,
  "icon" VARCHAR(50) DEFAULT 'Target'
);

-- ============================================================
-- USER DAILY QUESTS
-- ============================================================
CREATE TABLE "userDailyQuests" (
  "id" SERIAL PRIMARY KEY,
  "userId" BIGINT NOT NULL,
  "questId" BIGINT NOT NULL,
  "progress" INTEGER DEFAULT 0 NOT NULL,
  "completed" BOOLEAN DEFAULT FALSE NOT NULL,
  "claimed" BOOLEAN DEFAULT FALSE NOT NULL,
  "assignedAt" VARCHAR(10) NOT NULL
);
CREATE INDEX "udq_userId_idx" ON "userDailyQuests" ("userId");

-- ============================================================
-- ACTIVITY LOGS
-- ============================================================
CREATE TABLE "activityLogs" (
  "id" SERIAL PRIMARY KEY,
  "userId" BIGINT NOT NULL,
  "activityType" VARCHAR(50) NOT NULL,
  "description" VARCHAR(255) NOT NULL,
  "xpEarned" INTEGER DEFAULT 0 NOT NULL,
  "metadata" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX "al_userId_idx" ON "activityLogs" ("userId");

-- ============================================================
-- LEADERBOARD ENTRIES
-- ============================================================
CREATE TABLE "leaderboardEntries" (
  "id" SERIAL PRIMARY KEY,
  "userId" BIGINT NOT NULL,
  "username" VARCHAR(100) NOT NULL,
  "level" INTEGER DEFAULT 1 NOT NULL,
  "xp" INTEGER DEFAULT 0 NOT NULL,
  "weeklyXp" INTEGER DEFAULT 0 NOT NULL,
  "currentStreak" INTEGER DEFAULT 0 NOT NULL,
  "challengesSolved" INTEGER DEFAULT 0 NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX "le_userId_idx" ON "leaderboardEntries" ("userId");
CREATE INDEX "le_xp_idx" ON "leaderboardEntries" ("xp");

-- ============================================================
-- CHAT MESSAGES
-- ============================================================
CREATE TABLE "chatMessages" (
  "id" SERIAL PRIMARY KEY,
  "userId" BIGINT NOT NULL,
  "role" "chat_role" NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX "cm_userId_idx" ON "chatMessages" ("userId");
