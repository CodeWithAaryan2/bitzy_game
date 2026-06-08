import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Layers, ChevronRight, CheckCircle, Play, Zap } from 'lucide-react';
import { getCourseBySlug } from '@/data/courses';
import { useGame } from '@/context/GameContext';

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const course = getCourseBySlug(slug || '');
  const { gameState, hasCompletedLesson } = useGame();

  if (!course) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Course not found.</p>
      </div>
    );
  }

  const cp = gameState.courseProgress.find(p => p.courseId === course.id);
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = cp?.completedLessons.length || 0;
  const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="h-32 rounded-2xl mb-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${course.color}40, ${course.color}15)` }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-black" style={{ color: `${course.color}40` }}>{course.title[0]}</span>
          </div>
          <div className="absolute bottom-4 left-6">
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-black/30 text-white">{course.difficulty}</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
        <p className="text-sm text-muted-foreground mb-4">{course.longDescription}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {totalLessons} lessons</span>
          <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {course.modules.length} modules</span>
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> {course.xpReward} XP</span>
          <span>Progress: {overallProgress}%</span>
        </div>
        <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden max-w-md">
          <div className="h-full rounded-full transition-all" style={{ width: `${overallProgress}%`, backgroundColor: course.color }} />
        </div>
      </motion.div>

      {/* Modules */}
      <div className="space-y-6">
        {course.modules.map((module, mi) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mi * 0.1 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-medium">{mi + 1}</div>
                <div>
                  <h3 className="font-semibold">{module.title}</h3>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                </div>
                {module.isBossModule && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">Boss</span>
                )}
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {module.lessons.map((lesson, _li) => {
                const isCompleted = hasCompletedLesson(course.id, lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => navigate(`/app/courses/${course.slug}/${module.id}/${lesson.slug}`)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-all text-left"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? 'bg-emerald-500/20' : 'bg-white/5'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isCompleted ? 'text-emerald-400' : ''}`}>{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">{lesson.duration || '10 min'} • {lesson.xpReward} XP</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
