import { create } from 'zustand';
import { Contact, Message, ChatSession } from './types';

export const MOCK_USERS: Contact[] = [
  {
    id: '1',
    username: 'NeonPulse_88',
    emoji: '⚡',
    isOnline: true,
    lastMessage: 'Are you in position?',
    unreadCount: 0
  },
  {
    id: '2',
    username: 'ShadowWalker_92',
    emoji: '👤',
    isOnline: true,
    lastMessage: 'Almost there. Give me 5 mins.',
    unreadCount: 3
  },
  {
    id: '6',
    username: 'CyberGhost_404',
    emoji: '👻',
    isOnline: false,
    lastMessage: 'Disconnected',
    unreadCount: 0
  }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      senderId: '1',
      text: 'Are you in position?',
      timestamp: '10:30 AM'
    },
    {
      id: 'm2',
      senderId: 'me',
      text: 'Almost there. Give me 5 mins.',
      timestamp: '10:32 AM'
    }
  ]
};

const MOCK_SESSIONS: ChatSession[] = [
  {
    id: 's1',
    contactId: '1',
    startedAt: 'Apr 12, 2026 3:45 PM',
    lastMessageAt: 'Apr 12, 2026 4:30 PM',
    totalMessages: 42,
    unrepliedCount: 0,
    status: 'ended'
  },
  {
    id: 's2',
    contactId: '2',
    startedAt: 'Apr 17, 2026 10:15 AM',
    lastMessageAt: 'Apr 17, 2026 11:02 AM',
    totalMessages: 15,
    unrepliedCount: 3,
    status: 'active'
  },
  {
    id: 's3',
    contactId: '6',
    startedAt: 'Apr 10, 2026 8:00 PM',
    lastMessageAt: 'Apr 11, 2026 2:15 PM',
    totalMessages: 5,
    unrepliedCount: 0,
    status: 'ended'
  }
];

interface ChatState {
  contacts: Contact[];
  messages: Record<string, Message[]>;
  sessions: ChatSession[];
  sendMessage: (contactId: string, text: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  contacts: MOCK_USERS,
  messages: MOCK_MESSAGES,
  sessions: MOCK_SESSIONS,
  sendMessage: (contactId, text) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    set((state) => ({
      messages: {
        ...state.messages,
        [contactId]: [...(state.messages[contactId] || []), newMessage]
      }
    }));
  }
}));
