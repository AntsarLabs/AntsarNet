import type { User } from "@/features/user/types";

export interface ChatParticipant extends User {
  blockStatus?: 'blocked_by_you' | 'blocked_you' | null;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  seenAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Chat {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  senderDeletedAt?: string | null;
  receiverDeletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  sender?: ChatParticipant;
  receiver?: ChatParticipant;
}

// Extended chat with last message info for the list
export interface ChatWithLastMessage extends Chat {
  lastMessage?: {
    text: string;
    createdAt: string;
    senderId: string;
  } | null;
  unreadCount?: number;
}

// For pending chat requests
export interface PendingChatRequest extends Chat {
  isIncoming: boolean; // true if current user is the receiver
  requester: ChatParticipant;
}

// Chat form input
export interface SendMessageInput {
  chatId: string;
  text: string;
}

// Chat status update
export interface UpdateChatStatusInput {
  chatId: string;
  status: 'accepted' | 'declined';
}

