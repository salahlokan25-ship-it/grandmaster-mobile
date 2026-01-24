import { create } from 'zustand';
import { Story, Post, SocialUser } from '../types/social';

interface SocialStore {
    stories: Story[];
    posts: Post[];
    currentUser: SocialUser;

    addStory: (story: Omit<Story, 'id' | 'createdAt' | 'expiresAt' | 'user' | 'userId'>) => void;
    deleteStory: (id: string) => void;
    addPost: (post: Omit<Post, 'id' | 'createdAt' | 'user' | 'likes' | 'commentsCount' | 'userId'>) => void;
    deletePost: (id: string) => void;
    toggleLikePost: (id: string) => void;
    cleanupStories: () => void;
}

const MOCK_USER: SocialUser = {
    id: 'user_1',
    username: 'ChessMaster_Pro',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&h=200&fit=crop',
};

const MOCK_STORIES: Story[] = [
    {
        id: 's1',
        userId: 'u2',
        user: { id: 'u2', username: 'QueenSide', avatar: 'https://i.pravatar.cc/150?u=u2' },
        type: 'text',
        content: 'Just reached 1500 ELO! 🚀',
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    },
    {
        id: 's2',
        userId: 'u3',
        user: { id: 'u3', username: 'RookInvader', avatar: 'https://i.pravatar.cc/150?u=u3' },
        type: 'game_result',
        content: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        result: { winner: 'white', opponent: 'Stockfish 5', gameType: 'Blitz' },
        createdAt: Date.now() - 2 * 60 * 60 * 1000,
        expiresAt: Date.now() + 22 * 60 * 60 * 1000,
    },
];

const MOCK_POSTS: Post[] = [
    {
        id: 'p1',
        userId: 'u4',
        user: { id: 'u4', username: 'MagnusFan', avatar: 'https://i.pravatar.cc/150?u=u4' },
        content: 'What a brilliant sacrifice in my latest game! ♟️✨',
        gameFen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1',
        likes: 124,
        commentsCount: 18,
        createdAt: Date.now() - 4 * 60 * 60 * 1000,
    },
];

export const useSocialStore = create<SocialStore>((set, get) => ({
    stories: MOCK_STORIES,
    posts: MOCK_POSTS,
    currentUser: MOCK_USER,

    addStory: (storyData) => {
        const { currentUser } = get();
        const newStory: Story = {
            ...storyData,
            id: Math.random().toString(36).substring(7),
            userId: currentUser.id,
            user: currentUser,
            createdAt: Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };
        set((state) => ({ stories: [newStory, ...state.stories] }));
    },

    deleteStory: (id) => {
        set((state) => ({ stories: state.stories.filter((s) => s.id !== id) }));
    },

    addPost: (postData) => {
        const { currentUser } = get();
        const newPost: Post = {
            ...postData,
            id: Math.random().toString(36).substring(7),
            userId: currentUser.id,
            user: currentUser,
            likes: 0,
            commentsCount: 0,
            createdAt: Date.now(),
        };
        set((state) => ({ posts: [newPost, ...state.posts] }));
    },

    deletePost: (id) => {
        set((state) => ({ posts: state.posts.filter((p) => p.id !== id) }));
    },

    toggleLikePost: (id) => {
        set((state) => ({
            posts: state.posts.map((p) =>
                p.id === id ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked } : p
            ),
        }));
    },

    cleanupStories: () => {
        const now = Date.now();
        set((state) => ({
            stories: state.stories.filter((s) => s.expiresAt > now),
        }));
    },
}));
