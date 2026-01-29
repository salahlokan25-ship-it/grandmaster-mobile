import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plus, Users, Clock, CheckCircle, XCircle } from 'lucide-react-native'
import { TeamService, Team, TeamInvitation } from '../../lib/teams'
import { useAuthStore } from '../../stores/authStore'

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
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Loading teams...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Teams</Text>
        <Text className="text-gray-600 text-sm">Manage your chess teams</Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Your User ID */}
        <View className="bg-blue-50 rounded-lg p-4 mt-6 mb-6">
          <Text className="text-blue-800 font-medium mb-2">Your User ID</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-blue-900 font-mono text-lg">{profile?.fixed_id || 'Loading...'}</Text>
            <TouchableOpacity
              onPress={() => {
                if (profile?.fixed_id) {
                  // Copy to clipboard - you'd implement expo-clipboard here
                  Alert.alert('Copied', 'User ID copied to clipboard!')
                }
              }}
              className="bg-blue-200 px-3 py-1 rounded"
            >
              <Text className="text-blue-800 text-sm">Copy</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-blue-700 text-xs mt-2">
            Share this ID with others to invite you to their teams
          </Text>
        </View>

        {/* Create Team Button */}
        <TouchableOpacity
          onPress={() => router.push('/teams/create')}
          className="bg-blue-500 rounded-lg p-4 mb-6 flex-row items-center justify-center"
        >
          <Plus size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Create New Team</Text>
        </TouchableOpacity>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Pending Invitations ({invitations.length})
            </Text>
            {invitations.map((invitation) => (
              <View key={invitation.id} className="bg-gray-50 rounded-lg p-4 mb-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900">
                      {invitation.team?.name || 'Unknown Team'}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      From: {invitation.inviter?.display_name || invitation.inviter?.username}
                    </Text>
                    {invitation.message && (
                      <Text className="text-gray-500 text-sm mt-1">
                        "{invitation.message}"
                      </Text>
                    )}
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleAcceptInvitation(invitation.id)}
                      className="bg-green-100 p-2 rounded-full"
                    >
                      <CheckCircle size={16} color="#10B981" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeclineInvitation(invitation.id)}
                      className="bg-red-100 p-2 rounded-full"
                    >
                      <XCircle size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Your Teams */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Your Teams ({teams.length})
          </Text>
          {teams.length === 0 ? (
            <View className="bg-gray-50 rounded-lg p-6 items-center">
              <Users size={48} color="#9CA3AF" />
              <Text className="text-gray-600 mt-3 text-center">
                No teams yet. Create a team or wait for invitations.
              </Text>
            </View>
          ) : (
            teams.map((team) => (
              <TouchableOpacity
                key={team.id}
                onPress={() => router.push(`/teams/${team.id}`)}
                className="bg-gray-50 rounded-lg p-4 mb-3"
              >
                <Text className="font-medium text-gray-900">{team.name}</Text>
                {team.description && (
                  <Text className="text-gray-600 text-sm mt-1">{team.description}</Text>
                )}
                <View className="flex-row items-center mt-2">
                  <Users size={16} color="#6B7280" />
                  <Text className="text-gray-500 text-sm ml-1">View members</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Invite User Button */}
        <TouchableOpacity
          onPress={() => router.push('/teams/invite')}
          className="bg-green-500 rounded-lg p-4 mt-6 mb-6 flex-row items-center justify-center"
        >
          <Users size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Invite User</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
