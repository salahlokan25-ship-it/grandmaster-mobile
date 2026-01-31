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
import { PromotionModal } from '../../components/game/PromotionModal';
import { InGameChat } from '../../components/game/InGameChat';
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
        userColor,
        isPromotionModalVisible,
        completePromotion,
        toggleChat,
        addMessage
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
                                console.log('[GamePage] Synchronizing opponent move and timers:', moveData);
                                const times = {
                                    white: payload.new.white_time,
                                    black: payload.new.black_time
                                };
                                syncOnlineMove(moveData, times);
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

    // Setup real-time message listener
    useEffect(() => {
        if (gameMode !== 'online' || !gameId) return;

        const channel = supabase
            .channel(`messages:${gameId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'game_messages',
                    filter: `game_id=eq.${gameId}`
                },
                (payload) => {
                    console.log('[GamePage] New message received:', payload);
                    addMessage(payload.new as any);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [gameMode, gameId]);

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
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => toggleChat(true)}
                        className="bg-card rounded-2xl p-3 flex-row items-center justify-between mb-4 border border-border/50"
                    >
                        <View className="flex-row items-center gap-3">
                            <ChessAvatar size="md" fallback={gameMode === 'ai' ? 'AI' : 'O'} isOnline />
                            <View>
                                <Text className="font-semibold text-foreground">{gameMode === 'ai' ? 'Stockfish' : 'Opponent'}</Text>
                                <View className="flex-row items-center gap-1">
                                    <Text className="text-sm text-muted-foreground">2800</Text>
                                    <Text className="text-sm text-green-500">• Tactical Link</Text>
                                </View>
                            </View>
                        </View>
                        <View className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-secondary">
                            <Clock size={16} className="text-muted-foreground" color="hsl(30 15% 75%)" />
                            <Text className="font-mono font-bold text-foreground">{formatTime(gameState.blackTime)}</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Game Timer */}
                    <GameTimer
                        whiteTime={whiteTimeRemaining}
                        blackTime={blackTimeRemaining}
                        activeColor={gameState.currentTurn}
                        onTimeExpired={handleTimeExpired}
                        isPaused={!!winner}
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

                    {/* Self Info (Added current player card at bottom of board) */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => toggleChat(true)}
                        className="bg-card rounded-2xl p-3 flex-row items-center justify-between border border-border/50"
                    >
                        <View className="flex-row items-center gap-3">
                            <ChessAvatar size="md" fallback={userColor === 'white' ? 'W' : 'B'} isOnline />
                            <View>
                                <Text className="font-semibold text-foreground">You</Text>
                                <View className="flex-row items-center gap-1">
                                    <Text className="text-sm text-muted-foreground">{userColor?.toUpperCase()}</Text>
                                    <Text className="text-sm text-primary">• Active</Text>
                                </View>
                            </View>
                        </View>
                        <View className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-secondary">
                            <Clock size={16} className="text-muted-foreground" color="hsl(30 15% 75%)" />
                            <Text className="font-mono font-bold text-foreground">{formatTime(gameState.whiteTime)}</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>

            {/* Promotion Modal */}
            <PromotionModal
                visible={isPromotionModalVisible}
                color={gameState.currentTurn}
                onSelect={completePromotion}
            />

            {/* In-Game Chat Overlay */}
            <InGameChat />

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
