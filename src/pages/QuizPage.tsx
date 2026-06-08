import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getQuizById } from '@/data/quizzes';
import { useGame } from '@/context/GameContext';

export default function QuizPage() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const quiz = getQuizById(quizId || '');
  const courseId = searchParams.get('courseId') || '';
  const { completeQuiz } = useGame();

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit || null);

  useEffect(() => {
    if (!timeLeft || showResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleFinish(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResult, answers]);

  if (!quiz) {
    return <div className="p-8 text-center text-muted-foreground">Quiz not found.</div>;
  }

  const question = quiz.questions[currentQ];
  const progress = ((currentQ + 1) / quiz.questions.length) * 100;

  const handleSelect = (index: number) => {
    if (submitted) return;
    setSelected(index);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      handleFinish(answers);
    }
  };

  const handleFinish = (finalAnswers: number[]) => {
    let correct = 0;
    finalAnswers.forEach((ans, i) => {
      if (ans === quiz.questions[i].correctAnswer) correct++;
    });
    const pct = Math.round((correct / quiz.questions.length) * 100);
    setScore(pct);
    setShowResult(true);
    completeQuiz(courseId, quiz.id, pct);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (showResult) {
    const passed = score >= quiz.passingScore;
    return (
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">{passed ? 'Quiz Complete!' : 'Quiz Finished'}</h2>
          <div className="text-5xl font-black gradient-text mb-2">{score}%</div>
          <p className="text-sm text-muted-foreground mb-6">
            {passed ? 'Great job! You passed the quiz.' : 'Keep practicing! You\'ll get there.'}
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6 max-w-sm mx-auto">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-lg font-bold text-emerald-400">{Math.round(score / 100 * quiz.questions.length)}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-lg font-bold text-red-400">{quiz.questions.length - Math.round(score / 100 * quiz.questions.length)}</p>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-lg font-bold text-amber-400">+{score >= 100 ? quiz.xpReward * 2 : Math.round(quiz.xpReward * (score / 100))}</p>
              <p className="text-xs text-muted-foreground">XP Earned</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/app/courses`)}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
            >
              Back to Courses
            </button>
            <button
              onClick={() => {
                setCurrentQ(0); setSelected(null); setAnswers([]); setShowResult(false);
                setSubmitted(false); setScore(0); setTimeLeft(quiz.timeLimit);
              }}
              className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Retake
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          {timeLeft !== null && (
            <div className={`text-sm font-mono ${timeLeft < 60 ? 'text-red-400' : 'text-muted-foreground'}`}>
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">Question {currentQ + 1} of {quiz.questions.length}</p>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card rounded-xl p-6"
        >
          <p className="text-lg font-medium mb-6">{question.question}</p>
          <div className="space-y-3">
            {question.options?.map((option, i) => {
              const isSelected = selected === i;
              const isCorrect = submitted && i === question.correctAnswer;
              const isWrong = submitted && isSelected && i !== question.correctAnswer;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={submitted}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-all ${
                    isCorrect ? 'border-emerald-500/50 bg-emerald-500/10' :
                    isWrong ? 'border-red-500/50 bg-red-500/10' :
                    isSelected ? 'border-indigo-500/50 bg-indigo-500/10' :
                    'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isCorrect ? 'border-emerald-500 text-emerald-400' :
                    isWrong ? 'border-red-500 text-red-400' :
                    isSelected ? 'border-indigo-500 text-indigo-400' :
                    'border-white/20'
                  }`}>
                    {isCorrect ? <CheckCircle className="w-4 h-4" /> :
                     isWrong ? <XCircle className="w-4 h-4" /> :
                     String.fromCharCode(65 + i)}
                  </div>
                  <span className={`text-sm ${isCorrect ? 'text-emerald-400' : isWrong ? 'text-red-400' : ''}`}>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
            >
              <p className="text-sm text-indigo-300">{question.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-end mt-6">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
          >
            {currentQ < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
