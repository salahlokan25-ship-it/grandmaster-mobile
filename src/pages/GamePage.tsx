import { useState } from 'react';
import { ArrowLeft, Settings, Clock, RotateCcw, Lightbulb, MessageSquare, Flag, Cog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChessAvatar } from '@/components/ui/ChessAvatar';
import { ChessBoard } from '@/components/game/ChessBoard';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';

export function GamePage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const { gameState, aiCoachMessage, undoMove, getHint } = useGameStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary/50">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Ranked Match</h1>
        <button className="w-10 h-10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      <div className="flex-1 flex flex-col px-4">
        {/* Opponent Info */}
        <div className="bg-card rounded-2xl p-3 flex items-center justify-between mb-4 border border-border/50">
          <div className="flex items-center gap-3">
            <ChessAvatar size="md" fallback="G" isOnline />
            <div>
              <p className="font-semibold text-foreground">GrandmasterBot</p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">2800</span>
                <span className="text-sm text-green-500">• Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono font-bold text-foreground">{formatTime(gameState.blackTime)}</span>
          </div>
        </div>

        {/* Captured Pieces and View Toggle */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-0.5 text-xl">♟♞♝</div>
          <div className="flex gap-1 bg-secondary rounded-full p-1">
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
            <span className="ml-auto text-xs text-muted-foreground">14. e4 e5</span>
          </div>
          <p className="text-foreground">{aiCoachMessage}</p>
        </div>

        {/* Quick Message */}
        <div className="flex justify-end mt-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-full">
            <ChessAvatar size="sm" fallback="Y" />
            <span className="text-sm text-muted-foreground">Good luck! Have fun.</span>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="mt-auto pt-4 pb-8">
          <div className="flex items-center justify-center gap-2 bg-card rounded-2xl p-2 border border-border/50">
            <button onClick={undoMove} className="flex flex-col items-center gap-1 px-4 py-2">
              <RotateCcw className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Undo</span>
            </button>
            <button onClick={getHint} className="flex flex-col items-center gap-1 px-4 py-2">
              <Lightbulb className="w-6 h-6 text-amber-500" />
              <span className="text-xs text-muted-foreground">Hint</span>
            </button>

            <button className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-2" style={{ boxShadow: '0 0 20px rgba(232, 90, 0, 0.4)' }}>
              <div className="w-8 h-1 bg-primary-foreground rounded-full" />
            </button>

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
    </div>
  );
}

export default GamePage;
