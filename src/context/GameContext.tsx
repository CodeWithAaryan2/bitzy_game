import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { trpc } from '@/providers/trpc';
import type { GameState, CourseProgress, DailyQuest, XPPopup } from '@/types';
import { achievements } from '@/data/achievements';
import { useAuth } from './AuthContext';
import { getLevelFromXP } from './AuthContext';

interface GameContextType {
  gameState: GameState;
  addXP: (amount: number, source: string) => void;
  addCoins: (amount: number, source: string) => void;
  spendEnergy: (amount: number) => boolean;
  completeLesson: (courseId: string, lessonId: string) => void;
  completeQuiz: (courseId: string, quizId: string, score: number) => void;
  completeChallenge: (challengeId: string, firstTry: boolean) => void;
  checkAchievements: () => void;
  claimQuestReward: (questId: string) => void;
  getCourseProgress: (courseId: string) => CourseProgress | undefined;
  getOverallProgress: () => number;
  hasCompletedLesson: (courseId: string, lessonId: string) => boolean;
  hasCompletedQuiz: (courseId: string, quizId: string) => boolean;
  hasCompletedChallenge: (challengeId: string) => boolean;
  refreshDailyQuests: () => void;
  xpPopups: XPPopup[];
  showXPPopup: (amount: number, type: XPPopup['type'], message: string) => void;
  dismissPopup: (id: string) => void;
}

const GameContext = createContext<GameContextType | null>(null);

const DEFAULT_QUESTS: DailyQuest[] = [
  { id: 'dq1', title: 'Complete 2 Lessons', description: 'Finish 2 lessons today.', type: 'complete_lessons', requirement: 2, progress: 0, completed: false, claimed: false, xpReward: 50, coinReward: 25, difficulty: 'Easy', icon: 'BookOpen' },
  { id: 'dq2', title: 'Solve 1 Challenge', description: 'Complete a coding challenge today.', type: 'solve_challenges', requirement: 1, progress: 0, completed: false, claimed: false, xpReward: 75, coinReward: 40, difficulty: 'Medium', icon: 'Code' },
  { id: 'dq3', title: 'Score 80%+ on Quiz', description: 'Take a quiz and score at least 80%.', type: 'quiz_score', requirement: 80, progress: 0, completed: false, claimed: false, xpReward: 60, coinReward: 30, difficulty: 'Medium', icon: 'Target' },
  { id: 'dq4', title: 'Earn 100 XP', description: 'Accumulate 100 XP through any activities.', type: 'earn_xp', requirement: 100, progress: 0, completed: false, claimed: false, xpReward: 40, coinReward: 20, difficulty: 'Easy', icon: 'Zap' },
  { id: 'dq5', title: 'Chat with AI Mentor', description: 'Have a conversation with the AI Mentor.', type: 'ai_chat', requirement: 1, progress: 0, completed: false, claimed: false, xpReward: 30, coinReward: 15, difficulty: 'Easy', icon: 'MessageCircle' },
];

const STORAGE_VERSION = 'v2';

function loadGameState(userId: string): Partial<GameState> {
  const version = localStorage.getItem('bitxy_version');
  // Reset if version mismatch (data shape changed)
  if (version !== STORAGE_VERSION) {
    localStorage.removeItem(`bitxy_game_${userId}`);
    localStorage.setItem('bitxy_version', STORAGE_VERSION);
    return {};
  }
  const saved = localStorage.getItem(`bitxy_game_${userId}`);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Validate shape
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    } catch { /* ignore */ }
  }
  return {};
}

function saveGameState(userId: string, state: GameState) {
  localStorage.setItem('bitxy_version', STORAGE_VERSION);
  localStorage.setItem(`bitxy_game_${userId}`, JSON.stringify(state));
}

export function GameProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [xpPopups, setXpPopups] = useState<XPPopup[]>([]);

  // tRPC mutations for backend sync
  const addXPMutation = trpc.gamification.addXP.useMutation();
  const addCoinsMutation = trpc.gamification.addCoins.useMutation();
  const completeLessonMutation = trpc.gamification.completeLesson.useMutation();
  const spendEnergyMutation = trpc.gamification.spendEnergy.useMutation();
  const checkAchMutation = trpc.gamification.checkAchievements.useMutation();

  const [gameState, setGameState] = useState<GameState>(() => {
    const defaultState: GameState = {
      user: { id: '', email: '', username: '', displayName: '', avatar: '', bio: '', level: 1, xp: 0, coins: 100, energy: 100, maxEnergy: 100, currentStreak: 0, longestStreak: 0, lastLoginDate: '', joinedAt: '', isLoggedIn: false },
      achievements: achievements.map(a => ({ achievementId: a.id, completed: false, completedAt: null, progress: 0 })),
      courseProgress: [],
      submissions: [],
      dailyQuests: DEFAULT_QUESTS.map(q => ({ ...q })),
      chatSessions: {},
    };
    if (user?.id) {
      const saved = loadGameState(user.id);
      // Sanitize saved data - ensure arrays exist
      const sanitized: Partial<GameState> = {
        achievements: Array.isArray(saved.achievements) ? saved.achievements : defaultState.achievements,
        courseProgress: Array.isArray(saved.courseProgress) ? saved.courseProgress : [],
        submissions: Array.isArray(saved.submissions) ? saved.submissions : [],
        dailyQuests: Array.isArray(saved.dailyQuests) ? saved.dailyQuests : defaultState.dailyQuests,
        chatSessions: typeof saved.chatSessions === 'object' && saved.chatSessions !== null ? saved.chatSessions : {},
      };
      return { ...defaultState, ...sanitized, user: { ...defaultState.user, ...user } };
    }
    return defaultState;
  });

  // Update when user changes
  useEffect(() => {
    if (user?.id) {
      const saved = loadGameState(user.id);
      setGameState(prev => {
        const mergedAchievements = Array.isArray(saved.achievements) ? saved.achievements : prev.achievements;
        const mergedCourseProgress = Array.isArray(saved.courseProgress) ? saved.courseProgress : prev.courseProgress;
        const mergedSubmissions = Array.isArray(saved.submissions) ? saved.submissions : prev.submissions;
        const mergedQuests = Array.isArray(saved.dailyQuests) && saved.dailyQuests.length
          ? saved.dailyQuests
          : DEFAULT_QUESTS.map(q => ({ ...q }));
        return {
          ...prev,
          achievements: mergedAchievements,
          courseProgress: mergedCourseProgress,
          submissions: mergedSubmissions,
          dailyQuests: mergedQuests,
          chatSessions: typeof saved.chatSessions === 'object' && saved.chatSessions !== null ? saved.chatSessions : prev.chatSessions,
          user: { ...prev.user, ...user },
        };
      });
    }
  }, [user?.id]);

  // Persist game state
  useEffect(() => {
    if (user?.id) { saveGameState(user.id, gameState); }
  }, [gameState, user?.id]);

  const showXPPopup = useCallback((amount: number, type: XPPopup['type'], message: string) => {
    const id = Date.now().toString() + Math.random();
    const popup: XPPopup = { id, amount, type, message, x: 50 + Math.random() * 20, y: 60 + Math.random() * 20 };
    setXpPopups(prev => [...prev.slice(-4), popup]);
    setTimeout(() => { setXpPopups(prev => prev.filter(p => p.id !== id)); }, 3000);
  }, []);

  const dismissPopup = useCallback((id: string) => {
    setXpPopups(prev => prev.filter(p => p.id !== id));
  }, []);

  const addXP = useCallback((amount: number, source: string) => {
    setGameState(prev => {
      const newXP = prev.user.xp + amount;
      return { ...prev, user: { ...prev.user, xp: newXP } };
    });

    // Sync to backend
    if (isLoggedIn) {
      addXPMutation.mutate({ amount, source });
    }

    const beforeLevel = getLevelFromXP(gameState.user.xp).level;
    const afterLevel = getLevelFromXP(gameState.user.xp + amount).level;
    if (afterLevel > beforeLevel) {
      showXPPopup(afterLevel, 'level', `Level Up! You are now Level ${afterLevel}`);
    }
    showXPPopup(amount, 'xp', `+${amount} XP from ${source}`);
  }, [gameState.user.xp, isLoggedIn, addXPMutation, showXPPopup]);

  const addCoins = useCallback((amount: number, source: string) => {
    setGameState(prev => ({ ...prev, user: { ...prev.user, coins: prev.user.coins + amount } }));
    if (isLoggedIn) { addCoinsMutation.mutate({ amount, source }); }
    showXPPopup(amount, 'coin', `+${amount} Coins from ${source}`);
  }, [isLoggedIn, addCoinsMutation, showXPPopup]);

  const spendEnergy = useCallback((amount: number): boolean => {
    if (gameState.user.energy < amount) return false;
    setGameState(prev => ({ ...prev, user: { ...prev.user, energy: prev.user.energy - amount } }));
    if (isLoggedIn) { spendEnergyMutation.mutate({ amount }); }
    return true;
  }, [gameState.user.energy, isLoggedIn, spendEnergyMutation]);

  const completeLesson = useCallback((courseId: string, lessonId: string) => {
    setGameState(prev => {
      const progress = prev.courseProgress.find(cp => cp.courseId === courseId);
      let newProgress: CourseProgress[];
      if (progress) {
        if (progress.completedLessons.includes(lessonId)) {
          newProgress = prev.courseProgress.map(cp => cp.courseId === courseId ? { ...cp, currentLessonId: lessonId } : cp);
        } else {
          const completed = [...progress.completedLessons, lessonId];
          newProgress = prev.courseProgress.map(cp =>
            cp.courseId === courseId ? { ...cp, completedLessons: completed, currentLessonId: lessonId, overallProgress: Math.round((completed.length / 20) * 100) } : cp
          );
        }
      } else {
        newProgress = [...prev.courseProgress, { courseId, completedLessons: [lessonId], completedQuizzes: [], completedChallenges: [], currentLessonId: lessonId, overallProgress: 5 }];
      }
      const newQuests = prev.dailyQuests.map(q => {
        if (q.type === 'complete_lessons' && !q.completed) { const newProg = q.progress + 1; return { ...q, progress: newProg, completed: newProg >= q.requirement }; }
        return q;
      });
      return { ...prev, courseProgress: newProgress, dailyQuests: newQuests };
    });

    // Sync to backend
    if (isLoggedIn) {
      const numCourseId = parseInt(courseId);
      if (!isNaN(numCourseId)) {
        completeLessonMutation.mutate({ courseId: numCourseId, lessonId });
      }
    }

    addXP(20, 'lesson');
    addCoins(10, 'lesson');
  }, [addXP, addCoins, isLoggedIn, completeLessonMutation]);

  const completeQuiz = useCallback((courseId: string, quizId: string, score: number) => {
    setGameState(prev => {
      const newProgress = prev.courseProgress.map(cp =>
        cp.courseId === courseId && !cp.completedQuizzes.includes(quizId) ? { ...cp, completedQuizzes: [...cp.completedQuizzes, quizId] } : cp
      );
      const newQuests = prev.dailyQuests.map(q => {
        if (q.type === 'quiz_score' && !q.completed && score >= q.requirement) return { ...q, progress: score, completed: true };
        return q;
      });
      return { ...prev, courseProgress: newProgress, dailyQuests: newQuests };
    });
    const xpAmount = score >= 100 ? 50 * 2 : score >= 80 ? Math.round(50 * 1.5) : Math.round(50 * (score / 100));
    addXP(xpAmount, 'quiz');
    addCoins(Math.round(xpAmount / 2), 'quiz');
  }, [addXP, addCoins]);

  const completeChallenge = useCallback((challengeId: string, firstTry: boolean) => {
    setGameState(prev => {
      const newQuests = prev.dailyQuests.map(q => {
        if (q.type === 'solve_challenges' && !q.completed) { const newProg = q.progress + 1; return { ...q, progress: newProg, completed: newProg >= q.requirement }; }
        return q;
      });
      return {
        ...prev,
        submissions: [...prev.submissions, { id: Date.now().toString(), challengeId, userId: prev.user.id, language: 'javascript', sourceCode: '', status: 'accepted', stdout: '', stderr: '', testResults: [], xpAwarded: 50, coinsAwarded: 25, createdAt: new Date().toISOString() }],
        dailyQuests: newQuests,
      };
    });
    addXP(firstTry ? 75 : 50, 'challenge');
    addCoins(firstTry ? 35 : 25, 'challenge');
  }, [addXP, addCoins]);

  const checkAchievements = useCallback(() => {
    setGameState(prev => {
      const completedLessons = prev.courseProgress.reduce((sum, cp) => sum + cp.completedLessons.length, 0);
      const completedQuizzes = prev.courseProgress.reduce((sum, cp) => sum + cp.completedQuizzes.length, 0);
      const solvedChallenges = prev.submissions.filter(s => s.status === 'accepted').length;
      const streak = prev.user.currentStreak;

      const newAchievements = prev.achievements.map(ua => {
        if (ua.completed) return ua;
        const ach = achievements.find(a => a.id === ua.achievementId);
        if (!ach) return ua;
        let shouldComplete = false;
        switch (ach.requirement.type) {
          case 'lessons_completed': shouldComplete = completedLessons >= ach.requirement.count; break;
          case 'quizzes_completed': shouldComplete = completedQuizzes >= ach.requirement.count; break;
          case 'challenges_solved': shouldComplete = solvedChallenges >= ach.requirement.count; break;
          case 'first_try_solves': shouldComplete = solvedChallenges >= ach.requirement.count; break;
          case 'streak_days': shouldComplete = streak >= ach.requirement.count; break;
          case 'course_completed': shouldComplete = prev.courseProgress.some(cp => cp.overallProgress >= 80); break;
          case 'quests_completed': shouldComplete = prev.dailyQuests.filter(q => q.claimed).length >= ach.requirement.count; break;
          case 'profile_complete': shouldComplete = !!prev.user.displayName && !!prev.user.bio; break;
        }
        if (shouldComplete) return { ...ua, completed: true, completedAt: new Date().toISOString() };
        return { ...ua, progress: ach.requirement.type === 'lessons_completed' ? completedLessons : ach.requirement.type === 'challenges_solved' ? solvedChallenges : ach.requirement.type === 'streak_days' ? streak : 0 };
      });
      return { ...prev, achievements: newAchievements };
    });

    // Also sync to backend
    if (isLoggedIn) { checkAchMutation.mutate(); }
  }, [isLoggedIn, checkAchMutation]);

  const claimQuestReward = useCallback((questId: string) => {
    setGameState(prev => {
      const quest = prev.dailyQuests.find(q => q.id === questId);
      if (!quest || !quest.completed || quest.claimed) return prev;
      const newQuests = prev.dailyQuests.map(q => q.id === questId ? { ...q, claimed: true } : q);
      return { ...prev, user: { ...prev.user, xp: prev.user.xp + quest.xpReward, coins: prev.user.coins + quest.coinReward }, dailyQuests: newQuests };
    });
    const quest = gameState.dailyQuests.find(q => q.id === questId);
    if (quest) { addXP(quest.xpReward, 'quest'); addCoins(quest.coinReward, 'quest'); }
  }, [gameState.dailyQuests, addXP, addCoins]);

  const getCourseProgress = useCallback((courseId: string) => gameState.courseProgress.find(cp => cp.courseId === courseId), [gameState.courseProgress]);
  const getOverallProgress = useCallback(() => { if (gameState.courseProgress.length === 0) return 0; return Math.round(gameState.courseProgress.reduce((sum, cp) => sum + cp.overallProgress, 0) / gameState.courseProgress.length); }, [gameState.courseProgress]);
  const hasCompletedLesson = useCallback((courseId: string, lessonId: string) => { const cp = gameState.courseProgress.find(c => c.courseId === courseId); return cp ? cp.completedLessons.includes(lessonId) : false; }, [gameState.courseProgress]);
  const hasCompletedQuiz = useCallback((courseId: string, quizId: string) => { const cp = gameState.courseProgress.find(c => c.courseId === courseId); return cp ? cp.completedQuizzes.includes(quizId) : false; }, [gameState.courseProgress]);
  const hasCompletedChallenge = useCallback((challengeId: string) => gameState.submissions.some(s => s.challengeId === challengeId && s.status === 'accepted'), [gameState.submissions]);

  const refreshDailyQuests = useCallback(() => {
    setGameState(prev => ({ ...prev, dailyQuests: DEFAULT_QUESTS.map(q => ({ ...q, progress: 0, completed: false, claimed: false })) }));
  }, []);

  return (
    <GameContext.Provider value={{
      gameState, addXP, addCoins, spendEnergy, completeLesson, completeQuiz, completeChallenge,
      checkAchievements, claimQuestReward, getCourseProgress, getOverallProgress,
      hasCompletedLesson, hasCompletedQuiz, hasCompletedChallenge, refreshDailyQuests,
      xpPopups, showXPPopup, dismissPopup,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
