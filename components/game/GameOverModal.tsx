import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import { Share2, Clock, Trophy, X, ChevronRight, History, Play, Share } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { PieceColor } from '../../types/chess';
import { useSocialStore } from '../../stores/socialStore';
import { useGameStore } from '../../stores/gameStore';

interface GameOverModalProps {
    visible: boolean;
    onClose: () => void;
    winner: PieceColor | 'draw' | null;
    onRematch: () => void;
}

export function GameOverModal({ visible, onClose, winner, onRematch }: GameOverModalProps) {
    const { addStory, addPost } = useSocialStore();
    const { gameState, gameMode, aiDifficulty } = useGameStore();

    const handleShareStory = () => {
        addStory({
            type: 'game_result',
            content: 'FEN_PLACEHOLDER', // In a real app, capture current FEN
            result: {
                winner: winner || 'draw',
                opponent: gameMode === 'ai' ? `AI (${aiDifficulty})` : 'Opponent',
                gameType: 'Blitz 5+0',
            },
        });
        onClose();
    };

    const handleSharePost = () => {
        addPost({
            content: `Just finished a great game of Strategos! ${winner === 'white' ? 'Victory is mine! 🎉' : winner === 'draw' ? "It's a draw! 🤝" : 'Tough loss, but I learned a lot. ♟️'}`,
            gameFen: 'FEN_PLACEHOLDER',
        });
        onClose();
    };

    const isVictory = winner === 'white';
    const isDraw = winner === 'draw';

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/60 items-center justify-end">
                <View className="bg-card w-full rounded-t-[40px] p-8 pb-12 border-t border-border/50">
                    {/* Close Handle */}
                    <View className="w-12 h-1.5 bg-secondary rounded-full self-center mb-8" />

                    {/* Result Icon */}
                    <View className="items-center mb-6">
                        <View className={cn(
                            "w-24 h-24 rounded-full items-center justify-center mb-4",
                            isVictory ? "bg-amber-600/20" : isDraw ? "bg-primary/20" : "bg-destructive/20"
                        )}>
                            <Trophy size={48} color={isVictory ? "#f59e0b" : isDraw ? "#f97316" : "#ef4444"} />
                        </View>
                        <Text className="text-3xl font-bold text-foreground">
                            {isVictory ? 'Victory!' : isDraw ? 'Draw!' : 'Defeat!'}
                        </Text>
                        <Text className="text-muted-foreground mt-1">
                            {isVictory ? 'Splendid performance, grandmaster.' : isDraw ? 'A hard-fought battle.' : 'Every loss is a lesson.'}
                        </Text>
                    </View>

                    {/* Sharing Section */}
                    <View className="bg-secondary/30 rounded-3xl p-6 mb-8 border border-border/30">
                        <Text className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 text-center">Share your masterpiece</Text>
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={handleShareStory}
                                className="flex-1 bg-primary h-14 rounded-2xl flex-row items-center justify-center gap-2"
                            >
                                <Share2 size={20} color="white" />
                                <Text className="text-primary-foreground font-bold">Story</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleSharePost}
                                className="flex-1 bg-card h-14 rounded-2xl flex-row items-center justify-center gap-2 border border-border/50"
                            >
                                <Share size={20} color="hsl(30 15% 75%)" />
                                <Text className="text-foreground font-bold">Post</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="gap-3">
                        <TouchableOpacity
                            onPress={onRematch}
                            className="w-full h-16 bg-foreground rounded-2xl flex-row items-center justify-center gap-3"
                        >
                            <Play size={20} color="hsl(30 20% 10%)" fill="hsl(30 20% 10%)" />
                            <Text className="text-background font-bold text-lg">New Match</Text>
                        </TouchableOpacity>

                        <View className="flex-row gap-3">
                            <TouchableOpacity className="flex-1 h-14 bg-secondary/50 rounded-2xl flex-row items-center justify-center gap-2">
                                <History size={18} color="hsl(30 15% 75%)" />
                                <Text className="text-muted-foreground font-semibold">Analyze</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onClose}
                                className="flex-1 h-14 bg-secondary/50 rounded-2xl flex-row items-center justify-center gap-2"
                            >
                                <X size={18} color="hsl(30 15% 75%)" />
                                <Text className="text-muted-foreground font-semibold">Skip</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
