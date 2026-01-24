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
    getDocs,
    updateDoc,
    arrayUnion,
    deleteDoc
} from 'firebase/firestore';
import { SocialUser } from '../types/social';

export interface Challenge {
    id: string;
    senderId: string;
    senderName: string;
    receiverId: string;
    status: 'pending' | 'accepted' | 'declined';
    gameId?: string;
    createdAt: number;
}

export interface FriendRequest {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    receiverId: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: number;
}

interface FriendsState {
    friends: SocialUser[];
    incomingChallenges: Challenge[];
    sentChallenges: Challenge[];
    friendRequests: FriendRequest[];
    loading: boolean;

    fetchFriends: (userId: string) => () => void;
    subscribeToChallenges: (userId: string) => () => void;
    subscribeToSentChallenges: (userId: string) => () => void;
    subscribeToFriendRequests: (userId: string) => () => void;
    sendFriendRequest: (strategoId: string, sender: SocialUser) => Promise<void>;
    respondToFriendRequest: (requestId: string, status: 'accepted' | 'declined', currentUserId: string) => Promise<void>;
    sendChallenge: (receiverId: string, sender: SocialUser) => Promise<void>;
    respondToChallenge: (challengeId: string, status: 'accepted' | 'declined') => Promise<string | void>;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
    friends: [],
    incomingChallenges: [],
    sentChallenges: [],
    friendRequests: [],
    loading: false,

    fetchFriends: (userId) => {
        set({ loading: true });
        const userRef = doc(db, 'users', userId);

        return onSnapshot(userRef, async (snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.data();
                const friendIds = userData.friends || [];

                if (friendIds.length > 0) {
                    const friendDocs = await Promise.all(
                        friendIds.map((id: string) => getDocs(query(collection(db, 'users'), where('id', '==', id))))
                    );
                    const friends = friendDocs.map(snap => snap.docs[0]?.data() as SocialUser).filter(Boolean);
                    set({ friends, loading: false });
                } else {
                    set({ friends: [], loading: false });
                }
            }
        });
    },

    subscribeToChallenges: (userId) => {
        const q = query(
            collection(db, 'challenges'),
            where('receiverId', '==', userId),
            where('status', '==', 'pending')
        );

        return onSnapshot(q, (snapshot) => {
            const incoming = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge));
            set({ incomingChallenges: incoming });
        });
    },

    subscribeToSentChallenges: (userId) => {
        const q = query(
            collection(db, 'challenges'),
            where('senderId', '==', userId),
            where('status', 'in', ['pending', 'accepted'])
        );

        return onSnapshot(q, (snapshot) => {
            const sent = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge));
            set({ sentChallenges: sent });
        });
    },

    subscribeToFriendRequests: (userId) => {
        const q = query(
            collection(db, 'friendRequests'),
            where('receiverId', '==', userId),
            where('status', '==', 'pending')
        );

        return onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FriendRequest));
            set({ friendRequests: requests });
        });
    },

    sendFriendRequest: async (strategoId, sender) => {
        const q = query(collection(db, 'users'), where('strategoId', '==', strategoId));
        const snapshot = await getDocs(q);

        if (snapshot.empty) throw new Error('User not found');

        const receiver = snapshot.docs[0].data() as SocialUser;
        if (receiver.id === sender.id) throw new Error('You cannot add yourself');

        const requestData: Omit<FriendRequest, 'id'> = {
            senderId: sender.id,
            senderName: sender.username,
            senderAvatar: sender.avatar,
            receiverId: receiver.id,
            status: 'pending',
            createdAt: Date.now(),
        };

        await addDoc(collection(db, 'friendRequests'), requestData);
    },

    respondToFriendRequest: async (requestId, status, currentUserId) => {
        const requestRef = doc(db, 'friendRequests', requestId);

        if (status === 'declined') {
            await deleteDoc(requestRef);
        } else {
            const requestSnap = await getDocs(query(collection(db, 'friendRequests')));
            const request = requestSnap.docs.find(d => d.id === requestId)?.data() as FriendRequest;

            if (!request) return;

            await updateDoc(requestRef, { status: 'accepted' });

            const userRef = doc(db, 'users', currentUserId);
            const senderRef = doc(db, 'users', request.senderId);

            await updateDoc(userRef, { friends: arrayUnion(request.senderId) });
            await updateDoc(senderRef, { friends: arrayUnion(currentUserId) });
        }
    },

    sendChallenge: async (receiverId, sender) => {
        const challengeData = {
            senderId: sender.id,
            senderName: sender.username,
            receiverId,
            status: 'pending',
            createdAt: Date.now(),
        };
        await addDoc(collection(db, 'challenges'), challengeData);
    },

    respondToChallenge: async (challengeId, status) => {
        const challengeRef = doc(db, 'challenges', challengeId);
        if (status === 'declined') {
            await deleteDoc(challengeRef);
        } else {
            const newGameId = doc(collection(db, 'games')).id;
            await setDoc(doc(db, 'games', newGameId), {
                createdAt: Date.now(),
                fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                white: 'unknown',
                black: 'unknown',
                moves: []
            });
            await updateDoc(challengeRef, { status: 'accepted', gameId: newGameId });
            return newGameId;
        }
    }
}));
