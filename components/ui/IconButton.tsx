import { TouchableOpacity, View, Text } from 'react-native';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react-native';

interface IconButtonProps {
    icon: LucideIcon;
    onClick?: () => void;
    onPress?: () => void;
    className?: string;
    badge?: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'secondary' | 'outline';
}

export function IconButton({ icon: Icon, onClick, onPress, className, badge, size = 'md', variant = 'secondary' }: IconButtonProps) {
    const handlePress = onPress || onClick;

    return (
        <TouchableOpacity
            onPress={handlePress}
            className={cn(
                'relative items-center justify-center rounded-full',
                size === 'sm' && 'w-8 h-8',
                size === 'md' && 'w-10 h-10',
                size === 'lg' && 'w-12 h-12',
                size === 'xl' && 'w-14 h-14',
                variant === 'default' && 'bg-primary',
                variant === 'secondary' && 'bg-secondary',
                variant === 'outline' && 'border border-border',
                className
            )}
        >
            <Icon size={20} color={variant === 'default' ? 'white' : 'hsl(30 10% 55%)'} />
            {badge !== undefined && badge > 0 && (
                <View className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full items-center justify-center">
                    <Text className="text-primary-foreground text-[10px] font-bold">
                        {badge > 9 ? '9+' : badge}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}
