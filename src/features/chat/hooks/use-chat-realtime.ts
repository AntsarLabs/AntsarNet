import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { chatKeys } from './use-chats';

/**
 * Hook to listen for realtime changes in chats and messages tables.
 * When a change occurs, it invalidates the relevant React Query caches
 * to ensure the UI stays in sync with the database.
 */
export function useChatRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let chatsChannel: ReturnType<typeof supabase.channel>;
    let messagesChannel: ReturnType<typeof supabase.channel>;

    const setupRealtime = async () => {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log('[Realtime] No session, skipping subscription');
        return;
      }

      const userId = session.user.id;
      console.log('[Realtime] Setting up subscriptions for user:', userId);

      // 1. Subscribe to chat list changes - filter for chats I'm in
      chatsChannel = supabase
        .channel('chat_list_updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'chats',
            filter: `sender_id=eq.${userId}`
          },
          (payload) => {
            console.log('[Realtime] Chat update:', payload);
            queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
            queryClient.invalidateQueries({ queryKey: chatKeys.listsWithLastMessage() });

            if (payload.new && (payload.new as any).id) {
              queryClient.invalidateQueries({
                queryKey: chatKeys.detail((payload.new as any).id)
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'chats',
            filter: `receiver_id=eq.${userId}`
          },
          (payload) => {
            console.log('[Realtime] Chat update (receiver):', payload);
            queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
            queryClient.invalidateQueries({ queryKey: chatKeys.listsWithLastMessage() });

            if (payload.new && (payload.new as any).id) {
              queryClient.invalidateQueries({
                queryKey: chatKeys.detail((payload.new as any).id)
              });
            }
          }
        )
        .subscribe((status) => {
          console.log('[Realtime] Chats channel status:', status);
        });

      // 2. Subscribe to ALL message changes (messages where I'm sender or receiver)
      messagesChannel = supabase
        .channel('message_updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `from=eq.${userId}`
          },
          (payload) => {
            console.log('[Realtime] Message update (sender):', payload);
            const chatId = (payload.new as any)?.chat_id || (payload.old as any)?.chat_id;
            if (chatId) {
              queryClient.invalidateQueries({ queryKey: chatKeys.messages(chatId) });
            }
            queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
            queryClient.invalidateQueries({ queryKey: chatKeys.listsWithLastMessage() });
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `to=eq.${userId}`
          },
          (payload) => {
            console.log('[Realtime] Message update (receiver):', payload);
            const chatId = (payload.new as any)?.chat_id || (payload.old as any)?.chat_id;
            if (chatId) {
              queryClient.invalidateQueries({ queryKey: chatKeys.messages(chatId) });
            }
            queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
            queryClient.invalidateQueries({ queryKey: chatKeys.listsWithLastMessage() });
          }
        )
        .subscribe((status) => {
          console.log('[Realtime] Messages channel status:', status);
        });
    };

    setupRealtime();

    // Cleanup subscriptions on unmount
    return () => {
      if (chatsChannel) {
        supabase.removeChannel(chatsChannel);
      }
      if (messagesChannel) {
        supabase.removeChannel(messagesChannel);
      }
    };
  }, [queryClient]);
}
