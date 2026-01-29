import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://avowfobwwsqyrdmpkyka.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2b3dmb2J3d3NxeXJkbXBreWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTY0MjYsImV4cCI6MjA4NDkzMjQyNn0.gVIHVvZCKBHY4NkMtIQCxtafsInJdGJrL74QI1CHRW4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})
