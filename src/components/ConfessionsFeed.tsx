import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, Sparkles } from 'lucide-react';
import { Post, Comment } from '../types/chat';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import { PostDetail } from './PostDetail';
import { ReactionType } from './ReactionBar';
interface ConfessionsFeedProps {
  currentUser: {
    emoji: string;
    friendId: string;
  };
  posts: Post[];
  comments: Comment[];
  onAddPost: (
  content: string,
  visibility: 'public' | 'anonymous_room',
  tags: string[])
  => void;
  onAddComment: (postId: string, content: string, parentId?: string) => void;
  onReactPost: (postId: string, type: ReactionType) => void;
  onReactComment: (commentId: string, type: ReactionType) => void;
}
export function ConfessionsFeed({
  currentUser,
  posts,
  comments,
  onAddPost,
  onAddComment,
  onReactPost,
  onReactComment
}: ConfessionsFeedProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'latest' | 'hot'>('latest');
  const activePosts = posts.filter((p) => p.status === 'active');
  const sortedPosts = [...activePosts].sort((a, b) => {
    if (filter === 'hot') {
      return (
        b.reactionCount + b.commentCount - (a.reactionCount + a.commentCount));

    }
    // Simple mock sorting by ID for 'latest'
    return parseInt(b.id.replace('p', '')) - parseInt(a.id.replace('p', ''));
  });
  const selectedPost = posts.find((p) => p.id === selectedPostId);
  const postComments = comments.filter((c) => c.postId === selectedPostId);
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 md:py-8 relative min-h-screen">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
            Confessions <Sparkles className="text-pink-400" size={24} />
          </h2>
          <p className="text-slate-300 text-sm">
            Share your secrets safely. Stay anonymous.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
            <button
              onClick={() => setFilter('latest')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'latest' ? 'bg-white/20 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}>
              
              Latest
            </button>
            <button
              onClick={() => setFilter('hot')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'hot' ? 'bg-white/20 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}>
              
              <Flame
                size={14}
                className={filter === 'hot' ? 'text-orange-400' : ''} />
              
              Hot
            </button>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-[#D82B7D] hover:bg-[#C0266F] active:bg-[#A82161] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
            
            <Plus size={16} />
            Confess
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4 pb-32">
        <AnimatePresence mode="popLayout">
          {sortedPosts.map((post) =>
          <motion.div
            key={post.id}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95
            }}
            transition={{
              duration: 0.2
            }}>
            
              <PostCard
              post={post}
              onReact={onReactPost}
              onClick={(p) => setSelectedPostId(p.id)} />
            
            </motion.div>
          )}
        </AnimatePresence>

        {sortedPosts.length === 0 &&
        <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
            <p className="text-slate-300 text-lg mb-2">It's quiet here...</p>
            <p className="text-slate-400 text-sm">
              Be the first to confess something.
            </p>
          </div>
        }
      </div>

      {/* Modals & Overlays */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={onAddPost}
        currentUser={currentUser} />
      

      <AnimatePresence>
        {selectedPost &&
        <PostDetail
          post={selectedPost}
          comments={postComments}
          onBack={() => setSelectedPostId(null)}
          onReactPost={onReactPost}
          onReactComment={onReactComment}
          onAddComment={onAddComment} />

        }
      </AnimatePresence>
    </div>);

}