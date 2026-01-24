import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Flame, Play, Star, Sparkles, Trophy } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChessAvatar } from '../../components/ui/ChessAvatar';
import { cn } from '../../lib/utils';
import { IconButton } from '../../components/ui/IconButton';

// Assets
const chessHero = require('../../assets/chess-hero.jpg');
const chessPiecesLight = require('../../assets/chess-pieces-light.jpg');
const chessEndgame = require('../../assets/chess-endgame.jpg');

const leaderboardData = [
    { rank: 1, username: 'Grandmaster1', title: 'GM', rating: 2800, score: 55 },
    { rank: 2, username: 'You', title: 'IM', rating: 2350, score: 24, isUser: true },
    { rank: 3, username: 'Alice_Chess', title: 'FM', rating: 2100, score: 20 },
];

export default function PuzzlesPage() {
    const router = useRouter();
    const streak = 12;

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-4">
                    <Text className="text-xl font-bold text-foreground">Puzzles & Training</Text>
                    <View className="flex-row items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20">
                        <Flame size={16} className="text-amber-400" color="#fbbf24" fill="#fbbf24" />
                        <Text className="font-bold text-amber-400">{streak}</Text>
                    </View>
                </View>

                <View className="px-4 gap-6">
                    {/* Daily Challenge */}
                    <View className="bg-card rounded-2xl overflow-hidden border border-border/50">
                        <View className="relative">
                            <View className="absolute top-3 left-3 px-2 py-1 bg-primary rounded z-10">
                                <Text className="text-primary-foreground text-xs font-bold">DAILY CHALLENGE</Text>
                            </View>
                            <Image source={chessPiecesLight} className="w-full h-48" resizeMode="cover" />
                        </View>
                        <View className="p-4">
                            <Text className="text-xl font-bold text-foreground">Mate in 3</Text>
                            <Text className="text-muted-foreground">White to move • Rating: 1450</Text>
                            <TouchableOpacity className="w-full mt-4 py-3 rounded-full bg-primary flex-row items-center justify-center gap-2">
                                <Text className="font-semibold text-primary-foreground">Solve Now</Text>
                                <Play size={16} color="white" fill="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Training Modes */}
                    <View>
                        <Text className="text-lg font-bold text-foreground mb-3">Training Modes</Text>
                        <View className="flex-row gap-3">
                            <View className="flex-1 bg-card rounded-2xl overflow-hidden border border-border/50">
                                <View className="relative h-28">
                                    <Image source={chessHero} className="w-full h-full" resizeMode="cover" />
                                    <View className="absolute top-2 right-2 w-8 h-8 rounded-full bg-amber-500/80 items-center justify-center">
                                        <Star size={16} color="black" />
                                    </View>
                                </View>
                                <View className="p-3">
                                    <Text className="font-bold text-foreground">Puzzle Rush</Text>
                                    <Text className="text-xs text-muted-foreground">Speed & accuracy</Text>
                                    <Text className="text-sm text-primary font-semibold mt-1">Best: 24</Text>
                                </View>
                            </View>
                            <View className="flex-1 bg-card rounded-2xl overflow-hidden border border-border/50">
                                <View className="relative h-28">
                                    <Image source={chessEndgame} className="w-full h-full" resizeMode="cover" />
                                    <View className="absolute top-2 right-2 w-8 h-8 rounded-full bg-green-500/80 items-center justify-center">
                                        <Sparkles size={16} color="black" />
                                    </View>
                                </View>
                                <View className="p-3">
                                    <Text className="font-bold text-foreground">Endgame</Text>
                                    <Text className="text-xs text-muted-foreground">Technique focus</Text>
                                    <Text className="text-sm text-primary font-semibold mt-1">90% Mastery</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Daily Quiz */}
                    <View className="bg-card rounded-2xl p-4 border border-primary/30 bg-primary/5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Trophy size={20} className="text-primary" color="hsl(24 100% 45%)" />
                            <Text className="font-bold text-foreground">Daily Chess Quiz</Text>
                        </View>
                        <Text className="text-sm text-muted-foreground mt-1">
                            Test your knowledge of rules, piece values, and tactics for bonus points.
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/quiz')}
                            className="w-full mt-4 py-3 bg-primary rounded-xl items-center"
                        >
                            <Text className="text-primary-foreground font-bold">Start Quiz</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Custom Puzzle Packs */}
                    <View className="bg-card rounded-2xl p-4 border border-border/50">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Sparkles size={20} className="text-primary" color="hsl(24 100% 45%)" />
                        </View>
                        <Text className="font-bold text-foreground">Custom Puzzle Packs</Text>
                        <Text className="text-sm text-muted-foreground mt-1">
                            Generate puzzles from your last 50 Rapid games to fix your mistakes.
                        </Text>
                        <TouchableOpacity className="w-full mt-4 py-3 rounded-xl border border-border items-center">
                            <Text className="text-primary font-medium">Create Pack</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Leaderboard */}
                    <View>
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-lg font-bold text-foreground">Leaderboard</Text>
                            <TouchableOpacity>
                                <Text className="text-primary font-medium text-sm">View All</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="gap-2">
                            {leaderboardData.map((entry) => (
                                <View
                                    key={entry.rank}
                                    className={cn(
                                        'flex-row items-center gap-3 p-3 rounded-xl',
                                        entry.isUser ? 'bg-primary/10 border border-primary/30' : 'bg-card/50'
                                    )}
                                >
                                    <View className="w-6 items-center">
                                        <Text className={cn(
                                            'font-bold',
                                            entry.rank === 1 ? 'text-amber-500' : 'text-muted-foreground'
                                        )}>{entry.rank}</Text>
                                    </View>
                                    <ChessAvatar
                                        size="md"
                                        fallback={entry.username.charAt(0)}
                                        className={entry.isUser ? 'border-2 border-primary' : ''}
                                    />
                                    <View className="flex-1">
                                        <Text className="font-semibold text-foreground">{entry.username}</Text>
                                        <Text className="text-sm text-muted-foreground">{entry.title} • {entry.rating}</Text>
                                    </View>
                                    <Text className="font-bold text-primary">{entry.score}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
