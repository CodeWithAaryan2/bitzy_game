import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Target, Gem, BookOpen, Swords, Sparkles, Lock, Star, ChevronRight, Trophy, Gamepad2 } from 'lucide-react';
import { useAuth, getLevelFromXP } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { courses } from '@/data/courses';
import { challenges } from '@/data/challenges';
import { useState } from 'react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { gameState, getCourseProgress, claimQuestReward } = useGame();
  const [claimedQuest, setClaimedQuest] = useState<string | null>(null);

  const levelInfo = user ? getLevelFromXP(user.xp) : { level: 1, currentLevelXP: 0, xpToNext: 100 };
  const dailyQuests = gameState.dailyQuests.slice(0, 3);

  const handleClaim = (questId: string) => {
    claimQuestReward(questId);
    setClaimedQuest(questId);
    setTimeout(() => setClaimedQuest(null), 2000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Welcome Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">
            {isLoggedIn ? `Welcome back!` : 'Welcome, Learner!'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Continue your coding journey</p>
        </div>
        {user && (
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-2xl border-2 border-orange-200">
            <Flame className="w-5 h-5 text-[#FF9600]" />
            <span className="text-sm font-bold text-[#FF9600]">{user.currentStreak} day streak</span>
          </div>
        )}
      </motion.div>

      {/* Level Progress Card */}
      <motion.div variants={item} className="bitxy-card-green p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#58CC02]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#58CC02] flex items-center justify-center shadow-lg">
            <span className="font-display text-2xl font-bold text-white">{levelInfo.level}</span>
          </div>
          <div className="flex-1">
            <p className="font-display text-lg font-bold text-gray-800">Level {levelInfo.level}</p>
            <p className="text-xs text-gray-500">{levelInfo.currentLevelXP} / {levelInfo.currentLevelXP + levelInfo.xpToNext} XP</p>
            <div className="mt-2 h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <motion.div
                className="h-full bg-[#FFC800] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(levelInfo.currentLevelXP / (levelInfo.currentLevelXP + levelInfo.xpToNext)) * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Daily Quests */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold text-gray-800">Daily Quests</h2>
          <Target className="w-5 h-5 text-[#FF9600]" />
        </div>
        <div className="space-y-2">
          {dailyQuests.map((quest) => (
            <motion.div
              key={quest.id}
              whileTap={{ scale: 0.98 }}
              className={`bitxy-card p-3 flex items-center gap-3 ${quest.completed && !quest.claimed ? 'border-[#58CC02]/50 bg-green-50/50' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${quest.completed ? 'bg-[#58CC02]' : 'bg-gray-100'}`}>
                <Star className={`w-5 h-5 ${quest.completed ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">{quest.title}</p>
                <p className="text-xs text-gray-500">{quest.description}</p>
                <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#58CC02] rounded-full transition-all"
                    style={{ width: `${Math.min(100, (quest.progress / quest.requirement) * 100)}%` }}
                  />
                </div>
              </div>
              {quest.completed && !quest.claimed && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleClaim(quest.id)}
                  className="bitxy-btn bitxy-btn-green px-4 py-2 text-sm"
                >
                  {claimedQuest === quest.id ? 'Claimed!' : `+${quest.xpReward} XP`}
                </motion.button>
              )}
              {quest.claimed && (
                <div className="px-3 py-1.5 bg-green-100 rounded-xl">
                  <span className="text-xs font-bold text-green-600">Done</span>
                </div>
              )}
              {!quest.completed && (
                <span className="text-xs text-gray-400 font-medium">{quest.progress}/{quest.requirement}</span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Continue Learning - Course Path */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold text-gray-800">Continue Learning</h2>
          <button onClick={() => navigate('/app/courses')} className="text-sm font-bold text-[#1CB0F6] flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {courses.slice(0, 3).map((course) => {
            const progress = getCourseProgress(course.id);
            const pct = progress?.overallProgress || 0;
            return (
              <motion.button
                key={course.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/app/courses/${course.slug}`)}
                className="bitxy-card w-full p-4 flex items-center gap-4 text-left hover:border-[#58CC02]/40 transition-all"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: course.color }}
                >
                  {course.title[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800">{course.title}</p>
                  <p className="text-xs text-gray-500">{course.totalLessons} lessons</p>
                  <div className="mt-1.5 h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: course.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  {pct > 0 ? (
                    <span className="text-sm font-bold text-gray-600">{pct}%</span>
                  ) : (
                    <BookOpen className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="font-display text-lg font-bold text-gray-800 mb-3">Quick Play</h2>
        <div className="grid grid-cols-3 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/app/challenges')}
            className="bitxy-card-blue p-3 flex flex-col items-center text-center gap-2"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#1CB0F6] flex items-center justify-center">
              <Swords className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Code Arena</p>
              <p className="text-[10px] text-gray-500">{challenges.length} challenges</p>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/app/games')}
            className="p-3 flex flex-col items-center text-center gap-2 rounded-2xl bg-white border-2 border-[#FF4B4B]/30"
            style={{ boxShadow: '0 4px 0 0 rgba(255,75,75,0.15)' }}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FF4B4B] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Play Games</p>
              <p className="text-[10px] text-gray-500">4 game modes</p>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/app/mentor')}
            className="bitxy-card-purple p-3 flex flex-col items-center text-center gap-2 border-2 border-[#CE82FF]/30"
            style={{ boxShadow: '0 4px 0 0 rgba(206,130,255,0.15)' }}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#CE82FF] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">AI Mentor</p>
              <p className="text-[10px] text-gray-500">Get help coding</p>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Leaderboard Teaser */}
      <motion.div variants={item}>
        <div
          className="bitxy-card-orange p-4 flex items-center gap-4 cursor-pointer"
          onClick={() => navigate('/app/leaderboard')}
          style={{ boxShadow: '0 4px 0 0 rgba(255,150,0,0.15)', border: '2px solid rgba(255,150,0,0.3)' }}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FF9600] flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-800">League Rankings</p>
            <p className="text-xs text-gray-500">Compete with other coders</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </motion.div>

      {/* Spacer for bottom nav */}
      <div className="h-4" />
    </motion.div>
  );
}
