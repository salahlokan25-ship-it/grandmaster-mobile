import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TeamService } from '../../lib/teams'
import { useAuthStore } from '../../stores/authStore'

export default function CreateTeamScreen() {
  const [teamName, setTeamName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const { profile } = useAuthStore()

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert('Error', 'Please enter a team name')
      return
    }

    setIsLoading(true)
    try {
      await TeamService.createTeam(teamName.trim(), description.trim() || undefined)
      Alert.alert('Success', 'Team created successfully!')
      router.back()
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create team')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-500 text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900 ml-4">Create Team</Text>
        </View>

        <View className="flex-1 px-6 py-6">
          <View className="space-y-6">
            <View>
              <Text className="text-gray-700 font-medium mb-2">Team Name *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                value={teamName}
                onChangeText={setTeamName}
                placeholder="Enter team name"
                maxLength={50}
              />
              <Text className="text-gray-500 text-sm mt-1">
                {teamName.length}/50 characters
              </Text>
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Description (Optional)</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 h-24 text-gray-900"
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your team..."
                multiline
                textAlignVertical="top"
                maxLength={200}
              />
              <Text className="text-gray-500 text-sm mt-1">
                {description.length}/200 characters
              </Text>
            </View>

            <View className="bg-blue-50 rounded-lg p-4">
              <Text className="text-blue-800 font-medium mb-2">Team Owner</Text>
              <Text className="text-blue-900">{profile?.display_name || profile?.username}</Text>
              <Text className="text-blue-700 text-sm mt-1">
                User ID: {profile?.fixed_id}
              </Text>
            </View>

            <View className="bg-green-50 rounded-lg p-4">
              <Text className="text-green-800 font-medium mb-2">Next Steps</Text>
              <Text className="text-green-700 text-sm">
                After creating your team, you can invite other users by entering their 8-digit User ID.
              </Text>
            </View>
          </View>

          <View className="mt-8 space-y-3">
            <TouchableOpacity
              className={`bg-blue-500 rounded-lg py-4 ${isLoading ? 'opacity-50' : ''}`}
              onPress={handleCreateTeam}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-semibold">
                {isLoading ? 'Creating...' : 'Create Team'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border border-gray-300 rounded-lg py-4"
              onPress={() => router.back()}
            >
              <Text className="text-gray-700 text-center font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
