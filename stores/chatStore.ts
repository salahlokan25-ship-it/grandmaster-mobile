import { create } from 'zustand';
import { db } from '../lib/firebase';
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    doc,
    setDoc,
    where,
    orderBy,
    Timestamp,
    getDocs,
    updateDoc,
    arrayUnion,
    deleteDoc
} from 'firebase/firestore';
import { Message, Team, SocialUser } from '../types/social';

export interface TeamInvitation {
    id: string;
    teamId: string;
    teamName: string;
    senderName: string;
    receiverId: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: number;
}

interface ChatState {
    teams: Team[];
    messages: Record<string, Message[]>; // TeamId -> Messages
    teamInvitations: TeamInvitation[];
    loading: boolean;

    fetchTeams: (userId: string) => () => void;
    subscribeToMessages: (teamId: string) => () => void;
    subscribeToTeamInvitations: (userId: string) => () => void;
    sendMessage: (teamId: string, senderId: string, text: string) => Promise<void>;
    createTeam: (name: string, owner: SocialUser) => Promise<string>;
    joinTeamById: (teamId: string, userId: string) => Promise<void>;
    sendTeamInvitation: (teamId: string, targetStrategoId: string, senderName: string) => Promise<void>;
    respondToTeamInvitation: (invitationId: string, status: 'accepted' | 'declined', userId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    teams: [],
    messages: {},
    teamInvitations: [],
    loading: false,

    fetchTeams: (userId) => {
        set({ loading: true });
        const q = query(collection(db, 'teams'), where('members', 'array-contains', userId));

        return onSnapshot(q, (snapshot) => {
            const teams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
            set({ teams, loading: false });
        });
    },

    subscribeToMessages: (teamId) => {
        const q = query(
            collection(db, 'teams', teamId, 'messages'),
            orderBy('createdAt', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            set((state) => ({
                messages: { ...state.messages, [teamId]: msgs }
            }));
        });
    },

    subscribeToTeamInvitations: (userId) => {
        const q = query(
            collection(db, 'teamInvitations'),
            where('receiverId', '==', userId),
            where('status', '==', 'pending')
        );

        return onSnapshot(q, (snapshot) => {
            const invitations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamInvitation));
            set({ teamInvitations: invitations });
        });
    },

    sendMessage: async (teamId, senderId, text) => {
        const messageData = {
            senderId,
            text,
            createdAt: Date.now(),
            type: 'text' as const,
        };
        await addDoc(collection(db, 'teams', teamId, 'messages'), messageData);
    },

    createTeam: async (name, owner) => {
        const teamRef = doc(collection(db, 'teams'));
        const teamData: Team = {
            id: teamRef.id,
            name,
            ownerId: owner.id,
            members: [owner.id],
            description: `A formidable chess team lead by ${owner.username}`,
            createdAt: Date.now(),
        };
        await setDoc(teamRef, teamData);
        return teamRef.id;
    },

    joinTeamById: async (teamId, userId) => {
        const teamRef = doc(db, 'teams', teamId);
        await updateDoc(teamRef, {
            members: arrayUnion(userId)
        });
    },

    sendTeamInvitation: async (teamId, targetStrategoId, senderName) => {
        const q = query(collection(db, 'users'), where('strategoId', '==', targetStrategoId));
        const snapshot = await getDocs(q);

        if (snapshot.empty) throw new Error('User not found');

        const receiver = snapshot.docs[0].data() as SocialUser;
        const teamSnap = await getDocs(query(collection(db, 'teams'), where('id', '==', teamId)));
        const teamData = teamSnap.docs[0]?.data() as Team;

        if (!teamData) throw new Error('Team not found');

        const inviteData: Omit<TeamInvitation, 'id'> = {
            teamId,
            teamName: teamData.name,
            senderName,
            receiverId: receiver.id,
            status: 'pending',
            createdAt: Date.now(),
        };

        await addDoc(collection(db, 'teamInvitations'), inviteData);
    },

    respondToTeamInvitation: async (invitationId, status, userId) => {
        const inviteRef = doc(db, 'teamInvitations', invitationId);

        if (status === 'declined') {
            await deleteDoc(inviteRef);
        } else {
            const inviteSnap = await getDocs(query(collection(db, 'teamInvitations')));
            const invite = inviteSnap.docs.find(d => d.id === invitationId)?.data() as TeamInvitation;

            if (!invite) return;

            await updateDoc(inviteRef, { status: 'accepted' });

            const teamRef = doc(db, 'teams', invite.teamId);
            await updateDoc(teamRef, {
                members: arrayUnion(userId)
            });
        }
    }
}));
