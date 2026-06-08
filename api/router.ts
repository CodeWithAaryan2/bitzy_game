import { authRouter } from "./auth-router";
import { courseRouter } from "./course-router";
import { challengeRouter } from "./challenge-router";
import { gamificationRouter } from "./gamification-router";
import { mentorRouter } from "./mentor-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  course: courseRouter,
  challenge: challengeRouter,
  gamification: gamificationRouter,
  mentor: mentorRouter,
});

export type AppRouter = typeof appRouter;
