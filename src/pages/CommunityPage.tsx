import { useState } from 'react';
import { Search, Bell, Trophy, Users, MessageSquare, ChevronRight } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { BottomNav, TabId } from '@/components/layout/BottomNav';
import { BackButton, IconButton } from '@/components/ui/IconButton';
import { ChessAvatar } from '@/components/ui/ChessAvatar';
import { cn } from '@/lib/utils';
import chessHero from '@/assets/chess-hero.jpg';

const leaderboardTabs = ['Global', 'Friends', 'My Club'];

const leaderboardData = [
  { rank: 1, username: 'GrandMaster_99', rating: 2850, isTop: true },
  { rank: 2, username: 'QueenGambit', rating: 2810 },
  { rank: 3, username: 'RookToE4', rating: 2795 },
  { rank: 4, username: 'KnightRider', rating: 2750 },
];

interface CommunityPageProps {
  onBack?: () => void;
}

export function CommunityPage({ onBack }: CommunityPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('clubs');
  const [leaderboardTab, setLeaderboardTab] = useState('Global');

  return (
    <PageContainer className="pb-24">
      <PageHeader
        title="Community"
        leftAction={<BackButton onClick={onBack} />}
        rightAction={<IconButton icon={Bell} badge={1} variant="ghost" />}
      />

      <div className="px-4 space-y-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search players, clubs..."
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Find Your Tribe Banner */}
        <div className="chess-card overflow-hidden relative">
          <img
            src={chessHero}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative p-5">
            <h2 className="text-2xl font-bold text-foreground">Find your tribe</h2>
            <p className="text-muted-foreground mt-1">
              Compete in leagues or start your own dynasty.
            </p>
            <div className="flex gap-3 mt-4">
              <button className="chess-button-primary">Join Club</button>
              <button className="chess-button-secondary">Create</button>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Upcoming Events</h2>
            <button className="chess-link">View All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <div className="chess-card p-4 min-w-[200px] flex-shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                <span className="px-2 py-0.5 bg-secondary text-muted-foreground text-xs rounded-full">
                  TOURNAMENT
                </span>
              </div>
              <h3 className="font-bold text-foreground">Weekly Blitz Arena</h3>
              <p className="text-sm text-muted-foreground">Starts in 2h 15m</p>
              <div className="flex items-center gap-1 mt-3">
                <div className="flex -space-x-2">
                  <ChessAvatar size="sm" fallback="G" />
                  <ChessAvatar size="sm" fallback="Q" />
                  <ChessAvatar size="sm" fallback="R" />
                </div>
                <span className="text-xs text-muted-foreground ml-1">+124 joined</span>
              </div>
            </div>
            <div className="chess-card p-4 min-w-[200px] flex-shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <h3 className="font-bold text-foreground">Endgame Masters</h3>
              <p className="text-sm text-muted-foreground">Tomorrow, 14:00</p>
              <div className="flex items-center gap-1 mt-3">
                <div className="flex -space-x-2">
                  <ChessAvatar size="sm" fallback="A" />
                  <ChessAvatar size="sm" fallback="B" />
                </div>
                <span className="text-xs text-muted-foreground ml-1">+42 joined</span>
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Leaderboard</h2>
          <div className="flex gap-1 mb-4">
            {leaderboardTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setLeaderboardTab(tab)}
                className={cn(
                  'flex-1 py-2 text-sm font-medium transition-colors',
                  leaderboardTab === tab
                    ? 'text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground border-b-2 border-transparent'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {leaderboardData.map((entry) => (
              <div
                key={entry.rank}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl',
                  entry.isTop ? 'bg-amber-600/10 border border-amber-600/30' : 'bg-card/50'
                )}
              >
                <span className={cn(
                  'w-6 text-center font-bold',
                  entry.isTop ? 'text-amber-500' : 'text-muted-foreground'
                )}>
                  {entry.isTop ? <Trophy className="w-5 h-5" /> : entry.rank}
                </span>
                <ChessAvatar size="md" fallback={entry.username.charAt(0)} />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{entry.username}</p>
                  <p className="text-sm text-muted-foreground">Rating: {entry.rating}</p>
                </div>
                <span className={cn(
                  'px-2 py-1 rounded text-sm font-bold',
                  entry.isTop ? 'bg-amber-600/20 text-amber-400' : 'text-muted-foreground'
                )}>
                  #{entry.rank}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Club Chat */}
        <section className="chess-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">Club Chat</h3>
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded">
              3 New
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3">
              <ChessAvatar size="sm" fallback="A" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Alex_Chess</p>
                <p className="text-sm text-muted-foreground">
                  Anyone up for a quick 5min game? 🎮
                </p>
                <p className="text-xs text-primary mt-1">I'm down! Send invite.</p>
                <p className="text-xs text-muted-foreground mt-1">2 mins ago</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-3 py-2.5 rounded-xl bg-secondary text-foreground font-medium">
            Open Chat
          </button>
        </section>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} variant="community" />
    </PageContainer>
  );
}
