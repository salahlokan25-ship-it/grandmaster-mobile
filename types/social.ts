import { PieceColor } from './chess';

export interface SocialUser {
    id: string;
    fixed_id: string; // 8-digit unique ID
    username: string;
    avatar: string;
    elo?: number;
}

export interface Team {
    id: string;
    name: string;
    ownerId: string;
    members: string[]; // Array of User IDs
    description?: string;
    createdAt: number;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: number;
    type: 'text' | 'game_invite' | 'system';
}

export type StoryType = 'game_result' | 'text' | 'image';

export interface Story {
    id: string;
    userId: string;
    user: SocialUser;
    type: StoryType;
    content: string; // FEN for games, text for text stories
    imageUrl?: string;
    result?: {
        winner: PieceColor | 'draw';
        opponent: string;
        gameType: string;
    };
    createdAt: number;
    expiresAt: number;
}

export interface Post {
    id: string;
    userId: string;
    user: SocialUser;
    content: string;
    imageUrl?: string;
    gameFen?: string;
    likes: number;
    isLiked?: boolean;
    commentsCount: number;
    createdAt: number;
}
