// Simple AI chess engine for Strategos
import { GameState, Square, Piece, AIDifficulty } from '../types/chess';
import { isValidMove, isCheck } from './chessRules';

// Piece values for evaluation
const PIECE_VALUES: Record<string, number> = {
    'pawn': 100,
    'knight': 320,
    'bishop': 330,
    'rook': 500,
    'queen': 900,
    'king': 20000
};

// Position bonuses for piece placement (simplified)
const PAWN_BONUS = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

const KNIGHT_BONUS = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
];

interface Move {
    from: Square;
    to: Square;
    score?: number;
}

// Evaluate board position
function evaluatePosition(gameState: GameState, color: 'white' | 'black'): number {
    let score = 0;

    gameState.board.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            if (!piece) return;

            const pieceValue = PIECE_VALUES[piece.type];
            let positionBonus = 0;

            // Add position bonuses
            if (piece.type === 'pawn') {
                positionBonus = piece.color === 'white'
                    ? PAWN_BONUS[rowIndex][colIndex]
                    : PAWN_BONUS[7 - rowIndex][colIndex];
            } else if (piece.type === 'knight') {
                positionBonus = KNIGHT_BONUS[rowIndex][colIndex];
            }

            const totalValue = pieceValue + positionBonus;

            if (piece.color === color) {
                score += totalValue;
            } else {
                score -= totalValue;
            }
        });
    });

    return score;
}

// Get all possible moves for a color
function getAllPossibleMoves(gameState: GameState, color: 'white' | 'black'): Move[] {
    const moves: Move[] = [];

    gameState.board.forEach((row, fromRow) => {
        row.forEach((piece, fromCol) => {
            if (!piece || piece.color !== color) return;

            const from: Square = { row: fromRow, col: fromCol };

            // Try all possible destination squares
            for (let toRow = 0; toRow < 8; toRow++) {
                for (let toCol = 0; toCol < 8; toCol++) {
                    const to: Square = { row: toRow, col: toCol };

                    if (isValidMove(gameState, from, to)) {
                        moves.push({ from, to });
                    }
                }
            }
        });
    });

    return moves;
}

// Make a move and return new game state
function makeMove(gameState: GameState, from: Square, to: Square): GameState {
    const newBoard = gameState.board.map(row => [...row]);
    const piece = newBoard[from.row][from.col];

    if (!piece) return gameState;

    // Move the piece
    newBoard[to.row][to.col] = { ...piece, hasMoved: true };
    newBoard[from.row][from.col] = null;

    // Handle pawn promotion
    if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
        newBoard[to.row][to.col] = { ...piece, type: 'queen', hasMoved: true };
    }

    return {
        ...gameState,
        board: newBoard,
        currentTurn: gameState.currentTurn === 'white' ? 'black' : 'white'
    };
}

// Minimax algorithm with alpha-beta pruning
function minimax(
    gameState: GameState,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean,
    aiColor: 'white' | 'black'
): number {
    if (depth === 0) {
        return evaluatePosition(gameState, aiColor);
    }

    const currentColor = maximizingPlayer ? aiColor : (aiColor === 'white' ? 'black' : 'white');
    const moves = getAllPossibleMoves(gameState, currentColor);

    if (moves.length === 0) {
        // Checkmate or stalemate
        if (isCheck(gameState.board, currentColor)) {
            return maximizingPlayer ? -999999 : 999999;
        }
        return 0; // Stalemate
    }

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of moves) {
            const newState = makeMove(gameState, move.from, move.to);
            const evaluation = minimax(newState, depth - 1, alpha, beta, false, aiColor);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break; // Beta cutoff
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            const newState = makeMove(gameState, move.from, move.to);
            const evaluation = minimax(newState, depth - 1, alpha, beta, true, aiColor);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break; // Alpha cutoff
        }
        return minEval;
    }
}

// Get best move for AI
export function getBestAIMove(
    gameState: GameState,
    difficulty: AIDifficulty = 'amateur'
): Move | null {
    const aiColor = gameState.currentTurn;
    const allMoves = getAllPossibleMoves(gameState, aiColor);

    if (allMoves.length === 0) return null;

    // Determine search depth based on difficulty
    let depth = 2;
    let randomness = 0;

    switch (difficulty) {
        case 'beginner':
            depth = 1;
            randomness = 0.4;
            break;
        case 'apprentice':
            depth = 1;
            randomness = 0.1;
            break;
        case 'casual':
            depth = 2;
            randomness = 0.2;
            break;
        case 'amateur':
            depth = 2;
            randomness = 0;
            break;
        case 'intermediate':
            depth = 3;
            randomness = 0.1;
            break;
        case 'advanced':
            depth = 3;
            randomness = 0;
            break;
        case 'professional':
            depth = 4;
            randomness = 0;
            break;
        case 'legend':
            depth = 5;
            randomness = 0;
            break;
        default:
            depth = 2;
    }

    // Apply randomness
    if (randomness > 0 && Math.random() < randomness) {
        return allMoves[Math.floor(Math.random() * allMoves.length)];
    }

    // Evaluate all moves
    let bestMove: Move | null = null;
    let bestScore = -Infinity;

    for (const move of allMoves) {
        const newState = makeMove(gameState, move.from, move.to);
        const score = minimax(newState, depth - 1, -Infinity, Infinity, false, aiColor);

        if (score > bestScore) {
            bestScore = score;
            bestMove = { ...move, score };
        }
    }

    return bestMove;
}

// Quick move evaluation for immediate threats
export function evaluateMove(gameState: GameState, from: Square, to: Square): number {
    const piece = gameState.board[from.row][from.col];
    const target = gameState.board[to.row][to.col];

    if (!piece) return 0;

    let score = 0;

    // Capturing a piece
    if (target) {
        score += PIECE_VALUES[target.type];
        score -= PIECE_VALUES[piece.type] / 2; // Risk of counter-capture
    }

    // Center control
    const centerDistance = Math.abs(to.row - 3.5) + Math.abs(to.col - 3.5);
    score += (7 - centerDistance) * 5;

    return score;
}
