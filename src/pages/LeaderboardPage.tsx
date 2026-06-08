import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Crown, Medal, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { trpc } from '@/providers/trpc';

const FALLBACK_LEADERS = [
  { id: 1, username: 'code_master', level: 45, xp: 45230, streak: 89, challenges: 67 },
  { id: 2, username: 'sarahcodes', level: 38, xp: 38920, streak: 45, challenges: 52 },
  { id: 3, username: 'devmike', level: 35, xp: 35200, streak: 67, challenges: 48 },
  { id: 4, username: 'frontendqueen', level: 33, xp: 31800, streak: 23, challenges: 44 },
  { id: 5, username: 'pythonista', level: 31, xp: 29600, streak: 12, challenges: 41 },
  { id: 6, username: 'reactninja', level: 29, xp: 27400, streak: 34, challenges: 38 },
  { id: 7, username: 'csswizard', level: 27, xp: 25100, streak: 19, challenges: 35 },
  { id: 8, username: 'jsjunkie', level: 26, xp: 23800, streak: 8, challenges: 33 },
  { id: 9, username: 'webdev_alice', level: 24, xp: 21500, streak: 41, challenges: 30 },
  { id: 10, username: 'fullstackbob', level: 22, xp: 19200, streak: 15, challenges: 28 },
];

const RANK_COLORS = ['#FFC800', '#C0C0C0', '#CD7F32'];
const RANK_ICONS = [Crown, Medal, Medal];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } };

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [period] = useState('Weekly');

  const { data: dbLeaders } = trpc.gamification.getLeaderboard.useQuery(undefined, { staleTime: 1000 * 60 * 5 });
  const leaders = (dbLeaders && dbLeaders.length > 0)
    ? dbLeaders.map((e: any, i: number) => ({
        rank: i + 1, username: e.username, level: e.level, xp: e.xp, streak: e.currentStreak, challenges: e.challengesSolved
      }))
    : FALLBACK_LEADERS;

  const top3 = leaders.slice(0, 3);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {/* Header */}
      <motion.div variants={item} className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#FF9600] flex items-center justify-center mx-auto mb-2">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-800">Diamond League</h1>
        <p className="text-sm text-gray-500">Top 10 coders this {period.toLowerCase()}</p>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div variants={item} className="flex items-end justify-center gap-3 pt-4">
        {/* 2nd Place */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 border-3 border-gray-300 flex items-center justify-center text-sm font-bold text-gray-600 mb-1">
            {top3[1]?.username[0].toUpperCase()}
          </div>
          <p className="text-xs font-bold text-gray-600">@{top3[1]?.username}</p>
          <p className="text-xs text-gray-400">Lv.{top3[1]?.level}</p>
          <div className="w-16 h-20 rounded-t-2xl bg-gray-200 border-2 border-gray-300 mt-2 flex items-center justify-center">
            <Medal className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-xs font-bold text-gray-500 mt-1">#2</p>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center -mt-4">
          <div className="relative">
            <Crown className="w-6 h-6 text-[#FFC800] absolute -top-6 left-1/2 -translate-x-1/2" />
            <div className="w-14 h-14 rounded-full bg-[#FFC800] border-4 border-[#FFD93D] flex items-center justify-center text-lg font-bold text-white shadow-lg">
              {top3[0]?.username[0].toUpperCase()}
            </div>
          </div>
          <p className="text-sm font-bold text-gray-800 mt-1">@{top3[0]?.username}</p>
          <p className="text-xs text-[#FF9600] font-bold">Lv.{top3[0]?.level}</p>
          <div className="w-20 h-28 rounded-t-2xl bg-[#FFC800] border-2 border-[#FFD93D] mt-2 flex items-center justify-center shadow-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <p className="text-xs font-bold text-[#FF9600] mt-1">#1</p>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-amber-100 border-3 border-amber-300 flex items-center justify-center text-sm font-bold text-amber-700 mb-1">
            {top3[2]?.username[0].toUpperCase()}
          </div>
          <p className="text-xs font-bold text-amber-700">@{top3[2]?.username}</p>
          <p className="text-xs text-gray-400">Lv.{top3[2]?.level}</p>
          <div className="w-16 h-16 rounded-t-2xl bg-amber-100 border-2 border-amber-300 mt-2 flex items-center justify-center">
            <Medal className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-xs font-bold text-amber-700 mt-1">#3</p>
        </div>
      </motion.div>

      {/* Full Table */}
      <motion.div variants={item} className="bitxy-card overflow-hidden">
        {leaders.map((entry) => {
          const isMe = entry.username === (user?.username || 'bitxy_learner');
          const RankIcon = entry.rank <= 3 ? RANK_ICONS[entry.rank - 1] : null;
          const rankColor = entry.rank <= 3 ? RANK_COLORS[entry.rank - 1] : '#9CA3AF';

          return (
            <motion.div
              key={entry.rank}
              variants={item}
              className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0 ${isMe ? 'bg-[#58CC02]/5' : ''}`}
            >
              <div className="w-8 flex-shrink-0 text-center">
                {RankIcon ? (
                  <RankIcon className="w-5 h-5 mx-auto" style={{ color: rankColor }} />
                ) : (
                  <span className="text-sm font-bold text-gray-400">{entry.rank}</span>
                )}
              </div>

              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                isMe ? 'bg-[#58CC02] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {entry.username[0].toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${isMe ? 'text-[#58CC02]' : 'text-gray-800'}`}>
                  @{entry.username} {isMe && <span className="text-[10px] font-normal">(You)</span>}
                </p>
                <p className="text-[10px] text-gray-500">Level {entry.level}</p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-[#FFC800]">
                  <Star className="w-3.5 h-3.5" /> {entry.xp.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-[#FF9600]">
                  <Flame className="w-3.5 h-3.5" /> {entry.streak}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="h-4" />
    </motion.div>
  );
}
