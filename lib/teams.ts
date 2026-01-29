import { supabase } from './supabase'
import { UserProfile } from './auth'

export interface Team {
  id: string
  name: string
  description?: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: string
  joined_at: string
  user?: UserProfile
}

export interface TeamInvitation {
  id: string
  team_id: string
  inviter_id: string
  invitee_fixed_id: string
  status: string
  message?: string
  created_at: string
  expires_at: string
  team?: Team
  inviter?: UserProfile
}

export interface TeamJoinRequest {
  id: string
  team_id: string
  requester_id: string
  status: string
  message?: string
  created_at: string
  team?: Team
  requester?: UserProfile
}

export class TeamService {
  // Create a new team
  static async createTeam(name: string, description?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      console.log('Creating team for user:', user.id, 'Name:', name)

      const { data, error } = await supabase
        .from('teams')
        .insert({
          name,
          description,
          owner_id: user.id,
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error inserting team:', JSON.stringify(error, null, 2))
        throw error
      }

      console.log('Team created successfully, adding owner as member:', data.id)

      // Add owner as team member
      await this.addTeamMember(data.id, user.id, 'owner')

      return data as Team
    } catch (error) {
      console.error('Create team error details:', error)
      throw error
    }
  }

  // Get user's teams
  static async getUserTeams() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          team:teams(*)
        `)
        .eq('user_id', user.id)

      if (error) throw error

      return data as (TeamMember & { team: Team })[]
    } catch (error) {
      console.error('Get user teams error:', error)
      return []
    }
  }

  // Add member to team
  static async addTeamMember(teamId: string, userId: string, role: string = 'member') {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: userId,
          role,
        })
        .select()
        .single()

      if (error) throw error

      return data as TeamMember
    } catch (error) {
      console.error('Add team member error:', error)
      throw error
    }
  }

  // Send team invitation using fixed ID
  static async sendTeamInvitation(teamId: string, inviteeFixedId: string, message?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      // Normalize ID to 10 digits (zero-padded)
      const normalizedId = inviteeFixedId.trim().padStart(10, '0')
      console.log('Sending team invitation to:', normalizedId, 'Original:', inviteeFixedId)

      // Check if user exists with the provided fixed ID
      const { data: invitee } = await supabase
        .from('users')
        .select('id')
        .eq('fixed_id', normalizedId)
        .maybeSingle()

      if (!invitee) throw new Error(`Officer with ID ${normalizedId} not found`)

      const { data, error } = await supabase
        .from('team_invitations')
        .insert({
          team_id: teamId,
          inviter_id: user.id,
          invitee_fixed_id: normalizedId,
          message,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        })
        .select(`
          *,
          team:teams(*),
          inviter:users(*)
        `)
        .single()

      if (error) throw error

      return data as TeamInvitation
    } catch (error) {
      console.error('Send team invitation error:', error)
      throw error
    }
  }

  // Get user's invitations
  static async getUserInvitations() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      // Get user's fixed ID first
      const { data: userProfile } = await supabase
        .from('users')
        .select('fixed_id')
        .eq('id', user.id)
        .single()

      if (!userProfile) return []

      const { data, error } = await supabase
        .from('team_invitations')
        .select(`
          *,
          team:teams(*),
          inviter:users(*)
        `)
        .eq('invitee_fixed_id', userProfile.fixed_id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data as TeamInvitation[]
    } catch (error) {
      console.error('Get user invitations error:', error)
      return []
    }
  }

  // Accept team invitation
  static async acceptInvitation(invitationId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      // Get invitation details
      const { data: invitation, error: invitationError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('id', invitationId)
        .single()

      if (invitationError) throw invitationError
      if (!invitation) throw new Error('Invitation not found')

      // Add user to team
      await this.addTeamMember(invitation.team_id, user.id, 'member')

      // Update invitation status
      const { data, error } = await supabase
        .from('team_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId)
        .select()
        .single()

      if (error) throw error

      return data as TeamInvitation
    } catch (error) {
      console.error('Accept invitation error:', error)
      throw error
    }
  }

  // Decline team invitation
  static async declineInvitation(invitationId: string) {
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .update({ status: 'declined' })
        .eq('id', invitationId)
        .select()
        .single()

      if (error) throw error

      return data as TeamInvitation
    } catch (error) {
      console.error('Decline invitation error:', error)
      throw error
    }
  }

  // Send join request to team
  static async sendJoinRequest(teamId: string, message?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('team_join_requests')
        .insert({
          team_id: teamId,
          requester_id: user.id,
          message,
        })
        .select(`
          *,
          team:teams(*),
          requester:users(*)
        `)
        .single()

      if (error) throw error

      return data as TeamJoinRequest
    } catch (error) {
      console.error('Send join request error:', error)
      throw error
    }
  }

  // Get team's join requests (for team owners)
  static async getTeamJoinRequests(teamId: string) {
    try {
      const { data, error } = await supabase
        .from('team_join_requests')
        .select(`
          *,
          team:teams(*),
          requester:users(*)
        `)
        .eq('team_id', teamId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data as TeamJoinRequest[]
    } catch (error) {
      console.error('Get team join requests error:', error)
      return []
    }
  }

  // Accept join request
  static async acceptJoinRequest(requestId: string) {
    try {
      // Get request details
      const { data: request, error: requestError } = await supabase
        .from('team_join_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (requestError) throw requestError
      if (!request) throw new Error('Join request not found')

      // Add user to team
      await this.addTeamMember(request.team_id, request.requester_id, 'member')

      // Update request status
      const { data, error } = await supabase
        .from('team_join_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .select()
        .single()

      if (error) throw error

      return data as TeamJoinRequest
    } catch (error) {
      console.error('Accept join request error:', error)
      throw error
    }
  }

  // Decline join request
  static async declineJoinRequest(requestId: string) {
    try {
      const { data, error } = await supabase
        .from('team_join_requests')
        .update({ status: 'declined' })
        .eq('id', requestId)
        .select()
        .single()

      if (error) throw error

      return data as TeamJoinRequest
    } catch (error) {
      console.error('Decline join request error:', error)
      throw error
    }
  }

  // Get team members
  static async getTeamMembers(teamId: string) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          user:users(*)
        `)
        .eq('team_id', teamId)
        .order('joined_at', { ascending: true })

      if (error) throw error

      return data as (TeamMember & { user: UserProfile })[]
    } catch (error) {
      console.error('Get team members error:', error)
      return []
    }
  }

  // Remove team member
  static async removeTeamMember(teamId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId)

      if (error) throw error

      return true
    } catch (error) {
      console.error('Remove team member error:', error)
      throw error
    }
  }
}
