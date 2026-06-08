import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Star, CheckCircle2, BookOpen } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { courses } from '@/data/courses';
import { useState } from 'react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

interface PathNodeProps {
  status: 'locked' | 'current' | 'completed' | 'bonus';
  index: number;
  course: typeof courses[0];
  onClick: () => void;
}

function PathNode({ status, index, course, onClick }: PathNodeProps) {
  const isLeft = index % 2 === 0;

  const nodeConfig = {
    locked: {
      bg: 'bg-gray-200',
      border: 'border-gray-300',
      icon: <Lock className="w-5 h-5 text-gray-400" />,
      shadow: '0 4px 0 0 #D1D5DB',
      label: 'Locked',
      textColor: 'text-gray-500',
    },
    current: {
      bg: 'bg-white',
      border: `border-[${course.color}]`,
      icon: <Star className="w-5 h-5" style={{ color: course.color }} />,
      shadow: `0 4px 0 0 ${course.color}80`,
      label: 'Start',
      textColor: 'text-gray-800',
    },
    completed: {
      bg: course.color,
      border: `border-[${course.color}]`,
      icon: <CheckCircle2 className="w-5 h-5 text-white" />,
      shadow: `0 4px 0 0 ${course.color}`,
      label: 'Done',
      textColor: 'text-white',
    },
    bonus: {
      bg: 'bg-[#CE82FF]',
      border: 'border-[#CE82FF]',
      icon: <Star className="w-5 h-5 text-white" />,
      shadow: '0 4px 0 0 #A855C7',
      label: 'Bonus',
      textColor: 'text-white',
    },
  };

  const config = nodeConfig[status];

  return (
    <motion.div
      variants={item}
      className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} gap-4`}
    >
      {/* Connecting line */}
      <div className="flex-1 h-1 rounded-full bg-gray-200 relative">
        {status !== 'locked' && (
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: course.color }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          />
        )}
      </div>

      {/* Node */}
      <motion.button
        whileHover={status !== 'locked' ? { scale: 1.08 } : {}}
        whileTap={status !== 'locked' ? { scale: 0.92 } : {}}
        onClick={status !== 'locked' ? onClick : undefined}
        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${config.bg} ${config.border}`}
        style={{ boxShadow: config.shadow, opacity: status === 'locked' ? 0.6 : 1 }}
      >
        {config.icon}
        {status === 'current' && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF4B4B] flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">!</span>
          </div>
        )}
      </motion.button>

      {/* Label */}
      <div className={`flex-1 ${isLeft ? 'text-left' : 'text-right'}`}>
        <p className={`text-sm font-bold ${config.textColor}`}>
          {status === 'bonus' ? 'Bonus Lesson' : `Lesson ${index + 1}`}
        </p>
        <p className="text-xs text-gray-400">{status === 'locked' ? 'Complete previous' : config.label}</p>
      </div>
    </motion.div>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const { getCourseProgress } = useGame();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="font-display text-2xl font-bold text-gray-800">Learning Path</h1>
        <p className="text-sm text-gray-500">Follow your coding adventure</p>
      </motion.div>

      {/* Course Selector */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {courses.map((course) => {
          const progress = getCourseProgress(course.id);
          const isActive = selectedCourse === course.slug;
          return (
            <motion.button
              key={course.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCourse(isActive ? null : course.slug)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 transition-all ${
                isActive ? 'border-[#58CC02] bg-[#58CC02]/5' : 'border-gray-200 bg-white'
              }`}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: course.color }}
              >
                {course.title[0]}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-800 whitespace-nowrap">{course.title}</p>
                <p className="text-[10px] text-gray-500">{progress?.overallProgress || 0}%</p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Course Paths */}
      {courses.map((course) => {
        if (selectedCourse && selectedCourse !== course.slug) return null;
        const progress = getCourseProgress(course.id);
        const completedCount = progress?.completedLessons?.length || 0;
        const totalLessons = course.totalLessons;

        return (
          <motion.div key={course.id} variants={item} className="space-y-3">
            {/* Course Header */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: course.color }}
              >
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-gray-800">{course.title}</h2>
                <p className="text-xs text-gray-500">{completedCount}/{totalLessons} lessons completed</p>
              </div>
            </div>

            {/* Path */}
            <div className="relative pl-8 pr-4 space-y-6 py-4">
              {Array.from({ length: Math.min(6, totalLessons) }).map((_, i) => {
                let status: 'locked' | 'current' | 'completed' | 'bonus' = 'locked';
                if (i < completedCount) status = 'completed';
                else if (i === completedCount) status = 'current';
                else if (i === 3) status = 'bonus';

                return (
                  <PathNode
                    key={i}
                    index={i}
                    status={status}
                    course={course}
                    onClick={() => navigate(`/app/courses/${course.slug}`)}
                  />
                );
              })}
            </div>
          </motion.div>
        );
      })}

      <div className="h-4" />
    </motion.div>
  );
}
