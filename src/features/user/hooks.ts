import { useInfiniteQuery, useQuery, keepPreviousData } from '@tanstack/react-query';
import { userApi } from './api';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: any) => [...userKeys.lists(), { filters }] as const,
  totals: () => [...userKeys.all, 'total'] as const,
  online: () => [...userKeys.totals(), 'online'] as const,
};

const PAGE_SIZE = 12;

export function useUsersInfinite(filters: { username?: string } = {}) {
  return useInfiniteQuery({
    queryKey: userKeys.list(filters),
    queryFn: ({ pageParam = 0 }) => 
      userApi.getUsers({ 
        page: pageParam, 
        limit: PAGE_SIZE, 
        username: filters.username 
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    placeholderData: keepPreviousData,
  });
}

export function useTotalOnlineUsers() {
  return useQuery({
    queryKey: userKeys.online(),
    queryFn: () => userApi.getTotalOnlineUsers(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
