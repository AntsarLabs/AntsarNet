import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api';

export const chatKeys = {
  all: ['chats'] as const,
  lists: () => [...chatKeys.all, 'list'] as const,
  listsWithLastMessage: () => [...chatKeys.all, 'list-with-last-message'] as const,
  detail: (id: string) => [...chatKeys.all, 'detail', id] as const,
  messages: (chatId: string) => [...chatKeys.detail(chatId), 'messages'] as const,
};

/**
 * Hook to fetch the list of chats for the current user
 */
export function useChats() {
  return useQuery({
    queryKey: chatKeys.lists(),
    queryFn: () => chatApi.getChats(),
    refetchInterval: 10000, // Refetch every 10 seconds for basic "live" feel if realtime isn't enough
  });
}

/**
 * Hook to fetch chats with last message info for the chat list
 */
export function useChatsWithLastMessage() {
  return useQuery({
    queryKey: chatKeys.listsWithLastMessage(),
    queryFn: () => chatApi.getChatsWithLastMessage(),
    staleTime: 1000 * 5, // 5 seconds
  });
}

/**
 * Hook to create a new chat session
 */
export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receiverId: string) => chatApi.createChat(receiverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
  });
}

/**
 * Hook to update chat status (accept/decline)
 */
export function useUpdateChatStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, status }: { chatId: string; status: 'accepted' | 'declined' }) =>
      chatApi.updateChatStatus(chatId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
      queryClient.invalidateQueries({ queryKey: chatKeys.detail(variables.chatId) });
    },
  });
}
