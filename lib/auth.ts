import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  fixed_id: string
  email: string
  username: string
  display_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// Helper for standard timeouts
const DEFAULT_TIMEOUT = 12000 // 12 seconds

async function callWithTimeout<T>(promise: Promise<T> | PromiseLike<T>, timeoutMs: number = DEFAULT_TIMEOUT, errorMessage: string = 'Request timed out'): Promise<T> {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
  )
  return Promise.race([promise, timeoutPromise]) as Promise<T>
}

export class AuthService {
  static async signUp(email: string, password: string, username: string, displayName?: string) {
    try {
      console.log(`[AuthService] sign-up: Starting for ${email}`)

      // 1. Create auth user
      const signUpPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName || username,
          }
        }
      })

      const { data: authData, error: authError } = await callWithTimeout(
        signUpPromise,
        15000,
        'Sign up operation timed out. Please try again.'
      )

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create account profile')

      console.log(`[AuthService] sign-up: User created (${authData.user.id}), polling for profile...`)

      // 2. Poll for profile creation
      let profile = null
      let attempts = 0
      while (!profile && attempts < 8) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle()

        if (data) {
          profile = data
          break
        }

        await new Promise(resolve => setTimeout(resolve, 800))
        attempts++
      }

      console.log(`[AuthService] sign-up: Profile ${profile ? 'found' : 'missing (async sync delay)'}`)

      return {
        user: authData.user,
        profile: profile as UserProfile | null
      }
    } catch (error) {
      console.error('[AuthService] sign-up error:', error)
      throw error
    }
  }

  static async signIn(email: string, password: string) {
    try {
      console.log(`[AuthService] sign-in: Attempting for ${email}`)

      const { data, error } = await callWithTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        15000,
        'Sign in timed out. Please check your connection.'
      ) as any

      if (error) throw error
      console.log(`[AuthService] sign-in: Auth successful (${data.user.id}), fetching profile...`)

      // Get user profile
      const { data: profileData, error: profileError } = await callWithTimeout(
        supabase.from('users').select('*').eq('id', data.user.id).maybeSingle() as any,
        10000,
        'Profile lookup timed out'
      ) as any

      if (profileError) {
        console.warn('[AuthService] sign-in: Profile lookup warning:', profileError)
      }

      return {
        user: data.user,
        profile: profileData as UserProfile | null
      }
    } catch (error) {
      console.error('[AuthService] sign-in error:', error)
      throw error
    }
  }

  static async signOut() {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Sign out timed out')), 5000)
      )
      const signOutPromise = supabase.auth.signOut()
      const { error } = await Promise.race([signOutPromise, timeoutPromise]) as any
      if (error) throw error
    } catch (error) {
      console.error('AuthService: Sign out error:', error)
      throw error
    }
  }

  static async getCurrentUser() {
    try {
      console.log('[AuthService] get-current-user: Checking session...')

      const sessionResult = await callWithTimeout(
        supabase.auth.getSession(),
        10000,
        'Auth session lookup timed out'
      )

      const { data: { session }, error: sessionError } = sessionResult as any

      if (sessionError || !session) {
        console.log('[AuthService] get-current-user: No active session')
        return null
      }

      console.log('[AuthService] get-current-user: Session found, fetching user/')
      const userResult = await callWithTimeout(
        supabase.auth.getUser(),
        10000,
        'User data fetch timed out'
      )
      const { data: { user }, error: userError } = userResult as any

      if (userError) {
        if (userError.message.includes('session missing') || userError.status === 401) return null
        throw userError
      }

      if (!user) return null

      console.log(`[AuthService] get-current-user: User found (${user.id}), fetching profile...`)

      // Get user profile
      const profileResult = await callWithTimeout(
        supabase.from('users').select('*').eq('id', user.id).single() as any,
        10000,
        'Profile fetch timed out'
      )
      const { data: profileData, error: profileError } = profileResult as any

      if (profileError) {
        console.error('[AuthService] get-current-user: Profile fetch error:', profileError)
        return { user, profile: null }
      }

      let finalProfile = profileData as UserProfile

      // FALLBACK: If fixed_id is missing
      if (!finalProfile.fixed_id) {
        console.log('[AuthService] get-current-user: Generating missing Fixed ID...')
        const { data: newFixedId } = await supabase.rpc('generate_fixed_id')
        if (newFixedId) {
          const { data: updatedData } = await supabase
            .from('users')
            .update({ fixed_id: newFixedId })
            .eq('id', user.id)
            .select()
            .single()

          if (updatedData) finalProfile = updatedData as UserProfile
        }
      }

      return {
        user,
        profile: finalProfile
      }
    } catch (error) {
      console.error('[AuthService] get-current-user overall error:', error)
      return null
    }
  }

  static async updateProfile(updates: Partial<UserProfile>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      return data as UserProfile
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  static async getUserByFixedId(fixedId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('fixed_id', fixedId)
        .single()

      if (error) throw error

      return data as UserProfile
    } catch (error) {
      console.error('Get user by fixed ID error:', error)
      return null
    }
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}
