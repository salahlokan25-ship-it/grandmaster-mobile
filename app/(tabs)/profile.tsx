import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import {
    Settings, Edit2, Globe, Trophy, Swords, Star, Lock,
    ChevronRight, TrendingUp, Camera, LogOut, Trash2,
    ShieldCheck, ClipboardList, Info, Copy
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '../../stores/userStore';
import { PerformanceChart } from '../../components/profile/PerformanceChart';
import { cn } from '../../lib/utils';
import * as Clipboard from 'expo-clipboard';

export default function ProfilePage() {
    const router = useRouter();
    const {
        currentUser, stats, achievements, matchHistory, performanceHistory,
        updateProfile, logout, deleteAccount
    } = useUserStore();
    const [uploading, setUploading] = useState(false);

    const copyId = async () => {
        if (currentUser.strategoId) {
            await Clipboard.setStringAsync(currentUser.strategoId);
            Alert.alert('Copied', 'Your Strategos ID has been copied to clipboard!');
        }
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera roll permissions to upload a profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setUploading(true);
            try {
                // In a real app, we would upload to Firebase Storage here
                // For now, we'll update the local state with the URI
                updateProfile({ avatar: result.assets[0].uri });
                Alert.alert('Success', 'Profile picture updated!');
            } catch (error) {
                Alert.alert('Error', 'Failed to update profile picture.');
            } finally {
                setUploading(false);
            }
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await logout();
                    router.replace('/auth');
                }
            }
        ]);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This action is permanent and cannot be undone. All your progress will be lost.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Everything',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteAccount();
                        router.replace('/auth');
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0c0a09]" edges={['top']}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Header Backdrop & Info */}
                <View className="relative">
                    <View className="h-48 bg-stone-900 border-b border-white/5" />

                    <View className="px-6 -mt-20">
                        <View className="relative self-start">
                            <View className="w-32 h-32 rounded-[40px] bg-stone-800 overflow-hidden border-4 border-[#0c0a09] shadow-2xl items-center justify-center">
                                {currentUser.avatar ? (
                                    <Image source={{ uri: currentUser.avatar }} className="w-full h-full" />
                                ) : (
                                    <View className="w-full h-full bg-amber-500/10 items-center justify-center">
                                        <Text className="text-5xl">♟️</Text>
                                    </View>
                                )}
                                {uploading && (
                                    <View className="absolute inset-0 bg-black/50 items-center justify-center">
                                        <ActivityIndicator color="#f59e0b" />
                                    </View>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={handlePickImage}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-amber-500 rounded-2xl items-center justify-center border-4 border-[#0c0a09]"
                            >
                                <Camera size={18} color="#0c0a09" strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>

                        <View className="mt-6">
                            <Text className="text-3xl font-black text-white tracking-tight">{currentUser.username}</Text>
                            <View className="flex-row items-center gap-3 mt-2">
                                <View className="bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                                    <Text className="text-amber-500 font-bold text-xs uppercase tracking-widest">{stats.rank}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={copyId}
                                    className="flex-row items-center gap-2 bg-stone-900/50 px-3 py-1 rounded-full border border-white/5"
                                >
                                    <Text className="text-white/40 font-medium tracking-widest text-xs uppercase">UID: {currentUser.strategoId || '———— ————'}</Text>
                                    <Copy size={12} color="rgba(255,255,255,0.4)" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="px-6 mt-10 gap-10">
                    {/* Performance Analysis Section */}
                    <View>
                        <View className="flex-row items-center justify-between mb-4">
                            <View>
                                <Text className="text-xl font-black text-white uppercase tracking-tighter">Performance Analysis</Text>
                                <Text className="text-white/40 text-xs font-medium uppercase tracking-widest mt-1">AI vs Online Evolution</Text>
                            </View>
                            <View className="flex-row items-center gap-2 bg-stone-900 px-3 py-1.5 rounded-xl border border-white/5">
                                <Trophy size={14} color="#f59e0b" />
                                <Text className="text-white font-bold">{stats.elo}</Text>
                            </View>
                        </View>

                        <PerformanceChart data={performanceHistory} />

                        <View className="flex-row gap-4 mt-4">
                            <View className="flex-1 bg-stone-900/40 p-4 rounded-3xl border border-white/5">
                                <Text className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">AI Record</Text>
                                <Text className="text-blue-400 text-lg font-black">{stats.aiWins}<Text className="text-white/20">W</Text> {stats.aiLosses}<Text className="text-white/20">L</Text></Text>
                            </View>
                            <View className="flex-1 bg-stone-900/40 p-4 rounded-3xl border border-white/5">
                                <Text className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Online Record</Text>
                                <Text className="text-amber-500 text-lg font-black">{stats.onlineWins}<Text className="text-white/20">W</Text> {stats.onlineLosses}<Text className="text-white/20">L</Text></Text>
                            </View>
                        </View>
                    </View>

                    {/* Stats Grid */}
                    <View className="flex-row gap-3">
                        <View className="flex-1 items-center p-5 rounded-[32px] bg-stone-900/40 border border-white/5">
                            <Text className="text-2xl font-black text-white">{stats.winRate}%</Text>
                            <Text className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">Win Rate</Text>
                        </View>
                        <View className="flex-1 items-center p-5 rounded-[32px] bg-stone-900/40 border border-white/5">
                            <Text className="text-2xl font-black text-white">{stats.gamesPlayed}</Text>
                            <Text className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">Battles</Text>
                        </View>
                        <View className="flex-1 items-center p-5 rounded-[32px] bg-stone-900/40 border border-white/5">
                            <Text className="text-2xl font-black text-white">{stats.puzzlesSolved}</Text>
                            <Text className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">Puzzles</Text>
                        </View>
                    </View>

                    {/* Preferences & Settings */}
                    <View>
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4 ml-1">Preferences & Gear</Text>
                        <View className="bg-stone-900/40 rounded-[32px] border border-white/5 overflow-hidden">
                            <TouchableOpacity
                                onPress={() => router.push('/onboarding')}
                                className="flex-row items-center gap-4 p-5 border-b border-white/5"
                            >
                                <View className="w-10 h-10 bg-blue-500/10 rounded-2xl items-center justify-center">
                                    <ClipboardList size={20} color="#3b82f6" />
                                </View>
                                <Text className="flex-1 text-white font-bold text-base">Edit Onboarding Quiz</Text>
                                <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center gap-4 p-5 border-b border-white/5">
                                <View className="w-10 h-10 bg-amber-500/10 rounded-2xl items-center justify-center">
                                    <ShieldCheck size={20} color="#f59e0b" />
                                </View>
                                <Text className="flex-1 text-white font-bold text-base">App Privacy & Security</Text>
                                <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center gap-4 p-5">
                                <View className="w-10 h-10 bg-stone-500/10 rounded-2xl items-center justify-center">
                                    <Info size={20} color="rgba(255,255,255,0.4)" />
                                </View>
                                <Text className="flex-1 text-white font-bold text-base">About Strategos</Text>
                                <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Account Management */}
                    <View>
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4 ml-1">Account Ops</Text>
                        <View className="gap-3">
                            <TouchableOpacity
                                onPress={handleLogout}
                                className="flex-row items-center justify-center gap-3 p-5 rounded-[24px] bg-stone-900/40 border border-white/5 active:bg-amber-500/10"
                            >
                                <LogOut size={20} color="#f59e0b" />
                                <Text className="text-amber-500 font-black uppercase tracking-widest text-sm">Sign Out Session</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleDeleteAccount}
                                className="flex-row items-center justify-center gap-3 p-5 rounded-[24px] bg-red-500/5 border border-red-500/10 active:bg-red-500/20"
                            >
                                <Trash2 size={20} color="#ef4444" />
                                <Text className="text-red-500 font-black uppercase tracking-widest text-sm">Delete Shadow Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
