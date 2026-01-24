import { View, Image, Text } from 'react-native';
import { cn } from '../../lib/utils';

interface AvatarProps {
  src?: any; // Changed from string to any for require() support or uri objects
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
    <View className={cn('relative', className)}>
      <View
        className={cn(
          'rounded-full overflow-hidden bg-secondary border-2 border-primary/20 items-center justify-center',
          sizeClasses[size]
        )}
      >
        {src ? (
          <Image source={typeof src === 'string' ? { uri: src } : src} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full items-center justify-center bg-primary/20">
            <Text className="text-primary font-semibold text-center">
              {fallback?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
        )}
      </View>
      {isOnline && (
        <View className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-background" />
      )}
    </View>
  );
}
