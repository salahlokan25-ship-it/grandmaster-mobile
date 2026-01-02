import { create } from 'zustand';
import { UserStats, Player, MatchHistoryItem, Achievement } from '@/types/chess';

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
  updateStats: (stats: Partial<UserStats>) => void;
  addMatch: (match: MatchHistoryItem) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: {
    id: '1',
    username: 'Alex',
    avatar: undefined,
    rating: 1250,
    isOnline: true,
    country: 'United States',
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
  updateStats: (newStats) =>
    set((state) => ({
      stats: { ...state.stats, ...newStats },
    })),
  addMatch: (match) =>
    set((state) => ({
      matchHistory: [match, ...state.matchHistory],
    })),
}));
