import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ value, max, className, showLabel, label }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-sm font-medium text-primary">
            {value}/{max} XP
          </span>
        </div>
      )}
      <div className="chess-progress-bar">
        <div className="chess-progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
