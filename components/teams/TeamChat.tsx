import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { X, Send, Shield, MessageSquare } from 'lucide-react-native';
import { useAuthStore } from '../../stores/authStore';
import { TeamService, TeamMessage } from '../../lib/teams';
import { ChessAvatar } from '../ui/ChessAvatar';
import { cn } from '../../lib/utils';

interface TeamChatProps {
    isVisible: boolean;
    onClose: () => void;
    teamId: string;
    teamName: string;
}

export function TeamChat({ isVisible, onClose, teamId, teamName }: TeamChatProps) {
    const { profile } = useAuthStore();
    const [messages, setMessages] = useState<TeamMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (isVisible) {
            loadMessages();
            const subscription = TeamService.subscribeToTeamMessages(teamId, (message) => {
                setMessages((prev) => [...prev, message]);
            });

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [isVisible, teamId]);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages, isVisible]);

    const loadMessages = async () => {
        setIsLoading(true);
        try {
            const history = await TeamService.getTeamMessages(teamId);
            setMessages(history);
        } catch (error) {
            console.error('[TeamChat] Error loading messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim() || !profile) return;

        const text = inputText.trim();
        setInputText(''); // Optimistic clear

        try {
            await TeamService.sendTeamMessage(teamId, text);
        } catch (error) {
            console.error('[TeamChat] Error sending message:', error);
            // Optionally restore text on failure
        }
    };

    if (!isVisible) return null;

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end">
                {/* Backdrop to close */}
                <TouchableOpacity
                    className="absolute inset-0 bg-black/60"
                    activeOpacity={1}
                    onPress={onClose}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="w-full"
                >
                    <View className="bg-[#0c0a09] border-t border-white/10 rounded-t-[40px] px-6 pt-4 pb-10 shadow-2xl overflow-hidden h-[80%]">
                        {/* Premium Gradient Background */}
                        <View className="absolute inset-0 bg-stone-900/40" />

                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-6 mt-2">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-amber-500/10 rounded-xl items-center justify-center border border-amber-500/20">
                                    <MessageSquare size={20} color="#f59e0b" />
                                </View>
                                <View>
                                    <Text className="text-white text-xl font-black italic lowercase">{teamName}</Text>
                                    <Text className="text-amber-500/60 text-[8px] uppercase font-black tracking-[4px]">Secure Tactical Comms</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={onClose}
                                className="w-10 h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10"
                            >
                                <X size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Messages Area */}
                        {isLoading ? (
                            <View className="flex-1 items-center justify-center">
                                <ActivityIndicator color="#f59e0b" />
                                <Text className="text-white/20 text-[10px] uppercase font-black tracking-[3px] mt-4">Establishing Uplink...</Text>
                            </View>
                        ) : (
                            <ScrollView
                                ref={scrollViewRef}
                                className="flex-1 mb-6"
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingVertical: 10 }}
                            >
                                {messages.length === 0 ? (
                                    <View className="flex-1 items-center justify-center py-20">
                                        <View className="w-16 h-16 bg-white/5 rounded-3xl items-center justify-center border border-white/5 mb-4">
                                            <Shield size={24} color="rgba(255,255,255,0.1)" />
                                        </View>
                                        <Text className="text-white/20 text-[10px] uppercase font-bold tracking-[3px] text-center">
                                            Encrypted channel ready.{"\n"}Awaiting command transmissions.
                                        </Text>
                                    </View>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isMe = msg.sender_id === profile?.id;
                                        return (
                                            <View
                                                key={msg.id}
                                                className={cn(
                                                    "flex-row mb-6 items-end gap-3",
                                                    isMe ? "justify-end" : "justify-start"
                                                )}
                                            >
                                                {!isMe && (
                                                    <ChessAvatar
                                                        src={msg.sender?.avatar_url}
                                                        fallback={msg.sender?.display_name || msg.sender?.username}
                                                        size="sm"
                                                    />
                                                )}
                                                <View
                                                    className={cn(
                                                        "max-w-[75%] px-4 py-3 rounded-[24px]",
                                                        isMe
                                                            ? "bg-amber-600 rounded-br-none shadow-lg shadow-amber-600/20"
                                                            : "bg-stone-800 rounded-bl-none border border-white/5"
                                                    )}
                                                >
                                                    {!isMe && (
                                                        <Text className="text-[9px] font-black uppercase tracking-widest text-amber-500/60 mb-1">
                                                            {msg.sender?.display_name || msg.sender?.username}
                                                        </Text>
                                                    )}
                                                    <Text className={cn("text-[13px] font-medium leading-5", isMe ? "text-white" : "text-stone-300")}>
                                                        {msg.content}
                                                    </Text>
                                                    <Text className={cn("text-[8px] mt-1 uppercase font-bold text-right", isMe ? "text-white/60" : "text-stone-500")}>
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </Text>
                                                </View>
                                            </View>
                                        );
                                    })
                                )}
                            </ScrollView>
                        )}

                        {/* Input Area */}
                        <View className="flex-row items-center gap-3">
                            <View className="flex-1 bg-stone-800/80 rounded-[24px] px-5 flex-row items-center border border-white/5 h-14">
                                <TextInput
                                    placeholder="Enter directive..."
                                    placeholderTextColor="rgba(255,255,255,0.2)"
                                    className="flex-1 text-white text-sm font-medium"
                                    value={inputText}
                                    onChangeText={setInputText}
                                    returnKeyType="send"
                                    onSubmitEditing={sendMessage}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={sendMessage}
                                className="bg-white w-14 h-14 rounded-[24px] items-center justify-center shadow-xl active:scale-95"
                            >
                                <Send size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
