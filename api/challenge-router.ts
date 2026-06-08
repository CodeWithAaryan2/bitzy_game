import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";

export const challengeRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const { data } = await db
      .from("challenges")
      .select("*")
      .order("solveCount", { ascending: false });
    return data ?? [];
  }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const { data, error } = await db
        .from("challenges")
        .select("*")
        .eq("slug", input.slug)
        .single();
      if (error || !data) return null;
      return data;
    }),

  submit: authedQuery
    .input(z.object({
      challengeId: z.number(),
      language: z.string(),
      sourceCode: z.string(),
      status: z.enum(["pending", "accepted", "wrong_answer", "time_limit", "runtime_error", "compilation_error"]),
      testResults: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      await db.from("codeSubmissions").insert({
        userId,
        challengeId: input.challengeId,
        language: input.language,
        sourceCode: input.sourceCode,
        status: input.status,
        testResults: input.testResults || "[]",
      });

      if (input.status === "accepted") {
        const { data: challenge } = await db
          .from("challenges")
          .select("solveCount")
          .eq("id", input.challengeId)
          .single();

        if (challenge) {
          await db.from("challenges")
            .update({ solveCount: (challenge.solveCount || 0) + 1 })
            .eq("id", input.challengeId);

          const { data: profile } = await db
            .from("profiles")
            .select("totalChallenges")
            .eq("userId", userId)
            .single();

          await db.from("profiles")
            .update({ totalChallenges: (profile?.totalChallenges || 0) + 1 })
            .eq("userId", userId);
        }
      }

      return { success: true };
    }),

  mySubmissions: authedQuery
    .input(z.object({ challengeId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      let query = db.from("codeSubmissions").select("*").eq("userId", ctx.user.id);
      if (input.challengeId) {
        query = query.eq("challengeId", input.challengeId);
      }
      const { data } = await query;
      return data ?? [];
    }),
});
