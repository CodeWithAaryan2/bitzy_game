import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Timer, Zap, Trophy, RotateCcw, ArrowRight, Target, Keyboard, Flame } from 'lucide-react';

interface CodeSnippet {
  code: string;
  language: string;
  description: string;
}

interface SpeedTypingGameProps {
  snippets: CodeSnippet[];
  onComplete: (wpm: number, accuracy: number, totalScore: number) => void;
  onExit: () => void;
}

export default function SpeedTypingGame({ snippets, onComplete, onExit }: SpeedTypingGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [phase, setPhase] = useState<'ready' | 'typing' | 'snippet-done' | 'gameover'>('ready');
  const [startTime, setStartTime] = useState(0);
  const [snippetTime, setSnippetTime] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestWpm, setBestWpm] = useState(0);
  const [streak, setStreak] = useState(0);
  const [results, setResults] = useState<{ snippet: string; wpm: number; accuracy: number; time: number }[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const snippet = snippets[currentIdx];
  const isDone = phase === 'snippet-done' || phase === 'gameover';

  const handleStart = useCallback(() => {
    setPhase('typing');
    setStartTime(Date.now());
    setSnippetTime(Date.now());
    setUserInput('');
    inputRef.current?.focus();
  }, []);

  // Track typing
  const handleInput = (val: string) => {
    if (phase !== 'typing') return;
    setUserInput(val);

    const elapsed = (Date.now() - snippetTime) / 1000 / 60; // in minutes
    const charsTyped = val.length;
    const correct = val.split('').filter((c, i) => c === snippet.code[i]).length;

    if (elapsed > 0) {
      const currentWpm = Math.round((charsTyped / 5) / elapsed);
      setWpm(currentWpm);
    }

    setAccuracy(charsTyped > 0 ? Math.round((correct / charsTyped) * 100) : 100);
    setCorrectChars(prev => prev + (val.length > userInput.length ? 1 : 0));

    // Check if completed
    if (val === snippet.code) {
      const timeTaken = (Date.now() - snippetTime) / 1000;
      const chars = snippet.code.length;
      const finalWpm = Math.round((chars / 5) / (timeTaken / 60));
      const finalAccuracy = Math.round((correct / chars) * 100);

      setWpm(finalWpm);
      setAccuracy(finalAccuracy);
      setTotalChars(prev => prev + chars);
      setBestWpm(prev => Math.max(prev, finalWpm));
      setStreak(prev => prev + 1);
      setResults(prev => [...prev, { snippet: snippet.description, wpm: finalWpm, accuracy: finalAccuracy, time: timeTaken }]);

      if (currentIdx < snippets.length - 1) {
        setPhase('snippet-done');
      } else {
        setPhase('gameover');
      }
    }
  };

  const handleNext = () => {
    if (currentIdx < snippets.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setPhase('typing');
      setUserInput('');
      setSnippetTime(Date.now());
      setWpm(0);
      setAccuracy(100);
      inputRef.current?.focus();
    }
  };

  const handleFinish = () => {
    const avgWpm = Math.round(results.reduce((s, r) => s + r.wpm, 0) / results.length);
    const avgAccuracy = Math.round(results.reduce((s, r) => s + r.accuracy, 0) / results.length);
    const totalScore = avgWpm * (avgAccuracy / 100);
    onComplete(avgWpm, avgAccuracy, Math.round(totalScore));
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setUserInput('');
    setPhase('ready');
    setWpm(0);
    setAccuracy(100);
    setBestWpm(0);
    setStreak(0);
    setResults([]);
    setTotalChars(0);
    setCorrectChars(0);
  };

  // Render character-by-character with highlighting
  const renderCode = () => {
    return snippet.code.split('').map((char, i) => {
      let bgClass = '';
      if (i < userInput.length) {
        bgClass = userInput[i] === char ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';
      } else if (i === userInput.length && phase === 'typing') {
        bgClass = 'bg-[#58CC02]/20 border-b-2 border-[#58CC02]';
      }
      return (
        <span key={i} className={`${bgClass} rounded px-[1px] font-mono text-sm`}>
          {char === '\n' ? '↵\n' : char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  // Ready screen
  if (phase === 'ready') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#1CB0F6] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Keyboard className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-1">Speed Typing</h2>
          <p className="text-sm text-gray-500 mb-4">Type code snippets as fast and accurately as you can!</p>

          <div className="bitxy-card p-4 mb-4 max-w-xs mx-auto text-left">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-[#FF4B4B]" />
              <span className="text-xs font-bold text-gray-700">How to play</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>- Type the shown code exactly as it appears</li>
              <li>- Green = correct, Red = wrong character</li>
              <li>- WPM and accuracy update in real-time</li>
              <li>- Complete all {snippets.length} snippets</li>
            </ul>
          </div>

          <button onClick={handleStart} className="bitxy-btn bitxy-btn-blue px-8 py-3 text-base font-bold">
            <Zap className="w-5 h-5 inline mr-2" /> Start Typing
          </button>
        </motion.div>
      </div>
    );
  }

  // Game over screen
  if (phase === 'gameover') {
    const avgWpm = Math.round(results.reduce((s, r) => s + r.wpm, 0) / results.length);
    const avgAccuracy = Math.round(results.reduce((s, r) => s + r.accuracy, 0) / results.length);
    const isGreat = avgWpm >= 40 && avgAccuracy >= 90;

    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#58CC02] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-1">Race Complete!</h2>
          <p className="text-sm text-gray-500 mb-4">{isGreat ? 'Amazing typing skills!' : 'Keep practicing to improve!'}</p>

          <div className="bitxy-card p-4 mb-4 max-w-xs mx-auto">
            <div className="grid grid-cols-2 gap-3 text-center mb-3">
              <div>
                <p className="font-display text-2xl font-bold text-[#1CB0F6]">{avgWpm}</p>
                <p className="text-[10px] text-gray-500">Avg WPM</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[#58CC02]">{avgAccuracy}%</p>
                <p className="text-[10px] text-gray-500">Accuracy</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[#FFC800]">{bestWpm}</p>
                <p className="text-[10px] text-gray-500">Best WPM</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[#FF9600]">{totalChars}</p>
                <p className="text-[10px] text-gray-500">Chars Typed</p>
              </div>
            </div>

            {/* Results per snippet */}
            <div className="space-y-1 border-t border-gray-100 pt-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 truncate flex-1 text-left">{r.snippet}</span>
                  <span className="font-bold text-[#1CB0F6] ml-2">{r.wpm}wpm</span>
                  <span className="text-[#58CC02] ml-1">{r.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={handleRestart} className="bitxy-btn bitxy-btn-blue px-6 py-3 text-sm flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Race Again
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

        {/* Progress */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-[#1CB0F6] rounded-full"
            animate={{ width: `${((currentIdx + (isDone ? 1 : 0)) / snippets.length) * 100}%` }}
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-[#FFC800]" />
              <span className="text-sm font-bold text-[#FFC800]">{wpm} WPM</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-[#58CC02]" />
              <span className="text-sm font-bold text-[#58CC02]">{accuracy}%</span>
            </div>
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 rounded-full border border-orange-200">
              <Flame className="w-3 h-3 text-[#FF9600]" />
              <span className="text-[10px] font-bold text-[#FF9600]">{streak}x streak</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 mb-2 font-medium">{snippet.description}</p>

      {/* Code display */}
      <div className="flex-1 bg-[#1a1a2e] rounded-2xl border-2 border-gray-800 p-4 overflow-auto mb-3">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
          </div>
          <span className="text-[10px] text-gray-500 font-mono">{snippet.language}</span>
        </div>
        <pre className="whitespace-pre-wrap font-mono text-sm leading-6">{renderCode()}</pre>
      </div>

      {/* Hidden input for capturing keystrokes */}
      {phase === 'typing' && (
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={e => handleInput(e.target.value)}
          className="absolute opacity-0 pointer-events-auto"
          style={{ top: 0, left: 0, width: '100%', height: '100%' }}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
      )}

      {/* Snippet done */}
      {phase === 'snippet-done' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <div className="bitxy-card p-3 mb-3 inline-block">
            <p className="text-sm font-bold text-[#58CC02]">{wpm} WPM</p>
            <p className="text-xs text-gray-500">{accuracy}% accuracy</p>
          </div>
          <div>
            <button onClick={handleNext} className="bitxy-btn bitxy-btn-green px-6 py-3 text-sm font-bold">
              Next Snippet <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Tap to focus hint */}
      {phase === 'typing' && (
        <p className="text-center text-[10px] text-gray-400 mt-auto">Click anywhere and start typing</p>
      )}
    </div>
  );
}
