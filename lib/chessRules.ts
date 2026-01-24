import { GameState, Move, Piece, PieceColor, PieceType, Square } from '@/types/chess';

export const isValidMove = (gameState: GameState, from: Square, to: Square): boolean => {
    const piece = gameState.board[from.row][from.col];
    if (!piece) return false;
    if (piece.color !== gameState.currentTurn) return false;
    if (from.row === to.row && from.col === to.col) return false;

    const target = gameState.board[to.row][to.col];
    if (target && target.color === piece.color) return false; // Cannot capture own piece

    // Check physical rules
    if (!isPhysicalMoveValid(gameState, from, to, piece)) return false;

    // Make temporary move to check for check
    const tempBoard = simulateMove(gameState, from, to);
    if (isCheck(tempBoard, piece.color)) return false;

    return true;
};

export const getValidMoves = (gameState: GameState, square: Square): Square[] => {
    const moves: Square[] = [];
    const piece = gameState.board[square.row][square.col];
    if (!piece) return [];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isValidMove(gameState, square, { row: r, col: c })) {
                moves.push({ row: r, col: c });
            }
        }
    }
    return moves;
};

const isPhysicalMoveValid = (gameState: GameState, from: Square, to: Square, piece: Piece): boolean => {
    const dx = to.col - from.col;
    const dy = to.row - from.row;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    switch (piece.type) {
        case 'pawn':
            const direction = piece.color === 'white' ? -1 : 1;
            const startRow = piece.color === 'white' ? 6 : 1;
            const target = gameState.board[to.row][to.col];

            // Move forward 1
            if (dx === 0 && dy === direction && !target) return true;
            // Move forward 2
            if (dx === 0 && dy === direction * 2 && from.row === startRow && !target && !gameState.board[from.row + direction][from.col]) return true;
            // Capture
            if (absDx === 1 && dy === direction && target && target.color !== piece.color) return true;
            // En Passant
            if (absDx === 1 && dy === direction && !target) {
                const lastMove = gameState.moves[gameState.moves.length - 1];
                if (lastMove && lastMove.piece.type === 'pawn' &&
                    Math.abs(lastMove.to.row - lastMove.from.row) === 2 &&
                    lastMove.to.col === to.col &&
                    lastMove.to.row === from.row) {
                    return true;
                }
            }
            return false;

        case 'rook':
            if (dx !== 0 && dy !== 0) return false; // Must be linear
            return isPathClear(gameState.board, from, to);

        case 'knight':
            return (absDx === 2 && absDy === 1) || (absDx === 1 && absDy === 2);

        case 'bishop':
            if (absDx !== absDy) return false; // Must be diagonal
            return isPathClear(gameState.board, from, to);

        case 'queen':
            if (dx !== 0 && dy !== 0 && absDx !== absDy) return false; // Must be linear or diagonal
            return isPathClear(gameState.board, from, to);

        case 'king':
            if (absDx <= 1 && absDy <= 1) return true; // 1 step

            // Castling
            if (absDy === 0 && absDx === 2 && !piece.hasMoved) {
                // King side or Queen side
                const isKingSide = dx > 0;
                const rookCol = isKingSide ? 7 : 0;
                const rook = gameState.board[from.row][rookCol];

                // Rook must exist and not moved
                if (!rook || rook.type !== 'rook' || rook.hasMoved) return false;

                // Path must be clear
                const pathClear = isPathClear(gameState.board, from, { row: from.row, col: rookCol });
                if (!pathClear) return false;

                // Cannot castle out of check
                if (gameState.isCheck) return false;

                // Cannot pass through check
                const direction = isKingSide ? 1 : -1;
                const passedSquare = { row: from.row, col: from.col + direction };

                // Check if passed square is under attack
                const passedBoard = simulateMove(gameState, from, passedSquare);
                if (isCheck(passedBoard, piece.color)) return false;

                return true;
            }
            return false;

        default:
            return false;
    }
};

const isPathClear = (board: (Piece | null)[][], from: Square, to: Square): boolean => {
    const dx = Math.sign(to.col - from.col);
    const dy = Math.sign(to.row - from.row);
    let r = from.row + dy;
    let c = from.col + dx;

    while (r !== to.row || c !== to.col) {
        if (board[r][c]) return false;
        r += dy;
        c += dx;
    }
    return true;
};

const simulateMove = (gameState: GameState, from: Square, to: Square): (Piece | null)[][] => {
    const newBoard = gameState.board.map(row => [...row]);
    let piece = { ...newBoard[from.row][from.col] } as Piece;

    // Handle En Passant in simulation
    if (piece?.type === 'pawn' && from.col !== to.col && !newBoard[to.row][to.col]) {
        newBoard[from.row][to.col] = null;
    }

    // Handle Promotion in simulation
    if (piece?.type === 'pawn') {
        if ((piece.color === 'white' && to.row === 0) || (piece.color === 'black' && to.row === 7)) {
            piece.type = 'queen';
        }
    }

    // Handle Castling in simulation
    if (piece?.type === 'king' && Math.abs(to.col - from.col) === 2) {
        const isKingSide = to.col > from.col;
        const rookFromCol = isKingSide ? 7 : 0;
        const rookToCol = isKingSide ? 5 : 3;
        const rook = newBoard[from.row][rookFromCol];
        if (rook) {
            newBoard[from.row][rookToCol] = { ...rook, hasMoved: true };
            newBoard[from.row][rookFromCol] = null;
        }
    }

    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;
    return newBoard;
};

export const isCheck = (board: (Piece | null)[][], color: PieceColor): boolean => {
    // Find King
    let kingPos: Square | null = null;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.type === 'king' && p.color === color) {
                kingPos = { row: r, col: c };
                break;
            }
        }
    }
    if (!kingPos) return false; // Should not happen

    // Check if any enemy piece attacks king
    const enemyColor = color === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.color === enemyColor) {
                if (canPieceAttack(board, { row: r, col: c }, kingPos, p)) return true;
            }
        }
    }
    return false;
};

const canPieceAttack = (board: (Piece | null)[][], from: Square, to: Square, piece: Piece): boolean => {
    const dx = to.col - from.col;
    const dy = to.row - from.row;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    switch (piece.type) {
        case 'pawn':
            const direction = piece.color === 'white' ? -1 : 1;
            // Pawns capture diagonally
            if (absDx === 1 && dy === direction) return true;
            return false;
        case 'rook':
            if (dx !== 0 && dy !== 0) return false;
            return isPathClear(board, from, to);
        case 'knight':
            return (absDx === 2 && absDy === 1) || (absDx === 1 && absDy === 2);
        case 'bishop':
            if (absDx !== absDy) return false;
            return isPathClear(board, from, to);
        case 'queen':
            if (dx !== 0 && dy !== 0 && absDx !== absDy) return false;
            return isPathClear(board, from, to);
        case 'king':
            if (absDx <= 1 && absDy <= 1) return true;
            return false;
        default:
            return false;
    }
};
export const hasLegalMoves = (gameState: GameState, color: PieceColor): boolean => {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = gameState.board[r][c];
            if (piece && piece.color === color) {
                const moves = getValidMoves(gameState, { row: r, col: c });
                if (moves.length > 0) return true;
            }
        }
    }
    return false;
};

export const isCheckmate = (gameState: GameState, color: PieceColor): boolean => {
    return isCheck(gameState.board, color) && !hasLegalMoves(gameState, color);
};

export const isStalemate = (gameState: GameState, color: PieceColor): boolean => {
    return !isCheck(gameState.board, color) && !hasLegalMoves(gameState, color);
};
