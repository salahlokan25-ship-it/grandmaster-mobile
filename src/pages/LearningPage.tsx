import { ArrowLeft, Search, BookOpen, Flame, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/layout/BottomNav';
import chessHero from '@/assets/chess-hero.jpg';
import chessEndgame from '@/assets/chess-endgame.jpg';
import chessKnight from '@/assets/chess-knight.jpg';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const categories = ['Overview', 'Openings', 'Tactics', 'Strategy', 'Endgame'];

export function LearningPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Overview');

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary/50">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Learning Center</h1>
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
      </header>

      <div className="px-4 py-4 space-y-5">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good Evening, Alex</h1>
          <p className="text-muted-foreground">Ready to master the endgame?</p>
        </div>

        {/* Daily Goal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-foreground">Daily Goal</span>
            <span className="text-sm font-medium text-primary">12/20 Tactics</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: '60%' }} />
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search openings, tactics..."
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Continue Learning */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Continue Learning</h2>
          <div className="bg-card rounded-2xl overflow-hidden border border-border/50">
            <div className="flex">
              <img src={chessHero} alt="Sicilian Defense" className="w-1/3 h-32 object-cover" />
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-foreground">The Sicilian Defense</h3>
                  <span className="text-xs font-semibold text-primary uppercase">In Progress</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Master the counter-attack style.</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-2 py-0.5 rounded bg-amber-600/20 text-amber-400 text-xs font-medium">
                    Intermediate
                  </span>
                  <span className="text-sm text-muted-foreground">Lesson 3/10</span>
                </div>
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Puzzle Drill */}
        <section className="bg-card rounded-2xl p-4 border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">Daily Puzzle Drill</h3>
              <p className="text-sm text-muted-foreground">Boost your tactical vision.</p>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              <Flame className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">5 Day Streak</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Puzzle Rating</p>
                <p className="text-xl font-bold text-foreground">1200</p>
              </div>
            </div>
            <button className="px-6 py-3 rounded-full font-semibold text-primary-foreground bg-primary">
              Start Drill
            </button>
          </div>
        </section>

        {/* Recommended For You */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Recommended For You</h2>
            <button className="text-primary font-medium text-sm">View All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            <div className="bg-card rounded-2xl overflow-hidden w-44 flex-shrink-0 border border-border/50">
              <div className="relative h-28">
                <img src={chessEndgame} alt="Endgame" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-600 text-white text-xs font-semibold rounded">
                  ENDGAME
                </span>
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-foreground">King & Pawn vs. King</h4>
                <p className="text-xs text-muted-foreground">Fundamental technique</p>
                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl overflow-hidden w-44 flex-shrink-0 border border-border/50">
              <div className="relative h-28">
                <img src={chessKnight} alt="Tactics" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded">
                  TACTICS
                </span>
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-foreground">Fork & Skewer</h4>
                <p className="text-xs text-muted-foreground">Tactical motifs</p>
                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <BottomNav variant="learn" />
    </div>
  );
}

export default LearningPage;
