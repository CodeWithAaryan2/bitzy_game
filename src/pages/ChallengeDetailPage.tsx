import { useParams, useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ChevronLeft, CheckCircle, XCircle, Clock, Zap, Lightbulb, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getChallengeBySlug } from '@/data/challenges';
import { useGame } from '@/context/GameContext';

type RunStatus = 'idle' | 'running' | 'accepted' | 'wrong_answer' | 'error';

export default function ChallengeDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const challenge = getChallengeBySlug(slug || '');
  const { completeChallenge, spendEnergy } = useGame();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<RunStatus>('idle');
  const [results, setResults] = useState<{ testId: string; passed: boolean; got: string; expected: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'hints'>('description');
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    if (challenge) {
      setCode(challenge.starterCode[language] || '');
    }
  }, [challenge, language]);

  if (!challenge) return <div className="p-8 text-center text-muted-foreground">Challenge not found.</div>;

  const handleRun = async () => {
    if (!spendEnergy(15)) return;
    setStatus('running');
    setResults([]);

    // Simulate execution
    await new Promise(r => setTimeout(r, 1500));

    const testResults = challenge.testCases.filter(t => !t.isHidden).map(tc => {
      // Simulate: some tests pass, some fail randomly for demo
      const passed = Math.random() > 0.3;
      return {
        testId: tc.id,
        passed,
        got: passed ? tc.expectedOutput : '[]',
        expected: tc.expectedOutput,
      };
    });

    setResults(testResults);
    const allPassed = testResults.every(r => r.passed);
    setStatus(allPassed ? 'accepted' : 'wrong_answer');

    if (allPassed && !solved) {
      setSolved(true);
      completeChallenge(challenge.id, true);
    }
  };

  const handleSubmit = async () => {
    if (!spendEnergy(15)) return;
    setStatus('running');
    setResults([]);

    await new Promise(r => setTimeout(r, 2000));

    const testResults = challenge.testCases.map(tc => ({
      testId: tc.id,
      passed: true, // Demo: always passes on submit
      got: tc.expectedOutput,
      expected: tc.expectedOutput,
    }));

    setResults(testResults);
    setStatus('accepted');
    if (!solved) {
      setSolved(true);
      completeChallenge(challenge.id, true);
    }
  };

  const revealHint = (order: number) => {
    if (!revealedHints.includes(order)) {
      setRevealedHints([...revealedHints, order]);
    }
  };

  return (
    <div className="h-[calc(100vh-0px)] flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/app/challenges')} className="text-muted-foreground hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-semibold">{challenge.title}</h1>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                challenge.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                challenge.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>{challenge.difficulty}</span>
              <span className="text-xs text-muted-foreground">{challenge.category}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400" /> {challenge.xpReward} XP</span>
          {solved && <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Solved</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Description */}
        <div className="w-[45%] border-r border-white/5 overflow-y-auto code-scrollbar">
          <div className="flex border-b border-white/5">
            {(['description', 'hints'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-muted-foreground hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'description' ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Problem</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{challenge.problemStatement}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Constraints</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{challenge.constraints}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Examples</h3>
                  {challenge.examples.map((ex, i) => (
                    <div key={i} className="mb-3 bg-white/5 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Input: <span className="text-white font-mono">{ex.input}</span></p>
                      <p className="text-xs text-muted-foreground mb-1">Output: <span className="text-emerald-400 font-mono">{ex.output}</span></p>
                      {ex.explanation && <p className="text-xs text-muted-foreground mt-2">{ex.explanation}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground mb-4">Revealing hints costs XP but helps you learn!</p>
                {challenge.hints.map((hint) => (
                  <div key={hint.id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-indigo-400">Hint {hint.order}</span>
                      {!revealedHints.includes(hint.order) && (
                        <span className="text-xs text-amber-400">-{hint.xpCost} XP</span>
                      )}
                    </div>
                    {revealedHints.includes(hint.order) ? (
                      <p className="text-sm text-muted-foreground">{hint.hintText}</p>
                    ) : (
                      <button
                        onClick={() => revealHint(hint.order)}
                        className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <Lightbulb className="w-4 h-4" /> Reveal Hint
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Language Selector */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#12121a]">
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500/50"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
            </select>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setCode(challenge.starterCode[language] || ''); setStatus('idle'); setResults([]); }}
                className="p-1.5 text-muted-foreground hover:text-white transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 relative">
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full h-full bg-[#0d0d12] p-4 font-mono text-sm text-indigo-300 resize-none focus:outline-none code-scrollbar leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Test Results */}
          {results.length > 0 && (
            <div className="border-t border-white/5 bg-[#12121a] max-h-[200px] overflow-y-auto code-scrollbar">
              <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2">
                {status === 'accepted' ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> All tests passed!</span>
                ) : status === 'wrong_answer' ? (
                  <span className="text-xs text-red-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Some tests failed</span>
                ) : (
                  <span className="text-xs text-amber-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Running...</span>
                )}
              </div>
              {results.map((r, i) => (
                <div key={i} className="px-4 py-2 flex items-center gap-3 border-b border-white/5 text-xs">
                  {r.passed ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                  <span className="text-muted-foreground">Test {i + 1}</span>
                  {!r.passed && (
                    <span className="text-red-400 ml-auto">Expected {r.expected}, got {r.got}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="px-4 py-3 border-t border-white/5 flex items-center gap-3 bg-[#12121a]">
            <button
              onClick={handleRun}
              disabled={status === 'running'}
              className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4" /> {status === 'running' ? 'Running...' : 'Run Code'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={status === 'running'}
              className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
