import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  noPadding?: boolean;
}

export function PageContainer({ children, className, header, noPadding }: PageContainerProps) {
  return (
    <div className={cn('min-h-screen bg-background safe-bottom', className)}>
      {header}
      <div className={cn(!noPadding && 'px-4 py-4')}>
        {children}
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  className?: string;
  transparent?: boolean;
}

export function PageHeader({ title, leftAction, rightAction, className, transparent }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'safe-top sticky top-0 z-40 flex items-center justify-between px-4 py-3',
        !transparent && 'bg-background/95 backdrop-blur-lg border-b border-border/50',
        className
      )}
    >
      <div className="w-10 flex justify-start">{leftAction}</div>
      {title && <h1 className="text-lg font-semibold text-foreground">{title}</h1>}
      <div className="w-10 flex justify-end">{rightAction}</div>
    </header>
  );
}
