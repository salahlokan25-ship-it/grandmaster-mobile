import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Users, Crown, Settings, UserPlus, LogOut } from 'lucide-react-native'
import { TeamService, Team, TeamMember } from '../../lib/teams'
import { useAuthStore } from '../../stores/authStore'

export default function TeamDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { profile } = useAuthStore()
  const teamId = params.teamId as string

  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<(TeamMember & { user: any })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (teamId) {
      loadTeamData()
    }
  }, [teamId])

  const loadTeamData = async () => {
    try {
      const teamMembers = await TeamService.getTeamMembers(teamId)
      setMembers(teamMembers)
      
      // For now, create a basic team object from the first member
      // In a real implementation, you'd fetch team details separately
      if (teamMembers.length > 0) {
        setTeam({
          id: teamId,
          name: 'Team Name', // This would come from a separate API call
          description: 'Team description',
          owner_id: teamMembers.find(m => m.role === 'owner')?.user_id || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
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
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Loading team...</Text>
      </SafeAreaView>
    )
  }

  if (!team) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">Team not found</Text>
      </SafeAreaView>
    )
  }

  const isOwner = team.owner_id === profile?.id

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-500 text-lg">← Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-900 ml-4">{team.name}</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Team Info */}
        <View className="bg-gray-50 rounded-lg p-4 mb-6">
          <Text className="font-semibold text-gray-900 text-lg mb-2">{team.name}</Text>
          {team.description && (
            <Text className="text-gray-600 mb-3">{team.description}</Text>
          )}
          <View className="flex-row items-center">
            <Crown size={16} color="#F59E0B" />
            <Text className="text-gray-700 text-sm ml-2">
              Owner: {members.find(m => m.role === 'owner')?.user?.display_name || 'Unknown'}
            </Text>
          </View>
        </View>

        {/* Team Members */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-900">
              Members ({members.length})
            </Text>
            {isOwner && (
              <TouchableOpacity
                onPress={handleInviteUser}
                className="bg-blue-500 px-3 py-1 rounded-full flex-row items-center"
              >
                <UserPlus size={16} color="white" />
                <Text className="text-white font-medium ml-1">Invite</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="space-y-3">
            {members.map((member) => (
              <View key={member.id} className="bg-gray-50 rounded-lg p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
                      <Text className="text-white font-bold">
                        {member.user?.display_name?.charAt(0).toUpperCase() || 
                         member.user?.username?.charAt(0).toUpperCase() || 'U'}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-gray-900">
                        {member.user?.display_name || member.user?.username}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        ID: {member.user?.fixed_id}
                      </Text>
                    </View>
                  </View>
                  
                  <View className={`px-2 py-1 rounded-full ${
                    member.role === 'owner' ? 'bg-yellow-100' : 
                    member.role === 'admin' ? 'bg-purple-100' : 'bg-gray-200'
                  }`}>
                    <Text className={`text-xs font-medium ${
                      member.role === 'owner' ? 'text-yellow-800' : 
                      member.role === 'admin' ? 'text-purple-800' : 'text-gray-700'
                    }`}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View className="space-y-3">
          {isOwner && (
            <TouchableOpacity
              onPress={() => router.push(`/teams/${teamId}/settings`)}
              className="bg-gray-200 rounded-lg p-4 flex-row items-center justify-center"
            >
              <Settings size={20} color="#374151" />
              <Text className="text-gray-700 font-semibold ml-2">Team Settings</Text>
            </TouchableOpacity>
          )}

          {!isOwner && (
            <TouchableOpacity
              onPress={handleLeaveTeam}
              className="bg-red-100 rounded-lg p-4 flex-row items-center justify-center"
            >
              <LogOut size={20} color="#EF4444" />
              <Text className="text-red-700 font-semibold ml-2">Leave Team</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
