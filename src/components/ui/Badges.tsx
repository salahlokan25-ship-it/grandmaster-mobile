import { Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  days: number;
  className?: string;
}

export function StreakBadge({ days, className }: StreakBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full',
        'bg-amber-500/20 text-amber-400',
        className
      )}
    >
      <Flame className="w-4 h-4 fill-current" />
      <span className="text-xs font-semibold">{days} Days</span>
    </div>
  );
}

interface RankBadgeProps {
  rank: string;
  elo: number;
  className?: string;
}

export function RankBadge({ rank, elo, className }: RankBadgeProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center">
        <Trophy className="w-6 h-6 text-amber-500" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">{elo}</span>
          <span className="text-sm text-muted-foreground">ELO</span>
        </div>
        <span className="text-sm text-muted-foreground">{rank}</span>
      </div>
    </div>
  );
}
