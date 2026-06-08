import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2, ArrowLeft, Zap, Trophy, Timer, Bug,
  Swords, Keyboard, Sparkles, Target, Star, Flame
} from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import QuizGame from '@/components/games/QuizGame';
import CodeBattleGame from '@/components/games/CodeBattleGame';
import SpeedTypingGame from '@/components/games/SpeedTypingGame';
import BugHuntGame from '@/components/games/BugHuntGame';
import {
  getQuizQuestions,
  battleChallenges,
  typingSnippets,
  bugSnippets,
} from '@/data/gameData';

type ActiveGame = 'quiz' | 'battle' | 'typing' | 'bughunt' | null;
type QuizTopic = 'html' | 'css' | 'javascript' | 'mixed';

const gameCards = [
  {
    id: 'quiz' as ActiveGame,
    title: 'Code Quiz',
    desc: 'Test your knowledge with timed quizzes!',
    icon: Target,
    color: '#58CC02',
    bg: '#E8F5D6',
    players: '12k playing',
  },
  {
    id: 'battle' as ActiveGame,
    title: 'Code Battle',
    desc: 'Battle AI opponents in coding duels!',
    icon: Swords,
    color: '#FF4B4B',
    bg: '#FFE0E0',
    players: '8k battling',
  },
  {
    id: 'typing' as ActiveGame,
    title: 'Speed Typing',
    desc: 'Race to type code snippets fast!',
    icon: Keyboard,
    color: '#1CB0F6',
    bg: '#E8F7FE',
    players: '15k racing',
  },
  {
    id: 'bughunt' as ActiveGame,
    title: 'Bug Hunt',
    desc: 'Find and fix bugs in code!',
    icon: Bug,
    color: '#FF9600',
    bg: '#FFF3D6',
    players: '10k hunting',
  },
];

const quizTopics: { key: QuizTopic; label: string }[] = [
  { key: 'html', label: 'HTML' },
  { key: 'css', label: 'CSS' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'mixed', label: 'Mixed' },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function GamesPage() {
  const navigate = useNavigate();
  const { addXP, addCoins, showXPPopup } = useGame();
  const { user } = useAuth();

  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const [quizTopic, setQuizTopic] = useState<QuizTopic>('mixed');

  const handleGameComplete = (xp: number, coins: number, _extra?: number) => {
    addXP(xp, 'game');
    addCoins(coins, 'game');
    showXPPopup(xp, 'xp', `+${xp} XP from game!`);
    setActiveGame(null);
  };

  const handleQuizComplete = (score: number, _total: number, correctCount: number) => {
    const xp = Math.round(score / 10);
    const coins = correctCount * 10;
    handleGameComplete(xp, coins);
  };

  const handleBattleComplete = (playerHealth: number, _oppHealth: number, wins: number) => {
    const xp = playerHealth > 0 ? wins * 50 + 20 : wins * 30;
    const coins = playerHealth > 0 ? wins * 15 + 10 : wins * 10;
    handleGameComplete(xp, coins);
  };

  const handleTypingComplete = (wpm: number, accuracy: number, _score: number) => {
    const xp = Math.round(wpm * (accuracy / 100));
    const coins = Math.round(wpm / 3);
    handleGameComplete(xp, coins);
  };

  const handleBugHuntComplete = (score: number, _found: number, _total: number) => {
    const xp = Math.round(score / 2);
    const coins = Math.round(score / 5);
    handleGameComplete(xp, coins);
  };

  // Active game rendering
  if (activeGame === 'quiz') {
    const questions = getQuizQuestions(quizTopic);
    return (
      <div className="h-full">
        <QuizGame
          title={`${quizTopic.toUpperCase()} Quiz`}
          questions={questions}
          onComplete={handleQuizComplete}
          onExit={() => setActiveGame(null)}
        />
      </div>
    );
  }

  if (activeGame === 'battle') {
    return (
      <div className="h-full">
        <CodeBattleGame
          challenges={battleChallenges}
          onComplete={handleBattleComplete}
          onExit={() => setActiveGame(null)}
        />
      </div>
    );
  }

  if (activeGame === 'typing') {
    return (
      <div className="h-full">
        <SpeedTypingGame
          snippets={typingSnippets}
          onComplete={handleTypingComplete}
          onExit={() => setActiveGame(null)}
        />
      </div>
    );
  }

  if (activeGame === 'bughunt') {
    return (
      <div className="h-full">
        <BugHuntGame
          snippets={bugSnippets}
          onComplete={handleBugHuntComplete}
          onExit={() => setActiveGame(null)}
        />
      </div>
    );
  }

  // Game hub
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Header */}
      <motion.div variants={item} className="text-center">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-[#CE82FF] flex items-center justify-center mx-auto mb-3 shadow-lg"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <Gamepad2 className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="font-display text-2xl font-bold text-gray-800">Game Arena</h1>
        <p className="text-sm text-gray-500">Learn by playing! Pick a game mode below.</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        <div className="bitxy-card p-3 text-center">
          <Zap className="w-6 h-6 text-[#FFC800] mx-auto mb-1" />
          <p className="font-display text-lg font-bold text-gray-800">{user?.xp ?? 0}</p>
          <p className="text-[10px] text-gray-500">Your XP</p>
        </div>
        <div className="bitxy-card p-3 text-center">
          <Trophy className="w-6 h-6 text-[#FF9600] mx-auto mb-1" />
          <p className="font-display text-lg font-bold text-gray-800">Lv.{Math.floor((user?.xp ?? 0) / 100) + 1}</p>
          <p className="text-[10px] text-gray-500">Level</p>
        </div>
        <div className="bitxy-card p-3 text-center">
          <Flame className="w-6 h-6 text-[#FF4B4B] mx-auto mb-1" />
          <p className="font-display text-lg font-bold text-gray-800">{user?.currentStreak ?? 0}</p>
          <p className="text-[10px] text-gray-500">Streak</p>
        </div>
      </motion.div>

      {/* Quiz Topic Selector (shown when quiz selected) */}
      <motion.div variants={item}>
        <h2 className="font-display text-lg font-bold text-gray-800 mb-3">Pick a Topic</h2>
        <div className="flex gap-2 mb-4">
          {quizTopics.map(t => (
            <button
              key={t.key}
              onClick={() => setQuizTopic(t.key)}
              className={`px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all ${
                quizTopic === t.key
                  ? 'border-[#58CC02] bg-[#58CC02] text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Game Cards */}
      <motion.div variants={item}>
        <h2 className="font-display text-lg font-bold text-gray-800 mb-3">Choose Game Mode</h2>
        <div className="grid grid-cols-1 gap-3">
          {gameCards.map((game, i) => (
            <motion.button
              key={game.id}
              variants={item}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveGame(game.id)}
              className="bitxy-card w-full p-4 flex items-center gap-4 text-left hover:border-gray-300 transition-all"
              style={{ borderLeftWidth: '4px', borderLeftColor: game.color }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{ backgroundColor: game.bg }}
              >
                <game.icon className="w-7 h-7" style={{ color: game.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-800">{game.title}</p>
                  <Sparkles className="w-3 h-3 text-[#FFC800]" />
                </div>
                <p className="text-xs text-gray-500">{game.desc}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{game.players}</p>
              </div>
              <Star className="w-5 h-5 text-gray-300 flex-shrink-0" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* How to play */}
      <motion.div variants={item} className="bitxy-card p-4">
        <h3 className="font-display text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Target className="w-4 h-4 text-[#58CC02]" /> How Games Work
        </h3>
        <ul className="text-xs text-gray-500 space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-[#58CC02] font-bold">1.</span>
            <span>Play any game mode to earn <strong className="text-[#FFC800]">XP</strong> and <strong className="text-[#1CB0F6]">Coins</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#58CC02] font-bold">2.</span>
            <span>Faster completion and higher accuracy = more rewards</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#58CC02] font-bold">3.</span>
            <span>Streak bonuses multiply your score!</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#58CC02] font-bold">4.</span>
            <span>XP helps you level up and climb the leaderboard</span>
          </li>
        </ul>
      </motion.div>

      <div className="h-4" />
    </motion.div>
  );
}
