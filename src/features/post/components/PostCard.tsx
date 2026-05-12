import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { PostCardProps, POST_TYPE_META } from '../types';
import { ReactionBar } from './ReactionBar';
import { CommentThread } from './CommentThread';
import { useComments, useLoadMoreComments } from '../hooks';
import { useAuthStore } from '@/features/auth/store';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { Link } from 'react-router-dom';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function PostCard({
  post,
  userReaction: propReaction,
  onReact,
  onAddComment,
  onDelete,
  onReport,
  showDeleteButton = false
}: PostCardProps & { onDelete?: (id: string) => void; onReport?: (id: string, reason: string) => void; showDeleteButton?: boolean }) {
  const { user: currentUser } = useAuthStore();
  const isAuthor = currentUser?.id === post.user_id;
  const userReaction = propReaction ?? post.user_reaction;
  const [showReactions, setShowReactions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const COMMENTS_PER_PAGE = 10;
  const [allComments, setAllComments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  const { data: fetchedComments = [], isLoading: isLoadingComments } = useComments(post.id, {
    page: 0,
    limit: COMMENTS_PER_PAGE
  });

  const loadMoreComments = useLoadMoreComments();

  // Initialize comments when first loaded
  useEffect(() => {
    if (fetchedComments.length > 0 && currentPage === 0) {
      setAllComments(fetchedComments);
      setHasMoreComments(fetchedComments.length === COMMENTS_PER_PAGE);
    }
  }, [fetchedComments, currentPage]);

  const handleLoadMore = async () => {
    if (!hasMoreComments || loadMoreComments.isPending) return;

    try {
      const nextPage = currentPage + 1;
      const newComments = await loadMoreComments.mutateAsync({
        postId: post.id,
        page: nextPage,
        limit: COMMENTS_PER_PAGE
      });

      setAllComments(prev => [...prev, ...newComments]);
      setCurrentPage(nextPage);
      setHasMoreComments(newComments.length === COMMENTS_PER_PAGE);
    } catch (error) {
      console.error('Failed to load more comments:', error);
    }
  };

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
    // Reset pagination to fetch fresh comments including the new one
    setCurrentPage(0);
    setAllComments([]);
    setHasMoreComments(true);
  };


  const maxLength = 200;
  const isLong = post.content.length > maxLength;
  const displayText = isExpanded || !isLong ? post.content : post.content.slice(0, maxLength).trim();

  const typeMeta = POST_TYPE_META[post.post_type];
  const TypeIcon = typeMeta.icon;

  return (
    <>
      <motion.div
        layoutId={`post-${post.id}`}
        className="bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all group">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <Link to={`/discover?q=${post.user?.username}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm">
                {post.user?.emoji || '😶'}
              </div>
              <div>
                <div className="font-mono font-semibold text-slate-800 text-sm">
                  @{post.user?.username || 'Anonymous'}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span>{timeAgo(post.created_at)}</span>
                  <span className="text-slate-300">.</span>
                  <span className="inline-flex items-center gap-1">
                    <TypeIcon size={12} />
                    {typeMeta.label}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {isAuthor && showDeleteButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
              <Trash2 size={18} />
            </button>
          )}

          {!isAuthor && onReport && (
            post.is_reported ? (
              <button
                disabled
                className="p-2 text-slate-300 cursor-not-allowed flex items-center gap-1 transition-colors">
                <AlertTriangle size={18} /> Reported
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReportModal(true);
                  setReportReason('');
                }}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center gap-1 transition-colors">
                <AlertTriangle size={18} /> Report
              </button>
            )
          )}
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
                  key={tag.id}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-pink-50 text-pink-600 border border-pink-100">
                  {tag.name}
                </span>
              )}
            </div>
          }
        </div>

        {/* Reaction Pills - Below Content */}
        {post.reaction_count > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {Object.entries(post.reaction_counts || {}).map(([emoji, count]) => {
              const isSelected = userReaction === emoji;
              return (
                <button
                  key={emoji}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReact(post.id, emoji, false);
                  }}
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all hover:scale-105 active:scale-95 shadow-sm text-[12px] font-bold ${isSelected
                      ? 'bg-pink-400 border-pink-400 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <span className="text-[14px] leading-none">{emoji}</span>
                  <span className={`text-[11px] font-mono ${isSelected ? 'text-pink-100' : 'text-slate-400'}`}>
                    {count as number}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100/50">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            {/* Reaction Button */}
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
                      onReact(post.id, type, false);
                      setShowReactions(false);
                    }}
                    onClose={() => setShowReactions(false)}
                    position='bottom'
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
              <span>{post.comment_count}</span>
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
                  <span className="font-bold text-slate-800 text-[15px]">Comments ({post.comment_count})</span>
                  <button
                    onClick={() => setShowComments(false)}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors -mr-2"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  {isLoadingComments ? (
                    <div className="flex items-center justify-center h-40">
                      <Loader2 className="animate-spin text-pink-500" />
                    </div>
                  ) : allComments.length > 0 ? (
                    <>
                      <CommentThread
                        comments={allComments}
                        onReply={(commentId) => setReplyingTo(commentId)}
                        onReact={(commentId, emoji, isComment) => onReact(commentId, emoji, isComment)}
                      />

                      {/* Load More Button */}
                      {hasMoreComments && (
                        <div className="flex justify-center mt-4">
                          <button
                            onClick={handleLoadMore}
                            disabled={loadMoreComments.isPending}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 text-sm font-medium"
                          >
                            {loadMoreComments.isPending ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Loading...
                              </>
                            ) : (
                              <>
                                Load More
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
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
                      const rc = allComments?.find((c: any) => c.id === replyingTo);
                      if (rc) return (
                        <div className="flex items-center justify-between bg-blue-50/80 backdrop-blur-md border border-blue-200/50 border-b-0 rounded-t-2xl px-4 py-2.5 text-xs mb-[-1px] relative z-10 mx-1">
                          <div className="flex-1 truncate pr-2 flex items-center gap-2.5">
                            <div className="w-1 h-7 bg-blue-400 rounded-full"></div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-blue-600 font-bold font-mono text-[10px] uppercase leading-none">{rc.user?.username || 'Anonymous'}</span>
                              <span className="text-slate-600 text-[12px] truncate max-w-[200px] leading-tight">{rc.content}</span>
                            </div>
                          </div>
                          <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-slate-700 bg-white/70 rounded-full p-1.5 transition-colors"><X size={14} /></button>
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          if (onDelete) {
            onDelete(post.id);
            setShowDeleteModal(false);
          }
        }}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Report Modal */}
      {createPortal(
        <AnimatePresence>
          {showReportModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowReportModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                      <AlertTriangle size={24} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Report Post</h3>
                  </div>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 mb-4">Why are you reporting this post?</p>
                  <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Please provide a reason for reporting this post..."
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-slate-400 mt-2 text-right">
                    {reportReason.length}/500
                  </p>
                </div>
                <div className="flex items-center gap-3 p-6 pt-0">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (onReport && reportReason.trim()) {
                        onReport(post.id, reportReason.trim());
                        setShowReportModal(false);
                        setReportReason('');
                      }
                    }}
                    disabled={!reportReason.trim()}
                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Report
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}