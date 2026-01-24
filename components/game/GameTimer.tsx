import { View, Text } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface GameTimerProps {
    whiteTime: number; // milliseconds
    blackTime: number; // milliseconds
    activeColor: 'white' | 'black';
    onTimeExpired: (color: 'white' | 'black') => void;
}

export function GameTimer({ whiteTime, blackTime, activeColor, onTimeExpired }: GameTimerProps) {
    const [displayWhiteTime, setDisplayWhiteTime] = useState(whiteTime);
    const [displayBlackTime, setDisplayBlackTime] = useState(blackTime);

    useEffect(() => {
        setDisplayWhiteTime(whiteTime);
        setDisplayBlackTime(blackTime);
    }, [whiteTime, blackTime]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (activeColor === 'white') {
                setDisplayWhiteTime((prev) => {
                    const newTime = Math.max(0, prev - 100);
                    if (newTime === 0) {
                        onTimeExpired('white');
                    }
                    return newTime;
                });
            } else {
                setDisplayBlackTime((prev) => {
                    const newTime = Math.max(0, prev - 100);
                    if (newTime === 0) {
                        onTimeExpired('black');
                    }
                    return newTime;
                });
            }
        }, 100);

        return () => clearInterval(interval);
    }, [activeColor, onTimeExpired]);

    const formatTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const isLowTime = (ms: number) => ms < 60000; // Less than 1 minute

    return (
        <View className="flex-row justify-between items-center px-6 py-4 bg-card border-y border-border/50">
            {/* Black Timer */}
            <View
                className={cn(
                    'flex-row items-center gap-2 px-4 py-3 rounded-xl',
                    activeColor === 'black' ? 'bg-primary/20 border-2 border-primary' : 'bg-muted/30',
                    isLowTime(displayBlackTime) && activeColor === 'black' && 'bg-red-500/20 border-red-500'
                )}
            >
                <Clock
                    size={20}
                    color={
                        isLowTime(displayBlackTime) && activeColor === 'black'
                            ? '#ef4444'
                            : activeColor === 'black'
                                ? '#f59e0b'
                                : '#666'
                    }
                />
                <View>
                    <Text className="text-xs text-muted-foreground uppercase">Black</Text>
                    <Text
                        className={cn(
                            'text-2xl font-mono font-bold',
                            isLowTime(displayBlackTime) && activeColor === 'black'
                                ? 'text-red-500'
                                : activeColor === 'black'
                                    ? 'text-primary'
                                    : 'text-foreground'
                        )}
                    >
                        {formatTime(displayBlackTime)}
                    </Text>
                </View>
            </View>

            {/* White Timer */}
            <View
                className={cn(
                    'flex-row items-center gap-2 px-4 py-3 rounded-xl',
                    activeColor === 'white' ? 'bg-primary/20 border-2 border-primary' : 'bg-muted/30',
                    isLowTime(displayWhiteTime) && activeColor === 'white' && 'bg-red-500/20 border-red-500'
                )}
            >
                <Clock
                    size={20}
                    color={
                        isLowTime(displayWhiteTime) && activeColor === 'white'
                            ? '#ef4444'
                            : activeColor === 'white'
                                ? '#f59e0b'
                                : '#666'
                    }
                />
                <View>
                    <Text className="text-xs text-muted-foreground uppercase">White</Text>
                    <Text
                        className={cn(
                            'text-2xl font-mono font-bold',
                            isLowTime(displayWhiteTime) && activeColor === 'white'
                                ? 'text-red-500'
                                : activeColor === 'white'
                                    ? 'text-primary'
                                    : 'text-foreground'
                        )}
                    >
                        {formatTime(displayWhiteTime)}
                    </Text>
                </View>
            </View>
        </View>
    );
}
