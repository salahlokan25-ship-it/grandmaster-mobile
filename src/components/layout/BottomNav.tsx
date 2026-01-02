import { Home, Gamepad2, BookOpen, Users, User, Plus, Play, GraduationCap, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabId = 'home' | 'games' | 'learn' | 'social' | 'profile' | 'play' | 'puzzles' | 'stats' | 'clubs';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  variant?: 'home' | 'learn' | 'community' | 'profile' | 'puzzles';
}

const homeNavItems: { id: TabId; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'games', icon: Gamepad2, label: 'Games' },
  { id: 'social', icon: Users, label: 'Social' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const learnNavItems: { id: TabId; icon: typeof Home; label: string }[] = [
  { id: 'play', icon: Gamepad2, label: 'Play' },
  { id: 'learn', icon: GraduationCap, label: 'Learn' },
  { id: 'stats', icon: BarChart3, label: 'Stats' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const communityNavItems: { id: TabId; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'learn', icon: GraduationCap, label: 'Learn' },
  { id: 'clubs', icon: Users, label: 'Clubs' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const puzzlesNavItems: { id: TabId; icon: typeof Home; label: string }[] = [
  { id: 'play', icon: Gamepad2, label: 'Play' },
  { id: 'puzzles', icon: GraduationCap, label: 'Puzzles' },
  { id: 'social', icon: Users, label: 'Social' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export function BottomNav({ activeTab, onTabChange, variant = 'home' }: BottomNavProps) {
  const navItems = variant === 'learn' 
    ? learnNavItems 
    : variant === 'community' 
    ? communityNavItems 
    : variant === 'puzzles'
    ? puzzlesNavItems
    : homeNavItems;

  const hasCenterButton = variant === 'home' || variant === 'community';
  const centerIcon = variant === 'community' ? Play : Plus;

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.slice(0, 2).map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn('bottom-nav-item', activeTab === item.id && 'active')}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}

        {hasCenterButton && (
          <div className="flex flex-col items-center">
            <button className="bottom-nav-center">
              {variant === 'community' ? (
                <Play className="w-6 h-6 text-primary-foreground fill-current" />
              ) : (
                <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
              )}
            </button>
          </div>
        )}

        {navItems.slice(2).map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn('bottom-nav-item', activeTab === item.id && 'active')}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
