import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Trophy, Zap, BookOpen, Swords, Sparkles, Star, ArrowRight, Heart, Gem } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const floatingIcons = [
  { Icon: Code2, x: '10%', y: '20%', delay: 0, color: '#58CC02' },
  { Icon: Trophy, x: '85%', y: '15%', delay: 0.5, color: '#FF9600' },
  { Icon: Star, x: '75%', y: '70%', delay: 1, color: '#FFC800' },
  { Icon: Zap, x: '15%', y: '75%', delay: 1.5, color: '#1CB0F6' },
  { Icon: Heart, x: '90%', y: '50%', delay: 0.8, color: '#FF4B4B' },
  { Icon: Gem, x: '5%', y: '50%', delay: 1.2, color: '#CE82FF' },
];

const features = [
  { icon: BookOpen, title: 'Interactive Lessons', desc: 'Learn by doing with hands-on coding exercises', color: '#58CC02', bg: '#E8F5D6' },
  { icon: Swords, title: 'Code Arena', desc: 'Battle coding challenges and level up your skills', color: '#1CB0F6', bg: '#E8F7FE' },
  { icon: Sparkles, title: 'AI Mentor', desc: '24/7 AI-powered coding assistant at your fingertips', color: '#CE82FF', bg: '#F3E8FF' },
  { icon: Trophy, title: 'Leagues', desc: 'Compete on the leaderboard and climb the ranks', color: '#FF9600', bg: '#FFF3D6' },
];

const courses = [
  { name: 'HTML', color: '#E34C26', lessons: 15, icon: '</>' },
  { name: 'CSS', color: '#264DE4', lessons: 12, icon: '#' },
  { name: 'JavaScript', color: '#F7DF1E', lessons: 20, icon: 'JS' },
  { name: 'React', color: '#61DAFB', lessons: 18, icon: 'Re' },
  { name: 'Python', color: '#3776AB', lessons: 20, icon: 'Py' },
  { name: 'TypeScript', color: '#3178C6', lessons: 14, icon: 'TS' },
  { name: 'Node.js', color: '#339933', lessons: 16, icon: 'No' },
  { name: 'SQL', color: '#336791', lessons: 10, icon: 'DB' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Floating Icons */}
        {floatingIcons.map(({ Icon, x, y, delay, color }, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.15, scale: 1, y: [0, -15, 0] }}
            transition={{ delay, duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon className="w-12 h-12" style={{ color }} />
          </motion.div>
        ))}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10 max-w-lg"
        >
          <motion.div
            className="w-20 h-20 rounded-3xl bg-[#58CC02] flex items-center justify-center mx-auto mb-6 shadow-xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <Code2 className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">
            Learn to Code,
            <br />
            <span className="text-[#58CC02]">Play to Win</span>
          </h1>
          <p className="text-gray-500 text-base mb-8 leading-relaxed">
            The most fun way to learn programming. Master HTML, CSS, JavaScript, Python & more with bite-sized lessons, daily challenges, and epic rewards.
          </p>

          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')}
              className="bitxy-btn bitxy-btn-green w-full py-4 text-base font-bold"
            >
              Start Learning Free
              <ArrowRight className="w-5 h-5 inline ml-2" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="bitxy-btn bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 w-full py-3 text-sm font-bold"
              style={{ boxShadow: '0 4px 0 0 #E5E7EB' }}
            >
              I already have an account
            </motion.button>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-8 left-4 right-4 max-w-lg mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-100 p-3 flex items-center justify-around">
            <div className="text-center">
              <p className="font-display text-xl font-bold text-[#58CC02]">10+</p>
              <p className="text-[10px] text-gray-500">Courses</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="font-display text-xl font-bold text-[#1CB0F6]">100+</p>
              <p className="text-[10px] text-gray-500">Lessons</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="font-display text-xl font-bold text-[#FF9600]">50+</p>
              <p className="text-[10px] text-gray-500">Challenges</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="font-display text-xl font-bold text-[#CE82FF]">Free</p>
              <p className="text-[10px] text-gray-500">Forever</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <h2 className="font-display text-3xl font-bold text-center text-gray-900 mb-2">Why Bitxy?</h2>
          <p className="text-center text-gray-500 text-sm mb-10">Everything you need to become a coding pro</p>

          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-4 border-2 border-transparent"
                style={{ backgroundColor: bg, borderColor: `${color}20` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-sm">
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <p className="font-bold text-gray-800 text-sm mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Courses Section */}
      <section className="py-16 px-6 bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <h2 className="font-display text-3xl font-bold text-center text-gray-900 mb-2">Courses Available</h2>
          <p className="text-center text-gray-500 text-sm mb-10">From beginner basics to advanced concepts</p>

          <div className="space-y-3">
            {courses.map((course, i) => (
              <motion.div
                key={course.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 hover:border-gray-200 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: course.color }}
                >
                  {course.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{course.name}</p>
                  <p className="text-xs text-gray-500">{course.lessons} lessons</p>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map(s => (
                    <div key={s} className="w-2 h-2 rounded-full bg-gray-300" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-[#58CC02]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto text-center"
        >
          <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to Start?</h2>
          <p className="text-white/80 text-sm mb-8">Join thousands of learners already leveling up their coding skills.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="bg-white text-[#58CC02] font-bold py-4 px-10 rounded-2xl text-base shadow-xl"
            style={{ boxShadow: '0 8px 0 0 rgba(0,0,0,0.15)' }}
          >
            Get Started Free
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <div className="flex items-center gap-2 justify-center mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#58CC02] flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-white">Bitxy</span>
        </div>
        <p className="text-gray-500 text-xs">The fun way to learn coding. Built with passion.</p>
      </footer>
    </div>
  );
}
