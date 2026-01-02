import { Bell, Check, Circle, Globe, Flame, Swords, BookOpen, Bot } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { BottomNav, TabId } from '@/components/layout/BottomNav';
import { ChessAvatar } from '@/components/ui/ChessAvatar';
import { IconButton } from '@/components/ui/IconButton';
import { StreakBadge, RankBadge } from '@/components/ui/Badges';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatCard } from '@/components/ui/StatCard';
import { PlayCard, FeatureCard } from '@/components/ui/Cards';
import { useUserStore } from '@/stores/userStore';
import { useState } from 'react';
import chessHero from '@/assets/chess-hero.jpg';
import chessPiecesLight from '@/assets/chess-pieces-light.jpg';

export function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const { currentUser, stats, dailyGoals } = useUserStore();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <PageContainer className="pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <ChessAvatar
            size="lg"
            isOnline
            fallback={currentUser.username}
          />
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              {greeting()}
            </p>
            <h1 className="text-xl font-bold text-foreground">{currentUser.username}</h1>
          </div>
        </div>
        <IconButton icon={Bell} badge={1} />
      </header>

      <div className="px-4 space-y-6">
        {/* Stats Card */}
        <div className="chess-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <RankBadge rank={stats.rank} elo={stats.elo} />
            <StreakBadge days={stats.streak} />
          </div>

          <ProgressBar
            value={90}
            max={120}
            showLabel
            label="Progress to Bishop Rank"
          />

          <div className="grid grid-cols-3 gap-2 pt-2">
            <StatCard value={stats.wins} label="Won" />
            <StatCard value={stats.losses} label="Lost" />
            <StatCard value={`${stats.winRate}%`} label="Win Rate" />
          </div>
        </div>

        {/* Play Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Swords className="w-5 h-5 text-primary" />
            <h2 className="chess-section-title">Play</h2>
          </div>

          <div className="space-y-3">
            <PlayCard
              title="Play Online"
              subtitle="Ranked • Blitz • Bullet"
              icon={<Globe className="w-5 h-5 text-primary-foreground" />}
              image={chessHero}
            />
            <PlayCard
              title="Play vs AI"
              subtitle="Practice vs Stockfish"
              icon={<Bot className="w-5 h-5 text-primary-foreground" />}
              image={chessPiecesLight}
            />
          </div>
        </section>

        {/* Training Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="chess-section-title">Training</h2>
            </div>
            <button className="chess-link">View All</button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <FeatureCard
              title="Daily Puzzle"
              subtitle="Mate in 2"
              badge="DAILY"
              image={chessHero}
            />
            <FeatureCard
              title="Opening Principles"
              subtitle="3/10 Completed"
              icon={<BookOpen className="w-10 h-10" />}
              progress={{ current: 3, total: 10 }}
            />
            <FeatureCard
              title="Game Review"
              subtitle="Review last game"
              icon={<Swords className="w-10 h-10" />}
            />
          </div>
        </section>

        {/* Daily Goals */}
        <section className="chess-card p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Daily Goals
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                dailyGoals.puzzlesSolved >= dailyGoals.puzzlesTarget 
                  ? 'bg-primary' 
                  : 'border-2 border-muted-foreground'
              }`}>
                {dailyGoals.puzzlesSolved >= dailyGoals.puzzlesTarget && (
                  <Check className="w-3 h-3 text-primary-foreground" />
                )}
              </div>
              <span className="text-foreground">Solve 5 Puzzles</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                dailyGoals.gamesWon >= dailyGoals.gamesTarget 
                  ? 'bg-primary' 
                  : 'border-2 border-muted-foreground'
              }`}>
                {dailyGoals.gamesWon >= dailyGoals.gamesTarget && (
                  <Check className="w-3 h-3 text-primary-foreground" />
                )}
              </div>
              <span className="text-foreground">Win 1 Online Game</span>
            </div>
          </div>
        </section>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} variant="home" />
    </PageContainer>
  );
}
