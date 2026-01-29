import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import { Share2, Clock, Trophy, X, ChevronRight, History, Play, Share } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { PieceColor } from '../../types/chess';
import { useGameStore } from '../../stores/gameStore';
import { useAuthStore } from '../../stores/authStore';

interface GameOverModalProps {
    visible: boolean;
    onClose: () => void;
    winner: PieceColor | 'draw' | null;
    onRematch: () => void;
    opponent?: {
        id: string;
        username: string;
        fixed_id: string;
    } | null;
}

export function GameOverModal({ visible, onClose, winner, onRematch, opponent }: GameOverModalProps) {
    const { gameState, gameMode, aiDifficulty } = useGameStore();
    const { profile } = useAuthStore();
    const [requestSent, setRequestSent] = React.useState(false);

    const handleCopyOpponentId = async () => {
        if (opponent?.fixed_id) {
            const Clipboard = (await import('expo-clipboard')).default;
            await Clipboard.setStringAsync(opponent.fixed_id);
            // In a real app, show a toast here
        }
    };

    const handleAddFriend = async () => {
        // Friend functionality would be implemented with Supabase
        setRequestSent(true);
    };

    const handleShareStory = () => {
        // Share functionality would be implemented with Supabase
        onClose();
    };

    const handleSharePost = () => {
        // Share functionality would be implemented with Supabase
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

                    {/* Opponent Social Section (Online Only) */}
                    {gameMode === 'online' && opponent && (
                        <View className="bg-amber-500/5 rounded-3xl p-6 mb-6 border border-amber-500/10">
                            <View className="flex-row items-center justify-between mb-4">
                                <View>
                                    <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Opponent UID</Text>
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-amber-500 font-mono text-xl font-bold tracking-widest leading-none">
                                            {opponent.fixed_id}
                                        </Text>
                                        <TouchableOpacity onPress={handleCopyOpponentId} className="bg-amber-500/10 p-2 rounded-lg">
                                            <Share2 size={14} color="#f59e0b" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={handleAddFriend}
                                    disabled={requestSent}
                                    className={`px-5 py-3 rounded-xl border ${requestSent ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500 border-amber-600 shadow-lg shadow-amber-500/30'}`}
                                >
                                    <Text className={`font-bold text-xs uppercase tracking-widest ${requestSent ? 'text-green-500' : 'text-black'}`}>
                                        {requestSent ? 'Sent ✓' : 'Add Friend'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Text className="text-white/30 text-[10px] italic">Enjoyed the match? Connect with {opponent.username} for a rematch later!</Text>
                        </View>
                    )}

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
