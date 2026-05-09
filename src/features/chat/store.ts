import { create } from 'zustand';
import type { Message } from './types';

interface ChatState {
  // Active chat being viewed
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;

  // Input text for active chat
  inputText: string;
  setInputText: (text: string) => void;

  // Pending chat requests modal
  showRequestsModal: boolean;
  setShowRequestsModal: (show: boolean) => void;

  // Optimistic message updates (for instant UI feedback)
  optimisticMessages: Record<string, Message[]>;
  addOptimisticMessage: (chatId: string, message: Message) => void;
  clearOptimisticMessages: (chatId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeChatId: null,
  setActiveChatId: (id) => set({ activeChatId: id }),

  inputText: '',
  setInputText: (text) => set({ inputText: text }),

  showRequestsModal: false,
  setShowRequestsModal: (show) => set({ showRequestsModal: show }),

  optimisticMessages: {},
  addOptimisticMessage: (chatId, message) =>
    set((state) => ({
      optimisticMessages: {
        ...state.optimisticMessages,
        [chatId]: [...(state.optimisticMessages[chatId] || []), message],
      },
    })),
  clearOptimisticMessages: (chatId) =>
    set((state) => ({
      optimisticMessages: {
        ...state.optimisticMessages,
        [chatId]: [],
      },
    })),
}));
