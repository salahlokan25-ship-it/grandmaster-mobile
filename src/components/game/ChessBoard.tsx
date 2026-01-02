import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';
import { Piece, Square } from '@/types/chess';

const pieceSymbols: Record<string, string> = {
  'king-white': '♔',
  'queen-white': '♕',
  'rook-white': '♖',
  'bishop-white': '♗',
  'knight-white': '♘',
  'pawn-white': '♙',
  'king-black': '♚',
  'queen-black': '♛',
  'rook-black': '♜',
  'bishop-black': '♝',
  'knight-black': '♞',
  'pawn-black': '♟',
};

interface ChessBoardProps {
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  showCoordinates?: boolean;
  className?: string;
}

export function ChessBoard({
  size = 'md',
  interactive = true,
  showCoordinates = true,
  className,
}: ChessBoardProps) {
  const { gameState, selectedSquare, validMoves, selectSquare } = useGameStore();
  const { board } = gameState;

  const sizeClasses = {
    sm: 'w-[200px]',
    md: 'w-full max-w-[360px]',
    lg: 'w-full max-w-[420px]',
  };

  const handleSquareClick = (row: number, col: number) => {
    if (!interactive) return;
    selectSquare({ row, col });
  };

  const isSelected = (row: number, col: number) =>
    selectedSquare?.row === row && selectedSquare?.col === col;

  const isValidMove = (row: number, col: number) =>
    validMoves.some((m) => m.row === row && m.col === col);

  const isLastMove = (row: number, col: number) => {
    const lastMove = gameState.moves[gameState.moves.length - 1];
    if (!lastMove) return false;
    return (
      (lastMove.from.row === row && lastMove.from.col === col) ||
      (lastMove.to.row === row && lastMove.to.col === col)
    );
  };

  const cols = 'abcdefgh';

  return (
    <div className={cn('relative mx-auto', sizeClasses[size], className)}>
      <div className="aspect-square rounded-lg overflow-hidden shadow-lg border border-border/50">
        {board.map((rowPieces, row) => (
          <div key={row} className="flex">
            {rowPieces.map((piece, col) => {
              const isLight = (row + col) % 2 === 0;
              const selected = isSelected(row, col);
              const validMove = isValidMove(row, col);
              const lastMove = isLastMove(row, col);

              return (
                <button
                  key={`${row}-${col}`}
                  onClick={() => handleSquareClick(row, col)}
                  disabled={!interactive}
                  className={cn(
                    'relative aspect-square w-[12.5%] flex items-center justify-center',
                    'transition-colors duration-150',
                    isLight ? 'bg-chess-light' : 'bg-chess-dark',
                    selected && 'ring-2 ring-inset ring-primary',
                    lastMove && !selected && 'bg-primary/40',
                    interactive && 'hover:brightness-110 cursor-pointer'
                  )}
                >
                  {piece && (
                    <span
                      className={cn(
                        'text-3xl sm:text-4xl leading-none select-none',
                        piece.color === 'white' ? 'text-white drop-shadow-lg' : 'text-gray-900'
                      )}
                      style={{
                        textShadow:
                          piece.color === 'white'
                            ? '1px 1px 2px rgba(0,0,0,0.8)'
                            : '1px 1px 2px rgba(255,255,255,0.3)',
                      }}
                    >
                      {pieceSymbols[`${piece.type}-${piece.color}`]}
                    </span>
                  )}
                  
                  {validMove && !piece && (
                    <div className="w-3 h-3 rounded-full bg-primary/50" />
                  )}
                  
                  {validMove && piece && (
                    <div className="absolute inset-0 ring-4 ring-inset ring-primary/50 rounded-sm" />
                  )}

                  {/* Coordinates */}
                  {showCoordinates && col === 0 && (
                    <span className="absolute top-0.5 left-1 text-xxs font-medium text-muted-foreground/70">
                      {8 - row}
                    </span>
                  )}
                  {showCoordinates && row === 7 && (
                    <span className="absolute bottom-0.5 right-1 text-xxs font-medium text-muted-foreground/70">
                      {cols[col]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
