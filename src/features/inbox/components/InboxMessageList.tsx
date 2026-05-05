import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { inboxApi } from '../api';
import { useAuthStore } from '@/features/auth/store';
import { InboxMessageCard } from './InboxMessageCard';
import { EmptyInboxState } from './EmptyInboxState';
import { timeAgo } from '@/utils/date';

const PAGE_SIZE = 10;

const inboxKeys = {
  all: ['inbox'] as const,
  messages: (inboxId: string) => [...inboxKeys.all, 'messages', inboxId] as const,
};



export function InboxMessageList() {
  const { user, privateKey } = useAuthStore();
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: inboxKeys.messages(user?.id || ''),
    queryFn: ({ pageParam = 0 }) => inboxApi.fetchInboxMessages(user?.id || '', privateKey || '', pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data || lastPage.data.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleMarkRead = async (id: string) => {
    const queryKey = inboxKeys.messages(user?.id || '');

    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((msg: any) =>
            msg.id === id ? { ...msg, is_read: true } : msg
          ),
        })),
      };
    });

    try {
      await inboxApi.markMessageAsRead(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    const queryKey = inboxKeys.messages(user?.id || '');

    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.filter((msg: any) => msg.id !== id),
        })),
      };
    });

    try {
      await inboxApi.deleteInboxMessage(id);
    } catch (error) {
      console.log(error);
    }
  };

  const flattenMessages = data?.pages.flatMap((page) => page.data) ?? [];

  const inboxMessages = flattenMessages.map((msg) => ({
    id: msg.id,
    subject: msg.title,
    message: msg.message,
    createdAt: timeAgo(msg.created_at),
    isRead: msg.is_read,
  }));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white/85 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading your messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white/85 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm">
        <p className="text-red-500 font-medium">Failed to load messages</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-pink-600 font-semibold hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (inboxMessages.length === 0) {
    return <EmptyInboxState />;
  }

  return (
    <div className="space-y-4 pb-32">
      <AnimatePresence mode="popLayout">
        {inboxMessages.map((msg, index) => (
          <InboxMessageCard
            key={msg.id}
            msg={msg}
            index={index}
            onMarkRead={handleMarkRead}
            onDelete={handleDelete}
          />
        ))}
      </AnimatePresence>

      {/* Loading indicator for infinite scroll */}
      <div ref={ref} className="py-4 flex justify-center">
        {isFetchingNextPage && (
          <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
        )}
        {!hasNextPage && inboxMessages.length > 0 && (
          <p className="text-slate-400 text-xs font-medium italic">No more messages</p>
        )}
      </div>
    </div>
  );
}
