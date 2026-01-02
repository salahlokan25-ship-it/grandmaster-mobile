import { Bell, Settings, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconButtonProps {
  icon: typeof Bell;
  onClick?: () => void;
  badge?: number;
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'md';
  className?: string;
}

export function IconButton({
  icon: Icon,
  onClick,
  badge,
  variant = 'default',
  size = 'md',
  className,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center rounded-full transition-colors',
        variant === 'default' && 'bg-secondary hover:bg-secondary/80',
        variant === 'ghost' && 'hover:bg-secondary/50',
        size === 'sm' && 'w-8 h-8',
        size === 'md' && 'w-10 h-10',
        className
      )}
    >
      <Icon className={cn(size === 'sm' ? 'w-4 h-4' : 'w-5 h-5', 'text-muted-foreground')} />
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-xxs font-bold rounded-full flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
}

export function BackButton({ onClick, className }: { onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-10 h-10 flex items-center justify-center rounded-full',
        'bg-secondary/50 hover:bg-secondary transition-colors',
        className
      )}
    >
      <ArrowLeft className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}
