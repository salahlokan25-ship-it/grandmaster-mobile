import { supabase } from './supabase'
import { UserProfile } from './auth'

export interface Friendship {
    id: string
    user_id: string
    friend_id: string
    status: 'pending' | 'accepted'
    created_at: string
    friend?: UserProfile
    user?: UserProfile
}

export class FriendService {
    /**
     * Send a friend request to a user by their fixed ID (10 digits)
     */
    static async sendFriendRequest(targetFixedId: string) {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // Normalize ID
            const normalizedId = targetFixedId.trim().padStart(10, '0')

            // Find user
            const { data: targetUser, error: findError } = await supabase
                .from('users')
                .select('*')
                .eq('fixed_id', normalizedId)
                .maybeSingle()

            if (findError || !targetUser) throw new Error('Officer not found')
            if (targetUser.id === user.id) throw new Error('Cannot add yourself')

            // Create request
            const { data, error } = await supabase
                .from('friendships')
                .insert({
                    user_id: user.id,
                    friend_id: targetUser.id,
                    status: 'pending'
                })
                .select()
                .single()

            if (error) {
                if (error.code === '23505') throw new Error('Request already exists')
                throw error
            }

            return data as Friendship
        } catch (error) {
            console.error('[FriendService] sendFriendRequest error:', error)
            throw error
        }
    }

    /**
     * Get all friends (accepted only)
     */
    static async getFriends() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return []

            const { data, error } = await supabase
                .from('friendships')
                .select(`
          *,
          friend:friend_id(*),
          user:user_id(*)
        `)
                .eq('status', 'accepted')
                .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

            if (error) throw error

            // Transform result to always provide the "other" user as the friend object
            return (data || []).map(item => {
                const isRequester = item.user_id === user.id
                return {
                    ...item,
                    displayName: isRequester
                        ? (item.friend?.display_name || item.friend?.username)
                        : (item.user?.display_name || item.user?.username),
                    otherUser: isRequester ? item.friend : item.user
                }
            })
        } catch (error) {
            console.error('[FriendService] getFriends error:', error)
            return []
        }
    }

    /**
     * Get pending incoming friend requests
     */
    static async getPendingRequests() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return []

            const { data, error } = await supabase
                .from('friendships')
                .select(`
          *,
          user:user_id(*)
        `)
                .eq('friend_id', user.id)
                .eq('status', 'pending')

            if (error) throw error
            return data || []
        } catch (error) {
            console.error('[FriendService] getPendingRequests error:', error)
            return []
        }
    }

    /**
     * Handle (accept/decline) friend request
     */
    static async handleRequest(requestId: string, accept: boolean) {
        try {
            if (accept) {
                const { error } = await supabase
                    .from('friendships')
                    .update({ status: 'accepted' })
                    .eq('id', requestId)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('friendships')
                    .delete()
                    .eq('id', requestId)
                if (error) throw error
            }
        } catch (error) {
            console.error('[FriendService] handleRequest error:', error)
            throw error
        }
    }
}
