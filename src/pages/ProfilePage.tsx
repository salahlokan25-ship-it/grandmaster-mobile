import { Settings, Edit2, Globe, Trophy, Swords, Star, Lock, ChevronRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/layout/BottomNav';
import { ChessAvatar } from '@/components/ui/ChessAvatar';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';

export function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, stats, achievements, matchHistory } = useUserStore();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
        <button className="w-10 h-10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      <div className="px-4 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center pt-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-amber-200 flex items-center justify-center overflow-hidden border-4 border-primary/20">
              <div className="w-full h-full bg-gradient-to-b from-amber-100 to-amber-300 flex items-center justify-center text-4xl">
                👩
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-background" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mt-4">Grandmaster_Flash</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Globe className="w-4 h-4" />
            <span>United States</span>
            <span>•</span>
            <span className="text-primary font-semibold">ELO 1850</span>
          </div>
          <button className="mt-3 px-6 py-2 rounded-full bg-primary/20 text-primary font-medium flex items-center gap-2">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-4 rounded-xl bg-card border border-border/50">
            <Trophy className="w-5 h-5 text-primary mb-1" />
            <span className="text-2xl font-bold text-foreground">58%</span>
            <span className="text-xs text-muted-foreground uppercase">Win Rate</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-card border border-border/50">
            <Swords className="w-5 h-5 text-primary mb-1" />
            <span className="text-2xl font-bold text-foreground">412</span>
            <span className="text-xs text-muted-foreground uppercase">Games</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-card border border-border/50">
            <Star className="w-5 h-5 text-primary mb-1" />
            <span className="text-2xl font-bold text-foreground">1.2k</span>
            <span className="text-xs text-muted-foreground uppercase">Puzzles</span>
          </div>
        </div>

        {/* Rating History */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-foreground">Rating History</h3>
              <p className="text-sm text-muted-foreground">Last 30 Days</p>
            </div>
            <div className="flex items-center gap-1 text-green-500">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">+42</span>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-4 h-32 flex items-center justify-center border border-border/50">
            <svg className="w-full h-full" viewBox="0 0 300 80">
              <path
                d="M0 60 Q 30 40, 60 45 T 120 35 T 180 55 T 240 25 T 300 30"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
            </svg>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Level 4 • Next reward: King's Gambit Badge</p>
        </section>

        {/* Achievements */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">Achievements</h3>
            <button className="text-primary font-medium text-sm">View All</button>
          </div>
          <div className="flex gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex flex-col items-center gap-1">
                <div className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center',
                  achievement.unlocked ? 'bg-primary/20' : 'bg-secondary'
                )}>
                  {achievement.unlocked ? (
                    achievement.icon === 'trophy' ? (
                      <Trophy className="w-6 h-6 text-amber-500" />
                    ) : achievement.icon === 'zap' ? (
                      <Swords className="w-6 h-6 text-blue-500" />
                    ) : (
                      <Star className="w-6 h-6 text-primary" />
                    )
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <span className={cn(
                  'text-xs',
                  achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {achievement.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Match History */}
        <section>
          <h3 className="font-bold text-foreground mb-3">Match History</h3>
          <div className="space-y-2">
            {matchHistory.map((match) => (
              <button key={match.id} className="w-full flex items-center gap-3 p-3 rounded-xl bg-card/50">
                <ChessAvatar size="md" fallback={match.opponent.username.charAt(0)} />
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{match.opponent.username}</p>
                  <p className="text-sm text-muted-foreground">{match.gameType} • {match.timeControl}</p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    'font-semibold',
                    match.result === 'won' ? 'text-green-500' : match.result === 'lost' ? 'text-red-500' : 'text-muted-foreground'
                  )}>
                    {match.result.charAt(0).toUpperCase() + match.result.slice(1)}
                  </p>
                  <p className={cn('text-sm', match.eloChange > 0 ? 'text-green-500' : 'text-red-500')}>
                    {match.eloChange > 0 ? '+' : ''}{match.eloChange} ELO
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>
      </div>

      <BottomNav variant="profile" />
    </div>
  );
}

export default ProfilePage;
