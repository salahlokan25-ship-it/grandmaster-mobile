import { create } from 'zustand';
import { UserStats, Player, MatchHistoryItem, Achievement, PerformanceData } from '@/types/chess';
import { auth, db } from '@/lib/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';

interface UserState {
  currentUser: Player;
  stats: UserStats;
  achievements: Achievement[];
  matchHistory: MatchHistoryItem[];
  dailyGoals: {
    puzzlesSolved: number;
    puzzlesTarget: number;
    gamesWon: number;
    gamesTarget: number;
  };
  hasCompletedOnboarding: boolean;
  isProfileLoaded: boolean;
  performanceHistory: PerformanceData;
  setUser: (user: Player) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  addMatch: (match: MatchHistoryItem) => void;
  updateProfile: (profile: { displayName?: string; ageRange?: string; experienceLevel?: string; playFrequency?: string; avatar?: string }) => void;
  completeOnboarding: () => void;
  setProfileLoaded: (loaded: boolean) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: {
    id: '1',
    username: 'Guest',
    rating: 1200,
    strategoId: '',
  },
  stats: {
    elo: 1250,
    rank: 'Knight III',
    wins: 142,
    losses: 84,
    draws: 12,
    winRate: 58,
    streak: 5,
    puzzlesSolved: 1200,
    gamesPlayed: 412,
    aiWins: 32,
    aiLosses: 12,
    onlineWins: 110,
    onlineLosses: 72,
  },
  performanceHistory: {
    aiHistory: [
      { date: '2024-01-01', rating: 1100, type: 'ai' },
      { date: '2024-01-05', rating: 1120, type: 'ai' },
      { date: '2024-01-10', rating: 1115, type: 'ai' },
      { date: '2024-01-15', rating: 1150, type: 'ai' },
      { date: '2024-01-20', rating: 1180, type: 'ai' },
    ],
    onlineHistory: [
      { date: '2024-01-01', rating: 1200, type: 'online' },
      { date: '2024-01-05', rating: 1210, type: 'online' },
      { date: '2024-01-10', rating: 1240, type: 'online' },
      { date: '2024-01-15', rating: 1235, type: 'online' },
      { date: '2024-01-20', rating: 1250, type: 'online' },
    ],
  },
  achievements: [
    { id: '1', name: 'First Win', icon: 'trophy', unlocked: true },
    { id: '2', name: 'Rapid', icon: 'zap', unlocked: true },
    { id: '3', name: 'Streak', icon: 'flame', unlocked: true },
    { id: '4', name: 'Master', icon: 'crown', unlocked: false },
  ],
  matchHistory: [
    {
      id: '1',
      opponent: { id: '2', username: 'PlayerTwo', rating: 1280 },
      result: 'won',
      eloChange: 12,
      timeControl: '10 min',
      gameType: 'Rapid',
    },
    {
      id: '2',
      opponent: { id: '3', username: 'Stockfish Lvl 5', rating: 1400 },
      result: 'draw',
      eloChange: 2,
      timeControl: 'Training',
      gameType: 'Training',
    },
    {
      id: '3',
      opponent: { id: '4', username: 'ChessPro99', rating: 1320 },
      result: 'lost',
      eloChange: -8,
      timeControl: '3 min',
      gameType: 'Blitz',
    },
  ],
  dailyGoals: {
    puzzlesSolved: 5,
    puzzlesTarget: 5,
    gamesWon: 0,
    gamesTarget: 1,
  },
  hasCompletedOnboarding: false,
  isProfileLoaded: false,
  setUser: (user) => set({ currentUser: user }),
  updateStats: (newStats) =>
    set((state) => ({
      stats: { ...state.stats, ...newStats },
    })),
  addMatch: (match) =>
    set((state) => ({
      matchHistory: [match, ...state.matchHistory],
    })),
  updateProfile: (profile) =>
    set((state) => ({
      currentUser: { ...state.currentUser, ...profile },
    })),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  setProfileLoaded: (loaded) => set({ isProfileLoaded: loaded }),
  setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
  logout: async () => {
    await auth.signOut();
    set({ currentUser: { id: '1', username: 'Guest', rating: 1200, strategoId: '' }, isProfileLoaded: false });
  },
  deleteAccount: async () => {
    const user = auth.currentUser;
    if (user) {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
    }
  },
}));
