import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Timer, Zap, Star, Trophy, ArrowRight, RotateCcw, Flame } from 'lucide-react';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizGameProps {
  title: string;
  questions: QuizQuestion[];
  onComplete: (score: number, total: number, correctCount: number) => void;
  onExit: () => void;
}

const difficultyConfig = {
  easy: { color: '#58CC02', bg: '#E8F5D6', label: 'Easy', time: 20 },
  medium: { color: '#FF9600', bg: '#FFF3D6', label: 'Medium', time: 15 },
  hard: { color: '#FF4B4B', bg: '#FFE0E0', label: 'Hard', time: 10 },
};

export default function QuizGame({ title, questions, onComplete, onExit }: QuizGameProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isActive, setIsActive] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [answers, setAnswers] = useState<{ q: number; correct: boolean }[]>([]);

  const question = questions[currentQ];
  const diff = difficultyConfig[question.difficulty];

  // Timer
  useEffect(() => {
    if (!isActive || showResult || gameOver) return;
    setTimeLeft(diff.time);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQ, isActive, showResult, gameOver]);

  const handleTimeout = useCallback(() => {
    setIsActive(false);
    setShowResult(true);
    setSelected(null);
    setStreak(0);
    setAnswers(prev => [...prev, { q: currentQ, correct: false }]);
  }, [currentQ]);

  const handleAnswer = (index: number) => {
    if (!isActive || showResult) return;
    setIsActive(false);
    setSelected(index);
    setShowResult(true);

    const isCorrect = index === question.correctIndex;
    if (isCorrect) {
      const streakBonus = Math.min(streak * 10, 50);
      const timeBonus = Math.floor(timeLeft * 2);
      const points = 100 + streakBonus + timeBonus;
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(prev => Math.max(prev, newStreak));
    } else {
      setStreak(0);
    }
    setAnswers(prev => [...prev, { q: currentQ, correct: isCorrect }]);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setShowResult(false);
      setIsActive(true);
    } else {
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setIsActive(true);
    setGameOver(false);
    setAnswers([]);
  };

  const handleFinish = () => {
    onComplete(score, questions.length * 100 + questions.length * 20, correctCount);
  };

  const progress = ((currentQ + (showResult ? 1 : 0)) / questions.length) * 100;

  // Results screen
  if (gameOver) {
    const perfect = correctCount === questions.length;
    const percent = Math.round((correctCount / questions.length) * 100);
    const stars = perfect ? 3 : percent >= 70 ? 2 : percent >= 40 ? 1 : 0;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-[#58CC02] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-1">Quiz Complete!</h2>
          <p className="text-sm text-gray-500 mb-4">{title}</p>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map(s => (
              <motion.div
                key={s}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: s * 0.2, type: 'spring' }}
              >
                <Star
                  className="w-10 h-10"
                  style={{ color: s <= stars ? '#FFC800' : '#E5E7EB', fill: s <= stars ? '#FFC800' : 'none' }}
                />
              </motion.div>
            ))}
          </div>

          <div className="bitxy-card p-4 mb-4 max-w-xs mx-auto">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="font-display text-2xl font-bold text-[#58CC02]">{correctCount}/{questions.length}</p>
                <p className="text-xs text-gray-500">Correct</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[#FFC800]">{score}</p>
                <p className="text-xs text-gray-500">Points</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[#FF9600]">{maxStreak}</p>
                <p className="text-xs text-gray-500">Best Streak</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[#1CB0F6]">{percent}%</p>
                <p className="text-xs text-gray-500">Accuracy</p>
              </div>
            </div>
          </div>

          {/* Answer review */}
          <div className="flex justify-center gap-1 mb-4">
            {answers.map((a, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  a.correct ? 'bg-[#58CC02] text-white' : 'bg-[#FF4B4B] text-white'
                }`}
              >
                {a.correct ? '✓' : '✗'}
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={handleRestart} className="bitxy-btn bitxy-btn-blue px-6 py-3 text-sm flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
            <button onClick={handleFinish} className="bitxy-btn bitxy-btn-green px-6 py-3 text-sm flex items-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onExit} className="text-sm text-gray-500 hover:text-gray-700 font-medium">Exit</button>
          <span className="text-xs font-bold text-gray-400">{currentQ + 1} / {questions.length}</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#58CC02] rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Score */}
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-[#FFC800]" />
            <span className="text-sm font-bold text-[#FFC800]">{score}</span>
          </div>

          {/* Streak */}
          {streak > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 rounded-full border border-orange-200"
            >
              <Flame className="w-4 h-4 text-[#FF9600]" />
              <span className="text-xs font-bold text-[#FF9600]">{streak}x</span>
            </motion.div>
          )}

          {/* Timer */}
          <div className={`flex items-center gap-1 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
            <Timer className="w-4 h-4" />
            <span className="text-sm font-bold">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1"
        >
          {/* Difficulty badge */}
          <span
            className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2"
            style={{ backgroundColor: diff.bg, color: diff.color }}
          >
            {diff.label}
          </span>

          <h3 className="font-display text-lg font-bold text-gray-800 mb-4">{question.question}</h3>

          {/* Options */}
          <div className="space-y-2">
            <AnimatePresence>
              {question.options.map((option, i) => {
                let btnClass = 'bitxy-card w-full p-4 text-left text-sm font-medium transition-all border-2 ';
                let btnStyle = {};

                if (showResult) {
                  if (i === question.correctIndex) {
                    btnClass += 'bg-green-50 border-[#58CC02] text-gray-800';
                  } else if (i === selected && i !== question.correctIndex) {
                    btnClass += 'bg-red-50 border-[#FF4B4B] text-gray-800';
                  } else {
                    btnClass += 'bg-gray-50 border-gray-200 text-gray-400';
                  }
                } else {
                  btnClass += 'bg-white border-gray-200 text-gray-700 hover:border-[#58CC02]/50 cursor-pointer';
                }

                return (
                  <motion.button
                    key={`${currentQ}-${i}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(i)}
                    disabled={showResult}
                    className={btnClass}
                    style={btnStyle}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          showResult && i === question.correctIndex
                            ? 'bg-[#58CC02] text-white'
                            : showResult && i === selected
                            ? 'bg-[#FF4B4B] text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {showResult && i === question.correctIndex ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : showResult && i === selected ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </span>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200"
              >
                <p className="text-xs text-blue-600 font-medium mb-1">Explanation</p>
                <p className="text-sm text-blue-800">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Next button */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-shrink-0 mt-4"
            >
              <button
                onClick={handleNext}
                className="bitxy-btn bitxy-btn-green w-full py-3 text-sm flex items-center justify-center gap-2"
              >
                {currentQ < questions.length - 1 ? 'Next Question' : 'See Results'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
