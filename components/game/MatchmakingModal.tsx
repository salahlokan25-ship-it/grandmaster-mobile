import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Users, X, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { GameService } from '../../lib/games';
import { useAuthStore } from '../../stores/authStore';

interface MatchmakingModalProps {
    visible: boolean;
    onCancel: () => void;
}

export function MatchmakingModal({ visible, onCancel }: MatchmakingModalProps) {
    const router = useRouter();
    const { user } = useAuthStore();
    const [queueId, setQueueId] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (visible) {
            handleStartSearch();
        } else {
            handleStopSearch();
        }
    }, [visible]);

    const handleStartSearch = async () => {
        setIsSearching(true);
        try {
            const result = await GameService.joinMatchmaking();
            if (result.gameId) {
                // Instantly matched!
                onCancel(); // Close modal
                router.push({
                    pathname: '/(tabs)/game',
                    params: {
                        gameId: result.gameId,
                        color: result.color
                    }
                });
            } else if (result.queueId) {
                setQueueId(result.queueId);
            }
        } catch (error: any) {
            setIsSearching(false);
            Alert.alert('Matchmaking Error', error.message || 'Failed to join queue');
            onCancel();
        }
    };

    const handleStopSearch = async () => {
        if (queueId) {
            await GameService.leaveMatchmaking();
            setQueueId(null);
        }
        setIsSearching(false);
    };

    // Listen for match updates
    useEffect(() => {
        if (!visible || !queueId || !user) return;

        console.log('[MatchmakingModal] Listening for tactical update for queue:', queueId);

        const channel = supabase
            .channel(`matchmaking_${queueId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'matchmaking_queue',
                    filter: `id=eq.${queueId}`
                },
                (payload: any) => {
                    console.log('[MatchmakingModal] Match found!', payload);
                    if (payload.new && payload.new.status === 'matched' && payload.new.matched_game_id) {
                        setQueueId(null);
                        onCancel();
                        router.push({
                            pathname: '/(tabs)/game',
                            params: {
                                gameId: payload.new.matched_game_id,
                                color: 'white' // Waiter is always White in our logic
                            }
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [visible, queueId, user]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View className="flex-1 bg-black/90 items-center justify-center p-6">
                <View className="bg-stone-900 w-full max-w-sm rounded-[44px] p-10 border border-amber-500/30 items-center shadow-2xl">
                    <View className="bg-amber-500/10 w-28 h-28 rounded-full items-center justify-center mb-8 border border-amber-500/20 shadow-lg shadow-amber-500/10">
                        <ActivityIndicator size="large" color="#f59e0b" />
                    </View>

                    <Text className="text-white text-3xl font-black italic lowercase tracking-tight mb-3">Searching...</Text>
                    <Text className="text-white/40 text-center font-bold text-xs uppercase tracking-[4px] mb-10 leading-5 px-4">
                        Establishing tactical link with available commanders
                    </Text>

                    <TouchableOpacity
                        onPress={onCancel}
                        className="bg-stone-800 px-10 py-4 rounded-2xl border border-white/5 active:bg-stone-700"
                    >
                        <Text className="text-white/60 font-black text-xs uppercase tracking-[3px]">Abort Mission</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
