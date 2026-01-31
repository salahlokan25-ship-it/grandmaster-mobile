import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plus, Users, Clock, CheckCircle, XCircle, ChevronRight, Shield, Copy, Bell } from 'lucide-react-native'
import { TeamService, Team, TeamInvitation } from '../../lib/teams'
import { useAuthStore } from '../../stores/authStore'
import { cn } from '../../lib/utils'
import * as Clipboard from 'expo-clipboard'

export default function TeamsScreen() {
  const router = useRouter()
  const { profile } = useAuthStore()
  const [teams, setTeams] = useState<Team[]>([])
  const [invitations, setInvitations] = useState<TeamInvitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [userTeams, userInvitations] = await Promise.all([
        TeamService.getUserTeams(),
        TeamService.getUserInvitations()
      ])

      setTeams(userTeams.map(item => item.team))
      setInvitations(userInvitations)
    } catch (error) {
      console.error('Error loading teams data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await TeamService.acceptInvitation(invitationId)
      await loadData() // Refresh data
      Alert.alert('Success', 'You joined the team!')
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to join team')
    }
  }

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      await TeamService.declineInvitation(invitationId)
      await loadData() // Refresh data
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to decline invitation')
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-[#0c0a09] items-center justify-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-white/40 mt-4 font-black uppercase tracking-widest text-xs">Synchronizing Neural Network...</Text>
      </View>
    )
  }

  const copyId = async () => {
    if (profile?.fixed_id) {
      await Clipboard.setStringAsync(profile.fixed_id)
      Alert.alert('Registry Connection', 'Your Tactical UID has been copied to clipboard.')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0c0a09]" edges={['top']}>
      {/* Executive Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <View>
          <Text className="text-white font-black text-2xl lowercase italic">Tactical Units</Text>
          <Text className="text-white/40 text-[10px] uppercase font-black tracking-[4px]">Command Registry</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/teams/create')}
          className="w-12 h-12 bg-amber-500 rounded-2xl items-center justify-center border border-white/10"
        >
          <Plus size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Your Tactical UID Card */}
        <View className="px-6 mt-6">
          <View className="bg-stone-900/60 rounded-[32px] p-6 border border-white/5">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center">
                  <Shield size={20} color="#f59e0b" />
                </View>
                <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest">Tactical UID</Text>
              </View>
              <TouchableOpacity
                onPress={copyId}
                className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10"
              >
                <Copy size={14} color="white" />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-black text-3xl tracking-[4px]">{profile?.fixed_id || 'CLASSIFIED'}</Text>
              <View className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/20">
                <Text className="text-green-500 text-[10px] font-black uppercase">Active</Text>
              </View>
            </View>
            <Text className="text-white/20 text-[10px] mt-4 leading-relaxed font-bold uppercase tracking-tighter">
              Provide this identifier for external enlistment.
            </Text>
          </View>
        </View>

        {/* Pending Invitations Section */}
        {invitations.length > 0 && (
          <View className="px-6 mt-10">
            <View className="flex-row items-center gap-2 mb-4">
              <Bell size={14} color="#f59e0b" />
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px]">Enlistment Requests</Text>
            </View>
            {invitations.map((invitation) => (
              <View key={invitation.id} className="bg-stone-900/40 rounded-[32px] p-5 border border-white/5 mb-3">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-white font-black text-sm lowercase italic">
                      {invitation.team?.name || 'Unknown Unit'}
                    </Text>
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-0.5">
                      From: {invitation.inviter?.display_name || invitation.inviter?.username}
                    </Text>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleAcceptInvitation(invitation.id)}
                      className="bg-green-500/10 w-10 h-10 rounded-xl items-center justify-center border border-green-500/20"
                    >
                      <CheckCircle size={18} color="#10b981" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeclineInvitation(invitation.id)}
                      className="bg-red-500/10 w-10 h-10 rounded-xl items-center justify-center border border-red-500/20"
                    >
                      <XCircle size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                {invitation.message && (
                  <View className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <Text className="text-white/50 text-[11px] italic leading-relaxed">
                      "{invitation.message}"
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Deployment Section (Your Teams) */}
        <View className="px-6 mt-10">
          <View className="flex-row items-center justify-between mb-6 px-1">
            <View>
              <Text className="text-white font-black text-sm lowercase italic">Active Deployments</Text>
              <Text className="text-white/40 text-[10px] uppercase font-black tracking-[4px] mt-0.5">Unit Registry</Text>
            </View>
            <View className="bg-stone-900 px-3 py-1 rounded-full border border-white/5">
              <Text className="text-white/60 text-[10px] font-black">{teams.length} Groups</Text>
            </View>
          </View>

          {teams.length === 0 ? (
            <View className="bg-stone-900/40 rounded-[40px] p-10 items-center border border-white/5 border-dashed">
              <Users size={48} color="rgba(255,255,255,0.1)" />
              <Text className="text-white/30 mt-4 text-center text-xs font-black uppercase tracking-widest leading-relaxed">
                No tactical deployments found.{"\n"}Initiate creation above.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {teams.map((team) => (
                <TouchableOpacity
                  key={team.id}
                  onPress={() => router.push(`/teams/${team.id}`)}
                  className="bg-stone-900/40 rounded-[32px] p-5 border border-white/5 flex-row items-center justify-between shadow-2xl"
                >
                  <View className="flex-1 pr-4">
                    <Text className="text-white font-black text-sm lowercase italic">{team.name}</Text>
                    <View className="flex-row items-center gap-2 mt-1">
                      <Users size={12} color="#f59e0b" opacity={0.5} />
                      <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest">View Detachment</Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Global Enlistment Protocol */}
        <View className="px-6 mt-12 mb-10">
          <TouchableOpacity
            onPress={() => router.push('/teams/invite')}
            className="flex-row items-center justify-center gap-3 p-6 rounded-[32px] bg-stone-900/60 border border-white/5 active:bg-amber-500/10"
          >
            <Users size={20} color="#f59e0b" />
            <Text className="text-amber-500 font-black uppercase tracking-[2px] text-xs italic">External Enlistment Protocol</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
