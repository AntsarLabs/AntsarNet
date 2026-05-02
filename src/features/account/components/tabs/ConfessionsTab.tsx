import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Pencil, Trash2, MessageCircle, Send, Share2 } from 'lucide-react';
import { Post } from '@/types/chat';

// Mock data inside component as requested
const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'MyCodeName123',
    emoji: '😎',
    content: "I've been secretely learning Amharic to surprise my friend on their wedding day next month! Hope I can pull it off.",
    reactionCount: 24,
    commentCount: 5,
    reportCount: 0,
    createdAt: '2 hours ago',
    tags: ['Learning', 'Surprise'],
    visibility: 'public',
    status: 'active'
  },
  {
    id: 'p2',
    userId: 'MyCodeName123',
    emoji: '😎',
    content: 'Sometimes I just want to quit everything and move to a small village in the mountains. Is that normal?',
    reactionCount: 56,
    commentCount: 12,
    reportCount: 0,
    createdAt: 'Yesterday',
    tags: ['Life', 'Mountains'],
    visibility: 'public',
    status: 'active'
  }
];

export const ConfessionsTab: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const handleEditPost = (postId: string, newContent: string) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, content: newContent } : p)));
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm p-5 md:p-6">
        <h2 className="text-xl font-bold text-slate-900">My Confessions</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your anonymous posts</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm">
          <Flame size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-700">No confessions yet</h3>
          <p className="text-slate-400 text-sm mt-1">Share your thoughts anonymously on the discover page.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl p-4 md:p-5 shadow-sm relative"
            >
              {editingPostId === post.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all resize-none shadow-sm min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingPostId(null);
                        setEditContent('');
                      }}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleEditPost(post.id, editContent);
                        setEditingPostId(null);
                        setEditContent('');
                      }}
                      className="px-4 py-2 text-sm font-medium bg-[#D82B7D] text-white hover:bg-[#C0266F] rounded-lg transition-colors shadow-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-slate-500 font-medium">{post.createdAt}</div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingPostId(post.id);
                          setEditContent(post.content);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingPostId(post.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-wrap mb-4">
                    {post.content}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-pink-50 text-pink-600 border border-pink-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="text-lg leading-none">🤍</span> {post.reactionCount}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageCircle size={16} /> {post.commentCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                        title="Send to Friend"
                      >
                        <Send size={16} />
                      </button>
                      <button
                        className="p-1.5 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                        title="Share"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
              <AnimatePresence>
                {deletingPostId === post.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 z-10"
                  >
                    <Trash2 size={32} className="text-red-500 mb-3" />
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Delete Confession?</h4>
                    <p className="text-sm text-slate-500 text-center mb-4">This action cannot be undone.</p>
                    <div className="flex gap-3 w-full max-w-[200px]">
                      <button
                        onClick={() => setDeletingPostId(null)}
                        className="flex-1 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          handleDeletePost(post.id);
                          setDeletingPostId(null);
                        }}
                        className="flex-1 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
