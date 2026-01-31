import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeft, Shield, Sparkles } from 'lucide-react-native'
import { TeamService } from '../../lib/teams'
import { useAuthStore } from '../../stores/authStore'
import { cn } from '../../lib/utils'

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
      className="flex-1 bg-[#0c0a09]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Premium Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-stone-900 rounded-xl items-center justify-center border border-white/5"
          >
            <ChevronLeft size={20} color="white" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-white font-black text-lg lowercase italic">Initiate Unit</Text>
            <Text className="text-white/40 text-[8px] uppercase font-black tracking-[3px]">Formation Protocol</Text>
          </View>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          <View className="space-y-8">
            {/* Mission Identity Section */}
            <View>
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4">Mission Identity</Text>

              <View className="bg-stone-900/40 rounded-[32px] p-6 border border-white/5 space-y-6">
                <View>
                  <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Unit Designation *</Text>
                  <TextInput
                    className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold"
                    value={teamName}
                    onChangeText={setTeamName}
                    placeholder="Enter designation..."
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    maxLength={50}
                  />
                  <Text className="text-white/20 text-[10px] mt-2 font-bold uppercase tracking-tighter text-right">
                    {teamName.length}/50 registry limit
                  </Text>
                </View>

                <View>
                  <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Directive (Optional)</Text>
                  <TextInput
                    className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 h-32 text-white font-medium"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Define unit objectives..."
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    multiline
                    textAlignVertical="top"
                    maxLength={200}
                  />
                  <Text className="text-white/20 text-[10px] mt-2 font-bold uppercase tracking-tighter text-right">
                    {description.length}/200 limit
                  </Text>
                </View>
              </View>
            </View>

            {/* Commander Credentials */}
            <View>
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4">Founding Commander</Text>
              <View className="bg-stone-900/60 rounded-[32px] p-6 border border-white/5 flex-row items-center gap-4">
                <View className="w-12 h-12 bg-amber-500/10 rounded-2xl items-center justify-center border border-amber-500/20">
                  <Shield size={24} color="#f59e0b" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-black text-sm lowercase italic">{profile?.display_name || profile?.username}</Text>
                  <Text className="text-white/30 text-[10px] font-black tracking-widest uppercase">Registry ID: {profile?.fixed_id}</Text>
                </View>
              </View>
            </View>

            {/* Tactical Briefing */}
            <View className="bg-amber-500/5 rounded-[32px] p-6 border border-amber-500/10 flex-row items-start gap-4">
              <Sparkles size={18} color="#f59e0b" className="mt-1" />
              <View className="flex-1">
                <Text className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-1">Enlistment Protocol</Text>
                <Text className="text-amber-500/60 text-[11px] font-bold leading-relaxed uppercase tracking-tighter">
                  Upon authorization, you may enlist officers using their 10-digit Tactical UID.
                </Text>
              </View>
            </View>
          </View>

          {/* Action Protocols */}
          <View className="mt-12 space-y-4 mb-10">
            <TouchableOpacity
              className={cn(
                "h-16 rounded-[28px] items-center justify-center flex-row gap-3 shadow-2xl",
                isLoading || !teamName.trim() ? "bg-stone-800" : "bg-white"
              )}
              onPress={handleCreateTeam}
              disabled={isLoading || !teamName.trim()}
            >
              {isLoading ? (
                <ActivityIndicator color="black" />
              ) : (
                <>
                  <Text className="text-black font-black uppercase tracking-[2px] text-xs italic">Authorize Directive</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="h-16 rounded-[28px] items-center justify-center border border-white/5 bg-stone-900/40"
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text className="text-white/40 font-black uppercase tracking-[2px] text-[10px]">Abort Formation</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
