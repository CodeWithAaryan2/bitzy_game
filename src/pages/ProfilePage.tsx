import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Zap, Star, Trophy, BookOpen, Code2, Target, Swords, Award, Settings } from 'lucide-react';
import { useAuth, getLevelFromXP } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { achievements } from '@/data/achievements';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { gameState, getOverallProgress, hasCompletedChallenge } = useGame();

  const levelInfo = user ? getLevelFromXP(user.xp) : { level: 1, currentLevelXP: 0, xpToNext: 100 };
  const completedAchs = gameState.achievements.filter(a => a.completed).length;
  const solvedChallenges = Object.keys(gameState.submissions).length;

  const stats = [
    { label: 'Level', value: levelInfo.level, icon: Star, color: '#FFC800', bg: '#FFF8E0' },
    { label: 'XP', value: user?.xp ?? 0, icon: Zap, color: '#FFC800', bg: '#FFF8E0' },
    { label: 'Coins', value: user?.coins ?? 0, icon: Zap, color: '#1CB0F6', bg: '#E8F7FE' },
    { label: 'Streak', value: user?.currentStreak ?? 0, icon: Flame, color: '#FF9600', bg: '#FFF3D6' },
  ];

  const activityStats = [
    { label: 'Lessons Done', value: gameState.courseProgress.reduce((s, c) => s + c.completedLessons.length, 0), icon: BookOpen, color: '#58CC02' },
    { label: 'Challenges', value: solvedChallenges, icon: Swords, color: '#1CB0F6' },
    { label: 'Achievements', value: completedAchs, icon: Award, color: '#CE82FF' },
    { label: 'Quizzes', value: gameState.courseProgress.reduce((s, c) => s + c.completedQuizzes.length, 0), icon: Target, color: '#FF4B4B' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Profile Header */}
      <motion.div variants={item} className="text-center">
        <motion.div
          className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #58CC02, #89E219)' }}
          whileHover={{ scale: 1.05 }}
        >
          {user?.displayName?.[0]?.toUpperCase() || 'U'}
        </motion.div>
        <h1 className="font-display text-xl font-bold text-gray-800">{user?.displayName || 'Bitxy Learner'}</h1>
        <p className="text-sm text-gray-500">@{user?.username || 'learner'}</p>
        {user?.bio && <p className="text-xs text-gray-400 mt-1">{user.bio}</p>}

        {/* Level Badge */}
        <div className="mt-3 inline-flex items-center gap-2 bg-[#58CC02]/10 px-4 py-1.5 rounded-full border-2 border-[#58CC02]/30">
          <Star className="w-4 h-4 text-[#FFC800]" />
          <span className="text-sm font-bold text-[#58CC02]">Level {levelInfo.level}</span>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item} className="grid grid-cols-4 gap-2">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: s.bg }}>
            <s.icon className="w-5 h-5 mx-auto mb-1" style={{ color: s.color }} />
            <p className="font-display text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] font-medium text-gray-500">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Activity Stats */}
      <motion.div variants={item} className="bitxy-card p-4 space-y-3">
        <h2 className="font-display text-lg font-bold text-gray-800">Activity</h2>
        <div className="grid grid-cols-2 gap-3">
          {activityStats.map(stat => (
            <div key={stat.label} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-gray-800">{stat.value}</p>
                <p className="text-[10px] text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements Preview */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold text-gray-800">Recent Badges</h2>
          <button onClick={() => navigate('/app/achievements')} className="text-xs font-bold text-[#1CB0F6]">View All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {gameState.achievements.filter(a => a.completed).slice(0, 5).map(ua => {
            const ach = achievements.find(a => a.id === ua.achievementId);
            if (!ach) return null;
            return (
              <motion.div
                key={ach.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/app/achievements')}
                className="flex-shrink-0 w-16 flex flex-col items-center gap-1 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${ach.color}15` }}>
                  <Award className="w-6 h-6" style={{ color: ach.color }} />
                </div>
                <p className="text-[10px] font-bold text-gray-600 text-center leading-tight">{ach.title}</p>
              </motion.div>
            );
          })}
          {completedAchs === 0 && (
            <p className="text-sm text-gray-400 py-4">Complete lessons and challenges to earn badges!</p>
          )}
        </div>
      </motion.div>

      {/* Settings Button */}
      <motion.button
        variants={item}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/app/settings')}
        className="w-full bitxy-card p-4 flex items-center gap-3 text-left hover:border-gray-300 transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <Settings className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-800">Settings</p>
          <p className="text-xs text-gray-500">Manage your account</p>
        </div>
      </motion.button>

      <div className="h-4" />
    </motion.div>
  );
}
