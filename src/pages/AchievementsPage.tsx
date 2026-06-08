import { motion } from 'framer-motion';
import {
  Lock, Star, Zap, CheckCircle2, Trophy, Flame, Code, BookOpen,
  Swords, Target, Crown, HelpCircle, Moon, Rocket, Terminal,
  Bug, Timer, Languages, Sun, TrendingUp, UserCheck, Scroll,
  Coins, Gamepad2, Palette, Atom, Footprints
} from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import { achievements } from '@/data/achievements';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Footprints, BookOpen, Trophy, Target, Code, Flame, Crown, Star,
  HelpCircle, Moon, Rocket, Terminal, Bug, Zap, Timer, Languages,
  Sun, TrendingUp, UserCheck, Scroll, Coins, Gamepad2, Palette, Atom,
  CheckCircle: CheckCircle2, Sword: Swords, FileCode: Code, Braces: Code,
  GraduationCap: Trophy, Brain: Code, Cpu: Code, Library: BookOpen, User: Star,
};

function getIcon(name: string) {
  return iconMap[name] || Star;
}

const categoryColors: Record<string, string> = {
  learning: '#58CC02', coding: '#1CB0F6', streak: '#FF9600', social: '#CE82FF',
  special: '#FF7DB8', course: '#00CDD7', challenge: '#FF4B4B', secret: '#FFC800',
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } };

export default function AchievementsPage() {
  const { gameState } = useGame();
  const { user } = useAuth();

  const userAchievements = gameState.achievements;
  const totalAchievements = achievements.length;
  const completedAchievements = userAchievements.filter(a => a.completed).length;
  const completionRate = Math.round((completedAchievements / totalAchievements) * 100);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Header */}
      <motion.div variants={item} className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FFC800] flex items-center justify-center mx-auto mb-2 shadow-lg">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-800">Achievements</h1>
        <p className="text-sm text-gray-500">{completedAchievements} of {totalAchievements} unlocked</p>
      </motion.div>

      {/* Progress Ring */}
      <motion.div variants={item} className="bitxy-card p-4 flex items-center gap-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#E5E7EB" strokeWidth="8" />
            <motion.circle
              cx="40" cy="40" r="34" fill="none" stroke="#58CC02" strokeWidth="8"
              strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 34}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - completionRate / 100) }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-lg font-bold text-gray-800">{completionRate}%</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-800">Achievement Progress</p>
          <p className="text-xs text-gray-500 mt-0.5">Keep learning to unlock more badges!</p>
          <div className="mt-2 h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <motion.div
              className="h-full bg-[#58CC02] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Achievement Grid */}
      <motion.div variants={item}>
        <h2 className="font-display text-lg font-bold text-gray-800 mb-3">All Badges</h2>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement) => {
            const userAch = userAchievements.find(a => a.achievementId === achievement.id);
            const isCompleted = userAch?.completed || false;
            const isSecret = achievement.isSecret;
            const IconComp = getIcon(achievement.icon);
            const catColor = categoryColors[achievement.category] || '#58CC02';

            if (isSecret && !isCompleted) {
              return (
                <motion.div
                  key={achievement.id}
                  variants={item}
                  whileTap={{ scale: 0.95 }}
                  className="bitxy-card-locked p-4 flex flex-col items-center text-center gap-2 opacity-50"
                >
                  <Lock className="w-8 h-8 text-gray-400" />
                  <p className="text-xs font-bold text-gray-400">???</p>
                  <p className="text-[10px] text-gray-300">Hidden Achievement</p>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={achievement.id}
                variants={item}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-2 ${
                  isCompleted
                    ? 'bg-white border-transparent'
                    : 'bitxy-card-locked'
                }`}
                style={isCompleted ? {
                  borderColor: `${catColor}30`,
                  boxShadow: `0 4px 0 0 ${catColor}20`,
                } : {}}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isCompleted ? '' : 'bg-gray-100'
                  }`}
                  style={isCompleted ? { backgroundColor: `${catColor}15` } : {}}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ rotate: -20, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                      <IconComp className="w-6 h-6" style={{ color: catColor }} />
                    </motion.div>
                  ) : (
                    <IconComp className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <p className={`text-xs font-bold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                  {achievement.title}
                </p>
                {isCompleted && (
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#FFC800]" />
                    <span className="text-[10px] font-bold text-[#FFC800]">+{achievement.xpReward} XP</span>
                  </div>
                )}
                {!isCompleted && (
                  <p className="text-[10px] text-gray-400">{achievement.description}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="h-4" />
    </motion.div>
  );
}
