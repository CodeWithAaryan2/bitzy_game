import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { GameProvider } from '@/context/GameContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AppLayout from '@/components/AppLayout';
import Dashboard from '@/pages/Dashboard';
import CoursesPage from '@/pages/CoursesPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import LessonPlayerPage from '@/pages/LessonPlayerPage';
import QuizPage from '@/pages/QuizPage';
import ChallengesPage from '@/pages/ChallengesPage';
import ChallengeDetailPage from '@/pages/ChallengeDetailPage';
import AIMentorPage from '@/pages/AIMentorPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import AchievementsPage from '@/pages/AchievementsPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import GamesPage from '@/pages/games/GamesPage';
import { useAuth } from '@/context/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/app" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:slug" element={<CourseDetailPage />} />
        <Route path="courses/:courseSlug/:moduleSlug/:lessonSlug" element={<LessonPlayerPage />} />
        <Route path="quiz/:quizId" element={<QuizPage />} />
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="challenges/:slug" element={<ChallengeDetailPage />} />
        <Route path="mentor" element={<AIMentorPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="games" element={<GamesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GameProvider>
          <AppRoutes />
        </GameProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
