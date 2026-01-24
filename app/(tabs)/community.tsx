import { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, TextInput,
    Alert, ActivityIndicator, Modal, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
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
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChessAvatar } from '../../components/ui/ChessAvatar';
import { cn } from '../../lib/utils';
import { IconButton } from '../../components/ui/IconButton';
import { useUserStore } from '../../stores/userStore';
import { useChatStore } from '../../stores/chatStore';
import { useFriendsStore, Challenge } from '../../stores/friendsStore';
import * as Clipboard from 'expo-clipboard';
import Animated, { FadeInRight, FadeInUp, Layout } from 'react-native-reanimated';

export default function CommunityPage() {
    const router = useRouter();
    const { currentUser } = useUserStore();
    const {
        teams, fetchTeams, createTeam, joinTeamById,
        teamInvitations, subscribeToTeamInvitations, respondToTeamInvitation,
        loading
    } = useChatStore();
    const {
        friends, fetchFriends, sendFriendRequest,
        friendRequests, subscribeToFriendRequests, respondToFriendRequest,
        sendChallenge, loading: friendsLoading
    } = useFriendsStore();

    const [activeTab, setActiveTab] = useState<'teams' | 'friends' | 'pending'>('teams');
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isJoinModalVisible, setJoinModalVisible] = useState(false);
    const [isAddFriendModalVisible, setAddFriendModalVisible] = useState(false);
    const [isInviteModalVisible, setInviteModalVisible] = useState(false);

    const [teamName, setTeamName] = useState('');
    const [joinId, setJoinId] = useState('');
    const [friendId, setFriendId] = useState('');
    const [inviteTargetId, setInviteTargetId] = useState('');
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [selectedTeamName, setSelectedTeamName] = useState('');

    const { sendTeamInvitation } = useChatStore();
    const handleSendTeamInvite = async () => {
        if (!inviteTargetId.trim() || !selectedTeamId) return;
        try {
            await sendTeamInvitation(selectedTeamId, inviteTargetId.trim(), currentUser.username);
            setInviteTargetId('');
            setInviteModalVisible(false);
            Alert.alert('Invite Sent', `Recruitment dispatch sent for ${selectedTeamName}!`);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not send invitation');
        }
    };

    useEffect(() => {
        if (currentUser.id) {
            const unsubTeams = fetchTeams(currentUser.id);
            const unsubFriends = fetchFriends(currentUser.id);
            const unsubFriendRequests = subscribeToFriendRequests(currentUser.id);
            const unsubTeamInvites = subscribeToTeamInvitations(currentUser.id);

            return () => {
                unsubTeams && unsubTeams();
                unsubFriends && unsubFriends();
                unsubFriendRequests && unsubFriendRequests();
                unsubTeamInvites && unsubTeamInvites();
            };
        }
    }, [currentUser.id]);

    const handleCreateTeam = async () => {
        if (!teamName.trim()) return;
        try {
            await createTeam(teamName, {
                id: currentUser.id,
                username: currentUser.username,
                avatar: currentUser.avatar || '',
                strategoId: currentUser.strategoId || ''
            });
            setTeamName('');
            setCreateModalVisible(false);
            Alert.alert('Success', 'Team created successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to create team');
        }
    };

    const handleJoinTeam = async () => {
        if (!joinId.trim()) return;
        try {
            await joinTeamById(joinId, currentUser.id);
            setJoinId('');
            setJoinModalVisible(false);
            Alert.alert('Success', 'Joined the team!');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to join team');
        }
    };

    const handleAddFriend = async () => {
        if (!friendId.trim()) return;
        try {
            await sendFriendRequest(friendId.trim(), currentUser as any);
            setFriendId('');
            setAddFriendModalVisible(false);
            Alert.alert('Request Sent', 'Friend request has been dispatched!');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not find user');
        }
    };

    const copyId = async () => {
        if (currentUser.strategoId) {
            await Clipboard.setStringAsync(currentUser.strategoId);
            Alert.alert('Copied', 'Your Strategos ID has been copied!');
        }
    };

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center p-8 mt-12">
            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
                <Users size={40} color="hsl(24 100% 45%)" />
            </View>
            <Text className="text-xl font-bold text-foreground text-center mb-2">No Teams Yet</Text>
            <Text className="text-muted-foreground text-center mb-8">
                Build your chess empire. Create or join a team to start collaborating with other masters.
            </Text>
            <TouchableOpacity
                onPress={() => setCreateModalVisible(true)}
                className="bg-primary px-8 py-4 rounded-2xl flex-row items-center gap-2"
            >
                <Plus size={20} color="white" strokeWidth={3} />
                <Text className="text-white font-bold">Create First Team</Text>
            </TouchableOpacity>
        </View>
    );

    const renderEmptyFriends = () => (
        <View className="flex-1 items-center justify-center p-8 mt-12">
            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
                <Users size={40} color="hsl(24 100% 45%)" />
            </View>
            <Text className="text-xl font-bold text-foreground text-center mb-2">No Friends Added</Text>
            <Text className="text-muted-foreground text-center mb-8">
                Build your network. Add friends by their 10-digit UID (e.g., 5298103421) to challenge them.
            </Text>
            <TouchableOpacity
                onPress={() => setAddFriendModalVisible(true)}
                className="bg-primary px-8 py-4 rounded-2xl flex-row items-center gap-2"
            >
                <UserPlus size={20} color="white" strokeWidth={3} />
                <Text className="text-white font-bold">Add Friend</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="px-6 py-4 border-b border-border/50 bg-background/80 flex-row items-center justify-between">
                <View>
                    <Text className="text-2xl font-black text-primary italic lowercase tracking-tight">Teams Hub</Text>
                    <Text className="text-[10px] text-muted-foreground uppercase tracking-[3px] font-bold">Collaborate & Conquer</Text>
                </View>
                <View className="flex-row gap-2">
                    <IconButton icon={activeTab === 'teams' ? Plus : UserPlus} onPress={() => activeTab === 'teams' ? setCreateModalVisible(true) : setAddFriendModalVisible(true)} />
                </View>
            </View>

            <View className="px-6 py-2 flex-row gap-6 border-b border-border/30">
                <TouchableOpacity onPress={() => setActiveTab('teams')} className={cn("py-3 border-b-2", activeTab === 'teams' ? "border-primary" : "border-transparent")}>
                    <Text className={cn("font-bold", activeTab === 'teams' ? "text-foreground" : "text-muted-foreground")}>Teams</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('friends')} className={cn("py-3 border-b-2", activeTab === 'friends' ? "border-primary" : "border-transparent")}>
                    <Text className={cn("font-bold", activeTab === 'friends' ? "text-foreground" : "text-muted-foreground")}>Friends</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('pending')} className={cn("py-3 border-b-2 relative", activeTab === 'pending' ? "border-primary" : "border-transparent")}>
                    <Text className={cn("font-bold", activeTab === 'pending' ? "text-foreground" : "text-muted-foreground")}>Pending</Text>
                    {(friendRequests.length + teamInvitations.length) > 0 && (
                        <View className="absolute top-2 -right-3 w-4 h-4 bg-primary rounded-full items-center justify-center">
                            <Text className="text-[8px] text-white font-bold">{friendRequests.length + teamInvitations.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* User Identity Card */}
                <View className="px-6 py-6">
                    <View className="bg-stone-900 rounded-[32px] p-6 border border-white/5 shadow-xl relative overflow-hidden">
                        <View className="absolute top-0 right-0 p-8 opacity-5">
                            <Shield size={120} color="white" />
                        </View>

                        <View className="flex-row items-center gap-4 mb-6">
                            <ChessAvatar src={currentUser.avatar} size="lg" />
                            <View>
                                <Text className="text-white font-bold text-lg">{currentUser.username}</Text>
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
                                    {currentUser.strategoId || '— — — — — — — — — —'}
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
                            <TouchableOpacity
                                onPress={() => setJoinModalVisible(true)}
                                className="flex-1 bg-stone-900 p-5 rounded-3xl border border-white/5 items-center"
                            >
                                <UserPlus size={24} color="#f59e0b" />
                                <Text className="text-white font-bold mt-2">Join by ID</Text>
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
                                                onPress={() => alert('Chat flow coming soon!')}
                                            >
                                                <View className="w-14 h-14 bg-secondary rounded-2xl items-center justify-center">
                                                    <Trophy size={24} color="hsl(24 100% 45%)" />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="font-bold text-foreground text-lg">{team.name}</Text>
                                                    <Text className="text-muted-foreground text-xs" numberOfLines={1}>
                                                        {team.members.length} Master{team.members.length !== 1 ? 's' : ''} • {team.description}
                                                    </Text>
                                                </View>
                                                {team.ownerId === currentUser.id && (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setSelectedTeamId(team.id);
                                                            setSelectedTeamName(team.name);
                                                            setInviteModalVisible(true);
                                                        }}
                                                        className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20"
                                                    >
                                                        <Text className="text-primary font-bold text-xs uppercase">Recruit</Text>
                                                    </TouchableOpacity>
                                                )}
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
                            <Text className="text-lg font-bold text-foreground">Your Friends</Text>
                            <View className="px-3 py-1 bg-secondary rounded-full">
                                <Text className="text-xs text-muted-foreground font-bold">{friends.length} Master{friends.length !== 1 ? 's' : ''}</Text>
                            </View>
                        </View>

                        {friendsLoading ? (
                            <ActivityIndicator color="#f59e0b" className="mt-8" />
                        ) : friends.length === 0 ? (
                            renderEmptyFriends()
                        ) : (
                            <View className="gap-4">
                                {friends.map((friend, index) => (
                                    <Animated.View
                                        entering={FadeInRight.delay(index * 100)}
                                        key={friend.id}
                                    >
                                        <TouchableOpacity
                                            className="bg-card p-4 rounded-[24px] border border-border/50 flex-row items-center gap-4"
                                            onPress={() => {
                                                Alert.alert(
                                                    "Challenge Player?",
                                                    `Send a game invite to ${friend.username}?`,
                                                    [
                                                        { text: "Cancel", style: "cancel" },
                                                        { text: "Send Challenge", onPress: () => sendChallenge(friend.id, currentUser as any) }
                                                    ]
                                                )
                                            }}
                                        >
                                            <ChessAvatar src={friend.avatar} size="md" />
                                            <View className="flex-1">
                                                <Text className="font-bold text-foreground text-base">{friend.username}</Text>
                                                <Text className="text-amber-500 text-[10px] font-mono tracking-tighter uppercase">{friend.strategoId}</Text>
                                            </View>
                                            <View className="px-3 py-1.5 bg-primary/10 rounded-full">
                                                <Text className="text-primary font-bold text-xs uppercase">Battle</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Animated.View>
                                ))}
                            </View>
                        )}
                    </View>
                ) : (
                    <View className="px-6 mb-8">
                        {/* Friend Requests */}
                        <View className="mb-8">
                            <Text className="text-xs font-black text-white/40 uppercase tracking-[4px] mb-4">Friend Requests</Text>
                            {friendRequests.length === 0 ? (
                                <View className="bg-stone-900/40 p-6 rounded-3xl border border-dashed border-white/10 items-center">
                                    <Text className="text-white/30 text-xs font-bold">No pending friend requests</Text>
                                </View>
                            ) : (
                                <View className="gap-3">
                                    {friendRequests.map((req) => (
                                        <View key={req.id} className="bg-stone-900 p-4 rounded-3xl border border-white/5 flex-row items-center gap-4">
                                            <ChessAvatar src={req.senderAvatar} size="md" />
                                            <View className="flex-1">
                                                <Text className="text-white font-bold">{req.senderName}</Text>
                                                <Text className="text-white/40 text-[10px] uppercase font-bold">Wants to be friends</Text>
                                            </View>
                                            <View className="flex-row gap-2">
                                                <TouchableOpacity
                                                    onPress={() => respondToFriendRequest(req.id, 'declined', currentUser.id)}
                                                    className="w-8 h-8 bg-red-500/10 rounded-full items-center justify-center border border-red-500/20"
                                                >
                                                    <Plus size={16} color="#ef4444" style={{ transform: [{ rotate: '45deg' }] }} />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => respondToFriendRequest(req.id, 'accepted', currentUser.id)}
                                                    className="w-8 h-8 bg-green-500/10 rounded-full items-center justify-center border border-green-500/20"
                                                >
                                                    <Plus size={16} color="#22c55e" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Team Invitations */}
                        <View>
                            <Text className="text-xs font-black text-white/40 uppercase tracking-[4px] mb-4">Team Invitations</Text>
                            {teamInvitations.length === 0 ? (
                                <View className="bg-stone-900/40 p-6 rounded-3xl border border-dashed border-white/10 items-center">
                                    <Text className="text-white/30 text-xs font-bold">No pending team invites</Text>
                                </View>
                            ) : (
                                <View className="gap-3">
                                    {teamInvitations.map((inv) => (
                                        <View key={inv.id} className="bg-stone-900 p-4 rounded-3xl border border-white/5 flex-row items-center gap-4">
                                            <View className="w-12 h-12 bg-amber-500/10 rounded-2xl items-center justify-center border border-amber-500/20">
                                                <Trophy size={20} color="#f59e0b" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-white font-bold">{inv.teamName}</Text>
                                                <Text className="text-white/40 text-[10px] uppercase font-bold">Invited by {inv.senderName}</Text>
                                            </View>
                                            <View className="flex-row gap-2">
                                                <TouchableOpacity
                                                    onPress={() => respondToTeamInvitation(inv.id, 'declined', currentUser.id)}
                                                    className="px-4 py-2 bg-stone-800 rounded-xl"
                                                >
                                                    <Text className="text-white/60 text-xs font-bold">Ignore</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => respondToTeamInvitation(inv.id, 'accepted', currentUser.id)}
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
                visible={isCreateModalVisible || isJoinModalVisible || isAddFriendModalVisible || isInviteModalVisible}
                animationType="fade"
                onRequestClose={() => {
                    setCreateModalVisible(false);
                    setJoinModalVisible(false);
                    setAddFriendModalVisible(false);
                    setInviteModalVisible(false);
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
                            {isCreateModalVisible ? 'Create Team' :
                                isJoinModalVisible ? 'Infiltrate Team' :
                                    isAddFriendModalVisible ? 'Add Friend' :
                                        `Recruit to ${selectedTeamName}`}
                        </Text>
                        <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-6">
                            {isInviteModalVisible ? 'Deploy recruitment invitation' : 'Expand your influence'}
                        </Text>

                        <TextInput
                            placeholder={isCreateModalVisible ? "Strategic Team Name" : "Enter 10-digit numeric UID"}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white mb-6 font-medium"
                            value={isCreateModalVisible ? teamName :
                                isJoinModalVisible ? joinId :
                                    isAddFriendModalVisible ? friendId :
                                        inviteTargetId}
                            onChangeText={isCreateModalVisible ? setTeamName :
                                isJoinModalVisible ? setJoinId :
                                    isAddFriendModalVisible ? setFriendId :
                                        setInviteTargetId}
                            keyboardType={isCreateModalVisible ? "default" : "numeric"}
                            autoFocus
                        />

                        <View className="flex-row gap-4">
                            <TouchableOpacity
                                onPress={() => {
                                    setCreateModalVisible(false);
                                    setJoinModalVisible(false);
                                    setAddFriendModalVisible(false);
                                    setInviteModalVisible(false);
                                }}
                                className="flex-1 py-4 bg-white/5 rounded-2xl items-center"
                            >
                                <Text className="text-white font-bold">Abort</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={isCreateModalVisible ? handleCreateTeam :
                                    isJoinModalVisible ? handleJoinTeam :
                                        isAddFriendModalVisible ? handleAddFriend :
                                            handleSendTeamInvite}
                                className="flex-1 py-4 bg-primary rounded-2xl items-center"
                            >
                                <Text className="text-white font-bold">
                                    {isCreateModalVisible ? 'Establish' :
                                        isJoinModalVisible ? 'Join' :
                                            isAddFriendModalVisible ? 'Send Request' :
                                                'Send Invite'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}
