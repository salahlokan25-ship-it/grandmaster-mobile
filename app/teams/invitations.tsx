import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { CheckCircle, XCircle, Clock, Users, ArrowLeft, Hash, Copy } from 'lucide-react-native'
import { TeamService, TeamInvitation } from '../../lib/teams'
import { useAuthStore } from '../../stores/authStore'
import * as Clipboard from 'expo-clipboard'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'

export default function InvitationsScreen() {
  const router = useRouter()
  const { profile } = useAuthStore()
  const [invitations, setInvitations] = useState<TeamInvitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInvitations()
  }, [])

  const loadInvitations = async () => {
    try {
      const userInvitations = await TeamService.getUserInvitations()
      setInvitations(userInvitations)
    } catch (error) {
      console.error('Error loading invitations:', error)
      Alert.alert('Error', 'Failed to detect incoming transmissions')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await TeamService.acceptInvitation(invitationId)
      await loadInvitations() // Refresh data
      Alert.alert('Success', 'Mission accepted. You have joined the team.')
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to initialize team entry')
    }
  }

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      await TeamService.declineInvitation(invitationId)
      await loadInvitations() // Refresh data
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to abort invitation')
    }
  }

  const copyId = async () => {
    if (profile?.fixed_id) {
      await Clipboard.setStringAsync(profile.fixed_id)
      Alert.alert('Copied', 'Command UID copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-[#0c0a09] items-center justify-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-white/40 font-black uppercase tracking-widest mt-6">Searching Transmissions...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0c0a09]">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center border-b border-white/5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-stone-900 rounded-xl items-center justify-center border border-white/10"
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-black text-lg uppercase tracking-widest ml-4">Tactical Invitations</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Your User ID Dashboard */}
        <Animated.View entering={FadeInUp.delay(200)} className="bg-stone-900/40 rounded-[32px] p-1 border border-white/5 mb-8">
          <View className="bg-black/40 rounded-[28px] p-5">
            <View className="flex-row items-center mb-3">
              <Hash size={12} color="#f59e0b" />
              <Text className="text-white/30 text-[10px] font-black uppercase tracking-[3px] ml-2">Personal Command UID</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-amber-500 font-mono font-black text-2xl tracking-widest leading-none">
                {profile?.fixed_id || '--------'}
              </Text>
              <TouchableOpacity
                onPress={copyId}
                className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 active:bg-white/10"
              >
                <Text className="text-white/60 font-bold text-xs uppercase">Copy</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-white/20 text-[10px] mt-4 font-medium italic">
              Provide this identifier to team owners for recruitment
            </Text>
          </View>
        </Animated.View>

        {/* Invitations List Section */}
        <View className="pb-20">
          <View className="flex-row items-center justify-between mb-6 px-1">
            <Text className="text-white/40 font-black uppercase tracking-[4px] text-[10px]">
              Pending Signals ({invitations.length})
            </Text>
          </View>

          {invitations.length === 0 ? (
            <Animated.View entering={FadeInUp.delay(400)} className="bg-stone-900/20 rounded-[40px] p-10 items-center border border-white/5 border-dashed">
              <View className="w-20 h-20 bg-stone-900 rounded-3xl items-center justify-center border border-white/5 mb-6">
                <Clock size={32} color="rgba(255,255,255,0.2)" />
              </View>
              <Text className="text-white font-black text-xl text-center">No active signals</Text>
              <Text className="text-white/30 mt-2 text-center font-medium leading-5">
                Incoming transmissions from team owners will manifest here.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/teams')}
                className="mt-8 bg-white/5 px-8 py-4 rounded-[20px] border border-white/5 active:bg-white/10"
              >
                <Text className="text-white/60 font-black uppercase tracking-widest text-xs">Access Tactical Board</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View className="gap-4">
              {invitations.map((invitation, index) => (
                <Animated.View
                  key={invitation.id}
                  entering={FadeInDown.delay(400 + index * 100)}
                  className="bg-stone-900/40 rounded-[32px] p-5 border border-white/10"
                >
                  <View className="flex-row items-start justify-between mb-4">
                    <View className="flex-1">
                      <Text className="text-amber-500 font-black text-xl tracking-tight mb-1">
                        {invitation.team?.name || 'Unknown Command'}
                      </Text>
                      <View className="flex-row items-center">
                        <Text className="text-white/40 text-xs font-bold">
                          Origin: {invitation.inviter?.display_name || invitation.inviter?.username}
                        </Text>
                        <Text className="text-white/20 text-xs font-mono ml-2">[{invitation.inviter?.fixed_id}]</Text>
                      </View>
                    </View>
                    <View className="bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/20">
                      <Text className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Active</Text>
                    </View>
                  </View>

                  {invitation.message && (
                    <View className="bg-black/40 rounded-2xl p-4 mb-4 border border-white/5">
                      <Text className="text-white/60 text-sm italic leading-5">
                        "{invitation.message}"
                      </Text>
                    </View>
                  )}

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <View className="w-2 h-2 rounded-full bg-amber-500/50" />
                      <Text className="text-white/30 text-[10px] font-black uppercase tracking-widest">Team Recruitment</Text>
                    </View>

                    <View className="flex-row gap-3">
                      <TouchableOpacity
                        onPress={() => handleDeclineInvitation(invitation.id)}
                        className="w-12 h-12 bg-red-500/10 rounded-2xl items-center justify-center border border-red-500/20"
                      >
                        <XCircle size={24} color="#ef4444" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleAcceptInvitation(invitation.id)}
                        className="bg-emerald-500 px-6 h-12 rounded-2xl flex-row items-center justify-center border border-emerald-500/20"
                      >
                        <CheckCircle size={20} color="black" />
                        <Text className="text-black font-black uppercase tracking-widest text-xs ml-2">Secure</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="mt-4 pt-4 border-t border-white/5">
                    <Text className="text-white/10 text-[9px] font-black uppercase tracking-[2px]">
                      Signal expires: {new Date(invitation.expires_at).toLocaleDateString()}
                    </Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
