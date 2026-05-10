import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api';
import { chatKeys } from './use-chats';

/**
 * Hook to fetch messages for a specific chat
 */
export function useMessages(chatId: string, options: { limit?: number; offset?: number } = {}) {
  return useQuery({
    queryKey: [...chatKeys.messages(chatId), options],
    queryFn: () => chatApi.getMessages(chatId, options),
    enabled: !!chatId,
  });
}

/**
 * Hook to send a message in a chat
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, text }: { chatId: string; text: string }) =>
      chatApi.sendMessage(chatId, text),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(variables.chatId) });
      // Also invalidate lists to update "last message" preview if applicable
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
  });
}

/**
 * Hook to mark a message as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => chatApi.markAsRead(messageId),
    onSuccess: () => {
      // We don't necessarily know the chatId here without extra data, 
      // but we can invalidate all messages or specific ones if needed.
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
}
