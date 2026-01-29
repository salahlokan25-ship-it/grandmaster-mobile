import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../stores/authStore'
import { ArrowRight, Lock, Mail, User } from 'lucide-react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'

export default function SignUpScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { signUp } = useAuthStore()

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      Alert.alert('Error', 'Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      await signUp(email, password, username, displayName || undefined)
      // Redirect handled in auth logic or user navigated manually
      router.replace('/(auth)/welcome')
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0c0a09]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center px-8 relative">
        {/* Background Elements */}
        <View className="absolute bottom-0 left-0 right-0 h-96 bg-amber-500/5 blur-[100px] transform translate-y-1/2" />

        <Animated.View
          entering={FadeInUp.delay(200)}
          className="items-center mb-8"
        >
          <View className="w-28 h-28 bg-stone-900 rounded-[32px] border border-white/10 items-center justify-center shadow-2xl shadow-amber-500/10 mb-6 relative overflow-hidden">
            <View className="absolute inset-0 bg-white/5" />
            <Image
              source={require('../../assets/icon.jpg')}
              className="w-20 h-20 rounded-2xl"
              resizeMode="cover"
            />
          </View>
          <Text className="text-2xl font-black text-white text-center tracking-tight">
            Initialize Profile
          </Text>
          <Text className="text-white/40 font-medium text-center mt-1 text-sm">
            Create your unique identity to begin
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)}>
          <View className="space-y-3">
            <View className="flex-row items-center bg-stone-900/50 border border-white/10 rounded-2xl px-4 py-4 focus:border-amber-500/50 transition-colors">
              <Mail size={18} color="rgba(255,255,255,0.4)" />
              <TextInput
                className="flex-1 ml-3 text-white font-medium"
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                placeholderTextColor="rgba(255,255,255,0.2)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="flex-row items-center bg-stone-900/50 border border-white/10 rounded-2xl px-4 py-4 focus:border-amber-500/50 transition-colors">
              <User size={18} color="rgba(255,255,255,0.4)" />
              <TextInput
                className="flex-1 ml-3 text-white font-medium"
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor="rgba(255,255,255,0.2)"
                autoCapitalize="none"
              />
            </View>

            <View className="flex-row items-center bg-stone-900/50 border border-white/10 rounded-2xl px-4 py-4 focus:border-amber-500/50 transition-colors">
              <User size={18} color="rgba(255,255,255,0.4)" />
              <TextInput
                className="flex-1 ml-3 text-white font-medium"
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Display Name (Optional)"
                placeholderTextColor="rgba(255,255,255,0.2)"
              />
            </View>

            <View className="flex-row items-center bg-stone-900/50 border border-white/10 rounded-2xl px-4 py-4 focus:border-amber-500/50 transition-colors">
              <Lock size={18} color="rgba(255,255,255,0.4)" />
              <TextInput
                className="flex-1 ml-3 text-white font-medium"
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.2)"
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            className={`bg-amber-500 rounded-2xl py-4 mt-8 flex-row items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] ${isLoading ? 'opacity-50' : ''}`}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text className="text-black text-lg font-black uppercase tracking-wide">
              {isLoading ? 'Creating...' : 'Create Account'}
            </Text>
            {!isLoading && <ArrowRight size={20} color="black" strokeWidth={2.5} />}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-6 py-2"
            onPress={() => router.push('/(auth)/sign-in')}
          >
            <Text className="text-center text-white/40 font-medium pb-2">
              Already have an account? <Text className="text-amber-500 font-bold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  )
}
