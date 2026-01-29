import React from 'react';
import { View, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import * as Clipboard from 'expo-clipboard';
import { Shield, Copy, Check, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function WelcomeScreen() {
    const router = useRouter();
    const { profile } = useAuthStore();

    const handleCopyId = async () => {
        if (profile?.fixed_id) {
            await Clipboard.setStringAsync(profile.fixed_id);
            Alert.alert('Copied', 'User ID copied to clipboard!');
        }
    };

    const handleContinue = () => {
        router.replace('/(tabs)/');
    };

    if (!profile) return null;

    return (
        <SafeAreaView className="flex-1 bg-[#0c0a09] items-center justify-center p-6">
            <Animated.View
                entering={FadeInUp.delay(200)}
                className="w-full max-w-sm items-center"
            >
                {/* Icon Container */}
                <View className="mb-8 relative">
                    <View className="absolute inset-0 bg-amber-500 blur-2xl opacity-20 transform scale-150" />
                    <View className="w-24 h-24 bg-stone-900 rounded-3xl border border-white/10 items-center justify-center shadow-2xl">
                        <Shield size={48} color="#f59e0b" fill="#f59e0b" />
                    </View>
                </View>

                {/* Title & Description */}
                <Text className="text-3xl font-black text-white text-center mb-3">
                    Welcome, Commander
                </Text>
                <Text className="text-white/50 text-center font-medium mb-12 leading-6">
                    Your strategic journey begins now. This is your unique identity for teams and tournaments.
                </Text>

                {/* ID Card */}
                <Animated.View
                    entering={FadeInDown.delay(400)}
                    className="w-full bg-stone-900/80 rounded-[32px] p-1 border border-white/10 mb-8"
                >
                    <View className="bg-black/40 rounded-[28px] p-6 items-center">
                        <Text className="text-white/30 text-xs font-black uppercase tracking-[4px] mb-4">
                            Your Officer UID
                        </Text>

                        <View className="flex-row items-center justify-center gap-3">
                            <Text className="text-4xl font-mono font-black text-amber-500 tracking-widest leading-tight">
                                {profile.fixed_id || '--------'}
                            </Text>
                        </View>

                        <View className="w-full h-[1px] bg-white/5 my-6" />

                        <TouchableOpacity
                            onPress={handleCopyId}
                            className="flex-row items-center gap-2 bg-white/5 px-5 py-3 rounded-full border border-white/5 active:bg-white/10"
                        >
                            <Copy size={16} color="rgba(255,255,255,0.6)" />
                            <Text className="text-white/60 font-bold text-sm">Copy ID to Clipboard</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Continue Button */}
                <Animated.View
                    entering={FadeInDown.delay(600)}
                    className="w-full"
                >
                    <TouchableOpacity
                        onPress={handleContinue}
                        className="w-full bg-amber-500 h-16 rounded-[24px] flex-row items-center justify-center gap-3 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
                    >
                        <Text className="text-black font-black text-lg uppercase tracking-wide">
                            Enter Headquarters
                        </Text>
                        <ArrowRight size={24} color="black" strokeWidth={2.5} />
                    </TouchableOpacity>
                </Animated.View>

            </Animated.View>
        </SafeAreaView>
    );
}
