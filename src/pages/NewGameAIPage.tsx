import { useState } from 'react';
import { ArrowLeft, Bot, Zap, ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/stores/gameStore';
import { AIDifficulty, PieceColor } from '@/types/chess';
import { cn } from '@/lib/utils';
import chessHero from '@/assets/chess-hero.jpg';

const difficulties: { id: AIDifficulty; label: string }[] = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'amateur', label: 'Amateur' },
  { id: 'normal', label: 'Normal' },
  { id: 'professional', label: 'Professional' },
  { id: 'legend', label: 'Legend' },
];

export function NewGameAIPage() {
  const navigate = useNavigate();
  const { setAIDifficulty, setPlayerColor, startGame } = useGameStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<AIDifficulty>('professional');
  const [selectedColor, setSelectedColor] = useState<PieceColor | 'random'>('random');

  const handleStart = () => {
    setAIDifficulty(selectedDifficulty);
    setPlayerColor(selectedColor);
    startGame();
    navigate('/game');
  };

  const getDifficultyIndex = () => difficulties.findIndex((d) => d.id === selectedDifficulty);

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary/50">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">New Game vs AI</h1>
        <div className="w-10" />
      </header>

      <div className="px-4 space-y-6">
        {/* AI Card */}
        <div className="bg-card rounded-2xl p-6 text-center border border-border/50">
          <div className="w-20 h-20 rounded-2xl bg-primary mx-auto flex items-center justify-center relative">
            <Bot className="w-10 h-10 text-primary-foreground" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mt-4">Stockfish 16</h2>
          <p className="text-muted-foreground mt-1">
            Rating: <span className="text-primary font-semibold">2400</span> • Personality: Tactical
          </p>
          <div className="flex justify-center gap-2 mt-3">
            <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium uppercase">
              Aggressive
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium uppercase">
              Endgame Master
            </span>
          </div>
        </div>

        {/* Difficulty */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">Difficulty</h3>
            <span className="text-primary font-medium capitalize">{selectedDifficulty}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  selectedDifficulty === diff.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                )}
              >
                {diff.label}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <div className="h-1 bg-secondary rounded-full relative">
              <div
                className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                style={{ width: `${((getDifficultyIndex() + 1) / difficulties.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-muted-foreground uppercase">Low</span>
              <span className="text-xs text-muted-foreground uppercase">High</span>
            </div>
          </div>
        </section>

        {/* Board & Pieces */}
        <section>
          <h3 className="font-bold text-foreground mb-3">Board & Pieces</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img src={chessHero} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">Board Theme</p>
                <p className="text-sm text-muted-foreground">Walnut Wood</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                <Bot className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">Piece Style</p>
                <p className="text-sm text-muted-foreground">Neo Classic</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* Color Selection */}
        <section>
          <h3 className="font-bold text-foreground mb-3">Play As</h3>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => setSelectedColor('white')}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl transition-colors',
                selectedColor === 'white' && 'ring-2 ring-primary'
              )}
            >
              <div className="w-12 h-12 rounded-full bg-foreground border-4 border-border" />
              <span className="text-sm text-muted-foreground">White</span>
            </button>
            <button
              onClick={() => setSelectedColor('random')}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl transition-colors',
                selectedColor === 'random' && 'ring-2 ring-primary'
              )}
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xl">⚔</span>
              </div>
              <span className="text-sm font-medium text-primary">Random</span>
            </button>
            <button
              onClick={() => setSelectedColor('black')}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl transition-colors',
                selectedColor === 'black' && 'ring-2 ring-primary'
              )}
            >
              <div className="w-12 h-12 rounded-full bg-gray-800 border-4 border-border" />
              <span className="text-sm text-muted-foreground">Black</span>
            </button>
          </div>
        </section>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-full font-semibold text-lg text-primary-foreground bg-primary flex items-center justify-center gap-2"
          style={{ boxShadow: '0 0 20px rgba(232, 90, 0, 0.4)' }}
        >
          Start Game
          <Play className="w-5 h-5 fill-current" />
        </button>
      </div>
    </div>
  );
}

export default NewGameAIPage;
