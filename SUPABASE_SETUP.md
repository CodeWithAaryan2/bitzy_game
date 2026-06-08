# Supabase Database Setup Guide for Bitxy

## What Changed

The backend has been migrated from **MySQL/TiDB** to **PostgreSQL/Supabase**:

| Before | After |
|--------|-------|
| MySQL (TiDB Cloud) | PostgreSQL (Supabase) |
| `mysql2` driver | `postgres` driver |
| `drizzle-orm/mysql-core` | `drizzle-orm/pg-core` |
| `mysqlTable` | `pgTable` |
| `onDuplicateKeyUpdate()` | `onConflictDoUpdate()` |
| `.$returningId()` | `.returning()` |
| `bigint unsigned` | `bigint` (PostgreSQL) |

## Step-by-Step Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Choose an organization and name your project (e.g., `bitxy`)
4. Set a secure database password (save it!)
5. Choose a region close to your users
6. Click **"Create new project"** (takes ~2 minutes)

### 2. Get Your Connection String

1. In your project dashboard, go to **Project Settings** (gear icon)
2. Click **Database** in the left sidebar
3. Under **Connection string**, switch to **URI** tab
4. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[PASSWORD]@db.abcdefgh12345678.supabase.co:5432/postgres
   ```
5. Replace `[PASSWORD]` with your actual database password

### 3. Update the .env File

Open `/mnt/agents/output/app/.env` and replace the `DATABASE_URL`:

```env
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.abcdefgh12345678.supabase.co:5432/postgres
```

### 4. Push the Schema to Supabase

```bash
cd /mnt/agents/output/app
npm run db:push
```

This creates all 16 tables + 8 enum types in your Supabase database.

### 5. Seed the Database

```bash
npx tsx db/seed.ts
```

This fills the database with:
- 5 courses (HTML, CSS, JavaScript, React, Python)
- 15 modules
- 18 lessons
- 5 quizzes
- 7 coding challenges
- 18 achievements
- 8 daily quest templates

### 6. Start the App

```bash
npm run dev
```

The app runs at `http://localhost:3000`

## Database Schema Overview

### Tables (16 total)

| Table | Description |
|-------|-------------|
| `users` | OAuth users (auto-created on login) |
| `profiles` | Gamification data (XP, level, coins, streaks) |
| `courses` | 5 programming courses |
| `modules` | Course sections |
| `lessons` | Individual lessons with content |
| `quizzes` | Course quizzes |
| `challenges` | Coding problems |
| `achievements` | Badge definitions |
| `userAchievements` | User-earned badges |
| `courseProgress` | Per-user lesson tracking |
| `codeSubmissions` | Challenge solutions |
| `dailyQuests` | Quest template pool |
| `userDailyQuests` | Assigned daily quests |
| `activityLogs` | User activity feed |
| `leaderboardEntries` | Global rankings |
| `chatMessages` | AI Mentor conversations |

### Enums (8 total)

`role`, `difficulty`, `challenge_difficulty`, `quest_difficulty`, `lesson_type`, `submission_status`, `achievement_category`, `chat_role`

## Troubleshooting

### Connection refused
```
Error: getaddrinfo ENOTFOUND db.xxx.supabase.co
```
**Fix**: Check that your connection string is correct. Make sure you're using the direct connection (port 5432), not the pooler connection (port 6543).

### SSL error
```
Error: connection terminated unexpectedly
```
**Fix**: Add `?sslmode=require` to the end of your DATABASE_URL:
```
DATABASE_URL=postgresql://.../postgres?sslmode=require
```

### Table already exists (from previous push)
```bash
# Drop everything and start fresh
npx tsx db/drop-all.ts
npm run db:push
npx tsx db/seed.ts
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run check` | TypeScript type check |
| `npm run db:push` | Sync schema to Supabase |
| `npx tsx db/seed.ts` | Seed with data |
| `npx tsx db/drop-all.ts` | Wipe all tables |
