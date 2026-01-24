import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { X, Brain, Zap, Award, Target, Trophy, Flame } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import type { AIDifficulty } from '../../types/chess';

interface AIGameSetupModalProps {
    visible: boolean;
    onClose: () => void;
    onStartGame: (difficulty: AIDifficulty) => void;
}

export function AIGameSetupModal({ visible, onClose, onStartGame }: AIGameSetupModalProps) {
    const difficulties = [
        {
            id: 'beginner' as const,
            name: 'Beginner',
            description: 'Just learns basics',
            icon: Zap,
            color: 'bg-green-600',
            borderColor: 'border-green-500'
        },
        {
            id: 'apprentice' as const,
            name: 'Apprentice',
            description: 'Makes basic captures',
            icon: Zap,
            color: 'bg-lime-600',
            borderColor: 'border-lime-500'
        },
        {
            id: 'casual' as const,
            name: 'Casual',
            description: 'Plays for fun',
            icon: Brain,
            color: 'bg-yellow-600',
            borderColor: 'border-yellow-500'
        },
        {
            id: 'amateur' as const,
            name: 'Amateur',
            description: 'Solid basic play',
            icon: Brain,
            color: 'bg-amber-600',
            borderColor: 'border-amber-500'
        },
        {
            id: 'intermediate' as const,
            name: 'Intermediate',
            description: 'Short-term tactics',
            icon: Target,
            color: 'bg-orange-600',
            borderColor: 'border-orange-500'
        },
        {
            id: 'advanced' as const,
            name: 'Advanced',
            description: 'Tactical awareness',
            icon: Target,
            color: 'bg-red-600',
            borderColor: 'border-red-500'
        },
        {
            id: 'professional' as const,
            name: 'Professional',
            description: 'Deep calculation',
            icon: Trophy,
            color: 'bg-rose-600',
            borderColor: 'border-rose-500'
        },
        {
            id: 'legend' as const,
            name: 'Legend',
            description: 'Near-perfect play',
            icon: Flame,
            color: 'bg-purple-600',
            borderColor: 'border-purple-500'
        }
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/80 items-center justify-center p-6">
                <View className="bg-card rounded-3xl p-6 w-full max-w-sm border border-border/50 max-h-[80%]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-xl font-bold text-foreground">Select AI Level</Text>
                        <Pressable onPress={onClose} className="w-8 h-8 items-center justify-center rounded-full bg-secondary">
                            <X size={20} color="hsl(30 10% 55%)" />
                        </Pressable>
                    </View>

                    {/* Description */}
                    <Text className="text-muted-foreground mb-4 text-center">
                        Choose your opponent's difficulty
                    </Text>

                    {/* Difficulty Options */}
                    <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
                        <View className="gap-2">
                            {difficulties.map((diff) => {
                                const Icon = diff.icon;
                                return (
                                    <Pressable
                                        key={diff.id}
                                        onPress={() => {
                                            onStartGame(diff.id);
                                            onClose();
                                        }}
                                        className={cn(
                                            "p-3 rounded-2xl border-2 active:scale-95",
                                            diff.borderColor,
                                            "bg-secondary/30"
                                        )}
                                    >
                                        <View className="flex-row items-center gap-3">
                                            <View className={cn("w-10 h-10 rounded-xl items-center justify-center", diff.color)}>
                                                <Icon size={20} color="white" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="font-bold text-foreground text-base">{diff.name}</Text>
                                                <Text className="text-xs text-muted-foreground">{diff.description}</Text>
                                            </View>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </ScrollView>

                    {/* Info Box */}
                    <View className="bg-primary/10 rounded-xl p-3 border border-primary/30">
                        <Text className="text-sm text-muted-foreground text-center">
                            Legend level is designed to be unbeatable.
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
