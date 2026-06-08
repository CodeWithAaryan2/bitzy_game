import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { trpc } from '@/providers/trpc';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_USER: User = {
  id: '1',
  username: 'bitxy_learner',
  email: 'learner@bitxy.dev',
  displayName: 'Bitxy Learner',
  avatar: '',
  bio: 'Learning to code one day at a time!',
  level: 1,
  xp: 0,
  coins: 100,
  energy: 100,
  maxEnergy: 100,
  currentStreak: 1,
  longestStreak: 1,
  lastLoginDate: new Date().toISOString().split('T')[0],
  joinedAt: new Date().toISOString(),
  isLoggedIn: true,
};

export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: 'Novice', 5: 'Apprentice', 10: 'Code Scout', 20: 'Junior Developer',
    30: 'Developer', 40: 'Senior Developer', 50: 'Code Master',
    60: 'Architect', 70: 'Tech Lead', 80: 'CTO in Training',
    90: 'Unicorn Developer', 100: 'Coding Legend',
  };
  const levels = Object.keys(titles).map(Number).sort((a, b) => a - b);
  let title = 'Novice';
  for (const l of levels) { if (level >= l) title = titles[l]; }
  return title;
}

export function getXPForLevel(level: number): number {
  if (level <= 1) return 100;
  if (level <= 10) return 100 * level;
  if (level <= 25) return 500 + 200 * (level - 10);
  if (level <= 50) return 3500 + 500 * (level - 25);
  if (level <= 75) return 16000 + 1000 * (level - 50);
  if (level <= 90) return 41000 + 2000 * (level - 75);
  return 71000 + 5000 * (level - 90);
}

export function getLevelFromXP(xp: number): { level: number; currentLevelXP: number; xpToNext: number } {
  let cumulativeXP = 0;
  let level = 1;
  while (level < 100) {
    const xpForNext = getXPForLevel(level + 1);
    if (cumulativeXP + xpForNext > xp) {
      return { level, currentLevelXP: xp - cumulativeXP, xpToNext: xpForNext - (xp - cumulativeXP) };
    }
    cumulativeXP += xpForNext;
    level++;
  }
  return { level: 100, currentLevelXP: 0, xpToNext: 0 };
}

function dbUserToFrontendUser(dbUser: { id: number; name?: string | null; email?: string | null; avatar?: string | null; role?: string | null }, profile?: { displayName?: string | null; bio?: string | null; level?: number; xp?: number; coins?: number; energy?: number; maxEnergy?: number; currentStreak?: number; longestStreak?: number; lastLoginDate?: string | null } | null): User {
  return {
    id: String(dbUser.id),
    username: dbUser.name || 'learner',
    email: dbUser.email || '',
    displayName: profile?.displayName || dbUser.name || 'Learner',
    avatar: dbUser.avatar || '',
    bio: profile?.bio || 'Learning to code one day at a time!',
    level: profile?.level || 1,
    xp: profile?.xp || 0,
    coins: profile?.coins || 100,
    energy: profile?.energy || 100,
    maxEnergy: profile?.maxEnergy || 100,
    currentStreak: profile?.currentStreak || 1,
    longestStreak: profile?.longestStreak || 1,
    lastLoginDate: profile?.lastLoginDate || new Date().toISOString().split('T')[0],
    joinedAt: new Date().toISOString(),
    isLoggedIn: true,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Try tRPC OAuth auth
  const { data: trpcUser, isLoading: trpcLoading } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Get profile from backend when authenticated
  const { data: profileData } = trpc.gamification.getProfile.useQuery(undefined, {
    enabled: !!trpcUser,
    staleTime: 1000 * 60 * 2,
  });

  const logoutMutation = trpc.auth.logout.useMutation();
  const utils = trpc.useUtils();

  // Sync tRPC user to local state
  useEffect(() => {
    if (trpcUser) {
      const user = dbUserToFrontendUser(trpcUser, profileData);
      setLocalUser(user);
      setIsLoggedIn(true);
    }
  }, [trpcUser, profileData]);

  // Load from localStorage as fallback
  useEffect(() => {
    if (!trpcLoading) {
      const saved = localStorage.getItem('bitxy_user');
      if (saved && !trpcUser) {
        try {
          const parsed = JSON.parse(saved);
          setLocalUser(parsed);
          setIsLoggedIn(true);
        } catch {
          localStorage.removeItem('bitxy_user');
        }
      }
    }
  }, [trpcLoading, trpcUser]);

  // Persist to localStorage
  useEffect(() => {
    if (localUser) {
      localStorage.setItem('bitxy_user', JSON.stringify(localUser));
    }
  }, [localUser]);

  const login = (email: string, password: string): boolean => {
    // Demo local login
    const users = JSON.parse(localStorage.getItem('bitxy_users') || '[]');
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userWithoutPassword } = found;
      const today = new Date().toISOString().split('T')[0];
      const lastLogin = userWithoutPassword.lastLoginDate;
      if (lastLogin) {
        const lastDate = new Date(lastLogin);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          userWithoutPassword.currentStreak = (userWithoutPassword.currentStreak || 0) + 1;
          if (userWithoutPassword.currentStreak > (userWithoutPassword.longestStreak || 0)) {
            userWithoutPassword.longestStreak = userWithoutPassword.currentStreak;
          }
        } else if (diffDays > 1) {
          userWithoutPassword.currentStreak = 1;
        }
      }
      userWithoutPassword.lastLoginDate = today;
      userWithoutPassword.isLoggedIn = true;
      setLocalUser(userWithoutPassword);
      setIsLoggedIn(true);
      return true;
    }
    // Try demo accounts
    if (email === 'demo@bitxy.dev' && password === 'demo') {
      const demoUser = { ...DEFAULT_USER, id: 'demo', email: 'demo@bitxy.dev', username: 'demo_user', displayName: 'Demo User' };
      setLocalUser(demoUser);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('bitxy_users') || '[]');
    if (users.find((u: any) => u.email === email || u.username === username)) return false;
    const newUser = {
      ...DEFAULT_USER,
      id: Date.now().toString(),
      username,
      email,
      password,
      displayName: username,
      joinedAt: new Date().toISOString(),
      lastLoginDate: new Date().toISOString().split('T')[0],
    };
    users.push(newUser);
    localStorage.setItem('bitxy_users', JSON.stringify(users));
    const { password: _, ...withoutPassword } = newUser;
    setLocalUser(withoutPassword);
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => {
    setLocalUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('bitxy_user');
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        utils.invalidate();
      },
    });
  };

  const updateUser = (updates: Partial<User>) => {
    setLocalUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('bitxy_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{
      user: localUser,
      isLoggedIn,
      isLoading: trpcLoading,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
