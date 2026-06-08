import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Monitor, Moon, Sun, Shield, Database, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <Settings className="w-6 h-6 text-muted-foreground" />
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">Manage your preferences and account.</p>
        </div>

        {/* Appearance */}
        <div className="glass-card rounded-xl p-6 mb-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-indigo-400" />
            Appearance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-muted-foreground">Choose your preferred theme</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
                    theme === 'dark' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                  }`}
                >
                  <Moon className="w-4 h-4" /> Dark
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
                    theme === 'light' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                  }`}
                >
                  <Sun className="w-4 h-4" /> Light
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Animations</p>
                <p className="text-xs text-muted-foreground">Enable UI animations and transitions</p>
              </div>
              <button
                onClick={() => setAnimations(!animations)}
                className={`w-11 h-6 rounded-full transition-colors ${animations ? 'bg-indigo-500' : 'bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${animations ? 'translate-x-5.5 ml-[22px]' : 'translate-x-0.5 ml-[2px]'}`} style={{ marginTop: '2px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-xl p-6 mb-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Receive streak reminders and updates</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 rounded-full transition-colors ${notifications ? 'bg-indigo-500' : 'bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${notifications ? 'ml-[22px]' : 'ml-[2px]'}`} style={{ marginTop: '2px' }} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sound Effects</p>
                <p className="text-xs text-muted-foreground">Play sounds for XP, achievements, etc.</p>
              </div>
              <button
                onClick={() => setSoundEffects(!soundEffects)}
                className={`w-11 h-6 rounded-full transition-colors ${soundEffects ? 'bg-indigo-500' : 'bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${soundEffects ? 'ml-[22px]' : 'ml-[2px]'}`} style={{ marginTop: '2px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="glass-card rounded-xl p-6 mb-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Account
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all">
              Change Password
            </button>
            <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all">
              Export My Data
            </button>
            <button className="w-full text-left px-4 py-3 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-sm text-red-400 transition-all">
              Delete Account
            </button>
          </div>
        </div>

        {/* Data */}
        <div className="glass-card rounded-xl p-6 mb-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Data
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all flex items-center justify-between">
              <span>Clear Cache</span>
              <span className="text-xs text-muted-foreground">2.4 MB</span>
            </button>
            <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all">
              Reset Progress
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={logout}
          className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-sm font-medium text-red-400 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
