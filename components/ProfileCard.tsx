import React from 'react'
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import { Copy, ShieldCheck } from 'lucide-react-native'
import * as Clipboard from 'expo-clipboard'
import { UserProfile } from '../lib/auth'

interface ProfileCardProps {
  profile: UserProfile
  showCopyId?: boolean
}

export function ProfileCard({ profile, showCopyId = true }: ProfileCardProps) {
  const copyFixedId = async () => {
    if (profile?.fixed_id) {
      await Clipboard.setStringAsync(profile.fixed_id)
      Alert.alert('Copied', 'User ID copied to clipboard!')
    }
  }

  return (
    <View className="bg-stone-900/60 rounded-[32px] border border-white/10 p-6 shadow-2xl overflow-hidden relative">
      {/* Background Decor */}
      <View className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-2xl rounded-full -mr-16 -mt-16" />

      <View className="flex-row items-center mb-6">
        <View className="w-20 h-20 bg-stone-800 rounded-[24px] items-center justify-center border border-white/5 relative overflow-hidden">
          {profile.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="items-center justify-center">
              <Text className="text-amber-500 font-black text-2xl">
                {profile.display_name?.charAt(0).toUpperCase() || profile.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View className="absolute bottom-0 right-0 w-6 h-6 bg-amber-500 rounded-lg items-center justify-center border-2 border-stone-900">
            <ShieldCheck size={12} color="black" />
          </View>
        </View>

        <View className="flex-1 ml-5">
          <Text className="text-white font-black text-2xl tracking-tight">
            {profile.display_name || profile.username}
          </Text>
          <Text className="text-white/40 font-bold text-sm">@{profile.username}</Text>
        </View>
      </View>

      <View className="bg-black/40 rounded-[24px] p-5 border border-white/5">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white/30 text-[10px] font-black uppercase tracking-[3px] mb-1">Command Identity</Text>
            <Text className="text-amber-500 font-mono font-black text-xl tracking-widest">
              {profile.fixed_id || '--------'}
            </Text>
          </View>

          {showCopyId && (
            <TouchableOpacity
              onPress={copyFixedId}
              className="bg-white/5 w-12 h-12 rounded-2xl items-center justify-center border border-white/5 active:bg-white/10"
            >
              <Copy size={20} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="mt-4 px-1">
        <Text className="text-white/30 text-[10px] font-black uppercase tracking-[3px] mb-1">Email Connection</Text>
        <Text className="text-white/60 font-medium">{profile.email}</Text>
      </View>
    </View>
  )
}
