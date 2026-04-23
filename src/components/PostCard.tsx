import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Flag, MoreVertical, Send, Share2, X } from 'lucide-react';
import { Post, Reaction, Comment } from '../types/chat';
import { ReactionBar, ReactionType, REACTION_EMOJIS } from './ReactionBar';
interface PostCardProps {
  post: Post;
  comments?: Comment[];
  userReaction?: ReactionType | null;
  onReact: (postId: string, type: ReactionType) => void;
  onAddComment?: (postId: string, content: string, parentId?: string) => void;
}
export function PostCard({
  post,
  comments,
  userReaction,
  onReact,
  onAddComment
}: PostCardProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Prevent body scroll when popup is open
  useEffect(() => {
    if (showComments) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showComments]);

  const handleCommentSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newComment.trim() || !onAddComment) return;
    onAddComment(post.id, newComment, replyingTo || undefined);
    setNewComment('');
    setReplyingTo(null);
  };

  // Mock reaction counts for display
  const reactionCounts = {
    like: Math.floor(post.reactionCount * 0.4),
    love: Math.floor(post.reactionCount * 0.3),
    laugh: Math.floor(post.reactionCount * 0.2),
    fire: Math.floor(post.reactionCount * 0.1)
  };
  
  const topReactions = Object.entries(reactionCounts).
  filter(([_, count]) => count > 0).
  sort((a, b) => b[1] - a[1]).
  slice(0, 3).
  map(([type]) => type as ReactionType);

  const maxLength = 200;
  const isLong = post.content.length > maxLength;
  const displayText = isExpanded || !isLong ? post.content : post.content.slice(0, maxLength).trim();

  return (
    <>
      <motion.div
        layoutId={`post-${post.id}`}
      className="bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all group">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm">
            {post.emoji}
          </div>
          <div>
            <div className="font-mono font-semibold text-slate-800 text-sm">
              {post.userId}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {post.createdAt}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Handle report/options
          }}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors opacity-0 group-hover:opacity-100">
          
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-wrap transition-all">
          {displayText}
          {!isExpanded && isLong && <span className="text-slate-400">...</span>}
          {isLong && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }} 
              className="text-pink-500 font-semibold ml-1 hover:underline active:scale-95 transition-transform inline-flex"
            >
              {isExpanded ? ' show less' : ' more'}
            </button>
          )}
        </p>
        {post.tags && post.tags.length > 0 &&
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag) =>
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-pink-50 text-pink-600 border border-pink-100">
                {tag}
              </span>
            )}
          </div>
        }
      </div>

      {/* Telegram-style inline reactions */}
      {topReactions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {topReactions.map((type) => {
            const count = reactionCounts[type];
            if (count === 0) return null;
            // Highlight the chip if the user has selected THIS reaction
            const isSelected = userReaction === type;
            return (
              <button
                key={type}
                onClick={(e) => {
                  e.stopPropagation();
                  onReact(post.id, type);
                }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full border transition-all pointer-events-auto ${
                  isSelected 
                    ? 'bg-blue-50/80 border-blue-200 shadow-sm' 
                    : 'bg-slate-50/80 border-slate-200/60 hover:bg-slate-100 active:scale-95'
                }`}
              >
                <span className="text-[13px] leading-none">{REACTION_EMOJIS[type]}</span>
                <span className={`text-[11px] font-bold ${isSelected ? 'text-blue-600' : 'text-slate-600'}`}>
                  {count + (isSelected && post.reactionCount === 0 ? 1 : 0)} 
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100/50">
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {/* Reaction Button - Adds a new reaction via ReactionBar open */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReactions(!showReactions);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100 text-[13px] font-semibold transition-colors"
            >
              <span className="text-sm leading-none opacity-80 group-hover:scale-110 transition-transform">🤍</span>
              <span>React</span>
            </button>

            <AnimatePresence>
              {showReactions &&
                <ReactionBar
                  onReact={(type) => {
                    onReact(post.id, type);
                    setShowReactions(false);
                  }}
                  onClose={() => setShowReactions(false)} 
                />
              }
            </AnimatePresence>
          </div>

          {/* Comment Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(!showComments);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100 text-[13px] font-semibold transition-colors"
          >
            <MessageCircle size={15} className="opacity-70" />
            <span>{post.commentCount}</span>
          </button>

          {/* Send to Friend Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100 text-[13px] font-semibold transition-colors"
            title="Send to Friend">
            <Send size={15} className="opacity-70 -ml-0.5" />
          </button>

        </div>
      </div>
    </motion.div>

      {/* Popup / Screen Comments Section */}
      {createPortal(
        <AnimatePresence>
          {showComments && (
            <div className="fixed inset-0 z-[9999] flex justify-center items-end md:items-center pointer-events-none">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-400/20 backdrop-blur-sm pointer-events-auto"
                onClick={() => setShowComments(false)}
              />

              {/* Modal Container */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full h-[100dvh] md:h-auto md:max-h-[85vh] md:w-[480px] bg-slate-50 md:rounded-3xl rounded-none flex flex-col shadow-2xl pointer-events-auto overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 h-14 bg-white border-b border-slate-200/60 shrink-0 z-10">
                  <span className="font-bold text-slate-800 text-[15px]">Comments ({post.commentCount})</span>
                  <button 
                    onClick={() => setShowComments(false)}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors -mr-2"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                  {comments && comments.length > 0 ? comments.map((comment) => {
                      const parentComment = comment.parentCommentId ? comments.find(c => c.id === comment.parentCommentId) : null;
                      return (
                        <div key={comment.id} className="flex gap-3">
                            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm text-base">
                              {comment.emoji}
                            </div>
                            <div className="flex-1 min-w-0 bg-white rounded-2xl rounded-tl-sm p-3.5 border border-slate-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] transition-all group">
                              <div className="flex items-center justify-between mb-2">
                                  <span className="font-mono text-[12px] font-bold text-pink-600 truncate mr-2">{comment.userId}</span>
                                  <span className="text-[11px] text-slate-400 font-medium shrink-0">{comment.createdAt}</span>
                              </div>
                              
                              {/* Telegram-style Quote Block */}
                              {parentComment && (
                                  <div 
                                    className="mb-2.5 pl-2 border-l-2 border-blue-400 bg-blue-50/50 rounded-r border-t border-b border-r border-blue-50/50 p-2 cursor-pointer hover:bg-blue-50 transition-colors"
                                    onClick={(e) => { e.stopPropagation(); }}
                                  >
                                    <span className="block text-[11px] font-bold text-blue-600 font-mono mb-0.5 truncate">{parentComment.userId}</span>
                                    <span className="block text-[13px] text-slate-600 truncate">{parentComment.content}</span>
                                  </div>
                              )}
                              
                              <p className="text-slate-700 text-[14.5px] leading-relaxed break-words whitespace-pre-wrap">{comment.content}</p>
                              
                              {/* Reply Action */}
                              {onAddComment && (
                                <div className="mt-2.5 flex gap-2">
                                  <button 
                                    onClick={() => setReplyingTo(comment.id)}
                                    className="text-[11.5px] font-bold text-slate-400 hover:text-pink-500 transition-colors uppercase tracking-wider"
                                  >
                                    Reply
                                  </button>
                                </div>
                              )}
                            </div>
                        </div>
                      );
                  }) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500 pt-10 pb-12">
                        <MessageCircle size={40} className="mb-3 text-slate-300" strokeWidth={1.5} />
                        <p className="font-medium text-[15px]">No comments yet</p>
                        <p className="text-[13px] opacity-80">Be the first to share your thoughts!</p>
                      </div>
                  )}
                </div>

                {/* Comment Input */}
                {onAddComment && (
                  <div className="bg-white border-t border-slate-200/80 p-3 shrink-0">
                    {replyingTo && (() => {
                      const rc = comments?.find(c => c.id === replyingTo);
                      if (rc) return (
                        <div className="flex items-center justify-between bg-blue-50/80 backdrop-blur-md border border-blue-200/50 border-b-0 rounded-t-2xl px-4 py-2.5 text-xs mb-[-1px] relative z-10 mx-1">
                            <div className="flex-1 truncate pr-2 flex items-center gap-2.5">
                              <div className="w-1 h-7 bg-blue-400 rounded-full"></div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-blue-600 font-bold font-mono text-[10px] uppercase leading-none">{rc.userId}</span>
                                <span className="text-slate-600 text-[12px] truncate max-w-[200px] leading-tight">{rc.content}</span>
                              </div>
                            </div>
                            <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-slate-700 bg-white/70 rounded-full p-1.5 transition-colors"><X size={14}/></button>
                        </div>
                      );
                    })()}
                    <form onSubmit={handleCommentSubmit} className={`flex items-end gap-2 bg-slate-50/80 border px-3 py-2 ${replyingTo ? 'border-blue-200/50 rounded-b-3xl rounded-tr-3xl relative z-20' : 'border-slate-200/60 rounded-3xl'}`}>
                        <textarea 
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add an anonymous whisper..."
                          className="flex-1 bg-transparent border-none text-[14.5px] text-slate-800 placeholder:text-slate-400 focus:ring-0 resize-none max-h-28 min-h-[24px] p-2 focus:outline-none"
                          rows={1}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleCommentSubmit();
                            }
                          }}
                        />
                        <button type="submit" disabled={!newComment.trim()} className="text-white bg-[#D82B7D] disabled:opacity-50 p-2.5 hover:bg-[#C0266F] disabled:bg-slate-300 rounded-2xl transition-colors mb-0.5 shadow-sm">
                          <Send size={16} className="-ml-0.5" />
                        </button>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}