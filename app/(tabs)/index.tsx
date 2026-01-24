import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Check, Swords, BookOpen, Bot, Globe, Flame } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChessAvatar } from '../../components/ui/ChessAvatar';
import { IconButton } from '../../components/ui/IconButton';
import { AIGameSetupModal } from '../../components/game/AIGameSetupModal';
import { MatchmakingModal } from '../../components/game/MatchmakingModal';
import { useGameStore } from '../../stores/gameStore';
import { useState } from 'react';
import type { AIDifficulty } from '../../types/chess';

// Assets
const chessHero = require('../../assets/chess-hero.jpg');
const chessPiecesLight = require('../../assets/chess-pieces-light.jpg');

export default function HomePage() {
    const router = useRouter();
    const { startNewGame, setAIDifficulty } = useGameStore();
    const [showAISetup, setShowAISetup] = useState(false);
    const [showMatchmaking, setShowMatchmaking] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-4">
                    <View className="flex-row items-center gap-3">
                        <View className="relative">
                            <View className="w-12 h-12 rounded-full bg-amber-200 overflow-hidden items-center justify-center">
                                <View className="w-full h-full bg-amber-100 items-center justify-center">
                                    <Text className="text-2xl">👨</Text>
                                </View>
                            </View>
                            <View className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
                        </View>
                        <View>
                            <Text className="text-xs text-muted-foreground uppercase tracking-wide">Good Morning</Text>
                            <Text className="text-lg font-bold text-foreground">Alex</Text>
                        </View>
                    </View>
                    <IconButton icon={Bell} badge={1} />
                </View>

                <View className="px-4 gap-5">
                    {/* Stats Card */}
                    <View className="bg-card rounded-2xl p-4 border border-border/50">
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center gap-3">
                                <View className="w-12 h-12 rounded-xl bg-amber-600/20 items-center justify-center">
                                    <Text className="text-2xl">🏆</Text>
                                </View>
                                <View>
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-3xl font-bold text-foreground">1250</Text>
                                        <Text className="text-sm text-muted-foreground">ELO</Text>
                                    </View>
                                    <Text className="text-sm text-muted-foreground">Knight III</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20">
                                <Flame size={16} className="text-amber-400" color="#fbbf24" fill="#fbbf24" />
                                <Text className="text-sm font-semibold text-amber-400">5 Days</Text>
                            </View>
                        </View>

                        <View className="mb-4">
                            <View className="flex-row justify-between items-center mb-1.5">
                                <Text className="text-sm text-muted-foreground">Progress to Bishop Rank</Text>
                                <Text className="text-sm font-medium text-primary">90/120 XP</Text>
                            </View>
                            <View className="h-2 rounded-full bg-muted overflow-hidden">
                                <View className="h-full rounded-full bg-primary" style={{ width: '75%' }} />
                            </View>
                        </View>

                        <View className="flex-row gap-3">
                            <View className="flex-1 items-center p-3 rounded-xl bg-muted/30">
                                <Text className="text-2xl font-bold text-foreground">142</Text>
                                <Text className="text-xs text-muted-foreground uppercase">Won</Text>
                            </View>
                            <View className="flex-1 items-center p-3 rounded-xl bg-muted/30">
                                <Text className="text-2xl font-bold text-foreground">84</Text>
                                <Text className="text-xs text-muted-foreground uppercase">Lost</Text>
                            </View>
                            <View className="flex-1 items-center p-3 rounded-xl bg-muted/30">
                                <Text className="text-2xl font-bold text-foreground">58%</Text>
                                <Text className="text-xs text-muted-foreground uppercase">Win Rate</Text>
                            </View>
                        </View>
                    </View>

                    {/* Play Section */}
                    <View>
                        <View className="flex-row items-center gap-2 mb-3">
                            <Swords size={20} className="text-primary" color="hsl(24 100% 45%)" />
                            <Text className="text-lg font-bold text-foreground">Play</Text>
                        </View>

                        {/* Main Actions */}
                        <View className="gap-3">
                            <TouchableOpacity
                                onPress={() => setShowMatchmaking(true)}
                                className="w-full h-48 rounded-2xl overflow-hidden active:opacity-90"
                            >
                                <Image source={chessHero} className="w-full h-full" resizeMode="cover" />
                                <View className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 items-center justify-center">
                                    <View className="items-center gap-2">
                                        <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center backdrop-blur-sm">
                                            <Globe size={32} color="hsl(24 100% 45%)" />
                                        </View>
                                        <Text className="text-2xl font-bold text-white">Play Online</Text>
                                        <Text className="text-sm text-white/80">Challenge players worldwide</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setShowAISetup(true)}
                                className="w-full h-48 rounded-2xl overflow-hidden active:opacity-90"
                            >
                                <Image source={chessPiecesLight} className="w-full h-full" resizeMode="cover" />
                                <View className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 items-center justify-center">
                                    <View className="items-center gap-2">
                                        <View className="w-16 h-16 rounded-full bg-amber-600/30 items-center justify-center backdrop-blur-sm">
                                            <Bot size={32} color="#f59e0b" />
                                        </View>
                                        <Text className="text-2xl font-bold text-white">Play vs AI</Text>
                                        <Text className="text-sm text-white/80">Practice against computer</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Training Section */}
                    <View>
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center gap-2">
                                <BookOpen size={20} className="text-primary" color="hsl(24 100% 45%)" />
                                <Text className="text-lg font-bold text-foreground">Training</Text>
                            </View>
                            <TouchableOpacity onPress={() => router.push('/learn')}>
                                <Text className="text-primary font-medium text-sm">View All</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3 -mx-4 px-4 overflow-visible">
                            <View className="bg-card rounded-2xl overflow-hidden w-[150px] border border-border/50 mr-3">
                                <View className="h-24 relative">
                                    <Image source={chessHero} className="w-full h-full" resizeMode="cover" />
                                    <View className="absolute top-2 left-2 px-2 py-0.5 bg-primary rounded">
                                        <Text className="text-primary-foreground text-xs font-bold">DAILY</Text>
                                    </View>
                                </View>
                                <View className="p-3">
                                    <Text className="font-semibold text-foreground text-sm">Daily Puzzle</Text>
                                    <Text className="text-xs text-muted-foreground">Mate in 2</Text>
                                </View>
                            </View>

                            <View className="bg-card rounded-2xl overflow-hidden w-[150px] border border-border/50 mr-3">
                                <View className="h-24 bg-secondary items-center justify-center">
                                    <BookOpen size={40} className="text-primary" color="hsl(24 100% 45%)" />
                                </View>
                                <View className="p-3">
                                    <Text className="font-semibold text-foreground text-sm">Opening Principles</Text>
                                    <Text className="text-xs text-muted-foreground">3/10 Completed</Text>
                                    <View className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                                        <View className="h-full bg-primary rounded-full" style={{ width: '30%' }} />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>

                    {/* Daily Goal */}
                    <View className="bg-card rounded-2xl p-4 border border-border/50">
                        <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Daily Goals
                        </Text>
                        <View className="gap-3">
                            <View className="flex-row items-center gap-3">
                                <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
                                    <Check size={12} className="text-primary-foreground" color="white" />
                                </View>
                                <Text className="text-foreground">Solve 5 Puzzles</Text>
                            </View>
                            <View className="flex-row items-center gap-3">
                                <View className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                                <Text className="text-foreground">Win 1 Online Game</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Modals */}
            <AIGameSetupModal
                visible={showAISetup}
                onClose={() => setShowAISetup(false)}
                onStartGame={(difficulty) => {
                    setAIDifficulty(difficulty);
                    startNewGame('ai');
                    router.push('/game');
                }}
            />
            <MatchmakingModal
                visible={showMatchmaking}
                onCancel={() => setShowMatchmaking(false)}
            />
        </SafeAreaView>
    );
}
