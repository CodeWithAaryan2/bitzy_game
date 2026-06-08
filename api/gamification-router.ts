import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";

function getXPForLevel(level: number): number {
  if (level <= 1) return 100;
  if (level <= 10) return 100 * level;
  if (level <= 25) return 500 + 200 * (level - 10);
  if (level <= 50) return 3500 + 500 * (level - 25);
  if (level <= 75) return 16000 + 1000 * (level - 50);
  if (level <= 90) return 41000 + 2000 * (level - 75);
  return 71000 + 5000 * (level - 90);
}

function getLevelFromXP(xp: number): { level: number; currentLevelXP: number; xpToNext: number } {
  let cumulative = 0;
  let level = 1;
  while (level < 100) {
    const needed = getXPForLevel(level + 1);
    if (cumulative + needed > xp) {
      return { level, currentLevelXP: xp - cumulative, xpToNext: needed - (xp - cumulative) };
    }
    cumulative += needed;
    level++;
  }
  return { level: 100, currentLevelXP: 0, xpToNext: 0 };
}

export const gamificationRouter = createRouter({
  // -- Profile --
  getProfile: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const { data: profile, error } = await db
      .from("profiles")
      .select("*")
      .eq("userId", ctx.user.id)
      .single();

    if (error || !profile) {
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      await db.from("profiles").insert({
        userId: ctx.user.id,
        displayName: ctx.user.name || "Learner",
        bio: "Learning to code one day at a time!",
        lastLoginDate: dateStr,
      } as any);
      const { data: newProfile } = await db
        .from("profiles")
        .select("*")
        .eq("userId", ctx.user.id)
        .single();
      return newProfile;
    }
    return profile;
  }),

  updateProfile: authedQuery
    .input(z.object({ displayName: z.string().optional(), bio: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.from("profiles").update({ ...input, updatedAt: new Date().toISOString() } as any).eq("userId", ctx.user.id);
      return { success: true };
    }),

  // -- XP / Coins --
  addXP: authedQuery
    .input(z.object({ amount: z.number(), source: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { data: profile } = await db
        .from("profiles")
        .select("*")
        .eq("userId", ctx.user.id)
        .single();
      if (!profile) return { success: false };

      const prof = profile as any;
      const newXP = prof.xp + input.amount;
      const levelInfo = getLevelFromXP(newXP);
      const newLevel = levelInfo.level > prof.level ? levelInfo.level : prof.level;

      await db.from("profiles")
        .update({ xp: newXP, level: newLevel, updatedAt: new Date().toISOString() } as any)
        .eq("userId", ctx.user.id);

      await db.from("activityLogs").insert({
        userId: ctx.user.id,
        activityType: "xp",
        description: `+${input.amount} XP from ${input.source}`,
        xpEarned: input.amount,
      } as any);

      return { success: true, newXP, newLevel, levelUp: newLevel > prof.level };
    }),

  addCoins: authedQuery
    .input(z.object({ amount: z.number(), source: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { data: profile } = await db
        .from("profiles")
        .select("coins")
        .eq("userId", ctx.user.id)
        .single();
      const coins = (profile as any)?.coins || 0;
      await db.from("profiles")
        .update({ coins: coins + input.amount, updatedAt: new Date().toISOString() } as any)
        .eq("userId", ctx.user.id);
      return { success: true };
    }),

  spendEnergy: authedQuery
    .input(z.object({ amount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { data: profile } = await db
        .from("profiles")
        .select("energy")
        .eq("userId", ctx.user.id)
        .single();
      const energy = (profile as any)?.energy || 0;
      if (!profile || energy < input.amount) return { success: false, error: "Not enough energy" };
      await db.from("profiles").update({ energy: energy - input.amount } as any).eq("userId", ctx.user.id);
      return { success: true };
    }),

  // -- Course Progress --
  getProgress: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const { data } = await db
      .from("courseProgress")
      .select("*")
      .eq("userId", ctx.user.id);
    return data ?? [];
  }),

  completeLesson: authedQuery
    .input(z.object({ courseId: z.number(), lessonId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { data: existing } = await db
        .from("courseProgress")
        .select("*")
        .eq("userId", ctx.user.id)
        .eq("courseId", input.courseId)
        .single();

      if (existing) {
        const ex = existing as any;
        const completed = JSON.parse(ex.completedLessons || "[]") as string[];
        if (!completed.includes(input.lessonId)) {
          completed.push(input.lessonId);
          await db.from("courseProgress")
            .update({ completedLessons: JSON.stringify(completed), currentLessonId: input.lessonId } as any)
            .eq("id", ex.id);
        }
      } else {
        await db.from("courseProgress").insert({
          userId: ctx.user.id,
          courseId: input.courseId,
          completedLessons: JSON.stringify([input.lessonId]),
          currentLessonId: input.lessonId,
          overallProgress: 5,
        } as any);
      }

      const { data: profile } = await db
        .from("profiles")
        .select("totalLessons")
        .eq("userId", ctx.user.id)
        .single();
      const total = (profile as any)?.totalLessons || 0;
      await db.from("profiles")
        .update({ totalLessons: total + 1 } as any)
        .eq("userId", ctx.user.id);

      return { success: true };
    }),

  // -- Achievements --
  getAchievements: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const { data: allAchievements } = await db.from("achievements").select("*");
    const { data: userAchs } = await db.from("userAchievements").select("*").eq("userId", ctx.user.id);
    return {
      achievements: allAchievements ?? [],
      userAchievements: userAchs ?? [],
    };
  }),

  checkAchievements: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    const { data: profileData } = await db.from("profiles").select("*").eq("userId", ctx.user.id).single();
    if (!profileData) return [];

    const profile = profileData as any;
    const { data: allAchs } = await db.from("achievements").select("*");
    const { data: userAchs } = await db.from("userAchievements").select("*").eq("userId", ctx.user.id);
    const newlyCompleted: number[] = [];

    for (const ach of (allAchs ?? [])) {
      const achAny = ach as any;
      const existing = (userAchs ?? []).find((ua: any) => ua.achievementId === achAny.id);
      if (existing?.completed) continue;

      let shouldComplete = false;
      const reqCount = achAny.requirementCount;

      switch (achAny.requirementType) {
        case "lessons_completed": shouldComplete = profile.totalLessons >= reqCount; break;
        case "quizzes_completed": shouldComplete = profile.totalQuizzes >= reqCount; break;
        case "challenges_solved": shouldComplete = profile.totalChallenges >= reqCount; break;
        case "streak_days": shouldComplete = profile.currentStreak >= reqCount; break;
        case "course_completed": shouldComplete = profile.totalLessons >= reqCount; break;
        case "quests_completed": shouldComplete = profile.totalQuizzes >= reqCount; break;
        case "profile_complete": shouldComplete = !!profile.displayName && !!profile.bio; break;
      }

      if (shouldComplete) {
        if (existing) {
          await db.from("userAchievements")
            .update({ completed: true, completedAt: new Date().toISOString() } as any)
            .eq("id", (existing as any).id);
        } else {
          await db.from("userAchievements").insert({
            userId: ctx.user.id,
            achievementId: achAny.id,
            completed: true,
            completedAt: new Date().toISOString(),
          } as any);
        }
        newlyCompleted.push(achAny.id);

        await db.from("profiles")
          .update({ xp: profile.xp + achAny.xpReward, coins: profile.coins + achAny.coinReward } as any)
          .eq("userId", ctx.user.id);
      }
    }

    return newlyCompleted;
  }),

  // -- Daily Quests --
  getDailyQuests: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const today = new Date().toISOString().split("T")[0];

    let { data: userQuests } = await db
      .from("userDailyQuests")
      .select("*")
      .eq("userId", ctx.user.id);

    if (!userQuests || userQuests.length === 0 || !userQuests.every((q: any) => q.assignedAt === today)) {
      await db.from("userDailyQuests").delete().eq("userId", ctx.user.id);

      const { data: quests } = await db.from("dailyQuests").select("*").limit(5);
      for (const q of (quests ?? [])) {
        await db.from("userDailyQuests").insert({
          userId: ctx.user.id,
          questId: (q as any).id,
          assignedAt: today,
        } as any);
      }
      const { data: refreshed } = await db
        .from("userDailyQuests")
        .select("*")
        .eq("userId", ctx.user.id);
      userQuests = refreshed ?? [];
    }

    const { data: quests } = await db.from("dailyQuests").select("*");
    return (userQuests ?? []).map((uq: any) => ({
      ...uq,
      quest: (quests ?? []).find((q: any) => (q as any).id === uq.questId),
    }));
  }),

  claimQuest: authedQuery
    .input(z.object({ questId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { data: uq } = await db
        .from("userDailyQuests")
        .select("*")
        .eq("userId", ctx.user.id)
        .eq("questId", input.questId)
        .single();

      const uqAny = uq as any;
      if (!uqAny || !uqAny.completed || uqAny.claimed) return { success: false };

      await db.from("userDailyQuests").update({ claimed: true } as any).eq("id", uqAny.id);
      return { success: true };
    }),

  // -- Leaderboard --
  getLeaderboard: publicQuery.query(async () => {
    const db = getDb();
    const { data } = await db
      .from("leaderboardEntries")
      .select("*")
      .order("xp", { ascending: false })
      .limit(50);
    return data ?? [];
  }),

  updateLeaderboard: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    const { data: profileData } = await db.from("profiles").select("*").eq("userId", ctx.user.id).single();
    if (!profileData) return;

    const profile = profileData as any;
    const { data: existing } = await db
      .from("leaderboardEntries")
      .select("*")
      .eq("userId", ctx.user.id)
      .single();

    if (existing) {
      await db.from("leaderboardEntries").update({
        username: profile.displayName || ctx.user.name || "Learner",
        level: profile.level,
        xp: profile.xp,
        currentStreak: profile.currentStreak,
        challengesSolved: profile.totalChallenges,
      } as any).eq("id", (existing as any).id);
    } else {
      await db.from("leaderboardEntries").insert({
        userId: ctx.user.id,
        username: profile.displayName || ctx.user.name || "Learner",
        level: profile.level,
        xp: profile.xp,
        currentStreak: profile.currentStreak,
        challengesSolved: profile.totalChallenges,
      } as any);
    }
  }),

  // -- Activity Log --
  getActivityLog: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const { data } = await db
      .from("activityLogs")
      .select("*")
      .eq("userId", ctx.user.id)
      .order("createdAt", { ascending: false })
      .limit(20);
    return data ?? [];
  }),
});
