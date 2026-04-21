import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, MoreVertical } from 'lucide-react';
import { Post, Comment } from '../types/chat';
import { ReactionBar, ReactionType, REACTION_EMOJIS } from './ReactionBar';
import { CommentThread } from './CommentThread';
interface PostDetailProps {
  post: Post;
  comments: Comment[];
  onBack: () => void;
  onReactPost: (postId: string, type: ReactionType) => void;
  onReactComment: (commentId: string, type: ReactionType) => void;
  onAddComment: (postId: string, content: string, parentId?: string) => void;
}
export function PostDetail({
  post,
  comments,
  onBack,
  onReactPost,
  onReactComment,
  onAddComment
}: PostDetailProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const handleSend = () => {
    if (!newComment.trim()) return;
    onAddComment(post.id, newComment, replyingTo || undefined);
    setNewComment('');
    setReplyingTo(null);
  };
  const replyingToComment = replyingTo ?
  comments.find((c) => c.id === replyingTo) :
  null;
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 20
      }}
      animate={{
        opacity: 1,
        x: 0
      }}
      exit={{
        opacity: 0,
        x: 20
      }}
      className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[60] flex flex-col">
      
      {/* Header */}
      <div className="h-14 flex items-center px-4 sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10">
          
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-lg font-semibold ml-2 text-white">Confession</h1>
        <div className="ml-auto">
          <button className="p-2 -mr-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 md:p-6 pb-32">
          {/* Main Post */}
          <div className="bg-white/90 backdrop-blur-md border border-white/60 rounded-2xl p-5 md:p-6 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm">
                {post.emoji}
              </div>
              <div>
                <div className="font-mono font-bold text-slate-800 text-base">
                  {post.userId}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {post.createdAt}
                </div>
              </div>
            </div>

            <p className="text-slate-800 text-base md:text-lg leading-relaxed whitespace-pre-wrap mb-6">
              {post.content}
            </p>

            {post.tags && post.tags.length > 0 &&
            <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) =>
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-600 border border-pink-100">
                
                    {tag}
                  </span>
              )}
              </div>
            }

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="relative">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium text-sm">
                  
                  <span className="text-lg leading-none">🤍</span>
                  <span>{post.reactionCount} Reactions</span>
                </button>
                {showReactions &&
                <ReactionBar
                  onReact={(type) => {
                    onReactPost(post.id, type);
                    setShowReactions(false);
                  }}
                  onClose={() => setShowReactions(false)} />

                }
              </div>
              <span className="text-sm font-medium text-slate-500">
                {post.commentCount} Comments
              </span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl p-4 md:p-6 shadow-sm min-h-[300px]">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
              Comments
            </h3>
            {comments.length === 0 ?
            <div className="text-center py-10">
                <p className="text-slate-500 text-sm">
                  No comments yet. Be the first!
                </p>
              </div> :

            <CommentThread
              comments={comments}
              onReply={(id) => setReplyingTo(id)}
              onReact={onReactComment} />

            }
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-lg border-t border-white/10 p-4">
        <div className="max-w-2xl mx-auto">
          {replyingToComment &&
          <div className="flex items-center justify-between bg-white/10 rounded-t-xl px-4 py-2 text-xs text-white/80 mb-[-8px] pb-3">
              <span>
                Replying to{' '}
                <span className="font-mono font-bold">
                  {replyingToComment.userId}
                </span>
              </span>
              <button
              onClick={() => setReplyingTo(null)}
              className="hover:text-white">
              
                Cancel
              </button>
            </div>
          }
          <div className="relative flex items-end gap-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add an anonymous comment..."
              className="flex-1 bg-white/90 border border-white/50 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none max-h-32 min-h-[44px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }} />
            
            <button
              onClick={handleSend}
              disabled={!newComment.trim()}
              className="p-3 bg-[#D82B7D] text-white rounded-xl hover:bg-[#C0266F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 shadow-sm">
              
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>);

}