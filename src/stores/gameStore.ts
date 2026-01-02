import { create } from 'zustand';
import { GameState, Piece, PieceColor, Square, Move, AIDifficulty, TimeControl } from '@/types/chess';

const initialBoard: (Piece | null)[][] = [
  [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' },
  ],
  Array(8).fill(null).map(() => ({ type: 'pawn' as const, color: 'black' as const })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: 'pawn' as const, color: 'white' as const })),
  [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' },
  ],
];

interface GameStore {
  gameState: GameState;
  selectedSquare: Square | null;
  validMoves: Square[];
  aiDifficulty: AIDifficulty;
  timeControl: TimeControl;
  playerColor: PieceColor | 'random';
  isGameActive: boolean;
  aiCoachMessage: string;

  selectSquare: (square: Square | null) => void;
  makeMove: (from: Square, to: Square) => void;
  setAIDifficulty: (difficulty: AIDifficulty) => void;
  setTimeControl: (control: TimeControl) => void;
  setPlayerColor: (color: PieceColor | 'random') => void;
  startGame: () => void;
  resetGame: () => void;
  undoMove: () => void;
  getHint: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: {
    board: initialBoard,
    currentTurn: 'white',
    moves: [],
    isCheck: false,
    isCheckmate: false,
    isDraw: false,
    whiteTime: 600,
    blackTime: 600,
  },
  selectedSquare: null,
  validMoves: [],
  aiDifficulty: 'normal',
  timeControl: 'blitz',
  playerColor: 'white',
  isGameActive: false,
  aiCoachMessage: 'Strong move. You control the center and open up the bishop.',

  selectSquare: (square) => {
    const { gameState, selectedSquare } = get();
    
    if (!square) {
      set({ selectedSquare: null, validMoves: [] });
      return;
    }

    const piece = gameState.board[square.row][square.col];
    
    if (selectedSquare && piece?.color !== gameState.currentTurn) {
      // Try to make a move
      get().makeMove(selectedSquare, square);
      return;
    }

    if (piece && piece.color === gameState.currentTurn) {
      // Calculate valid moves (simplified)
      const moves: Square[] = [];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const target = gameState.board[r][c];
          if (!target || target.color !== piece.color) {
            moves.push({ row: r, col: c });
          }
        }
      }
      set({ selectedSquare: square, validMoves: moves.slice(0, 8) }); // Simplified
    }
  },

  makeMove: (from, to) => {
    const { gameState } = get();
    const piece = gameState.board[from.row][from.col];
    
    if (!piece) return;

    const newBoard = gameState.board.map(row => [...row]);
    const captured = newBoard[to.row][to.col];
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;

    const cols = 'abcdefgh';
    const notation = `${cols[from.col]}${8 - from.row} ${cols[to.col]}${8 - to.row}`;

    const move: Move = {
      from,
      to,
      piece,
      captured: captured || undefined,
      notation,
    };

    set({
      gameState: {
        ...gameState,
        board: newBoard,
        currentTurn: gameState.currentTurn === 'white' ? 'black' : 'white',
        moves: [...gameState.moves, move],
      },
      selectedSquare: null,
      validMoves: [],
      aiCoachMessage: captured 
        ? 'Excellent capture! Keep the pressure on.'
        : 'Good development. Control the center.',
    });
  },

  setAIDifficulty: (difficulty) => set({ aiDifficulty: difficulty }),
  setTimeControl: (control) => set({ timeControl: control }),
  setPlayerColor: (color) => set({ playerColor: color }),
  
  startGame: () => set({ isGameActive: true }),
  
  resetGame: () => set({
    gameState: {
      board: initialBoard.map(row => row.map(piece => piece ? { ...piece } : null)),
      currentTurn: 'white',
      moves: [],
      isCheck: false,
      isCheckmate: false,
      isDraw: false,
      whiteTime: 600,
      blackTime: 600,
    },
    selectedSquare: null,
    validMoves: [],
    isGameActive: false,
  }),

  undoMove: () => {
    const { gameState } = get();
    if (gameState.moves.length === 0) return;
    
    // Simplified undo - would need full implementation
    set({ aiCoachMessage: 'Move undone. Think carefully about your next move.' });
  },

  getHint: () => {
    set({ aiCoachMessage: 'Consider developing your knight to f3 - it controls the center.' });
  },
}));
