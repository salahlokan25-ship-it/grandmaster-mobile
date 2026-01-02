import { useState } from 'react';
import { Settings, ArrowLeft, Clock, RotateCcw, Lightbulb, MessageSquare, Flag, Cog } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { BackButton, IconButton } from '@/components/ui/IconButton';
import { ChessAvatar } from '@/components/ui/ChessAvatar';
import { ChessBoard } from '@/components/game/ChessBoard';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';

interface GamePageProps {
  onBack?: () => void;
}

export function GamePage({ onBack }: GamePageProps) {
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const { gameState, aiCoachMessage, undoMove, getHint } = useGameStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <PageContainer className="pb-0 min-h-screen flex flex-col">
      <PageHeader
        title="Ranked Match"
        leftAction={<BackButton onClick={onBack} />}
        rightAction={<IconButton icon={Settings} variant="ghost" />}
      />

      <div className="flex-1 flex flex-col px-4">
        {/* Opponent Info */}
        <div className="chess-card p-3 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ChessAvatar size="md" fallback="G" isOnline />
            <div>
              <p className="font-semibold text-foreground">GrandmasterBot</p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">2800</span>
                <span className="text-sm text-success">• Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono font-bold text-foreground">
              {formatTime(gameState.blackTime)}
            </span>
          </div>
        </div>

        {/* Captured Pieces */}
        <div className="flex items-center justify-between mb-2 text-xl">
          <div className="flex gap-0.5">♟♞♝</div>
          <div className="flex gap-2 bg-secondary rounded-full p-1">
            <button
              onClick={() => setViewMode('2D')}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                viewMode === '2D' ? 'bg-card text-foreground' : 'text-muted-foreground'
              )}
            >
              2D
            </button>
            <button
              onClick={() => setViewMode('3D')}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                viewMode === '3D' ? 'bg-card text-foreground' : 'text-muted-foreground'
              )}
            >
              3D
            </button>
          </div>
        </div>

        {/* Chess Board */}
        <ChessBoard size="lg" interactive showCoordinates />

        {/* AI Coach Message */}
        <div className="mt-4 p-4 rounded-xl bg-card border-l-4 border-primary">
          <div className="flex items-center gap-2 mb-1">
            <Cog className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase">AI Coach</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {gameState.moves.length > 0 ? `${Math.ceil(gameState.moves.length / 2)}. e4 e5` : ''}
            </span>
          </div>
          <p className="text-foreground">{aiCoachMessage}</p>
        </div>

        {/* Message */}
        <div className="flex justify-end mt-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-full">
            <ChessAvatar size="sm" fallback="Y" />
            <span className="text-sm text-muted-foreground">Good luck! Have fun.</span>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="mt-auto pt-4 pb-8">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={undoMove}
              className="flex flex-col items-center gap-1 px-4 py-2"
            >
              <RotateCcw className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Undo</span>
            </button>
            <button
              onClick={getHint}
              className="flex flex-col items-center gap-1 px-4 py-2"
            >
              <Lightbulb className="w-6 h-6 text-amber-500" />
              <span className="text-xs text-muted-foreground">Hint</span>
            </button>

            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-4 glow-primary">
              <div className="w-8 h-1 bg-primary-foreground rounded-full" />
            </div>

            <button className="flex flex-col items-center gap-1 px-4 py-2">
              <MessageSquare className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Chat</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-4 py-2">
              <Flag className="w-6 h-6 text-destructive" />
              <span className="text-xs text-muted-foreground">Resign</span>
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
