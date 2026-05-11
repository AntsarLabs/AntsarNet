import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PostCard, CreatePostModal } from './components';
import { MainLayout } from '@/components/MainLayout';
import { usePostsInfinite, useCreatePost, useToggleReaction, useAddComment, useDeletePost } from './hooks';
import type { PostType, ReactionType } from './types';
import { POST_TYPE_META } from './types';
import { useAuthStore } from '@/features/auth/store';

const POST_TYPES: (PostType | 'all')[] = ['all', 'confession', 'vent', 'question', 'advice'];

export function ConfessionsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeType, setActiveType] = useState<PostType | 'all'>('all');
  const [sort, setSort] = useState<'latest' | 'hot' | 'my'>('latest');
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const filterUserId = searchParams.get('user');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePostsInfinite({
      postType: activeType,
      userId: filterUserId || (sort === 'my' ? user?.id : undefined),
      sort
    });
  const createPost = useCreatePost();
  const toggleReaction = useToggleReaction();
  const addComment = useAddComment();
  const deletePost = useDeletePost();

  const allPosts = data?.pages.flat() ?? [];

  const sortedPosts = [...allPosts].sort((a, b) => {
    if (sort === 'hot') {
      const aScore = (a.reaction_count || 0) + (a.comment_count || 0);
      const bScore = (b.reaction_count || 0) + (b.comment_count || 0);
      return bScore - aScore;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleCreatePost = (content: string, postType: PostType, tagIds: string[]) => {
    createPost.mutate({ content, postType, tagIds });
  };

  const handleReact = (targetId: string, emoji: ReactionType, isComment?: boolean) => {
    if (isComment) {
      toggleReaction.mutate({ commentId: targetId, emoji });
    } else {
      toggleReaction.mutate({ postId: targetId, emoji });
    }
  };

  const handleAddComment = (postId: string, content: string, parentCommentId?: string) => {
    addComment.mutate({ postId, content, parentCommentId });
  };

  const handleDeletePost = (postId: string) => {
    deletePost.mutate(postId);
  };

  return (
    <MainLayout>
      <div className="flex-1 w-full relative pb-20 md:pb-0">
        <div className="relative z-10">
          <div className="w-full max-w-3xl mx-auto px-4 py-6 md:py-8 relative min-h-screen">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex md:flex-row flex-col gap-2 justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-1">
                    {filterUserId ? 'User Posts' : 'Posts'}
                  </h2>
                  <p className="text-slate-500 text-sm">
                    {filterUserId ? 'Showing posts from this user.' : 'Confess, vent, ask, or share advice 100% anonymously.'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setSort('latest')}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${sort === 'latest' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      Latest
                    </button>
                    <button
                      onClick={() => setSort('hot')}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${sort === 'hot' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      Hot
                    </button>
                    {user && (
                      <button
                        onClick={() => setSort('my')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${sort === 'my' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        My
                      </button>
                    )}
                  </div>

                  {filterUserId ? (
                    <button
                      onClick={() => navigate('/posts')}
                      className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                      <X size={16} />
                      Clear Filter
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsCreateOpen(true)}
                      className="flex items-center gap-2 px-4 py-1.5 bg-[#D82B7D] hover:bg-[#C0266F] active:bg-[#A82161] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                      <Plus size={16} />
                      Post
                    </button>
                  )}
                </div>
              </div>

              {/* Post type tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 no-scrollbar">
                {POST_TYPES.map((type) => {
                  const isActive = activeType === type;
                  const meta = type === 'all' ? null : POST_TYPE_META[type];
                  const Icon = meta?.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => setActiveType(type)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white/80 text-slate-600 border-slate-200/60 hover:border-slate-300 hover:bg-white'
                        }`}
                    >
                      {Icon && <Icon size={14} />}
                      {type === 'all' ? 'All' : meta!.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feed */}
            <div className="space-y-4 pb-32">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-sm animate-pulse">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                        <div className="space-y-2 flex-1">
                          <div className="h-3 w-24 bg-slate-200 rounded" />
                          <div className="h-2.5 w-16 bg-slate-100 rounded" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-slate-100 rounded" />
                        <div className="h-3 w-3/4 bg-slate-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {sortedPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}>
                      <PostCard
                        post={post}
                        onReact={handleReact}
                        onAddComment={handleAddComment}
                        onDelete={handleDeletePost}
                        showDeleteButton={sort==='my'}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {sortedPosts.length === 0 && !isLoading && (
                <div className="text-center py-20 bg-white/85 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm">
                  <p className="text-slate-700 text-lg mb-2">It's quiet here...</p>
                  <p className="text-slate-500 text-sm">
                    Be the first to post something.
                  </p>
                </div>
              )}

              {hasNextPage && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-6 py-2 bg-white/90 border border-slate-200/60 rounded-xl text-sm font-medium text-slate-600 hover:bg-white transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isFetchingNextPage ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              )}
            </div>

            {/* Create Modal */}
            <CreatePostModal
              isOpen={isCreateOpen}
              onClose={() => setIsCreateOpen(false)}
              onSubmit={handleCreatePost}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
