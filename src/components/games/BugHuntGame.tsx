import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, CheckCircle2, XCircle, Timer, Zap, Trophy, ArrowRight, RotateCcw, Eye, Lightbulb, Target, Flame } from 'lucide-react';

interface BuggySnippet {
  id: string;
  buggyCode: string;
  fixedCode: string;
  language: string;
  description: string;
  bugs: {
    line: number;
    hint: string;
    explanation: string;
  }[];
  points: number;
}

interface BugHuntGameProps {
  snippets: BuggySnippet[];
  onComplete: (totalScore: number, bugsFound: number, totalBugs: number) => void;
  onExit: () => void;
}

export default function BugHuntGame({ snippets, onComplete, onExit }: BugHuntGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [foundBugs, setFoundBugs] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<'hunting' | 'revealed' | 'gameover'>('hunting');
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalBugsFound, setTotalBugsFound] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [shakeLine, setShakeLine] = useState<number | null>(null);
  const [flashLine, setFlashLine] = useState<number | null>(null);

  const snippet = snippets[currentIdx];
  const totalBugs = snippets.reduce((s, snip) => s + snip.bugs.length, 0);

  // Timer
  useEffect(() => {
    if (phase !== 'hunting') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('revealed');
          setStreak(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, currentIdx]);

  const handleLineClick = (lineNum: number) => {
    if (phase !== 'hunting') return;

    const bug = snippet.bugs.find(b => b.line === lineNum);
    if (!bug) {
      // Wrong line - shake it
      setShakeLine(lineNum);
      setTimeout(() => setShakeLine(null), 500);
      setStreak(0);
      return;
    }

    if (foundBugs.has(lineNum)) return; // Already found

    // Found a bug!
    const timeBonus = Math.floor(timeLeft / 5);
    const streakBonus = Math.min(streak * 15, 60);
    const points = snippet.points + timeBonus + streakBonus;

    setFoundBugs(prev => new Set([...prev, lineNum]));
    setScore(prev => prev + points);
    setTotalBugsFound(prev => prev + 1);
    setStreak(prev => prev + 1);
    setFlashLine(lineNum);
    setTimeout(() => setFlashLine(null), 600);

    // Check if all bugs in this snippet found
    if (foundBugs.size + 1 >= snippet.bugs.length) {
      setTimeout(() => setPhase('revealed'), 600);
    }
  };

  const handleNext = () => {
    if (currentIdx < snippets.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setFoundBugs(new Set());
      setPhase('hunting');
      setSelectedLine(null);
      setTimeLeft(60);
      setShowHint(false);
    } else {
      setPhase('gameover');
    }
  };

  const handleFinish = () => {
    onComplete(score, totalBugsFound, totalBugs);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setFoundBugs(new Set());
    setPhase('hunting');
    setSelectedLine(null);
    setScore(0);
    setTotalBugsFound(0);
    setHintsUsed(0);
    setShowHint(false);
    setTimeLeft(60);
    setStreak(0);
  };

  // Check if a line has a bug
  const getLineBug = (lineNum: number) => snippet.bugs.find(b => b.line === lineNum);
  const isBugFound = (lineNum: number) => foundBugs.has(lineNum);
  const allFound = foundBugs.size >= snippet.bugs.length;

  // Split code into lines
  const lines = snippet.buggyCode.split('\n');

  // Game over screen
  if (phase === 'gameover') {
    const percent = Math.round((totalBugsFound / totalBugs) * 100);
    const isGreat = percent >= 80;

    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <motion.div
            animate={isGreat ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-20 h-20 rounded-full bg-[#58CC02] flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-1">
            {isGreat ? 'Bug Hunter Pro!' : 'Hunt Complete!'}
          </h2>
          <p className="text-sm text-gray-500 mb-4">You found {totalBugsFound} out of {totalBugs} bugs</p>

          <div className="bitxy-card p-4 mb-4 max-w-xs mx-auto">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="font-display text-2xl font-bold text-[#58CC02]">{score}</p>
                <p className="text-[10px] text-gray-500">Points</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[#FF9600]">{totalBugsFound}/{totalBugs}</p>
                <p className="text-[10px] text-gray-500">Bugs Found</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[#FFC800]">{percent}%</p>
                <p className="text-[10px] text-gray-500">Accuracy</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[#CE82FF]">{hintsUsed}</p>
                <p className="text-[10px] text-gray-500">Hints Used</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={handleRestart} className="bitxy-btn bitxy-btn-blue px-6 py-3 text-sm flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Play Again
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
      <div className="flex-shrink-0 mb-3">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onExit} className="text-xs text-gray-500 font-medium hover:text-gray-700">Exit</button>
          <span className="text-xs font-bold text-gray-400">{currentIdx + 1} / {snippets.length}</span>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-[#FF4B4B] rounded-full"
            animate={{ width: `${((currentIdx + (phase === 'revealed' ? 1 : 0)) / snippets.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-[#FFC800]" />
              <span className="text-sm font-bold text-[#FFC800]">{score}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bug className="w-4 h-4 text-[#FF4B4B]" />
              <span className="text-sm font-bold text-[#FF4B4B]">{foundBugs.size}/{snippet.bugs.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {streak > 1 && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 rounded-full border border-orange-200">
                <Flame className="w-3 h-3 text-[#FF9600]" />
                <span className="text-[10px] font-bold text-[#FF9600]">{streak}x</span>
              </div>
            )}
            <div className={`flex items-center gap-1 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
              <Timer className="w-4 h-4" />
              <span className="text-sm font-bold">{timeLeft}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="flex items-center gap-2 mb-2">
        <Bug className="w-4 h-4 text-[#FF4B4B]" />
        <p className="text-xs text-gray-600 font-medium">{snippet.description}</p>
        <span className="text-[10px] text-gray-400 ml-auto">{snippet.language}</span>
      </div>

      {/* Hint button */}
      {phase === 'hunting' && (
        <button
          onClick={() => { setHintsUsed(prev => prev + 1); setShowHint(!showHint); }}
          className="flex items-center gap-1 text-xs font-bold text-[#1CB0F6] hover:text-blue-600 mb-2 self-start"
        >
          <Lightbulb className="w-3 h-3" />
          {showHint ? 'Hide Hints' : 'Show Hints'}
        </button>
      )}

      {showHint && phase === 'hunting' && (
        <div className="mb-2 p-2 bg-yellow-50 rounded-xl border border-yellow-200">
          <p className="text-[10px] font-bold text-yellow-700 mb-1">Hints:</p>
          {snippet.bugs.filter(b => !foundBugs.has(b.line)).map((bug, i) => (
            <p key={i} className="text-xs text-yellow-600">Line {bug.line}: {bug.hint}</p>
          ))}
        </div>
      )}

      {/* Code display */}
      <div className="flex-1 bg-[#1a1a2e] rounded-2xl border-2 border-gray-800 p-4 overflow-auto mb-3">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
          </div>
          <span className="text-[10px] text-gray-500 font-mono">{snippet.language} - Click buggy lines</span>
        </div>

        <div className="space-y-0.5">
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const bug = getLineBug(lineNum);
            const found = isBugFound(lineNum);
            const isShake = shakeLine === lineNum;
            const isFlash = flashLine === lineNum;

            let bgClass = '';
            if (phase === 'revealed' || found) {
              if (bug) {
                bgClass = found ? 'bg-green-500/20 border-l-2 border-green-500' : 'bg-red-500/20 border-l-2 border-red-500';
              }
            }

            return (
              <motion.div
                key={`${currentIdx}-${lineNum}`}
                onClick={() => {
                  handleLineClick(lineNum);
                  if (bug && !found) setSelectedLine(lineNum);
                }}
                className={`flex items-start gap-2 px-2 py-0.5 rounded cursor-pointer transition-all hover:bg-white/5 ${bgClass} ${isShake ? 'animate-shake' : ''}`}
                animate={isFlash ? { scale: [1, 1.02, 1] } : {}}
              >
                <span className={`text-xs font-mono w-6 text-right flex-shrink-0 select-none ${
                  bug ? (found ? 'text-green-400' : phase === 'revealed' ? 'text-red-400' : 'text-gray-600') : 'text-gray-600'
                }`}>
                  {lineNum}
                </span>
                <span className={`text-xs font-mono flex-1 whitespace-pre ${
                  found ? 'line-through text-green-400/50' : bug && phase === 'revealed' ? 'text-red-400' : 'text-gray-300'
                }`}>
                  {line}
                </span>
                {found && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                {bug && phase === 'revealed' && !found && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected line explanation */}
      <AnimatePresence>
        {selectedLine && (() => {
          const bug = getLineBug(selectedLine);
          if (!bug || !isBugFound(selectedLine)) return null;
          return (
            <motion.div
              key={`explain-${selectedLine}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-shrink-0 mb-2 p-3 bg-green-50 rounded-2xl border-2 border-green-200"
            >
              <p className="text-xs font-bold text-green-700 mb-0.5">Bug found on line {selectedLine}!</p>
              <p className="text-xs text-green-600">{bug.explanation}</p>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Fixed code reveal */}
      <AnimatePresence>
        {phase === 'revealed' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex-shrink-0 mb-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-3 h-3 text-[#58CC02]" />
              <span className="text-[10px] font-bold text-[#58CC02]">Fixed Code:</span>
            </div>
            <div className="bg-[#0d3b1a] rounded-xl border border-green-800 p-3">
              <pre className="text-xs font-mono text-green-300 whitespace-pre-wrap">{snippet.fixedCode}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action button */}
      {phase === 'revealed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0"
        >
          <button
            onClick={handleNext}
            className="bitxy-btn bitxy-btn-green w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
          >
            {currentIdx < snippets.length - 1 ? 'Next Challenge' : 'See Results'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
