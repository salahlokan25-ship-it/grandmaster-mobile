import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthService, UserProfile } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  signUp: (email: string, password: string, username: string, displayName?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,

      signUp: async (email: string, password: string, username: string, displayName?: string) => {
        set({ isLoading: true })
        try {
          const result = await AuthService.signUp(email, password, username, displayName)
          // Only set authenticated if we have a user (result.user) 
          // Note: If email confirmation is ON, we might not have a session yet
          set({
            user: result.user,
            profile: result.profile,
            isAuthenticated: !!result.user, // Still set user so we can show Welcome
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      signIn: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const result = await AuthService.signIn(email, password)
          set({
            user: result.user,
            profile: result.profile,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      signOut: async () => {
        set({ isLoading: true })
        try {
          await AuthService.signOut()
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      updateProfile: async (updates: Partial<UserProfile>) => {
        try {
          const updatedProfile = await AuthService.updateProfile(updates)
          set({ profile: updatedProfile })
        } catch (error) {
          throw error
        }
      },

      checkAuth: async () => {
        set({ isLoading: true })
        try {
          const result = await AuthService.getCurrentUser()
          if (result) {
            set({
              user: result.user,
              profile: result.profile,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({
              user: null,
              profile: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }
        } catch (error) {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (state) => {
        // When the store is rehydrated, verify with Supabase
        return (state, error) => {
          if (error) {
            console.error('Rehydration error:', error)
          } else if (state) {
            state.checkAuth()
          }
        }
      },
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Set up auth state listener
supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
  const store = useAuthStore.getState()

  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
    if (session?.user) {
      // If we don't have a profile yet, or the user changed, refresh
      if (!store.profile || store.user?.id !== session.user.id) {
        await store.checkAuth()
      }
    }
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }
})
