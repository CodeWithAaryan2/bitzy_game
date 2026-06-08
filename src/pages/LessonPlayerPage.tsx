import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, ArrowRight, Zap, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { getLessonBySlug, getAdjacentLesson, getCourseBySlug } from '@/data/courses';
import { getQuizByLessonId } from '@/data/quizzes';
import { useGame } from '@/context/GameContext';

export default function LessonPlayerPage() {
  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const { completeLesson, hasCompletedLesson, spendEnergy } = useGame();
  const [completed, setCompleted] = useState(false);

  const result = getLessonBySlug(courseSlug || '', lessonSlug || '');
  const course = getCourseBySlug(courseSlug || '');
  const quiz = result ? getQuizByLessonId(result.lesson.id) : null;

  if (!result || !course) {
    return <div className="p-8 text-center text-muted-foreground">Lesson not found.</div>;
  }

  const { lesson } = result;
  const isCompleted = hasCompletedLesson(course.id, lesson.id);
  const prevLesson = getAdjacentLesson(courseSlug || '', lessonSlug || '', 'prev');
  const nextLesson = getAdjacentLesson(courseSlug || '', lessonSlug || '', 'next');

  const handleComplete = () => {
    if (!isCompleted && !completed) {
      if (spendEnergy(lesson.energyCost || 10)) {
        completeLesson(course.id, lesson.id);
        setCompleted(true);
      }
    }
  };

  const handleTakeQuiz = () => {
    if (quiz) {
      navigate(`/app/quiz/${quiz.id}?courseId=${course.id}`);
    }
  };

  // Parse content to render code blocks
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
        if (match) {
          const [, lang, code] = match;
          return (
            <div key={i} className="my-4 rounded-lg overflow-hidden border border-white/10">
              {lang && (
                <div className="bg-[#1a1a25] px-4 py-1.5 text-xs text-muted-foreground flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                  </div>
                  {lang}
                </div>
              )}
              <pre className="bg-[#0d0d12] p-4 overflow-x-auto code-scrollbar">
                <code className="text-sm font-mono text-indigo-300">{code.trim()}</code>
              </pre>
            </div>
          );
        }
      }
      // Render markdown-like text
      return (
        <div key={i} className="prose prose-invert prose-sm max-w-none">
          {part.split('\n').map((line, li) => {
            if (line.startsWith('## ')) return <h2 key={li} className="text-lg font-bold mt-6 mb-3">{line.slice(3)}</h2>;
            if (line.startsWith('### ')) return <h3 key={li} className="text-base font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
            if (line.startsWith('- ')) return <li key={li} className="ml-4 text-sm text-muted-foreground">{line.slice(2)}</li>;
            if (line.startsWith('**') && line.endsWith('**')) return <p key={li} className="text-sm font-semibold my-2">{line.slice(2, -2)}</p>;
            if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) return <li key={li} className="ml-4 text-sm text-muted-foreground list-decimal">{line.slice(3)}</li>;
            if (line.trim() === '') return <div key={li} className="h-2" />;
            if (line.startsWith('`') && line.endsWith('`')) {
              return <p key={li} className="text-sm my-1"><code className="px-1.5 py-0.5 bg-white/10 rounded text-indigo-300 text-xs">{line.slice(1, -1)}</code></p>;
            }
            return <p key={li} className="text-sm text-muted-foreground leading-relaxed my-1">{line}</p>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5 px-6 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/app/courses/${courseSlug}`)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {course.title}
          </button>
          <div className="flex items-center gap-2">
            {isCompleted || completed ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" /> Completed
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Zap className="w-3.5 h-3.5" /> {lesson.energyCost || 10} energy
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 lg:p-8"
      >
        <div className="mb-6">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{result.module.title}</span>
          <h1 className="text-2xl font-bold mt-1">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
        </div>

        {/* Lesson Content */}
        <div className="glass-card rounded-xl p-6 mb-6">
          {renderContent(lesson.content || `# ${lesson.title}\n\n${lesson.description}\n\nThis lesson covers important concepts. Read through the material and complete the exercises.`)}
        </div>

        {/* Code Examples */}
        {(lesson.codeExamples || []).map((example, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="glass-card rounded-xl p-5 mb-4"
          >
            <p className="text-xs text-muted-foreground mb-3">{example.explanation}</p>
            <div className="rounded-lg overflow-hidden border border-white/10">
              <div className="bg-[#1a1a25] px-4 py-1.5 text-xs text-muted-foreground flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                </div>
                {example.language}
              </div>
              <pre className="bg-[#0d0d12] p-4 overflow-x-auto code-scrollbar">
                <code className="text-sm font-mono text-indigo-300 whitespace-pre">{example.code}</code>
              </pre>
            </div>
          </motion.div>
        ))}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <button
            onClick={() => prevLesson && prevLesson.module && navigate(`/app/courses/${courseSlug}/${prevLesson.module.id}/${prevLesson.lesson.slug}`)}
            disabled={!prevLesson}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-3">
            {!isCompleted && !completed && (
              <button
                onClick={handleComplete}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Mark Complete
              </button>
            )}
            {(isCompleted || completed) && quiz && (
              <button
                onClick={handleTakeQuiz}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" /> Take Quiz
              </button>
            )}
          </div>

          <button
            onClick={() => nextLesson && nextLesson.module && navigate(`/app/courses/${courseSlug}/${nextLesson.module.id}/${nextLesson.lesson.slug}`)}
            disabled={!nextLesson}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all flex items-center gap-2"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
