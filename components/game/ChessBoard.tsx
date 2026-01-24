import { View, Text, TouchableOpacity } from 'react-native';
import { useGameStore } from '../../stores/gameStore';
import { cn } from '../../lib/utils';
import { ChessPiece } from './ChessPiece';

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

  const handleSquarePress = (row: number, col: number) => {
    if (!interactive) return;
    selectSquare({ row, col });
  };

  const isSelected = (row: number, col: number) =>
    selectedSquare?.row === row && selectedSquare?.col === col;

  const isValidMove = (row: number, col: number) =>
    validMoves.some((m) => m.row === row && m.col === col);

  const getMoveHighlight = (row: number, col: number) => {
    const lastMove = gameState.moves[gameState.moves.length - 1];
    if (!lastMove) return null;
    if (lastMove.from.row === row && lastMove.from.col === col) return 'from';
    if (lastMove.to.row === row && lastMove.to.col === col) return 'to';
    return null;
  };

  const cols = 'abcdefgh';

  // Professional Colors from Image
  const LIGHT_SQUARE = '#B7B7B7';
  const DARK_SQUARE = '#404040';
  const HIGHLIGHT_COLOR = '#7B4B2F';
  const BOARD_BG = '#2E1E1E';

  return (
    <View
      className={cn('relative mx-auto w-full aspect-square max-w-[400px]', className)}
    >
      {/* Outer Border/Container */}
      <View
        className="flex-1 rounded-[12px] p-2"
        style={{
          backgroundColor: BOARD_BG,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.5,
          shadowRadius: 15,
          elevation: 20
        }}
      >
        <View className="flex-1 rounded-[4px] overflow-hidden shadow-inner">
          {board.map((rowPieces, row) => (
            <View key={row} className="flex-1 flex-row">
              {rowPieces.map((piece, col) => {
                const isLight = (row + col) % 2 === 0;
                const selected = isSelected(row, col);
                const validMove = isValidMove(row, col);
                const highlight = getMoveHighlight(row, col);

                const squareColor = isLight ? LIGHT_SQUARE : DARK_SQUARE;
                const coordColor = isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)';

                return (
                  <TouchableOpacity
                    key={`${row}-${col}`}
                    onPress={() => handleSquarePress(row, col)}
                    disabled={!interactive}
                    activeOpacity={0.8}
                    className="flex-1 items-center justify-center relative"
                    style={{ backgroundColor: squareColor }}
                  >
                    {/* Last Move Highlights */}
                    {highlight === 'from' && (
                      <View className="absolute inset-0" style={{ backgroundColor: HIGHLIGHT_COLOR, opacity: 0.8 }} />
                    )}
                    {highlight === 'to' && (
                      <View className="absolute inset-0 border-[3px]" style={{ borderColor: HIGHLIGHT_COLOR, backgroundColor: HIGHLIGHT_COLOR + '40' }} />
                    )}

                    {/* Selection Highlight */}
                    {selected && (
                      <View className="absolute inset-0 border-2 border-primary z-10" />
                    )}

                    {/* Coordinates */}
                    {showCoordinates && col === 0 && (
                      <Text
                        className="absolute top-0.5 left-1 text-[9px] font-bold"
                        style={{ color: coordColor }}
                      >
                        {8 - row}
                      </Text>
                    )}
                    {showCoordinates && row === 7 && (
                      <Text
                        className="absolute bottom-0.5 right-1 text-[9px] font-bold"
                        style={{ color: coordColor }}
                      >
                        {cols[col]}
                      </Text>
                    )}

                    {/* Pieces */}
                    {piece && (
                      <View
                        style={{
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.4,
                          shadowRadius: 4
                        }}
                      >
                        <ChessPiece type={piece.type} color={piece.color} size={38} />
                      </View>
                    )}

                    {/* Valid Move Indicators */}
                    {validMove && (
                      <View
                        className={cn(
                          "rounded-full",
                          piece ? "absolute inset-0 border-[4px] border-black/10" : "w-[30%] h-[30%] bg-black/15"
                        )}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
