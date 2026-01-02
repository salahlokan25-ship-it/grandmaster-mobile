import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Gamepad2, BookOpen, Users, User, Plus, Play, GraduationCap, BarChart3, Puzzle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavVariant = 'home' | 'learn' | 'community' | 'profile' | 'puzzles';

interface BottomNavProps {
  variant?: NavVariant;
}

export function BottomNav({ variant = 'home' }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getNavConfig = () => {
    switch (variant) {
      case 'home':
        return {
          items: [
            { path: '/', icon: Home, label: 'Home' },
            { path: '/play-online', icon: Gamepad2, label: 'Games' },
            { path: '/community', icon: Users, label: 'Social' },
            { path: '/profile', icon: User, label: 'Profile' },
          ],
          centerAction: () => navigate('/new-game-ai'),
          centerIcon: Plus,
        };
      case 'learn':
        return {
          items: [
            { path: '/new-game-ai', icon: Gamepad2, label: 'Play' },
            { path: '/learn', icon: GraduationCap, label: 'Learn' },
            { path: '/profile', icon: BarChart3, label: 'Stats' },
            { path: '/profile', icon: User, label: 'Profile' },
          ],
          centerAction: null,
          centerIcon: null,
        };
      case 'community':
        return {
          items: [
            { path: '/', icon: Home, label: 'Home' },
            { path: '/learn', icon: GraduationCap, label: 'Learn' },
            { path: '/community', icon: Users, label: 'Clubs' },
            { path: '/profile', icon: User, label: 'Profile' },
          ],
          centerAction: () => navigate('/play-online'),
          centerIcon: Play,
        };
      case 'puzzles':
        return {
          items: [
            { path: '/new-game-ai', icon: Gamepad2, label: 'Play' },
            { path: '/puzzles', icon: Puzzle, label: 'Puzzles' },
            { path: '/community', icon: Users, label: 'Social' },
            { path: '/profile', icon: User, label: 'Profile' },
          ],
          centerAction: null,
          centerIcon: null,
        };
      case 'profile':
        return {
          items: [
            { path: '/new-game-ai', icon: Gamepad2, label: 'Play' },
            { path: '/learn', icon: GraduationCap, label: 'Learn' },
            { path: '/profile', icon: User, label: 'Profile' },
            { path: '/community', icon: Users, label: 'Social' },
          ],
          centerAction: null,
          centerIcon: null,
        };
      default:
        return {
          items: [],
          centerAction: null,
          centerIcon: null,
        };
    }
  };

  const config = getNavConfig();
  const hasCenterButton = config.centerAction !== null;
  const firstTwo = config.items.slice(0, 2);
  const lastTwo = config.items.slice(2);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 z-50 max-w-md mx-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}>
      <div className="flex items-center justify-around">
        {firstTwo.map((item) => (
          <button
            key={item.path + item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 py-3 px-4 transition-colors flex-1',
              location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}

        {hasCenterButton && config.centerIcon && (
          <div className="flex flex-col items-center -mt-6">
            <button
              onClick={config.centerAction!}
              className="w-14 h-14 rounded-full flex items-center justify-center bg-primary shadow-lg"
              style={{ boxShadow: '0 0 20px rgba(232, 90, 0, 0.4)' }}
            >
              {variant === 'community' ? (
                <Play className="w-6 h-6 text-primary-foreground fill-current" />
              ) : (
                <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
              )}
            </button>
          </div>
        )}

        {lastTwo.map((item) => (
          <button
            key={item.path + item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 py-3 px-4 transition-colors flex-1',
              location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
