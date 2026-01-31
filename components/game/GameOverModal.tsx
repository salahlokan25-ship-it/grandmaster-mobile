import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import { Share2, Clock, Trophy, X, ChevronRight, History, Play, Share, Sparkles, Frown } from 'lucide-react-native';
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
        avatar_url?: string;
    } | null;
}

export function GameOverModal({ visible, onClose, winner, onRematch, opponent }: GameOverModalProps) {
    const { gameState, gameMode, aiDifficulty, userColor } = useGameStore();
    const { profile } = useAuthStore();
    const [requestSent, setRequestSent] = React.useState(false);

    const isVictory = winner === userColor;
    const isDraw = winner === 'draw';
    const isDefeat = winner && winner !== userColor && winner !== 'draw';

    const handleCopyOpponentId = async () => {
        if (opponent?.fixed_id) {
            const Clipboard = (await import('expo-clipboard')).default;
            await Clipboard.setStringAsync(opponent.fixed_id);
        }
    };

    const handleAddFriend = async () => {
        setRequestSent(true);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/90 items-center justify-center px-6">
                {/* Background Glow */}
                <View className={cn(
                    "absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-20",
                    isVictory ? "bg-amber-500" : isDraw ? "bg-blue-500" : "bg-red-500"
                )} />

                <View className="bg-stone-900 w-full rounded-[48px] overflow-hidden border border-white/10 shadow-2xl">
                    {/* Header Gradient */}
                    <View className={cn(
                        "h-32 items-center justify-center",
                        isVictory ? "bg-amber-500/10" : isDraw ? "bg-stone-800" : "bg-red-500/10"
                    )}>
                        <View className={cn(
                            "w-20 h-20 rounded-full items-center justify-center shadow-2xl",
                            isVictory ? "bg-amber-500" : isDraw ? "bg-stone-700" : "bg-red-500"
                        )}>
                            {isVictory ? (
                                <Trophy size={40} color="black" fill="black" />
                            ) : isDraw ? (
                                <Sparkles size={40} color="white" />
                            ) : (
                                <Frown size={40} color="white" />
                            )}
                        </View>
                    </View>

                    <View className="p-8 pt-6 items-center">
                        <Text className={cn(
                            "text-4xl font-black uppercase tracking-widest italic leading-none mb-2",
                            isVictory ? "text-amber-500" : isDraw ? "text-white" : "text-red-500"
                        )}>
                            {isVictory ? 'Victory' : isDraw ? 'Draw' : 'Defeat'}
                        </Text>
                        <Text className="text-white/40 text-center font-medium leading-5 px-4 mb-8">
                            {isVictory
                                ? 'A masterclass performance. Your rating has increased.'
                                : isDraw
                                    ? 'A stalemate of giants. The battle ends in equality.'
                                    : 'Victory is a poor teacher. Analyze your mistakes to grow.'}
                        </Text>

                        {/* Opponent Identity (Online Only) */}
                        {gameMode === 'online' && opponent && (
                            <View className="w-full bg-stone-800/50 rounded-[32px] p-4 flex-row items-center gap-4 mb-8 border border-white/5">
                                <View className="w-12 h-12 rounded-2xl bg-stone-700 items-center justify-center overflow-hidden">
                                    {opponent.avatar_url ? (
                                        <Image source={{ uri: opponent.avatar_url }} className="w-full h-full" />
                                    ) : (
                                        <Text className="text-white font-black">{opponent.username.charAt(0).toUpperCase()}</Text>
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-black text-sm">{opponent.username}</Text>
                                    <Text className="text-white/40 text-[10px] uppercase font-black tracking-widest">Opponent</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={handleAddFriend}
                                    className={cn(
                                        "px-4 py-2 rounded-xl border",
                                        requestSent ? "bg-green-500/10 border-green-500/20" : "border-white/20"
                                    )}
                                >
                                    <Text className={cn(
                                        "text-[10px] font-black uppercase tracking-widest",
                                        requestSent ? "text-green-500" : "text-white"
                                    )}>
                                        {requestSent ? 'Sent' : 'Add Friend'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Action Buttons */}
                        <View className="w-full gap-4">
                            <TouchableOpacity
                                onPress={onRematch}
                                className={cn(
                                    "w-full h-16 rounded-[24px] flex-row items-center justify-center gap-3 shadow-xl",
                                    isVictory ? "bg-amber-500" : isDraw ? "bg-white" : "bg-red-500"
                                )}
                            >
                                <Play size={20} color={isVictory ? "black" : "black"} fill="black" />
                                <Text className="text-black font-black uppercase tracking-widest text-sm">New Match</Text>
                            </TouchableOpacity>

                            <View className="flex-row gap-4">
                                <TouchableOpacity className="flex-1 h-14 bg-stone-800 rounded-[20px] flex-row items-center justify-center gap-2 border border-white/5">
                                    <History size={18} color="white" />
                                    <Text className="text-white font-black uppercase tracking-widest text-[10px]">Analyze</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={onClose}
                                    className="flex-1 h-14 bg-stone-800 rounded-[20px] flex-row items-center justify-center gap-2 border border-white/5"
                                >
                                    <X size={18} color="rgba(255,255,255,0.4)" />
                                    <Text className="text-white/40 font-black uppercase tracking-widest text-[10px]">Dismiss</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
