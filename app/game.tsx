import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info } from 'lucide-react-native';
import { ChessBoard } from '../components/game/ChessBoard'; // Assuming this exists based on context
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function GamePage() {
    const { gameId } = useLocalSearchParams<{ gameId: string }>();
    const router = useRouter();
    const [gameState, setGameState] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!gameId) return;

        const unsub = onSnapshot(doc(db, 'games', gameId), (doc) => {
            if (doc.exists()) {
                setGameState(doc.data());
            }
            setLoading(false);
        });

        return () => unsub();
    }, [gameId]);

    if (!gameId) {
        return (
            <SafeAreaView className="flex-1 bg-background items-center justify-center">
                <Text className="text-white">No Game ID provided.</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-primary px-4 py-2 rounded">
                    <Text className="text-white">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-stone-900" edges={['top']}>
            {/* Header */}
            <View className="px-4 py-2 flex-row items-center justify-between border-b border-white/5">
                <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/5 rounded-full">
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                <View>
                    <Text className="text-white font-bold text-lg text-center">Online Match</Text>
                    <Text className="text-xs text-amber-500 font-mono text-center">ID: {gameId.slice(0, 6)}...</Text>
                </View>
                <TouchableOpacity className="p-2">
                    <Info size={24} color="gray" />
                </TouchableOpacity>
            </View>

            {/* Game Content */}
            <View className="flex-1 items-center justify-center">
                {loading ? (
                    <ActivityIndicator size="large" color="#f59e0b" />
                ) : (
                    <View className="w-full aspect-square">
                        {/* 
                            Placeholder for actual online board integration.
                            We verify the board renders, but state sync (fen) would be passed here.
                        */}
                        <View className="flex-1 items-center justify-center bg-black/20">
                            <Text className="text-white mb-4">Game Connected</Text>
                            <View className="px-4 py-2 bg-green-500/20 rounded border border-green-500">
                                <Text className="text-green-500 font-bold">LIVE SESSION ACTIVE</Text>
                            </View>
                            {/* <ChessBoard /> - Uncomment when ready to wire up online FEN */}
                        </View>
                    </View>
                )}
            </View>

            {/* Footer */}
            <View className="p-6 bg-stone-900 border-t border-white/5">
                <Text className="text-center text-muted-foreground">
                    Waiting for opponent moves... (Sync Implementation Pending)
                </Text>
            </View>
        </SafeAreaView>
    );
}
