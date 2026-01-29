import { supabase } from './supabase'
import { UserProfile } from './auth'

export interface GameInvitation {
    id: string
    inviter_id: string
    invitee_fixed_id: string
    status: 'pending' | 'accepted' | 'declined' | 'expired'
    game_id?: string // UUID from active_games
    created_at: string
    expires_at: string
    inviter?: UserProfile
}

export interface ActiveGame {
    id: string
    white_player_id: string
    black_player_id: string
    fen: string
    last_move?: string
    last_move_at: string
    status: 'active' | 'completed' | 'draw'
    winner_id?: string
    updated_at: string
}

export class GameService {
    // Send a play invitation
    static async sendGameInvitation(inviteeFixedId: string) {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No authenticated user')

            // Normalize ID to 10 digits (zero-padded)
            const normalizedId = inviteeFixedId.trim().padStart(10, '0')
            console.log('[GameService] Dispatching mission to:', normalizedId)

            // Check if user exists with the provided fixed ID
            const { data: invitee, error: searchError } = await supabase
                .from('users')
                .select('id, username')
                .eq('fixed_id', normalizedId)
                .maybeSingle()

            if (searchError || !invitee) throw new Error('Target commander not found')
            if (invitee.id === user.id) throw new Error('Cannot challenge yourself')

            const { data, error } = await supabase
                .from('game_invitations')
                .insert({
                    inviter_id: user.id,
                    invitee_fixed_id: normalizedId,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
                })
                .select(`
          *,
          inviter:users(*)
        `)
                .single()

            if (error) throw error

            return data as GameInvitation
        } catch (error) {
            console.error('Send game invitation error:', error)
            throw error
        }
    }

    // Get invitations sent to the current user
    static async getUserGameInvitations() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return []

            console.log('[GameService] Fetching missions for user:', user.id)

            const { data: userProfile } = await supabase
                .from('users')
                .select('fixed_id')
                .eq('id', user.id)
                .maybeSingle()

            if (!userProfile) {
                console.warn('[GameService] No public profile found for recipient search')
                return []
            }

            console.log('[GameService] Recipient UID:', userProfile.fixed_id)

            const { data, error } = await supabase
                .from('game_invitations')
                .select(`
                  *,
                  inviter:users(*)
                `)
                .eq('invitee_fixed_id', userProfile.fixed_id)
                .eq('status', 'pending')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('[GameService] Database error fetching missions:', error)
                throw error
            }

            console.log(`[GameService] Found ${data?.length || 0} pending missions`)
            return data as GameInvitation[]
        } catch (error) {
            console.error('Get user game invitations error:', error)
            return []
        }
    }

    // Accept a play invitation and create an active game session
    static async acceptGameInvitation(invitationId: string) {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No authenticated user')

            // 1. Fetch the invitation to get the inviter_id
            const { data: invite, error: fetchError } = await supabase
                .from('game_invitations')
                .select('*')
                .eq('id', invitationId)
                .single()

            if (fetchError || !invite) throw new Error('Invitation not found')
            if (invite.status !== 'pending') throw new Error('Invitation is no longer pending')

            // 2. Create the active game session
            // Inviter is White, Invitee is Black
            const { data: game, error: gameError } = await supabase
                .from('active_games')
                .insert({
                    white_player_id: invite.inviter_id,
                    black_player_id: user.id,
                    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    status: 'active'
                })
                .select()
                .single()

            if (gameError) throw gameError

            // 3. Update invitation with accepted status and link to the game
            const { data: updatedInvite, error: updateError } = await supabase
                .from('game_invitations')
                .update({
                    status: 'accepted',
                    game_id: (game as any).id
                })
                .eq('id', invitationId)
                .select()
                .single()

            if (updateError) throw updateError

            return updatedInvite as GameInvitation
        } catch (error) {
            console.error('Accept game invitation error:', error)
            throw error
        }
    }

    // Submit a move in an online game
    static async submitOnlineMove(gameId: string, move: { from: any, to: any }, fen: string) {
        try {
            const { error } = await supabase
                .from('active_games')
                .update({
                    fen: fen,
                    last_move: JSON.stringify(move),
                    last_move_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', gameId)

            if (error) throw error
        } catch (error) {
            console.error('[GameService] Error submitting move:', error)
            throw error
        }
    }

    // Fetch active game state
    static async getActiveGame(gameId: string) {
        try {
            const { data, error } = await supabase
                .from('active_games')
                .select('*')
                .eq('id', gameId)
                .maybeSingle()

            if (error) throw error
            return data as ActiveGame
        } catch (error) {
            console.error('[GameService] Error fetching game:', error)
            throw error
        }
    }

    // Decline a play invitation
    static async declineGameInvitation(invitationId: string) {
        try {
            const { data, error } = await supabase
                .from('game_invitations')
                .update({ status: 'declined' })
                .eq('id', invitationId)
                .select()
                .single()

            if (error) throw error

            return data as GameInvitation
        } catch (error) {
            console.error('Decline game invitation error:', error)
            throw error
        }
    }

    // Search for a user by fixed ID
    static async searchUserByUID(uid: string) {
        try {
            // Normalize ID to 10 digits (zero-padded) if it's numeric
            const normalizedId = /^\d+$/.test(uid.trim()) ? uid.trim().padStart(10, '0') : uid.trim()

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('fixed_id', normalizedId)
                .maybeSingle()

            if (error) throw error
            return data as UserProfile
        } catch (error) {
            console.error('Search user by UID error:', error)
            return null
        }
    }
}
