import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
  fallback?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-24 h-24',
};

export function ChessAvatar({ src, alt, size = 'md', isOnline, className, fallback }: AvatarProps) {
  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden bg-secondary border-2 border-primary/20',
          sizeClasses[size]
        )}
      >
        {src ? (
          <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-semibold">
            {fallback?.charAt(0).toUpperCase() || '?'}
          </div>
        )}
      </div>
      {isOnline && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-background" />
      )}
    </div>
  );
}
