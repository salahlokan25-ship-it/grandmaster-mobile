import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface PlayCardProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  image?: string;
  onClick?: () => void;
  className?: string;
}

export function PlayCard({ title, subtitle, icon, image, onClick, className }: PlayCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full overflow-hidden rounded-2xl text-left transition-transform active:scale-[0.98]',
        'h-[140px]',
        className
      )}
    >
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="relative h-full p-4 flex flex-col justify-end">
        <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-sm text-foreground/70">{subtitle}</p>
      </div>
    </button>
  );
}

interface FeatureCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  image?: string;
  icon?: ReactNode;
  progress?: { current: number; total: number };
  onClick?: () => void;
  className?: string;
}

export function FeatureCard({
  title,
  subtitle,
  badge,
  image,
  icon,
  progress,
  onClick,
  className,
}: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'chess-card p-0 overflow-hidden text-left transition-transform active:scale-[0.98]',
        'w-[160px] flex-shrink-0',
        className
      )}
    >
      <div className="relative h-24 bg-secondary">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : icon ? (
          <div className="w-full h-full flex items-center justify-center text-primary">
            {icon}
          </div>
        ) : null}
        {badge && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded">
            {badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        {progress && (
          <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        )}
      </div>
    </button>
  );
}

interface ListItemCardProps {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ListItemCard({ title, subtitle, left, right, onClick, className }: ListItemCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl bg-card/50 text-left',
        'transition-colors hover:bg-card active:bg-card/80',
        className
      )}
    >
      {left}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{title}</h4>
        {subtitle && <p className="text-sm text-muted-foreground truncate">{subtitle}</p>}
      </div>
      {right || <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
    </button>
  );
}
