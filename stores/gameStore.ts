import { create } from 'zustand';
import { GameState, Piece, PieceColor, Square, Move, AIDifficulty, TimeControl } from '@/types/chess';
import { getValidMoves, isValidMove, isCheck, isCheckmate, isStalemate } from '@/lib/chessRules';
import { speakMove, speakMessage } from '@/lib/speech';

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
  gameMode: 'local' | 'ai' | 'online';
  whiteTimeRemaining: number;
  blackTimeRemaining: number;
  timerActive: boolean;
  lastMoveTimestamp: number;
  isSpeechEnabled: boolean;
  onlineGameId: string | null;
  userColor: PieceColor | null;

  selectSquare: (square: Square | null) => void;
  makeMove: (from: Square, to: Square) => void;
  setAIDifficulty: (difficulty: AIDifficulty) => void;
  setTimeControl: (control: TimeControl) => void;
  setPlayerColor: (color: PieceColor | 'random') => void;
  startNewGame: (mode?: 'local' | 'ai' | 'online') => void;
  initOnlineGame: (gameId: string, userColor: PieceColor) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  updateTimer: (color: PieceColor) => void;
  handleTimeExpired: (color: PieceColor) => void;
  resetGame: () => void;
  undoMove: () => void;
  getHint: () => void;
  makeAIMove: () => void;
  toggleSpeech: () => void;
  syncOnlineMove: (move: { from: Square; to: Square }) => void;
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
  aiDifficulty: 'amateur',
  timeControl: 'blitz',
  playerColor: 'white',
  isGameActive: false,
  aiCoachMessage: 'Welcome to Strategos! Start a new game to begin.',
  gameMode: 'local',
  whiteTimeRemaining: 10 * 60 * 1000, // 10 minutes in milliseconds
  blackTimeRemaining: 10 * 60 * 1000, // 10 minutes in milliseconds
  timerActive: false,
  lastMoveTimestamp: Date.now(),
  isSpeechEnabled: true,
  onlineGameId: null,
  userColor: null,

  selectSquare: (square: Square | null) => {
    const { gameState, selectedSquare, validMoves } = get();

    if (!square) {
      set({ selectedSquare: null, validMoves: [] });
      return;
    }

    const piece = gameState.board[square.row][square.col];

    if (selectedSquare) {
      const isValid = validMoves.some(m => m.row === square.row && m.col === square.col);

      if (isValid) {
        get().makeMove(selectedSquare, square);
        return;
      }

      if (piece?.color !== gameState.currentTurn) {
        set({ selectedSquare: null, validMoves: [] });
        return;
      }
    }

    if (!piece || piece.color !== gameState.currentTurn) {
      set({ selectedSquare: null, validMoves: [] });
      return;
    }

    const moves = getValidMoves(gameState, square);
    set({ selectedSquare: square, validMoves: moves });
  },

  makeMove: (from: Square, to: Square) => {
    const { gameState, gameMode } = get();

    if (!isValidMove(gameState, from, to)) {
      return;
    }

    const newBoard = gameState.board.map(row => [...row]);
    const piece = newBoard[from.row][from.col];

    if (!piece) return;

    const captured = newBoard[to.row][to.col];
    let actualCaptured = captured;

    // Handle En Passant
    if (piece.type === 'pawn' && from.col !== to.col && !captured) {
      actualCaptured = newBoard[from.row][to.col];
      newBoard[from.row][to.col] = null;
    }

    // Handle castling
    if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
      const isKingSide = to.col > from.col;
      const rookFromCol = isKingSide ? 7 : 0;
      const rookToCol = isKingSide ? 5 : 3;
      const rook = newBoard[from.row][rookFromCol];

      if (rook) {
        newBoard[from.row][rookToCol] = { ...rook, hasMoved: true };
        newBoard[from.row][rookFromCol] = null;
      }
    }

    let newPiece = { ...piece, hasMoved: true };

    // Handle Promotion
    if (piece.type === 'pawn') {
      if ((piece.color === 'white' && to.row === 0) || (piece.color === 'black' && to.row === 7)) {
        newPiece.type = 'queen';
      }
    }

    newBoard[to.row][to.col] = newPiece;
    newBoard[from.row][from.col] = null;

    const cols = 'abcdefgh';
    const isPromotion = piece.type === 'pawn' && newPiece.type === 'queen';
    const notation = `${cols[from.col]}${8 - from.row}${actualCaptured ? 'x' : '-'}${cols[to.col]}${8 - to.row}${isPromotion ? '=Q' : ''}`;

    const move: Move = {
      from,
      to,
      piece,
      captured: actualCaptured || undefined,
      notation,
    };

    const nextTurn: PieceColor = gameState.currentTurn === 'white' ? 'black' : 'white';

    // Check for game end
    const tempGameState = {
      ...gameState,
      board: newBoard,
      currentTurn: nextTurn,
    };

    const checkmate = isCheckmate(tempGameState, nextTurn);
    const stalemate = isStalemate(tempGameState, nextTurn);

    // Update timer for the player who just moved
    get().updateTimer(gameState.currentTurn);

    // Start timer if this is the first move
    if (gameState.moves.length === 0) {
      get().startTimer();
    }

    set({
      gameState: {
        ...gameState,
        board: newBoard,
        currentTurn: nextTurn,
        moves: [...gameState.moves, move],
        isCheck: isCheck(newBoard, nextTurn),
        isCheckmate: checkmate,
        isDraw: stalemate,
      },
      selectedSquare: null,
      validMoves: [],
      aiCoachMessage: checkmate
        ? `Checkmate! ${gameState.currentTurn === 'white' ? 'White' : 'Black'} wins!`
        : stalemate
          ? 'Draw by stalemate!'
          : captured
            ? 'Excellent capture! Keep the pressure on.'
            : 'Good development. Control the center.',
    });

    // Speak the move
    const { isSpeechEnabled } = get();
    speakMove(notation, isSpeechEnabled);
    if (checkmate || stalemate) {
      setTimeout(() => speakMessage(checkmate ? 'Checkmate' : 'Stalemate', isSpeechEnabled), 1000);
    }

    // Trigger AI move if in AI mode and it's now AI's turn (and game is not over)
    if (gameMode === 'ai' && nextTurn === 'black' && !checkmate && !stalemate) {
      setTimeout(() => {
        get().makeAIMove();
      }, 500);
    }

    // Push move to Supabase if in online mode
    const { onlineGameId, userColor } = get();
    if (gameMode === 'online' && onlineGameId && userColor === piece.color) {
      import('@/lib/games').then(({ GameService }) => {
        GameService.submitOnlineMove(onlineGameId, { from, to }, ''); // FEN intentionally empty for now as we sync via moves
      });
    }
  },

  setAIDifficulty: (difficulty: AIDifficulty) => set({ aiDifficulty: difficulty }),
  setTimeControl: (control: TimeControl) => set({ timeControl: control }),
  setPlayerColor: (color: PieceColor | 'random') => set({ playerColor: color }),

  startNewGame: (mode: 'local' | 'ai' | 'online' = 'local') => set({
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
    isGameActive: true,
    gameMode: mode,
    aiCoachMessage: mode === 'ai' ? 'Good luck! You\'re playing White against the AI.' : 'New game started!',
    whiteTimeRemaining: 10 * 60 * 1000,
    blackTimeRemaining: 10 * 60 * 1000,
    timerActive: false,
    lastMoveTimestamp: Date.now(),
    onlineGameId: null,
    userColor: mode === 'online' ? get().userColor : null,
  }),

  initOnlineGame: (gameId: string, color: PieceColor) => {
    get().startNewGame('online');
    set({
      onlineGameId: gameId,
      userColor: color,
      aiCoachMessage: `Online match started! You are playing as ${color.charAt(0).toUpperCase() + color.slice(1)}.`
    });
  },

  resetGame: () => get().startNewGame(get().gameMode),

  undoMove: () => {
    set({ aiCoachMessage: 'Move undone. Think carefully about your next move.' });
  },

  getHint: () => {
    set({ aiCoachMessage: 'Consider developing your knight to f3 - it controls the center.' });
  },

  makeAIMove: () => {
    const state = get();

    if (state.gameMode !== 'ai' || state.gameState.currentTurn !== 'black') {
      return;
    }

    import('../lib/chessAI').then(({ getBestAIMove }) => {
      const bestMove = getBestAIMove(state.gameState, state.aiDifficulty);

      if (bestMove) {
        setTimeout(() => {
          get().makeMove(bestMove.from, bestMove.to);
        }, 300);
      }
    });
  },

  startTimer: () => {
    set({ timerActive: true, lastMoveTimestamp: Date.now() });
  },

  pauseTimer: () => {
    set({ timerActive: false });
  },

  updateTimer: (color: PieceColor) => {
    const { lastMoveTimestamp, timerActive } = get();
    if (!timerActive) return;

    const now = Date.now();
    const elapsed = now - lastMoveTimestamp;

    if (color === 'white') {
      set((state) => ({
        whiteTimeRemaining: Math.max(0, state.whiteTimeRemaining - elapsed),
        lastMoveTimestamp: now,
      }));
    } else {
      set((state) => ({
        blackTimeRemaining: Math.max(0, state.blackTimeRemaining - elapsed),
        lastMoveTimestamp: now,
      }));
    }
  },

  handleTimeExpired: (color: PieceColor) => {
    const winner = color === 'white' ? 'black' : 'white';
    set((state) => ({
      gameState: {
        ...state.gameState,
        isCheckmate: true,
      },
      timerActive: false,
      aiCoachMessage: `Time's up! ${winner.charAt(0).toUpperCase() + winner.slice(1)} wins by timeout!`,
    }));
  },
  toggleSpeech: () => set((state) => ({ isSpeechEnabled: !state.isSpeechEnabled })),

  syncOnlineMove: (move: { from: Square; to: Square }) => {
    const { from, to } = move;
    get().makeMove(from, to);
  },
}));
