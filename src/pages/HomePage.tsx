import { Bell, Check, Swords, BookOpen, Bot, Globe, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/layout/BottomNav';
import { ChessAvatar } from '@/components/ui/ChessAvatar';
import { IconButton } from '@/components/ui/IconButton';
import chessHero from '@/assets/chess-hero.jpg';
import chessPiecesLight from '@/assets/chess-pieces-light.jpg';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-b from-amber-100 to-amber-300 flex items-center justify-center text-2xl">
                👨
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Good Morning</p>
            <h1 className="text-lg font-bold text-foreground">Alex</h1>
          </div>
        </div>
        <IconButton icon={Bell} badge={1} />
      </header>

      <div className="px-4 space-y-5">
        {/* Stats Card */}
        <div className="bg-card rounded-2xl p-4 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-foreground">1250</span>
                  <span className="text-sm text-muted-foreground">ELO</span>
                </div>
                <span className="text-sm text-muted-foreground">Knight III</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20">
              <Flame className="w-4 h-4 text-amber-400 fill-current" />
              <span className="text-sm font-semibold text-amber-400">5 Days</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-muted-foreground">Progress to Bishop Rank</span>
              <span className="text-sm font-medium text-primary">90/120 XP</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: '75%' }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-3 rounded-xl bg-muted/30">
              <span className="text-2xl font-bold text-foreground">142</span>
              <span className="text-xs text-muted-foreground uppercase">Won</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-muted/30">
              <span className="text-2xl font-bold text-foreground">84</span>
              <span className="text-xs text-muted-foreground uppercase">Lost</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-muted/30">
              <span className="text-2xl font-bold text-foreground">58%</span>
              <span className="text-xs text-muted-foreground uppercase">Win Rate</span>
            </div>
          </div>
        </div>

        {/* Play Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Swords className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Play</h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/play-online')}
              className="relative w-full h-[130px] overflow-hidden rounded-2xl"
            >
              <img src={chessHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="relative h-full p-4 flex flex-col justify-end">
                <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Play Online</h3>
                <p className="text-sm text-foreground/70">Ranked • Blitz • Bullet</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/new-game-ai')}
              className="relative w-full h-[130px] overflow-hidden rounded-2xl"
            >
              <img src={chessPiecesLight} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="relative h-full p-4 flex flex-col justify-end">
                <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Play vs AI</h3>
                <p className="text-sm text-foreground/70">Practice vs Stockfish</p>
              </div>
            </button>
          </div>
        </section>

        {/* Training Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Training</h2>
            </div>
            <button onClick={() => navigate('/learn')} className="text-primary font-medium text-sm">View All</button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            <div className="bg-card rounded-2xl overflow-hidden w-[150px] flex-shrink-0 border border-border/50">
              <div className="relative h-24">
                <img src={chessHero} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded">
                  DAILY
                </span>
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-foreground text-sm">Daily Puzzle</h4>
                <p className="text-xs text-muted-foreground">Mate in 2</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl overflow-hidden w-[150px] flex-shrink-0 border border-border/50">
              <div className="h-24 bg-secondary flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-foreground text-sm">Opening Principles</h4>
                <p className="text-xs text-muted-foreground">3/10 Completed</p>
                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl overflow-hidden w-[150px] flex-shrink-0 border border-border/50">
              <div className="h-24 bg-secondary flex items-center justify-center">
                <Swords className="w-10 h-10 text-primary" />
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-foreground text-sm">Game Review</h4>
                <p className="text-xs text-muted-foreground">Review last game</p>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Goals */}
        <section className="bg-card rounded-2xl p-4 border border-border/50">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Daily Goals
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-foreground">Solve 5 Puzzles</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
              <span className="text-foreground">Win 1 Online Game</span>
            </div>
          </div>
        </section>
      </div>

      <BottomNav variant="home" />
    </div>
  );
}

export default HomePage;
