import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import {
    View, Text, TouchableOpacity, ScrollView, TextInput,
    Alert, ActivityIndicator, Modal, KeyboardAvoidingView, Platform,
    RefreshControl
} from 'react-native'
import { useRouter } from 'expo-router'
import {
    Users,
    Plus,
    MessageSquare,
    Search,
    ChevronRight,
    Shield,
    Trophy,
    UserPlus,
    Copy,
    Info
} from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChessAvatar } from '../../components/ui/ChessAvatar'
import { cn } from '../../lib/utils'
import { IconButton } from '../../components/ui/IconButton'
import { useAuthStore } from '../../stores/authStore'
import { TeamService, Team, TeamInvitation } from '../../lib/teams'
import { GameService, GameInvitation } from '../../lib/games'
import { FriendService, Friendship } from '../../lib/friends'
import { UserProfile } from '../../lib/auth'
import * as Clipboard from 'expo-clipboard'
import Animated, { FadeInRight, FadeInUp, Layout, FadeInDown } from 'react-native-reanimated'
import { Hash, Play, UserPlus2, Check, X } from 'lucide-react-native'
import { MatchmakingModal } from '../../components/game/MatchmakingModal'

export default function CommunityPage() {
    const router = useRouter()
    const { profile, user } = useAuthStore()
    const [teams, setTeams] = useState<Team[]>([])
    const [invitations, setInvitations] = useState<TeamInvitation[]>([])
    const [gameInvitations, setGameInvitations] = useState<GameInvitation[]>([])
    const [friends, setFriends] = useState<any[]>([])
    const [friendRequests, setFriendRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [activeTab, setActiveTab] = useState<'teams' | 'friends' | 'pending'>('friends')
    const [isCreateModalVisible, setCreateModalVisible] = useState(false)
    const [isJoinModalVisible, setJoinModalVisible] = useState(false)

    const [searchQuery, setSearchQuery] = useState('')
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null)
    const [isSearching, setIsSearching] = useState(false)

    const [teamName, setTeamName] = useState('')
    const [joinId, setJoinId] = useState('')
    const [busy, setBusy] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    // Matchmaking State
    const [isMatchmakingVisible, setMatchmakingVisible] = useState(false)

    useEffect(() => {
        loadData()
    }, [activeTab])

    // Listen for accepted game invitations (Real-time)
    useEffect(() => {
        if (!user) return

        console.log('[CommunityPage] Subscribing to mission updates for user:', user.id)

        const channel = supabase
            .channel(`missions_${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'game_invitations',
                    filter: `inviter_id=eq.${user.id}`,
                },
                (payload) => {
                    console.log('[CommunityPage] Mission update received:', payload)
                    if (payload.new && payload.new.status === 'accepted') {
                        console.log('[CommunityPage] Mission accepted! Redirecting to game...', payload.new.game_id)
                        Alert.alert('Challenge Accepted!', 'Your recruit has entered the tactical arena.')
                        router.push({
                            pathname: '/(tabs)/game',
                            params: {
                                gameId: payload.new.game_id,
                                color: 'white' // Inviter is White
                            }
                        })
                    }
                }
            )
            .subscribe((status) => {
                console.log('[CommunityPage] Subscription status:', status)
            })

        return () => {
            console.log('[CommunityPage] Unsubscribing from mission updates')
            supabase.removeChannel(channel)
        }
    }, [user])

    const loadData = async (isManual = false) => {
        if (isManual) setRefreshing(true)
        try {
            console.log('[CommunityPage] Loading data...')
            const [userTeams, userInvitations, userGameInvitations, userFriends, requests] = await Promise.all([
                TeamService.getUserTeams(),
                TeamService.getUserInvitations(),
                GameService.getUserGameInvitations(),
                FriendService.getFriends(),
                FriendService.getPendingRequests()
            ])

            setTeams(userTeams.map(item => item.team))
            setInvitations(userInvitations)
            setGameInvitations(userGameInvitations)
            setFriends(userFriends)
            setFriendRequests(requests)
            console.log('[CommunityPage] Data loaded successfully')
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const handleSearchUser = async () => {
        if (searchQuery.length < 8) return
        setIsSearching(true)
        try {
            const user = await GameService.searchUserByUID(searchQuery)
            setFoundUser(user)
        } catch (error) {
            setFoundUser(null)
        } finally {
            setIsSearching(false)
        }
    }

    const handleSendGameInvitation = async () => {
        if (!foundUser) return
        setBusy(true)
        try {
            await GameService.sendGameInvitation(foundUser.fixed_id)
            Alert.alert('Challenge Sent!', `Invitation sent to ${foundUser.display_name || foundUser.username}.`)
            setFoundUser(null)
            setSearchQuery('')
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to send invitation')
        } finally {
            setBusy(false)
        }
    }

    const handleAcceptGameInvitation = async (invitationId: string) => {
        setBusy(true)
        try {
            const result = await GameService.acceptGameInvitation(invitationId)
            console.log('[CommunityPage] Accepted mission:', result)
            Alert.alert('Challenge Accepted!', 'Entering the tactical arena...', [
                {
                    text: 'OK',
                    onPress: () => router.push({
                        pathname: '/(tabs)/game',
                        params: {
                            gameId: (result as any).game_id,
                            color: 'black' // Invitee is Black
                        }
                    })
                }
            ])
            await loadData()
        } catch (error: any) {
            console.error('[CommunityPage] Accept error:', error)
            Alert.alert('Error', error.message || 'Failed to accept invitation')
        } finally {
            setBusy(false)
        }
    }

    const handleDeclineGameInvitation = async (invitationId: string) => {
        try {
            await GameService.declineGameInvitation(invitationId)
            await loadData()
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to decline invitation')
        }
    }

    const handleSendFriendRequest = async () => {
        if (!foundUser) return
        setBusy(true)
        try {
            await FriendService.sendFriendRequest(foundUser.fixed_id)
            Alert.alert('Request Sent', `A recruitment invitation has been sent to ${foundUser.display_name || foundUser.username}.`)
            setFoundUser(null)
            setSearchQuery('')
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to send request')
        } finally {
            setBusy(false)
        }
    }

    const handleFriendRequest = async (requestId: string, accept: boolean) => {
        setBusy(true)
        try {
            await FriendService.handleRequest(requestId, accept)
            if (accept) Alert.alert('Officer Recruited', 'They are now in your personnel list.')
            await loadData()
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Action failed')
        } finally {
            setBusy(false)
        }
    }

    const handleCreateTeam = async () => {
        if (!teamName.trim()) return
        setBusy(true)
        try {
            await TeamService.createTeam(teamName.trim())
            setTeamName('')
            setCreateModalVisible(false)
            Alert.alert('Success', 'Team created successfully!')
            await loadData()
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create team')
        } finally {
            setBusy(false)
        }
    }

    const handleJoinTeam = async () => {
        if (!joinId.trim()) return
        setBusy(true)
        try {
            // For now, just show a message - actual join by ID would need additional implementation
            Alert.alert('Info', 'Join by ID feature coming soon! Use team invitations for now.')
            setJoinId('')
            setJoinModalVisible(false)
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to join team')
        } finally {
            setBusy(false)
        }
    }

    const handleCancelMatchmaking = () => {
        setMatchmakingVisible(false)
    }

    const handleStartMatchmaking = () => {
        setMatchmakingVisible(true)
    }

    const copyId = async () => {
        if (profile?.fixed_id) {
            await Clipboard.setStringAsync(profile.fixed_id)
            Alert.alert('Copied', 'Your User ID has been copied!')
        }
    }

    const handleAcceptInvitation = async (invitationId: string) => {
        try {
            await TeamService.acceptInvitation(invitationId)
            await loadData()
            Alert.alert('Success', 'You joined the team!')
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to join team')
        }
    }

    const handleDeclineInvitation = async (invitationId: string) => {
        try {
            await TeamService.declineInvitation(invitationId)
            await loadData()
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to decline invitation')
        }
    }

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center p-8 mt-12">
            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
                <Users size={40} color="hsl(24 100% 45%)" />
            </View>
            <Text className="text-xl font-bold text-foreground text-center mb-2">No Teams Yet</Text>
            <Text className="text-muted-foreground text-center mb-8">
                Build your chess empire. Create a team or wait for invitations to start collaborating.
            </Text>
            <TouchableOpacity
                onPress={() => setCreateModalVisible(true)}
                className="bg-primary px-8 py-4 rounded-2xl flex-row items-center gap-2"
            >
                <Plus size={20} color="white" strokeWidth={3} />
                <Text className="text-white font-bold">Create First Team</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="px-6 py-4 border-b border-border/50 bg-background/80 flex-row items-center justify-between">
                <View>
                    <Text className="text-2xl font-black text-primary italic lowercase tracking-tight">Teams Hub</Text>
                    <Text className="text-[10px] text-muted-foreground uppercase tracking-[3px] font-bold">Collaborate & Conquer</Text>
                </View>
                <View className="flex-row gap-2">
                    <IconButton icon={Plus} onPress={() => setCreateModalVisible(true)} />
                </View>
            </View>

            <View className="px-6 py-2 flex-row gap-6 border-b border-border/30">
                <TouchableOpacity onPress={() => setActiveTab('teams')} className={cn("py-3 border-b-2", activeTab === 'teams' ? "border-primary" : "border-transparent")}>
                    <Text className={cn("font-bold", activeTab === 'teams' ? "text-foreground" : "text-muted-foreground")}>Teams</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('friends')} className={cn("py-3 border-b-2", activeTab === 'friends' ? "border-primary" : "border-transparent")}>
                    <Text className={cn("font-bold", activeTab === 'friends' ? "text-foreground" : "text-muted-foreground")}>Personnel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('pending')} className={cn("py-3 border-b-2 relative", activeTab === 'pending' ? "border-primary" : "border-transparent")}>
                    <Text className={cn("font-bold", activeTab === 'pending' ? "text-foreground" : "text-muted-foreground")}>Pending</Text>
                    {(invitations.length + gameInvitations.length + friendRequests.length) > 0 && (
                        <View className="absolute top-2 -right-3 w-4 h-4 bg-primary rounded-full items-center justify-center">
                            <Text className="text-[8px] text-white font-bold">{invitations.length + gameInvitations.length + friendRequests.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} tintColor="#f59e0b" />
                }
            >
                {/* User Identity Card */}
                <View className="px-6 py-6">
                    <View className="bg-stone-900 rounded-[32px] p-6 border border-white/5 shadow-xl relative overflow-hidden">
                        <View className="absolute top-0 right-0 p-8 opacity-5">
                            <Shield size={120} color="white" />
                        </View>

                        <View className="flex-row items-center gap-4 mb-6">
                            <ChessAvatar src={profile?.avatar_url} size="lg" />
                            <View>
                                <Text className="text-white font-bold text-lg">{profile?.display_name || profile?.username}</Text>
                                <View className="flex-row items-center gap-2">
                                    <View className="w-2 h-2 rounded-full bg-green-500" />
                                    <Text className="text-green-500/80 text-xs font-bold uppercase tracking-wider">Active Commander</Text>
                                </View>
                            </View>
                        </View>

                        <View className="bg-white/5 rounded-2xl p-4 border border-white/5 flex-row items-center justify-between">
                            <View>
                                <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Your UID</Text>
                                <Text className="text-amber-500 font-mono text-xl font-bold tracking-widest">
                                    {profile?.fixed_id || '— — — — — — — — — —'}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={copyId}
                                className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20"
                            >
                                <Copy size={20} color="#f59e0b" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Player Discovery Search */}
                <View className="px-6 mb-8">
                    <Text className="text-xs font-black text-white/40 uppercase tracking-[4px] mb-4">Discover Personnel</Text>
                    <View className="flex-row items-center bg-stone-900/50 border border-white/10 rounded-2xl px-4 py-3">
                        <Hash size={18} color="#f59e0b" />
                        <TextInput
                            className="flex-1 ml-3 text-white font-medium"
                            placeholder="Search by Mission ID (UID)..."
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            value={searchQuery}
                            onChangeText={(text) => {
                                setSearchQuery(text)
                                if (text.length >= 8) {
                                    handleSearchUser()
                                }
                            }}
                            keyboardType="numeric"
                            maxLength={10}
                        />
                        {isSearching ? (
                            <ActivityIndicator size="small" color="#f59e0b" />
                        ) : (
                            <Search size={18} color="rgba(255,255,255,0.4)" />
                        )}
                    </View>

                    {foundUser && (
                        <Animated.View entering={FadeInDown} className="mt-4 bg-stone-900 p-5 rounded-3xl border border-amber-500/30">
                            <View className="flex-row items-center gap-4">
                                <ChessAvatar src={foundUser.avatar_url} size="md" />
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-lg">{foundUser.display_name || foundUser.username}</Text>
                                    <Text className="text-white/40 text-xs font-medium">@{foundUser.username}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={handleSendFriendRequest}
                                    disabled={busy}
                                    className="bg-amber-500 px-4 py-2 rounded-xl flex-row items-center gap-2"
                                >
                                    <UserPlus2 size={14} color="black" />
                                    <Text className="text-black font-black text-xs uppercase">Recruit</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    )}
                </View>

                {activeTab === 'teams' ? (
                    <>
                        {/* Actions Grid */}
                        <View className="flex-row px-6 gap-4 mb-8">
                            <TouchableOpacity
                                onPress={() => setCreateModalVisible(true)}
                                className="flex-1 bg-primary/10 p-5 rounded-3xl border border-primary/20 items-center"
                            >
                                <Plus size={24} color="hsl(24 100% 45%)" />
                                <Text className="text-primary font-bold mt-2">Create Team</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Teams List */}
                        <View className="px-6 mb-8">
                            <View className="flex-row items-center justify-between mb-4">
                                <Text className="text-lg font-bold text-foreground">Your Teams</Text>
                                <View className="px-3 py-1 bg-secondary rounded-full">
                                    <Text className="text-xs text-muted-foreground font-bold">{teams.length} Active</Text>
                                </View>
                            </View>

                            {loading ? (
                                <ActivityIndicator color="#f59e0b" className="mt-8" />
                            ) : teams.length === 0 ? (
                                renderEmptyState()
                            ) : (
                                <View className="gap-4">
                                    {teams.map((team, index) => (
                                        <Animated.View
                                            entering={FadeInRight.delay(index * 100)}
                                            key={team.id}
                                        >
                                            <TouchableOpacity
                                                className="bg-card p-5 rounded-[28px] border border-border/50 flex-row items-center gap-4"
                                                onPress={() => router.push(`/teams/${team.id}`)}
                                            >
                                                <View className="w-14 h-14 bg-secondary rounded-2xl items-center justify-center">
                                                    <Trophy size={24} color="hsl(24 100% 45%)" />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="font-bold text-foreground text-lg">{team.name}</Text>
                                                    <Text className="text-muted-foreground text-xs" numberOfLines={1}>
                                                        {team.description || 'Chess Team'}
                                                    </Text>
                                                </View>
                                                <ChevronRight size={20} color="hsl(30 10% 55%)" />
                                            </TouchableOpacity>
                                        </Animated.View>
                                    ))}
                                </View>
                            )}
                        </View>
                    </>
                ) : activeTab === 'friends' ? (
                    <View className="px-6 mb-8">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-lg font-bold text-foreground">Active Personnel</Text>
                            <TouchableOpacity
                                onPress={handleStartMatchmaking}
                                className="flex-row items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20"
                            >
                                <Play size={12} color="#f59e0b" fill="#f59e0b" />
                                <Text className="text-[10px] text-amber-500 uppercase tracking-widest font-black">Play Online</Text>
                            </TouchableOpacity>
                        </View>

                        {loading ? (
                            <ActivityIndicator color="#f59e0b" className="mt-8" />
                        ) : friends.length === 0 ? (
                            <View className="items-center justify-center p-8 mt-4 bg-card rounded-[32px] border border-border/50">
                                <Users size={32} color="rgba(255,255,255,0.2)" />
                                <Text className="text-muted-foreground text-center mt-4">No officers in your personnel list yet. Search for them using their Mission ID.</Text>
                            </View>
                        ) : (
                            <View className="gap-4">
                                {friends.map((friend, index) => (
                                    <Animated.View
                                        entering={FadeInRight.delay(index * 100)}
                                        key={friend.id}
                                    >
                                        <View className="bg-card p-5 rounded-[32px] border border-border/50 flex-row items-center gap-4">
                                            <ChessAvatar src={friend.otherUser?.avatar_url} size="md" />
                                            <View className="flex-1">
                                                <Text className="font-bold text-foreground text-lg">{friend.displayName}</Text>
                                                <Text className="text-muted-foreground text-xs">@{friend.otherUser?.username}</Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    setBusy(true)
                                                    try {
                                                        await GameService.sendGameInvitation(friend.otherUser.fixed_id)
                                                        Alert.alert('Mission Sent', `Deployment request sent to ${friend.displayName}.`)
                                                    } catch (e: any) {
                                                        Alert.alert('Error', e.message)
                                                    } finally {
                                                        setBusy(false)
                                                    }
                                                }}
                                                disabled={busy}
                                                className="bg-amber-500 h-10 w-10 rounded-xl items-center justify-center"
                                            >
                                                <Play size={16} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    </Animated.View>
                                ))}
                            </View>
                        )}
                    </View>
                ) : (
                    <View className="px-6 mb-8">
                        {/* Friend Requests */}
                        <View className="mb-8">
                            <Text className="text-xs font-black text-white/40 uppercase tracking-[4px] mb-4">Recruitment Requests</Text>
                            {friendRequests.length === 0 ? (
                                <View className="bg-stone-900/40 p-6 rounded-3xl border border-dashed border-white/10 items-center">
                                    <Text className="text-white/30 text-xs font-bold">No incoming recruitment requests</Text>
                                </View>
                            ) : (
                                <View className="gap-3">
                                    {friendRequests.map((req) => (
                                        <View key={req.id} className="bg-stone-900 p-5 rounded-[28px] border border-amber-500/20">
                                            <View className="flex-row items-center gap-4 mb-4">
                                                <ChessAvatar src={req.user?.avatar_url} size="md" />
                                                <View className="flex-1">
                                                    <Text className="text-white font-bold text-base">
                                                        {req.user?.display_name || req.user?.username}
                                                    </Text>
                                                    <Text className="text-amber-500/60 text-[10px] uppercase font-bold tracking-widest">Wants to join your unit</Text>
                                                </View>
                                            </View>
                                            <View className="flex-row gap-2">
                                                <TouchableOpacity
                                                    onPress={() => handleFriendRequest(req.id, false)}
                                                    className="flex-1 py-3 bg-stone-800 rounded-xl items-center border border-white/5"
                                                >
                                                    <X size={18} color="rgba(255,255,255,0.4)" />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => handleFriendRequest(req.id, true)}
                                                    className="flex-1 py-3 bg-amber-500 rounded-xl items-center flex-row justify-center gap-2"
                                                >
                                                    <Check size={18} color="black" strokeWidth={3} />
                                                    <Text className="text-black font-black text-xs uppercase">Accept</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Play Invitations */}
                        <View className="mb-8">
                            <Text className="text-xs font-black text-white/40 uppercase tracking-[4px] mb-4">Tactical Challenges</Text>
                            {gameInvitations.length === 0 ? (
                                <View className="bg-stone-900/40 p-6 rounded-3xl border border-dashed border-white/10 items-center">
                                    <Text className="text-white/30 text-xs font-bold">No active challenges</Text>
                                </View>
                            ) : (
                                <View className="gap-3">
                                    {gameInvitations.map((inv) => (
                                        <View key={inv.id} className="bg-stone-900 p-5 rounded-[28px] border border-amber-500/20">
                                            <View className="flex-row items-center gap-4 mb-4">
                                                <ChessAvatar src={inv.inviter?.avatar_url} size="md" />
                                                <View className="flex-1">
                                                    <Text className="text-white font-bold text-base">
                                                        {inv.inviter?.display_name || inv.inviter?.username}
                                                    </Text>
                                                    <View className="flex-row items-center gap-1">
                                                        <Trophy size={10} color="#f59e0b" />
                                                        <Text className="text-amber-500/60 text-[10px] uppercase font-bold tracking-widest">Wants to play</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View className="flex-row gap-2">
                                                <TouchableOpacity
                                                    onPress={() => handleDeclineGameInvitation(inv.id)}
                                                    className="flex-1 py-3 bg-stone-800 rounded-xl items-center border border-white/5"
                                                >
                                                    <Text className="text-white/40 text-xs font-bold">Decline</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => handleAcceptGameInvitation(inv.id)}
                                                    className="flex-1 py-3 bg-amber-500 rounded-xl items-center flex-row justify-center gap-2 shadow-lg shadow-amber-500/20"
                                                >
                                                    <Play size={14} color="black" />
                                                    <Text className="text-black font-black text-xs uppercase">Accept</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Team Invitations */}
                        <View>
                            <Text className="text-xs font-black text-white/40 uppercase tracking-[4px] mb-4">Squad Recruitment</Text>
                            {invitations.length === 0 ? (
                                <View className="bg-stone-900/40 p-6 rounded-3xl border border-dashed border-white/10 items-center">
                                    <Text className="text-white/30 text-xs font-bold">No pending squad invites</Text>
                                </View>
                            ) : (
                                <View className="gap-3">
                                    {invitations.map((inv) => (
                                        <View key={inv.id} className="bg-stone-900 p-4 rounded-3xl border border-white/5">
                                            <View className="flex-row items-center justify-between mb-2">
                                                <View className="flex-1">
                                                    <Text className="text-white font-bold">{inv.team?.name}</Text>
                                                    <Text className="text-white/40 text-[10px] uppercase font-bold">
                                                        Sent by {inv.inviter?.display_name || inv.inviter?.username}
                                                    </Text>
                                                </View>
                                                <View className="bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                                                    <Text className="text-amber-500 text-[10px] font-black uppercase tracking-wider">Pending</Text>
                                                </View>
                                            </View>
                                            {inv.message && (
                                                <Text className="text-white/60 text-sm mb-3 italic">"{inv.message}"</Text>
                                            )}
                                            <View className="flex-row gap-2">
                                                <TouchableOpacity
                                                    onPress={() => handleDeclineInvitation(inv.id)}
                                                    className="px-4 py-2 bg-stone-800 rounded-xl"
                                                >
                                                    <Text className="text-white/60 text-xs font-bold">Decline</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => handleAcceptInvitation(inv.id)}
                                                    className="px-4 py-2 bg-primary rounded-xl"
                                                >
                                                    <Text className="text-white text-xs font-bold">Accept</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Modals */}
            <Modal
                transparent
                visible={isCreateModalVisible || isJoinModalVisible}
                animationType="fade"
                onRequestClose={() => {
                    setCreateModalVisible(false)
                    setJoinModalVisible(false)
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 bg-black/80 items-center justify-center p-6"
                >
                    <Animated.View
                        entering={FadeInUp}
                        className="bg-stone-900 w-full p-8 rounded-[40px] border border-white/10"
                    >
                        <Text className="text-2xl font-bold text-white mb-2">
                            {isCreateModalVisible ? 'Create Team' : 'Join Team'}
                        </Text>
                        <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-6">
                            {isCreateModalVisible ? 'Establish your chess team' : 'Enter team details'}
                        </Text>

                        <TextInput
                            placeholder={isCreateModalVisible ? "Team Name" : "Enter 8-digit User ID"}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white mb-6 font-medium"
                            value={isCreateModalVisible ? teamName : joinId}
                            onChangeText={isCreateModalVisible ? setTeamName : setJoinId}
                            keyboardType={isCreateModalVisible ? "default" : "numeric"}
                            autoFocus
                            editable={!busy}
                            onSubmitEditing={isCreateModalVisible ? handleCreateTeam : handleJoinTeam}
                        />

                        <View className="flex-row gap-4">
                            <TouchableOpacity
                                onPress={() => {
                                    setCreateModalVisible(false)
                                    setJoinModalVisible(false)
                                    setBusy(false)
                                }}
                                disabled={busy}
                                className="flex-1 py-4 bg-white/5 rounded-2xl items-center"
                            >
                                <Text className="text-white font-bold">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={isCreateModalVisible ? handleCreateTeam : handleJoinTeam}
                                disabled={busy}
                                className={`flex-1 py-4 rounded-2xl items-center flex-row justify-center gap-2 ${busy ? 'bg-primary/50' : 'bg-primary'}`}
                            >
                                {busy && <ActivityIndicator size="small" color="white" />}
                                <Text className="text-white font-bold">
                                    {isCreateModalVisible ? 'Create' : 'Join'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            </Modal>

            <MatchmakingModal
                visible={isMatchmakingVisible}
                onCancel={handleCancelMatchmaking}
            />
        </SafeAreaView >
    )
}
