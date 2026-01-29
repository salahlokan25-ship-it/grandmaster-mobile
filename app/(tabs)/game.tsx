import { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Settings, Clock, RotateCcw, Lightbulb, MessageSquare, Flag, Volume2, VolumeX } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChessAvatar } from '../../components/ui/ChessAvatar';
import { ChessBoard } from '../../components/game/ChessBoard';
import { GameTimer } from '../../components/game/GameTimer';
import { useGameStore } from '../../stores/gameStore';
import { cn } from '../../lib/utils';
import { GameOverModal } from '../../components/game/GameOverModal';
import { supabase } from '../../lib/supabase';
import { PieceColor } from '../../types/chess';

export default function GamePage() {
    const router = useRouter();
    const {
        gameState,
        undoMove,
        getHint,
        resetGame,
        gameMode,
        whiteTimeRemaining,
        blackTimeRemaining,
        handleTimeExpired,
        isSpeechEnabled,
        toggleSpeech,
        initOnlineGame,
        syncOnlineMove,
        userColor
    } = useGameStore();

    const { gameId, color } = useLocalSearchParams<{ gameId: string, color: string }>();
    const [modalVisible, setModalVisible] = useState(true);

    // Initialize online game if params provided
    useEffect(() => {
        if (gameId && color) {
            console.log('[GamePage] Initializing online session:', gameId, color);
            initOnlineGame(gameId, color as PieceColor);
        }
    }, [gameId, color]);

    // Setup real-time move listener
    useEffect(() => {
        if (gameMode !== 'online' || !gameId) return;

        console.log('[GamePage] Activating tactical data link for session:', gameId);

        const channel = supabase
            .channel(`game:${gameId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'active_games',
                    filter: `id=eq.${gameId}`
                },
                (payload) => {
                    console.log('[GamePage] Tactical update received:', payload);
                    if (payload.new.last_move) {
                        try {
                            const moveData = JSON.parse(payload.new.last_move);
                            // Only sync if the move wasn't made by the current user
                            const lastTurn = gameState.currentTurn === 'white' ? 'black' : 'white';
                            if (gameState.currentTurn !== userColor) {
                                console.log('[GamePage] Synchronizing opponent move:', moveData);
                                syncOnlineMove(moveData);
                            }
                        } catch (e) {
                            console.error('[GamePage] Failed to process move data:', e);
                        }
                    }
                }
            )
            .subscribe((status) => {
                console.log('[GamePage] Data link status:', status);
            });

        return () => {
            console.log('[GamePage] Deactivating tactical data link');
            supabase.removeChannel(channel);
        };
    }, [gameMode, gameId, userColor, gameState.currentTurn]);

    const winner = useMemo(() => {
        if (gameState.isCheckmate) {
            return gameState.currentTurn === 'white' ? 'black' : 'white';
        }
        if (gameState.isDraw) return 'draw';
        return null;
    }, [gameState.isCheckmate, gameState.isDraw, gameState.currentTurn]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRematch = () => {
        setModalVisible(false);
        resetGame();
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="flex-1 flex-col">
                {/* Header scrolled content */}
                <View className="flex-row items-center justify-between px-4 py-3">
                    <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-secondary/50">
                        <ArrowLeft size={20} className="text-muted-foreground" color="hsl(30 15% 75%)" />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold text-foreground">{gameMode === 'ai' ? 'Vs AI' : 'Local Match'}</Text>
                    <TouchableOpacity onPress={toggleSpeech} className="w-10 h-10 items-center justify-center">
                        {isSpeechEnabled ? (
                            <Volume2 size={20} className="text-primary" color="#f59e0b" />
                        ) : (
                            <VolumeX size={20} className="text-muted-foreground" color="hsl(30 15% 75%)" />
                        )}
                    </TouchableOpacity>
                </View>

                <View className="flex-1 flex-col px-4">
                    {/* Opponent Info */}
                    <View className="bg-card rounded-2xl p-3 flex-row items-center justify-between mb-4 border border-border/50">
                        <View className="flex-row items-center gap-3">
                            <ChessAvatar size="md" fallback={gameMode === 'ai' ? 'AI' : 'O'} isOnline />
                            <View>
                                <Text className="font-semibold text-foreground">{gameMode === 'ai' ? 'Stockfish' : 'Opponent'}</Text>
                                <View className="flex-row items-center gap-1">
                                    <Text className="text-sm text-muted-foreground">2800</Text>
                                    <Text className="text-sm text-green-500">• Online</Text>
                                </View>
                            </View>
                        </View>
                        <View className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-secondary">
                            <Clock size={16} className="text-muted-foreground" color="hsl(30 15% 75%)" />
                            <Text className="font-mono font-bold text-foreground">{formatTime(gameState.blackTime)}</Text>
                        </View>
                    </View>

                    {/* Game Timer */}
                    <GameTimer
                        whiteTime={whiteTimeRemaining}
                        blackTime={blackTimeRemaining}
                        activeColor={gameState.currentTurn}
                        onTimeExpired={handleTimeExpired}
                    />

                    {/* Chess Board */}
                    <View className="mb-4">
                        <ChessBoard
                            size="md"
                            interactive={!winner && (gameMode !== 'online' || gameState.currentTurn === userColor)}
                            flipped={userColor === 'black'}
                            showCoordinates
                        />
                    </View>

                    {/* Bottom Controls */}
                    <View className="mt-auto pt-4 pb-8">
                        <View className="flex-row items-center justify-center gap-2 bg-card rounded-2xl p-2 border border-border/50">
                            {gameMode === 'ai' && (
                                <>
                                    <TouchableOpacity onPress={undoMove} className="flex-1 flex-col items-center gap-1 px-2 py-2">
                                        <RotateCcw size={20} className="text-muted-foreground" color="hsl(30 15% 75%)" />
                                        <Text className="text-xs text-muted-foreground">Undo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={getHint} className="flex-1 flex-col items-center gap-1 px-2 py-2">
                                        <Lightbulb size={20} className="text-amber-500" color="#f59e0b" />
                                        <Text className="text-xs text-muted-foreground">Hint</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            <TouchableOpacity
                                onPress={() => Alert.alert('Menu', 'Game settings and analysis coming soon!')}
                                className="w-16 h-16 rounded-full bg-primary flex-col items-center justify-center gap-1 mx-2 shadow-lg"
                                style={{ elevation: 5 }}
                            >
                                <View className="w-8 h-1 bg-white rounded-full" />
                                <View className="w-8 h-1 bg-white rounded-full" />
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-1 flex-col items-center gap-1 px-2 py-2">
                                <MessageSquare size={20} className="text-muted-foreground" color="hsl(30 15% 75%)" />
                                <Text className="text-xs text-muted-foreground">Chat</Text>
                            </TouchableOpacity>

                            {gameMode === 'ai' ? (
                                <TouchableOpacity onPress={resetGame} className="flex-1 flex-col items-center gap-1 px-2 py-2">
                                    <RotateCcw size={20} className="text-primary" color="#f59e0b" />
                                    <Text className="text-xs text-muted-foreground">Reload</Text>
                                </TouchableOpacity>
                            ) : (
                                <View className="flex-1" />
                            )}
                        </View>
                    </View>
                </View>
            </View>

            {/* Game Over Modal */}
            <GameOverModal
                visible={!!winner && modalVisible}
                onClose={() => setModalVisible(false)}
                winner={winner}
                onRematch={handleRematch}
            />
        </SafeAreaView>
    );
}
