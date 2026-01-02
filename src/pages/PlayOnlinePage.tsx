import { useState } from 'react';
import { ArrowLeft, Zap, Clock, Timer, Search, UserPlus, ChevronRight } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { BackButton } from '@/components/ui/IconButton';
import { ChessAvatar } from '@/components/ui/ChessAvatar';
import { useGameStore } from '@/stores/gameStore';
import { TimeControl } from '@/types/chess';
import { cn } from '@/lib/utils';

const timeControls: { id: TimeControl; label: string; time: string; icon: typeof Zap; color: string }[] = [
  { id: 'bullet', label: 'Bullet', time: '1 min', icon: Zap, color: 'text-amber-500' },
  { id: 'blitz', label: 'Blitz', time: '3 | 2', icon: Zap, color: 'text-primary' },
  { id: 'rapid', label: 'Rapid', time: '10 min', icon: Timer, color: 'text-green-500' },
];

interface PlayOnlinePageProps {
  onBack?: () => void;
  onFindOpponent?: () => void;
}

export function PlayOnlinePage({ onBack, onFindOpponent }: PlayOnlinePageProps) {
  const { timeControl, setTimeControl } = useGameStore();
  const [selectedTime, setSelectedTime] = useState<TimeControl>(timeControl);
  const [ratingRange, setRatingRange] = useState({ min: 1250, max: 1650 });
  const userRating = 1450;

  return (
    <PageContainer className="pb-8">
      <PageHeader
        title="Play Online"
        leftAction={<BackButton onClick={onBack} />}
      />

      <div className="px-4 space-y-6">
        {/* Select Mode */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-1">Select Mode</h2>
          <p className="text-muted-foreground mb-4">Choose your preferred time control</p>

          <div className="grid grid-cols-3 gap-3">
            {timeControls.map((tc) => (
              <button
                key={tc.id}
                onClick={() => setSelectedTime(tc.id)}
                className={cn(
                  'chess-card p-4 flex flex-col items-center text-center relative transition-all',
                  selectedTime === tc.id && 'ring-2 ring-primary'
                )}
              >
                {tc.id === 'blitz' && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-xxs font-bold rounded uppercase">
                    Popular
                  </span>
                )}
                <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mb-2', 
                  selectedTime === tc.id ? 'bg-primary/20' : 'bg-secondary'
                )}>
                  <tc.icon className={cn('w-6 h-6', tc.color)} />
                </div>
                <span className={cn(
                  'font-bold',
                  selectedTime === tc.id ? 'text-primary' : 'text-foreground'
                )}>
                  {tc.label}
                </span>
                <span className="text-sm text-muted-foreground">{tc.time}</span>
              </button>
            ))}
          </div>

          <button className="flex items-center justify-center gap-1 mt-3 w-full text-primary font-medium">
            Custom Game <ChevronRight className="w-4 h-4" />
          </button>
        </section>

        {/* Opponent Rating */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">Opponent Rating</h3>
            <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-sm">
              Your Rating: {userRating}
            </span>
          </div>

          <div className="chess-card p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Range</span>
              <span className="font-bold text-foreground">-200 / +200</span>
            </div>

            <div className="relative h-2 bg-secondary rounded-full">
              <div
                className="absolute h-full bg-primary rounded-full"
                style={{
                  left: '20%',
                  right: '30%',
                }}
              />
              <div className="absolute top-1/2 -translate-y-1/2 left-[20%] w-5 h-5 rounded-full bg-primary border-2 border-background" />
              <div className="absolute top-1/2 -translate-y-1/2 right-[30%] w-5 h-5 rounded-full bg-primary border-2 border-background" />
            </div>

            <div className="flex justify-between mt-3">
              <span className="text-sm text-muted-foreground">{ratingRange.min}</span>
              <span className="text-sm text-muted-foreground">{ratingRange.max}</span>
            </div>
          </div>
        </section>

        {/* Recent Players */}
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Recent Players
          </h3>
          <div className="flex -space-x-2">
            <ChessAvatar size="lg" fallback="G" className="ring-2 ring-background" />
            <ChessAvatar size="lg" fallback="Q" className="ring-2 ring-background" />
            <ChessAvatar size="lg" fallback="R" className="ring-2 ring-background" />
            <ChessAvatar size="lg" fallback="K" className="ring-2 ring-background" />
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-semibold ring-2 ring-background">
              +4
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={onFindOpponent}
            className="w-full chess-button-primary flex items-center justify-center gap-2 py-4 text-lg"
          >
            <Search className="w-5 h-5" />
            Find Opponent
          </button>
          <button className="w-full chess-button-secondary flex items-center justify-center gap-2 py-4">
            <UserPlus className="w-5 h-5" />
            Challenge a Friend
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
