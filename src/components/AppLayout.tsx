import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, BookOpen, Code2, Trophy, Sparkles,
  Zap, Heart, Gem, Swords, Gamepad2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { getLevelFromXP } from '@/context/AuthContext';
import XPPopupOverlay from '@/components/XPPopupOverlay';

const navItems = [
  { path: '/app/dashboard', label: 'Learn', icon: Home },
  { path: '/app/courses', label: 'Path', icon: BookOpen },
  { path: '/app/games', label: 'Play', icon: Gamepad2 },
  { path: '/app/challenges', label: 'Arena', icon: Swords },
  { path: '/app/leaderboard', label: 'League', icon: Trophy },
  { path: '/app/mentor', label: 'Mentor', icon: Sparkles },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { xpPopups, dismissPopup } = useGame();

  const levelInfo = user ? getLevelFromXP(user.xp) : { level: 1, currentLevelXP: 0, xpToNext: 100 };
  const xpPercent = levelInfo.xpToNext > 0
    ? (levelInfo.currentLevelXP / levelInfo.xpToNext) * 100
    : 100;

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Top Bar */}
      <header className="flex-shrink-0 bg-white border-b-2 border-gray-100 px-4 py-2 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#58CC02] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-[#58CC02]">Bitxy</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/app/achievements')} className="flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-gray-100 transition-colors">
              <Gem className="w-4 h-4 text-[#1CB0F6]" />
              <span className="text-sm font-bold text-[#1CB0F6]">{user?.coins ?? 0}</span>
            </button>
            <button onClick={() => navigate('/app/profile')} className="flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-gray-100 transition-colors">
              <Zap className="w-4 h-4 text-[#FFC800]" />
              <span className="text-sm font-bold text-[#FFC800]">{user?.xp ?? 0}</span>
            </button>
            <button onClick={() => navigate('/app/profile')} className="flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-gray-100 transition-colors">
              <Heart className="w-4 h-4 text-[#FF4B4B]" />
              <span className="text-sm font-bold text-[#FF4B4B]">{user?.energy ?? 5}</span>
            </button>
            <button onClick={() => navigate('/app/profile')} className="w-8 h-8 rounded-full bg-[#CE82FF] flex items-center justify-center text-white text-xs font-bold">
              {user?.displayName?.[0]?.toUpperCase() || 'U'}
            </button>
          </div>
        </div>
      </header>

      {/* XP Progress Bar */}
      <div className="flex-shrink-0 h-1.5 bg-gray-200 w-full">
        <motion.div
          className="h-full bg-[#FFC800]"
          initial={{ width: 0 }}
          animate={{ width: `${xpPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="max-w-2xl mx-auto px-4 py-4 pb-24"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 z-30">
        <div className="max-w-2xl mx-auto flex items-center justify-around py-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all"
              >
                <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#58CC02]/10' : ''}`}>
                  <item.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-[#58CC02]' : 'text-gray-400'}`} />
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#58CC02]"
                    />
                  )}
                </div>
                <span className={`text-[10px] font-bold ${isActive ? 'text-[#58CC02]' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* XP Popups */}
      <XPPopupOverlay popups={xpPopups} onDismiss={dismissPopup} />
    </div>
  );
}
