import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import {
    Settings, Globe, Trophy, Swords, Star, Lock,
    ChevronRight, TrendingUp, Camera, LogOut,
    ShieldCheck, ClipboardList, Info, Copy,
    BarChart3, Target, Zap
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../stores/authStore';
import { ProfileCard } from '../../components/ProfileCard';
import { PerformanceChart } from '../../components/profile/PerformanceChart';
import { cn } from '../../lib/utils';
import * as Clipboard from 'expo-clipboard';

export default function ProfilePage() {
    const router = useRouter();
    const { user, profile, signOut, isAuthenticated, isLoading, checkAuth } = useAuthStore();
    const [uploading, setUploading] = useState(false);

    // Mock data for initial professional visualization until real history is built
    const mockPerformanceData = {
        onlineHistory: [
            { rating: 1180, date: '1', type: 'online' as const },
            { rating: 1200, date: '2', type: 'online' as const },
            { rating: 1195, date: '3', type: 'online' as const },
            { rating: 1210, date: '4', type: 'online' as const },
            { rating: 1235, date: '5', type: 'online' as const },
            { rating: 1230, date: '6', type: 'online' as const },
            { rating: 1250, date: '7', type: 'online' as const },
        ],
        aiHistory: [
            { rating: 1000, date: '1', type: 'ai' as const },
            { rating: 1050, date: '2', type: 'ai' as const },
            { rating: 1080, date: '3', type: 'ai' as const },
            { rating: 1100, date: '4', type: 'ai' as const },
            { rating: 1150, date: '5', type: 'ai' as const },
        ]
    };

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            router.replace('/(auth)/sign-in');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleLogout = () => {
        Alert.alert('Sign Out', 'Protocol termination. Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Confirm',
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                    router.replace('/(auth)/sign-in');
                }
            }
        ]);
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-[#0c0a09] items-center justify-center">
                <ActivityIndicator size="large" color="#f59e0b" />
            </View>
        );
    }

    if (!profile) return null;

    return (
        <SafeAreaView className="flex-1 bg-[#0c0a09]" edges={['top']}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Executive Header */}
                <View className="px-6 pt-4 flex-row items-center justify-between mb-6">
                    <View>
                        <Text className="text-white font-black text-2xl lowercase italic">Executive Terminal</Text>
                        <Text className="text-white/40 text-[10px] uppercase font-black tracking-[4px]">Commander Profile</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/settings')}
                        className="w-12 h-12 bg-stone-900 rounded-2xl items-center justify-center border border-white/10"
                    >
                        <Settings size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Profile Card */}
                <View className="px-6">
                    <ProfileCard profile={profile} showCopyId={true} />
                </View>

                {/* Performance Analytics Section */}
                <View className="px-6 mt-10">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] ml-1">Tactical Analytics</Text>
                        <View className="flex-row items-center gap-2">
                            <TrendingUp size={12} color="#f59e0b" />
                            <Text className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Rising</Text>
                        </View>
                    </View>

                    <View className="gap-6">
                        <PerformanceChart
                            data={{ onlineHistory: mockPerformanceData.onlineHistory, aiHistory: [] }}
                            title="Global Arena Winrate"
                            lineColor="#f59e0b"
                        />
                        <PerformanceChart
                            data={{ onlineHistory: mockPerformanceData.aiHistory, aiHistory: [] }}
                            title="Neural Network Training"
                            lineColor="#3b82f6"
                        />
                    </View>
                </View>

                {/* Key Metrics Bento */}
                <View className="px-6 mt-10">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4 ml-1">Key Metrics</Text>
                    <View className="flex-row gap-4 h-40">
                        <View className="flex-1 bg-stone-900/60 rounded-[32px] p-5 border border-white/5 justify-between">
                            <View className="w-10 h-10 bg-amber-500/10 rounded-2xl items-center justify-center">
                                <Trophy size={20} color="#f59e0b" />
                            </View>
                            <View>
                                <Text className="text-2xl font-black text-white italic">--</Text>
                                <Text className="text-[10px] text-white/40 font-black uppercase tracking-widest">Win Rate</Text>
                            </View>
                        </View>
                        <View className="flex-1 bg-stone-900/60 rounded-[32px] p-5 border border-white/5 justify-between">
                            <View className="w-10 h-10 bg-blue-500/10 rounded-2xl items-center justify-center">
                                <Zap size={20} color="#3b82f6" />
                            </View>
                            <View>
                                <Text className="text-2xl font-black text-white italic">1200</Text>
                                <Text className="text-[10px] text-white/40 font-black uppercase tracking-widest">Global ELO</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Command Center Options */}
                <View className="px-6 mt-10">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4 ml-1">Command Center</Text>
                    <View className="bg-stone-900/40 rounded-[40px] border border-white/5 overflow-hidden">
                        {[
                            { icon: Globe, label: 'Arena Rankings', route: '/leaderboard', color: '#f59e0b' },
                            { icon: Swords, label: 'Battle History', route: '/history', color: '#ef4444' },
                            { icon: ShieldCheck, label: 'Security & Privacy', route: '/settings', color: '#10b981' },
                            { icon: Info, label: 'About Strategos', route: '/about', color: '#a8a29e' },
                        ].map((item, i, arr) => (
                            <TouchableOpacity
                                key={item.label}
                                onPress={() => item.route && router.push(item.route as any)}
                                className={cn(
                                    "flex-row items-center gap-4 p-5",
                                    i !== arr.length - 1 && "border-b border-white/5"
                                )}
                            >
                                <View style={{ backgroundColor: `${item.color}15` }} className="w-11 h-11 rounded-[18px] items-center justify-center">
                                    <item.icon size={20} color={item.color} />
                                </View>
                                <Text className="flex-1 text-white font-black text-sm lowercase italic">{item.label}</Text>
                                <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Sign Out Section */}
                <View className="px-6 mt-10 mb-10">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center justify-center gap-3 p-6 rounded-[32px] bg-red-500/10 border border-red-500/20 active:bg-red-500/20"
                    >
                        <LogOut size={20} color="#ef4444" />
                        <Text className="text-red-500 font-black uppercase tracking-[2px] text-xs italic">Terminate Session</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
