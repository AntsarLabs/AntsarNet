import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Check, X, Loader2 } from 'lucide-react';
import { Comment, ReactionType } from '../types';
import { ReactionBar } from './ReactionBar';
import { useAuthStore } from '@/features/auth/store';
import { useUpdateComment } from '../hooks';

interface CommentThreadProps {
  comments: Comment[];
  onReply: (commentId: string) => void;
  onReact: (commentId: string, emoji: ReactionType, isComment?: boolean) => void;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function CommentThread({
  comments,
  onReply,
  onReact
}: CommentThreadProps) {
  const { user: currentUser } = useAuthStore();
  const updateComment = useUpdateComment();
  const [activeReactionCommentId, setActiveReactionCommentId] = React.useState<string | null>(null);
  const [highlightedId, setHighlightedId] = React.useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
  const [editContent, setEditContent] = React.useState('');

  // Sort comments to ensure parent comments appear before child comments
  const sortedComments = [...comments].sort((a, b) => {
    // First, sort by creation time
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    
    // If one is a reply to the other, ensure parent comes first
    if (a.parent_comment_id === b.id) return 1; // a is child of b, b comes first
    if (b.parent_comment_id === a.id) return -1; // b is child of a, a comes first
    
    // Otherwise, sort by time (oldest first)
    return timeA - timeB;
  });

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return;
    try {
      await updateComment.mutateAsync({ commentId, content: editContent });
      setEditingCommentId(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const scrollToComment = (id: string) => {
    const element = document.getElementById(`comment-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedId(id);
      // Remove highlight after a delay
      setTimeout(() => setHighlightedId(null), 2000);
    }
  };

  return (
    <div className="space-y-4 pb-4 relative overflow-visible">
      {sortedComments.map((comment) => {
        const isAuthor = currentUser?.id === comment.user_id;
        const isEditing = editingCommentId === comment.id;
        
        const parentComment = comment.parent_comment_id
          ? comments.find(c => c.id === comment.parent_comment_id)
          : null;

        const userReaction = (comment as any).user_reaction;
        const isHighlighted = highlightedId === comment.id;

        return (
          <motion.div
            key={comment.id}
            id={`comment-${comment.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              backgroundColor: isHighlighted ? 'rgba(236, 72, 153, 0.05)' : 'transparent',
            }}
            transition={{ duration: 0.3 }}
            className={`flex gap-3 p-1 rounded-2xl transition-colors ${isHighlighted ? 'ring-2 ring-pink-100 ring-offset-2' : ''}`}
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-lg shadow-sm shrink-0 mt-0.5">
              {comment.user?.emoji || '😶'}
            </div>

            {/* Message Bubble */}
            <div className="flex-1 min-w-0">
              <div className={`bg-white border rounded-2xl rounded-tl-sm p-3.5 shadow-sm relative group transition-colors ${isHighlighted ? 'border-pink-200' : 'border-slate-100'}`}>
                {/* Author & Time */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono font-semibold text-slate-800 text-[12px] truncate">
                    {isAuthor ? "You" : "@"+comment.user?.username}
                  </span>
                  <div className="flex items-center gap-2">
                    {comment.updated_at !== comment.created_at && (
                      <span className="text-[9px] text-slate-300 font-medium italic">Edited</span>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium">
                      {timeAgo(comment.created_at)}
                    </span>
                  </div>
                </div>

                {/* Telegram-style Quote Block for Replies */}
                {parentComment && (
                  <div
                    onClick={() => scrollToComment(parentComment.id)}
                    className="mb-2.5 pl-2 border-l-2 border-blue-400 bg-blue-50/50 rounded-r py-1.5 px-2.5 cursor-pointer hover:bg-blue-100 transition-colors group/quote"
                  >
                    <span className="block text-[11px] font-bold text-blue-600 font-mono mb-0.5 truncate group-hover/quote:underline">
                      @{parentComment.user?.username || 'Anonymous'}
                    </span>
                    <span className="block text-[13px] text-slate-600 truncate leading-snug">
                      {parentComment.content}
                    </span>
                  </div>
                )}

                {/* Content */}
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full text-[14.5px] leading-relaxed p-2 border border-pink-200 rounded-xl focus:ring-1 focus:ring-pink-400 focus:outline-none min-h-[60px] resize-none"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        disabled={updateComment.isPending || !editContent.trim() || editContent === comment.content}
                        className="p-1.5 text-pink-500 hover:bg-pink-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Save Changes"
                      >
                        {updateComment.isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-700 text-[14.5px] leading-relaxed whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                )}
              </div>

              {/* Reaction Pills - Below Bubble */}
              {comment.reaction_count > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 ml-2 mb-1">
                  {Object.entries((comment as any).reaction_counts || {}).map(([emoji, count]) => {
                    const isSelected = userReaction === emoji;
                    return (
                      <button 
                        key={emoji} 
                        onClick={(e) => {
                          e.stopPropagation();
                          onReact(comment.id, emoji as string, true);
                        }}
                        className={`flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all hover:scale-105 active:scale-95 shadow-sm text-[12px] font-bold ${
                          isSelected 
                            ? 'bg-pink-500 border-pink-400 text-white' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-[14px] leading-none">{emoji as string}</span>
                        <span className={`text-[11px] font-mono ${isSelected ? 'text-pink-100' : 'text-slate-400'}`}>
                          {count as number}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 mt-1 ml-2 relative">
                <div className="relative">
                  <button
                    onClick={() => setActiveReactionCommentId(activeReactionCommentId === comment.id ? null : comment.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100 text-[11px] font-bold transition-colors shadow-sm"
                  >
                    <span className="text-xs leading-none opacity-80">🤍</span>
                    <span>{userReaction ? 'Reacted' : 'React'}</span>
                  </button>
                  <AnimatePresence>

                    {activeReactionCommentId === comment.id && (
                      <div className="absolute top-full left-0 mb-2 z-50">
                        
                        <ReactionBar
                          onReact={(emoji) => {
                            onReact(comment.id, emoji, true);
                            setActiveReactionCommentId(null);
                          }}
                          onClose={() => setActiveReactionCommentId(null)}
                        />
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {!isEditing && (
                  <>
                    <button
                      onClick={() => onReply(comment.id)}
                      className="text-[11.5px] font-bold text-slate-400 hover:text-pink-500 transition-colors uppercase tracking-wider"
                    >
                      Reply
                    </button>

                    {isAuthor && (
                      <button
                        onClick={() => handleStartEdit(comment)}
                        className="text-[11.5px] font-bold text-slate-400 hover:text-pink-500 transition-colors uppercase tracking-wider flex items-center gap-1"
                      >
                        Edit
                      </button>
                    )}
                  </>
                )}

                <button className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-300 hover:text-red-400">
                  <Flag size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}