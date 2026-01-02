import { Flame, Play, Star, Sparkles, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/layout/BottomNav';
import { ChessAvatar } from '@/components/ui/ChessAvatar';
import { cn } from '@/lib/utils';
import chessHero from '@/assets/chess-hero.jpg';
import chessPiecesLight from '@/assets/chess-pieces-light.jpg';
import chessEndgame from '@/assets/chess-endgame.jpg';

const leaderboardData = [
  { rank: 1, username: 'Grandmaster1', title: 'GM', rating: 2800, score: 55 },
  { rank: 2, username: 'You', title: 'IM', rating: 2350, score: 24, isUser: true },
  { rank: 3, username: 'Alice_Chess', title: 'FM', rating: 2100, score: 20 },
];

export function PuzzlesPage() {
  const navigate = useNavigate();
  const streak = 12;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <h1 className="text-xl font-bold text-foreground">Puzzles & Training</h1>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400">
          <Flame className="w-4 h-4 fill-current" />
          <span className="font-bold">{streak}</span>
        </div>
      </header>

      <div className="px-4 space-y-6">
        {/* Daily Challenge */}
        <section className="bg-card rounded-2xl overflow-hidden border border-border/50">
          <div className="relative">
            <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded z-10">
              DAILY CHALLENGE
            </span>
            <img src={chessPiecesLight} alt="Daily puzzle" className="w-full h-48 object-cover" />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold text-foreground">Mate in 3</h2>
            <p className="text-muted-foreground">White to move • Rating: 1450</p>
            <button className="w-full mt-4 py-3 rounded-full font-semibold text-primary-foreground bg-primary flex items-center justify-center gap-2">
              Solve Now
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </section>

        {/* Training Modes */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Training Modes</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-2xl overflow-hidden border border-border/50">
              <div className="relative h-28">
                <img src={chessHero} alt="Puzzle Rush" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-amber-500/80 flex items-center justify-center">
                  <Star className="w-4 h-4 text-black" />
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-foreground">Puzzle Rush</h3>
                <p className="text-xs text-muted-foreground">Speed & accuracy</p>
                <p className="text-sm text-primary font-semibold mt-1">Best: 24</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl overflow-hidden border border-border/50">
              <div className="relative h-28">
                <img src={chessEndgame} alt="Endgame" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-green-500/80 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-foreground">Endgame</h3>
                <p className="text-xs text-muted-foreground">Technique focus</p>
                <p className="text-sm text-primary font-semibold mt-1">90% Mastery</p>
              </div>
            </div>
          </div>
        </section>

        {/* Custom Puzzle Packs */}
        <section className="bg-card rounded-2xl p-4 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-bold text-foreground">Custom Puzzle Packs</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Generate puzzles from your last 50 Rapid games to fix your mistakes.
          </p>
          <button className="w-full mt-4 py-3 rounded-xl border border-border text-primary font-medium">
            Create Pack
          </button>
        </section>

        {/* Leaderboard */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Leaderboard</h2>
            <button className="text-primary font-medium text-sm">View All</button>
          </div>
          <div className="space-y-2">
            {leaderboardData.map((entry) => (
              <div
                key={entry.rank}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl',
                  entry.isUser ? 'bg-primary/10 border border-primary/30' : 'bg-card/50'
                )}
              >
                <span className={cn(
                  'w-6 text-center font-bold',
                  entry.rank === 1 ? 'text-amber-500' : 'text-muted-foreground'
                )}>
                  {entry.rank}
                </span>
                <ChessAvatar
                  size="md"
                  fallback={entry.username.charAt(0)}
                  className={entry.isUser ? 'ring-2 ring-primary' : ''}
                />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{entry.username}</p>
                  <p className="text-sm text-muted-foreground">{entry.title} • {entry.rating}</p>
                </div>
                <span className="font-bold text-primary">{entry.score}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav variant="puzzles" />
    </div>
  );
}

export default PuzzlesPage;
