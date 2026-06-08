import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Coins, Trophy, Star, TrendingUp } from 'lucide-react';
import type { XPPopup } from '@/types';

interface Props {
  popups: XPPopup[];
  onDismiss: (id: string) => void;
}

const typeConfig = {
  xp: { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  coin: { icon: Coins, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  streak: { icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  achievement: { icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  level: { icon: Star, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
};

export default function XPPopupOverlay({ popups, onDismiss }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {popups.map((popup, index) => {
          const config = typeConfig[popup.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={popup.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border ${config.bg} ${config.border} backdrop-blur-xl min-w-[240px]`}
              style={{ marginBottom: index * 4 }}
            >
              <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${config.color}`}>
                  {popup.type === 'level' ? popup.message : `+${popup.amount}`}
                </p>
                {popup.type !== 'level' && (
                  <p className="text-xs text-muted-foreground">{popup.message}</p>
                )}
              </div>
              <button
                onClick={() => onDismiss(popup.id)}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
