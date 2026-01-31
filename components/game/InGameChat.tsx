import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { X, Send } from 'lucide-react-native';
import { useGameStore } from '../../stores/gameStore';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

export function InGameChat() {
    const { isChatVisible, toggleChat, messages, onlineGameId } = useGameStore();
    const { user } = useAuthStore();
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const sendMessage = async () => {
        if (!inputText.trim() || !onlineGameId || !user) return;

        const { error } = await supabase.from('game_messages').insert({
            game_id: onlineGameId,
            sender_id: user.id,
            content: inputText.trim(),
        });

        if (error) {
            console.error('[InGameChat] Error sending message:', error);
        } else {
            setInputText('');
        }
    };

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages, isChatVisible]);

    if (!isChatVisible) return null;

    return (
        <Modal
            visible={isChatVisible}
            transparent
            animationType="slide"
            onRequestClose={() => toggleChat(false)}
        >
            <View className="flex-1 justify-end">
                {/* Backdrop to close */}
                <TouchableOpacity
                    className="absolute inset-0 bg-black/40"
                    activeOpacity={1}
                    onPress={() => toggleChat(false)}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="w-full"
                >
                    <View className="bg-stone-900 border-t border-white/10 rounded-t-[40px] px-6 pt-4 pb-10 shadow-2xl overflow-hidden">
                        {/* Glassmorphism background effect */}
                        <View className="absolute inset-0 bg-stone-900/80" />

                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-4 mt-2">
                            <View>
                                <Text className="text-white text-xl font-black italic lowercase">Tactical Comms</Text>
                                <Text className="text-amber-500/60 text-[8px] uppercase font-black tracking-[2px]">Encrypted Channel</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => toggleChat(false)}
                                className="w-10 h-10 items-center justify-center rounded-full bg-white/5"
                            >
                                <X size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Messages Area */}
                        <ScrollView
                            ref={scrollViewRef}
                            className="h-80 mb-4"
                            showsVerticalScrollIndicator={false}
                        >
                            {messages.length === 0 ? (
                                <View className="flex-1 items-center justify-center py-20">
                                    <Text className="text-white/20 text-[10px] uppercase font-bold tracking-[3px]">Secure link established</Text>
                                </View>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMe = msg.sender_id === user?.id;
                                    return (
                                        <View
                                            key={msg.id}
                                            className={cn(
                                                "max-w-[80%] mb-3 px-4 py-3 rounded-2xl",
                                                isMe
                                                    ? "self-end bg-amber-600 rounded-tr-none"
                                                    : "self-start bg-white/10 rounded-tl-none"
                                            )}
                                        >
                                            <Text className={cn("text-sm font-medium", isMe ? "text-white" : "text-stone-300")}>
                                                {msg.content}
                                            </Text>
                                            <Text className={cn("text-[8px] mt-1 uppercase font-bold opacity-40", isMe ? "text-white" : "text-stone-400")}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </View>
                                    );
                                })
                            )}
                        </ScrollView>

                        {/* Input Area */}
                        <View className="flex-row items-center gap-2">
                            <View className="flex-1 bg-white/5 rounded-2xl px-4 flex-row items-center border border-white/5 h-12">
                                <TextInput
                                    placeholder="Type a message..."
                                    placeholderTextColor="rgba(255,255,255,0.2)"
                                    className="flex-1 text-white text-sm"
                                    value={inputText}
                                    onChangeText={setInputText}
                                    returnKeyType="send"
                                    onSubmitEditing={sendMessage}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={sendMessage}
                                className="bg-amber-600 w-12 h-12 rounded-2xl items-center justify-center shadow-lg"
                            >
                                <Send size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
