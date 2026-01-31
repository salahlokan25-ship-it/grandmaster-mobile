import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Users, Crown, Settings, UserPlus, LogOut, Shield, ShieldCheck, ChevronLeft, Hexagon, MessageSquare } from 'lucide-react-native'
import { TeamService, Team, TeamMember } from '../../lib/teams'
import { useAuthStore } from '../../stores/authStore'
import { ChessAvatar } from '../../components/ui/ChessAvatar'
import { TeamChat } from '../../components/teams/TeamChat'
import { cn } from '../../lib/utils'

export default function TeamDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { profile } = useAuthStore()
  const teamId = params.teamId as string

  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<(TeamMember & { user: any })[]>([])
  const [loading, setLoading] = useState(true)
  const [isChatVisible, setIsChatVisible] = useState(false)

  useEffect(() => {
    if (teamId) {
      loadTeamData()
    }
  }, [teamId])

  const loadTeamData = async () => {
    try {
      setLoading(true)
      const [teamData, teamMembers] = await Promise.all([
        TeamService.getTeamById(teamId),
        TeamService.getTeamMembers(teamId)
      ])

      setTeam(teamData)
      setMembers(teamMembers)
    } catch (error) {
      console.error('Error loading team data:', error)
      Alert.alert('Error', 'Failed to load team data')
    } finally {
      setLoading(false)
    }
  }

  const handleInviteUser = () => {
    router.push(`/teams/invite?teamId=${teamId}`)
  }

  const handleLeaveTeam = async () => {
    Alert.alert(
      'Leave Team',
      'Are you sure you want to leave this team?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await TeamService.removeTeamMember(teamId, profile?.id || '')
              router.back()
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to leave team')
            }
          }
        }
      ]
    )
  }

  if (loading) {
    return (
      <View className="flex-1 bg-[#0c0a09] items-center justify-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-white/40 mt-4 font-black uppercase tracking-widest text-xs">Accessing Encrypted Data...</Text>
      </View>
    )
  }

  if (!team) {
    return (
      <SafeAreaView className="flex-1 bg-[#0c0a09] items-center justify-center p-6">
        <Text className="text-white/60 text-center mb-6">Tactical unit not found in registry.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-stone-900 border border-white/10 px-8 py-4 rounded-2xl"
        >
          <Text className="text-white font-black uppercase">Return to HQ</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  const isOwner = team.owner_id === profile?.id

  return (
    <SafeAreaView className="flex-1 bg-[#0c0a09]" edges={['top']}>
      {/* Premium Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-stone-900 rounded-xl items-center justify-center border border-white/5"
        >
          <ChevronLeft size={20} color="white" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-white font-black text-lg lowercase italic">{team.name}</Text>
          <Text className="text-white/40 text-[8px] uppercase font-black tracking-[3px]">Tactical Detachment</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => setIsChatVisible(true)}
            className="w-10 h-10 bg-stone-900 rounded-xl items-center justify-center border border-white/10"
          >
            <MessageSquare size={18} color="#f59e0b" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => isOwner && router.push(`/teams/${teamId}/settings`)}
            disabled={!isOwner}
            className={cn(
              "w-10 h-10 rounded-xl items-center justify-center border",
              isOwner ? "bg-stone-900 border-white/10" : "bg-transparent border-transparent"
            )}
          >
            {isOwner && <Settings size={18} color="white" />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Team Hero Section */}
        <View className="px-6 mt-6">
          <View className="bg-stone-900/40 rounded-[40px] p-6 border border-white/5 overflow-hidden">
            <View className="flex-row items-center gap-4 mb-4">
              <View className="w-16 h-16 bg-amber-500/10 rounded-3xl items-center justify-center border border-amber-500/20">
                <Users size={32} color="#f59e0b" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-black text-2xl tracking-tight">{team.name}</Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Hexagon size={12} color="#f59e0b" fill="#f59e0b" opacity={0.5} />
                  <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest">Active Division</Text>
                </View>
              </View>
            </View>

            {team.description && (
              <View className="bg-white/5 rounded-2xl p-4 mb-4">
                <Text className="text-white/70 text-sm leading-relaxed italic">{team.description}</Text>
              </View>
            )}

            <View className="flex-row items-center justify-between pt-4 border-t border-white/5">
              <View className="flex-row items-center gap-2">
                <Crown size={14} color="#f59e0b" />
                <Text className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                  Commander: {members.find(m => m.role === 'owner')?.user?.display_name || 'Classified'}
                </Text>
              </View>
              <View className="bg-amber-500/10 px-3 py-1 rounded-full">
                <Text className="text-amber-500 text-[10px] font-black">{members.length} Officers</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Officer Registry (Member List) */}
        <View className="px-6 mt-10">
          <View className="flex-row items-center justify-between mb-6 px-1">
            <View>
              <Text className="text-white font-black text-sm lowercase italic">Officer Registry</Text>
              <Text className="text-white/40 text-[10px] uppercase font-black tracking-[4px] mt-0.5">Deployment Data</Text>
            </View>
            {isOwner && (
              <TouchableOpacity
                onPress={handleInviteUser}
                className="bg-white px-4 py-2 rounded-2xl flex-row items-center gap-2"
              >
                <UserPlus size={14} color="black" />
                <Text className="text-black font-black uppercase text-[10px]">Enlist</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="gap-3">
            {members.map((member) => (
              <View
                key={member.id}
                className="bg-stone-900/40 rounded-[32px] p-4 border border-white/5 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-4 flex-1">
                  <ChessAvatar
                    src={member.user?.avatar_url}
                    fallback={member.user?.display_name?.charAt(0) || 'U'}
                    size="md"
                  />
                  <View className="flex-1">
                    <Text className="text-white font-black text-sm lowercase italic">
                      {member.user?.display_name || member.user?.username}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-0.5">
                      <Text className="text-white/30 text-[10px] font-black tracking-widest uppercase">
                        UID: {member.user?.fixed_id}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className={cn(
                  "px-3 py-1.5 rounded-full border flex-row items-center gap-1.5",
                  member.role === 'owner' ? "bg-amber-500/10 border-amber-500/20" :
                    member.role === 'admin' ? "bg-purple-500/10 border-purple-500/20" :
                      "bg-white/5 border-white/10"
                )}>
                  {member.role === 'owner' ? <Crown size={10} color="#f59e0b" /> :
                    member.role === 'admin' ? <ShieldCheck size={10} color="#a855f7" /> :
                      <Shield size={10} color="rgba(255,255,255,0.4)" />}
                  <Text className={cn(
                    "text-[8px] font-black uppercase tracking-widest",
                    member.role === 'owner' ? "text-amber-500" :
                      member.role === 'admin' ? "text-purple-500" : "text-white/40"
                  )}>
                    {member.role}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Departure Protocol */}
        {!isOwner && (
          <View className="px-6 mt-12 mb-10">
            <TouchableOpacity
              onPress={handleLeaveTeam}
              className="flex-row items-center justify-center gap-3 p-6 rounded-[32px] bg-red-500/10 border border-red-500/20 active:bg-red-500/20"
            >
              <LogOut size={20} color="#ef4444" />
              <Text className="text-red-500 font-black uppercase tracking-[2px] text-xs italic">Decommission Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {team && (
        <TeamChat
          isVisible={isChatVisible}
          onClose={() => setIsChatVisible(false)}
          teamId={teamId}
          teamName={team.name}
        />
      )}
    </SafeAreaView>
  )
}
