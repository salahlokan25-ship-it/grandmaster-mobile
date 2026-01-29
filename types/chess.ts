export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type PieceColor = 'white' | 'black';

export interface Piece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface Square {
  row: number;
  col: number;
}

export interface Move {
  from: Square;
  to: Square;
  piece: Piece;
  captured?: Piece;
  notation: string;
}

export interface Player {
  id: string;
  fixed_id?: string;
  username: string;
  avatar?: string;
  rating: number;
  isOnline?: boolean;
  country?: string;
}

export interface GameState {
  board: (Piece | null)[][];
  currentTurn: PieceColor;
  moves: Move[];
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  whiteTime: number;
  blackTime: number;
}

export interface UserStats {
  elo: number;
  rank: string;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  streak: number;
  puzzlesSolved: number;
  gamesPlayed: number;
  aiWins: number;
  aiLosses: number;
  onlineWins: number;
  onlineLosses: number;
}

export interface PerformancePoint {
  date: string;
  rating: number;
  type: 'ai' | 'online';
}

export interface PerformanceData {
  aiHistory: PerformancePoint[];
  onlineHistory: PerformancePoint[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'openings' | 'tactics' | 'strategy' | 'endgame';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessonsCompleted: number;
  totalLessons: number;
  image?: string;
  isInProgress?: boolean;
}

export interface Puzzle {
  id: string;
  fen: string;
  rating: number;
  solution: string[];
  theme: string;
}

export interface LeaderboardEntry {
  rank: number;
  player: Player;
  score?: number;
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
}

export interface MatchHistoryItem {
  id: string;
  opponent: Player;
  result: 'won' | 'lost' | 'draw';
  eloChange: number;
  timeControl: string;
  gameType: string;
}

export type TimeControl = 'bullet' | 'blitz' | 'rapid' | 'classical';
export type AIDifficulty = 'beginner' | 'apprentice' | 'casual' | 'amateur' | 'intermediate' | 'advanced' | 'professional' | 'legend';
