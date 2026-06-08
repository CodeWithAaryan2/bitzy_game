import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Lock, Star, Zap, Clock, Trophy, TrendingUp } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { challenges } from '@/data/challenges';
import { useState } from 'react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const difficultyConfig: Record<string, { color: string; bg: string; label: string }> = {
  Easy: { color: '#58CC02', bg: '#E8F5D6', label: 'Easy' },
  Medium: { color: '#FF9600', bg: '#FFF3D6', label: 'Medium' },
  Hard: { color: '#FF4B4B', bg: '#FFE0E0', label: 'Hard' },
};

export default function ChallengesPage() {
  const navigate = useNavigate();
  const { hasCompletedChallenge } = useGame();
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Easy', 'Medium', 'Hard'];
  const filtered = filter === 'All' ? challenges : challenges.filter(c => c.difficulty === filter);
  const solvedCount = challenges.filter(c => hasCompletedChallenge(c.id)).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {/* Header */}
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-[#1CB0F6] flex items-center justify-center">
            <Swords className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-800">Code Arena</h1>
            <p className="text-sm text-gray-500">Battle coding challenges</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        <div className="bitxy-card p-3 text-center">
          <Trophy className="w-6 h-6 text-[#FF9600] mx-auto mb-1" />
          <p className="font-display text-lg font-bold text-gray-800">{solvedCount}</p>
          <p className="text-[10px] text-gray-500">Solved</p>
        </div>
        <div className="bitxy-card p-3 text-center">
          <Zap className="w-6 h-6 text-[#FFC800] mx-auto mb-1" />
          <p className="font-display text-lg font-bold text-gray-800">{challenges.length - solvedCount}</p>
          <p className="text-[10px] text-gray-500">Pending</p>
        </div>
        <div className="bitxy-card p-3 text-center">
          <TrendingUp className="w-6 h-6 text-[#58CC02] mx-auto mb-1" />
          <p className="font-display text-lg font-bold text-gray-800">{Math.round((solvedCount / challenges.length) * 100)}%</p>
          <p className="text-[10px] text-gray-500">Progress</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex gap-2">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all ${
              filter === c
                ? 'border-[#58CC02] bg-[#58CC02] text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            {c}
          </button>
        ))}
      </motion.div>

      {/* Challenge Cards */}
      <div className="space-y-3">
        {filtered.map((challenge, idx) => {
          const solved = hasCompletedChallenge(challenge.id);
          const diff = difficultyConfig[challenge.difficulty];

          return (
            <motion.div
              key={challenge.id}
              variants={item}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/app/challenges/${challenge.slug}`)}
              className={`bitxy-card p-4 flex items-center gap-4 cursor-pointer transition-all ${
                solved ? 'border-[#58CC02]/40 bg-green-50/30' : 'hover:border-gray-200'
              }`}
            >
              {/* Number badge */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-display text-lg font-bold flex-shrink-0"
                style={{ backgroundColor: solved ? '#58CC02' : diff.bg, color: solved ? 'white' : diff.color }}
              >
                {solved ? <Star className="w-5 h-5 text-white" /> : idx + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-gray-800 truncate">{challenge.title}</p>
                  {solved && <span className="text-[10px] font-bold text-[#58CC02] bg-[#58CC02]/10 px-2 py-0.5 rounded-full">Solved</span>}
                </div>
                <p className="text-xs text-gray-500 truncate">{challenge.category}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: diff.bg, color: diff.color }}
                  >
                    {diff.label}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {challenge.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                <Swords className={`w-4 h-4 ${solved ? 'text-[#58CC02]' : 'text-gray-400'}`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="h-4" />
    </motion.div>
  );
}
