import React, { useEffect } from 'react';
import { Ban, Loader2 } from 'lucide-react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { accountApi } from '../../api';
import { useAuthStore } from '@/features/auth/store';

const PAGE_SIZE = 10;

const accountKeys = {
  all: ['account'] as const,
  blocked: () => [...accountKeys.all, 'blocked'] as const,
};

export const BlockedTab: React.FC = () => {
  const { user } = useAuthStore();
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
    queryKey: accountKeys.blocked(),
    queryFn: ({ pageParam = 0 }) => accountApi.getBlockedUsers(user?.id || '', pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const toggleBlockMutation = useMutation({
    mutationFn: (blockedId: string) => accountApi.toggleBlocking(user?.id || '', blockedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.blocked() });
    },
  });

  const handleUnblock = async (blockedId: string) => {
    try {
      await toggleBlockMutation.mutateAsync(blockedId);
    } catch (err) {
      console.error('Failed to unblock user:', err);
    }
  };

  const blockedUsers = data?.pages.flat() ?? [];

  return (
    <div className="space-y-4">
      <div className="bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm p-5 md:p-6">
        <h2 className="text-xl font-bold text-slate-900">Block List</h2>
        <p className="text-slate-500 text-sm mt-1">Users you have blocked</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm">
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading block list...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm">
          <p className="text-red-500 font-medium">Failed to load blocked users</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-pink-600 font-semibold hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : blockedUsers.length === 0 ? (
        <div className="text-center py-12 bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm">
          <Ban size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-700">No blocked users</h3>
          <p className="text-slate-400 text-sm mt-1">You haven't blocked anyone yet.</p>
        </div>
      ) : (
        <div className="space-y-2 pb-10">
          {blockedUsers.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-4 bg-white/85 backdrop-blur-md border border-white/60 rounded-xl md:rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm">
                  {contact.emoji}
                </div>
                <div className="flex flex-col">
                  <span className="font-mono font-semibold text-slate-800 text-sm">@{contact.username}</span>
                </div>
              </div>
              <button
                onClick={() => handleUnblock(contact.id)}
                disabled={toggleBlockMutation.isPending}
                className="px-4 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {toggleBlockMutation.isPending && toggleBlockMutation.variables === contact.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : null}
                Unblock
              </button>
            </div>
          ))}

          {/* Loading indicator for infinite scroll */}
          <div ref={ref} className="py-4 flex justify-center">
            {isFetchingNextPage && (
              <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
            )}
            {!hasNextPage && blockedUsers.length > 0 && (
              <p className="text-slate-400 text-xs font-medium italic">All blocked users loaded</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
