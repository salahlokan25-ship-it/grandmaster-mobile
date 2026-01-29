import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import {
    Settings, Edit2, Globe, Trophy, Swords, Star, Lock,
    ChevronRight, TrendingUp, Camera, LogOut, Trash2,
    ShieldCheck, ClipboardList, Info, Copy
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

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            router.replace('/(auth)/sign-in');
        }
    }, [isAuthenticated, isLoading, router]);

    const copyId = async () => {
        if (profile?.fixed_id) {
            await Clipboard.setStringAsync(profile.fixed_id);
            Alert.alert('Copied', 'Your User ID has been copied to clipboard!');
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

        if (!result.canceled && profile) {
            setUploading(true);
            try {
                // Update profile with new avatar URL
                await useAuthStore.getState().updateProfile({
                    avatar_url: result.assets[0].uri
                });
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

    if (!profile) {
        return (
            <SafeAreaView className="flex-1 bg-[#0c0a09] items-center justify-center p-6">
                <Text className="text-white/60 text-center mb-6">Failed to load profile data.</Text>
                <TouchableOpacity
                    onPress={() => checkAuth()}
                    className="bg-amber-500 px-8 py-4 rounded-2xl"
                >
                    <Text className="text-black font-black uppercase">Retry Connection</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#0c0a09]" edges={['top']}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Profile Card with Fixed ID */}
                <View className="px-6 pt-6">
                    <ProfileCard profile={profile} showCopyId={true} />
                </View>

                {/* Quick Stats */}
                <View className="px-6 mt-6">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4 ml-1">Chess Stats</Text>
                    <View className="flex-row gap-3">
                        <View className="flex-1 items-center p-5 rounded-[32px] bg-stone-900/40 border border-white/5">
                            <Text className="text-2xl font-black text-white">--</Text>
                            <Text className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">Win Rate</Text>
                        </View>
                        <View className="flex-1 items-center p-5 rounded-[32px] bg-stone-900/40 border border-white/5">
                            <Text className="text-2xl font-black text-white">0</Text>
                            <Text className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">Games</Text>
                        </View>
                        <View className="flex-1 items-center p-5 rounded-[32px] bg-stone-900/40 border border-white/5">
                            <Text className="text-2xl font-black text-white">1200</Text>
                            <Text className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">Rating</Text>
                        </View>
                    </View>
                </View>

                {/* Team Management */}
                <View className="px-6 mt-10">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4 ml-1">Team Management</Text>
                    <View className="bg-stone-900/40 rounded-[32px] border border-white/5 overflow-hidden">
                        <TouchableOpacity
                            onPress={() => router.push('/teams')}
                            className="flex-row items-center gap-4 p-5 border-b border-white/5"
                        >
                            <View className="w-10 h-10 bg-blue-500/10 rounded-2xl items-center justify-center">
                                <Trophy size={20} color="#3b82f6" />
                            </View>
                            <Text className="flex-1 text-white font-bold text-base">My Teams</Text>
                            <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/teams/invitations')}
                            className="flex-row items-center gap-4 p-5"
                        >
                            <View className="w-10 h-10 bg-amber-500/10 rounded-2xl items-center justify-center">
                                <Copy size={20} color="#f59e0b" />
                            </View>
                            <Text className="flex-1 text-white font-bold text-base">Team Invitations</Text>
                            <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Preferences & Settings */}
                <View className="px-6 mt-10">
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
                <View className="px-6 mt-10 mb-6">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4 ml-1">Account Ops</Text>
                    <View className="gap-3">
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="flex-row items-center justify-center gap-3 p-5 rounded-[24px] bg-stone-900/40 border border-white/5 active:bg-amber-500/10"
                        >
                            <LogOut size={20} color="#f59e0b" />
                            <Text className="text-amber-500 font-black uppercase tracking-widest text-sm">Sign Out Session</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
