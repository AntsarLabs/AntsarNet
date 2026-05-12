import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { postApi } from './api';
import type { PostType } from './types';

// ── Query key factory ─────────────────────────────────
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: { postType?: PostType | 'all', userId?: string, sort?: 'latest' | 'hot' | 'my' }) =>
    [...postKeys.lists(), filters] as const,
  tags: () => ['tags'] as const,
  comments: (postId: string) => [...postKeys.all, 'comments', postId] as const,
};

const PAGE_SIZE = 20;

// ── Posts (infinite scroll) ───────────────────────────
export function usePostsInfinite(options: { postType?: PostType | 'all', userId?: string, sort?: 'latest' | 'hot' | 'my' } = {}) {
  const { postType = 'all', userId, sort = 'latest' } = options;
  return useInfiniteQuery({
    queryKey: postKeys.list({ postType, userId, sort }),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => postApi.getPosts({ before: pageParam, limit: PAGE_SIZE, postType, userId, sort }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      // Return the created_at of the last post as the cursor for the next page
      return lastPage[lastPage.length - 1].created_at;
    },
    placeholderData: keepPreviousData,
  });
}

// ── Tags ──────────────────────────────────────────────
export function useTags() {
  return useQuery({
    queryKey: postKeys.tags(),
    queryFn: () => postApi.getTags(),
    staleTime: 1000 * 60 * 30, // tags rarely change, cache 30 min
  });
}

// ── Create post mutation ──────────────────────────────
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.createPost,
    onSuccess: () => {
      // Invalidate all post lists so new post appears everywhere
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// ── Comments ──────────────────────────────────────────
export function useComments(postId: string, options: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: [...postKeys.comments(postId), options],
    queryFn: () => postApi.getComments(postId, options),
    enabled: !!postId,
  });
}

/**
 * Hook to load more comments for pagination
 */
export function useLoadMoreComments() {
  return useMutation({
    mutationFn: async ({ postId, page, limit }: { postId: string; page: number; limit: number }) => {
      const comments = await postApi.getComments(postId, { page, limit });
      return comments;
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.addComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.comments(variables.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// ── Reactions ─────────────────────────────────────────
export function useToggleReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.toggleReaction,
    onSuccess: (_, variables) => {
      // Invalidate all post lists to update post reaction counts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      
      // If it's a comment reaction, invalidate that post's comment list
      if (variables.commentId) {
        // We might not have the postId here directly in the mutation variables 
        // if the API only takes commentId. But we can invalidate ALL comment lists 
        // or update the API to accept postId for invalidation purposes.
        queryClient.invalidateQueries({ queryKey: [...postKeys.all, 'comments'] });
      }
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

export function useReportPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.reportPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.updateComment,
    onSuccess: () => {
      // Invalidate all comment lists to show updated content
      queryClient.invalidateQueries({ queryKey: [...postKeys.all, 'comments'] });
    },
  });
}
