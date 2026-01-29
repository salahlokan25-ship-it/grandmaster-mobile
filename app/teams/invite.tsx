import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { TeamService } from '../../lib/teams'
import { useAuthStore } from '../../stores/authStore'
import { ArrowLeft, Send, UserPlus, Info, Hash } from 'lucide-react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'

export default function InviteUserScreen() {
  const [userId, setUserId] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const params = useLocalSearchParams()
  const { profile } = useAuthStore()

  const handleSendInvitation = async () => {
    // Validate that user ID is numeric and support 8-10 digits
    if (!/^\d{8,10}$/.test(userId.trim())) {
      Alert.alert('Error', 'Command ID must be between 8 and 10 digits')
      return
    }

    setIsLoading(true)
    try {
      const teamId = params.teamId as string

      if (!teamId) {
        Alert.alert('Error', 'Team ID is required')
        return
      }

      await TeamService.sendTeamInvitation(teamId, userId.trim(), message || undefined)
      Alert.alert('Success', 'Officer recruitment invitation sent!')
      router.back()
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send invitation')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0c0a09]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1 px-6 pt-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-stone-900 rounded-xl items-center justify-center border border-white/10"
            >
              <ArrowLeft size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-black text-lg uppercase tracking-widest">Recruit Officer</Text>
            <View className="w-10" />
          </View>

          <Animated.View entering={FadeInUp.delay(200)}>
            <View className="items-center mb-10">
              <View className="w-20 h-20 bg-amber-500/10 rounded-[28px] items-center justify-center border border-amber-500/20 mb-4">
                <UserPlus size={32} color="#f59e0b" />
              </View>
              <Text className="text-white text-2xl font-black text-center">Team Expansion</Text>
              <Text className="text-white/40 text-center font-medium mt-1">
                Enter the unique command ID to send an invitation
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)} className="space-y-6">
            <View>
              <View className="flex-row items-center mb-2 ml-1">
                <Hash size={12} color="#f59e0b" />
                <Text className="text-white/40 font-black uppercase tracking-[2px] text-[10px] ml-2">Target User UID</Text>
              </View>
              <View className="flex-row items-center bg-stone-900/50 border border-white/10 rounded-2xl px-4 py-4 focus:border-amber-500/50">
                <TextInput
                  className="flex-1 text-white font-mono font-black text-xl tracking-widest"
                  value={userId}
                  onChangeText={setUserId}
                  placeholder="0000000000"
                  placeholderTextColor="rgba(255,255,255,0.1)"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
              <Text className="text-white/20 text-[11px] mt-2 ml-1 italic">
                The target officer can find this on their profile page
              </Text>
            </View>

            <View>
              <View className="flex-row items-center mb-2 ml-1">
                <Info size={12} color="#f59e0b" />
                <Text className="text-white/40 font-black uppercase tracking-[2px] text-[10px] ml-2">Mission Message</Text>
              </View>
              <View className="bg-stone-900/50 border border-white/10 rounded-2xl px-4 py-4 h-32">
                <TextInput
                  className="flex-1 text-white font-medium text-base"
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Enter briefing message (optional)..."
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View className="bg-amber-500/5 border border-amber-500/10 rounded-[24px] p-5">
              <Text className="text-amber-500/60 font-black text-[10px] uppercase tracking-[3px] mb-2">Protocol Note</Text>
              <Text className="text-white/50 text-xs leading-5">
                Invitations expire after 7 days if not accepted. Once the officer accepts, they will gain access to the team's tactical board and chat.
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600)} className="mt-12 pb-10">
            <TouchableOpacity
              className={`bg-amber-500 rounded-[24px] py-5 flex-row items-center justify-center gap-3 shadow-lg shadow-amber-500/20 active:scale-[0.98] ${isLoading ? 'opacity-50' : ''}`}
              onPress={handleSendInvitation}
              disabled={isLoading}
            >
              <Text className="text-black text-lg font-black uppercase tracking-wider">
                {isLoading ? 'Transmitting...' : 'Send Invitation'}
              </Text>
              {!isLoading && <Send size={20} color="black" strokeWidth={2.5} />}
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
