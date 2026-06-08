export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  bio: string;
  level: number;
  xp: number;
  coins: number;
  energy: number;
  maxEnergy: number;
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string;
  joinedAt: string;
  isLoggedIn: boolean;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  color: string;
  difficulty: 'Beginner' | 'Easy' | 'Medium' | 'Hard' | 'Expert';
  category: string;
  tags: string[];
  totalLessons: number;
  totalQuizzes: number;
  totalChallenges: number;
  estimatedHours: number;
  xpReward: number;
  coinReward: number;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: CourseLesson[];
  xpReward?: number;
  isBossModule?: boolean;
}

export interface CourseLesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: 'reading' | 'video' | 'interactive' | 'coding';
  duration: string;
  xpReward: number;
  coinReward?: number;
  energyCost?: number;
  estimatedMinutes?: number;
  order?: number;
  isCompleted: boolean;
  content?: string;
  codeExamples?: CodeExample[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  isBossModule?: boolean;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  codeExamples?: CodeExample[];
  type: 'reading' | 'video' | 'interactive' | 'coding';
  xpReward: number;
  coinReward?: number;
  energyCost?: number;
  estimatedMinutes?: number;
  duration?: string;
  order: number;
  isCompleted?: boolean;
}

export interface CodeExample {
  language: string;
  code: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number | null;
  passingScore: number;
  xpReward: number;
  coinReward: number;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'coding' | 'fill_blank';
  question: string;
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
  difficulty: string;
  codeTemplate?: string;
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  problemStatement: string;
  constraints: string;
  examples: ChallengeExample[];
  starterCode: Record<string, string>;
  testCases: TestCase[];
  hints: ChallengeHint[];
  xpReward: number;
  coinReward: number;
  solveCount: number;
  attemptCount: number;
}

export interface ChallengeExample {
  input: string;
  output: string;
  explanation: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  isExample: boolean;
  explanation?: string;
}

export interface ChallengeHint {
  id: string;
  hintText: string;
  order: number;
  xpCost: number;
}

export interface Achievement {
  id: string;
  name: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  color: string;
  requirement: AchievementRequirement;
  xpReward: number;
  coinReward: number;
  isSecret: boolean;
}

export type AchievementCategory = 'learning' | 'coding' | 'streak' | 'social' | 'special' | 'course' | 'challenge' | 'secret';

export interface AchievementRequirement {
  type: string;
  count: number;
  metadata?: Record<string, any>;
}

export interface UserAchievement {
  achievementId: string;
  completed: boolean;
  completedAt: string | null;
  progress: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  weeklyXp: number;
  currentStreak: number;
  challengesSolved: number;
  rank: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  type: string;
  requirement: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
  xpReward: number;
  coinReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CodeSubmission {
  id: string;
  challengeId: string;
  userId: string;
  language: string;
  sourceCode: string;
  status: 'pending' | 'accepted' | 'wrong_answer' | 'time_limit' | 'runtime_error' | 'compilation_error';
  stdout: string;
  stderr: string;
  testResults: TestResult[];
  xpAwarded: number;
  coinsAwarded: number;
  createdAt: string;
}

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  executionTime: number;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  completedQuizzes: string[];
  completedChallenges: string[];
  currentLessonId: string | null;
  overallProgress: number;
}

export interface XPPopup {
  id: string;
  amount: number;
  type: 'xp' | 'coin' | 'streak' | 'achievement' | 'level';
  message: string;
  x: number;
  y: number;
}

export interface GameState {
  user: User;
  achievements: UserAchievement[];
  courseProgress: CourseProgress[];
  submissions: CodeSubmission[];
  dailyQuests: DailyQuest[];
  chatSessions: Record<string, ChatMessage[]>;
}
