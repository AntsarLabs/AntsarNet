export interface User {
  id: string;
  username: string;
  emoji: string;
  isOnline: boolean;
  distance?: string;
  city?: string;
}

export interface Contact extends User {
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  blockStatus?: 'blocked_by_you' | 'blocked_you' | null;
  mood?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  contactId: string;
  startedAt: string;
  lastMessageAt: string;
  totalMessages: number;
  unrepliedCount: number;
  status: 'active' | 'ended';
}

export interface Post {
  id: string;
  userId: string;
  emoji: string;
  content: string;
  tags: string[];
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | null;
  visibility: 'public' | 'anonymous_room' | 'private_match';
  createdAt: string;
  status: 'active' | 'deleted' | 'flagged' | 'hidden';
  reactionCount: number;
  commentCount: number;
  reportCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  emoji: string;
  parentCommentId?: string | null;
  content: string;
  createdAt: string;
  status: 'active' | 'deleted' | 'hidden' | 'flagged';
  reactionCount: number;
  reportCount: number;
}

export interface Reaction {
  id: string;
  userId: string;
  targetType: 'post' | 'comment';
  targetId: string;
  reactionType: 'like' | 'love' | 'laugh' | 'sad' | 'angry' | 'fire';
  createdAt: string;
}
