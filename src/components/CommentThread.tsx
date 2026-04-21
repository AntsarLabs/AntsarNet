import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, MessageCircle } from 'lucide-react';
import { Comment } from '../types/chat';
import { ReactionType, REACTION_EMOJIS } from './ReactionBar';
interface CommentThreadProps {
  comments: Comment[];
  onReply: (commentId: string) => void;
  onReact: (commentId: string, type: ReactionType) => void;
}
export function CommentThread({
  comments,
  onReply,
  onReact
}: CommentThreadProps) {
  // Group comments by parent
  const topLevelComments = comments.filter((c) => !c.parentCommentId);
  const replies = comments.filter((c) => c.parentCommentId);
  return (
    <div className="space-y-4">
      {topLevelComments.map((comment) =>
      <CommentItem
        key={comment.id}
        comment={comment}
        replies={replies.filter((r) => r.parentCommentId === comment.id)}
        onReply={onReply}
        onReact={onReact} />

      )}
    </div>);

}
interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  onReply: (commentId: string) => void;
  onReact: (commentId: string, type: ReactionType) => void;
}
function CommentItem({ comment, replies, onReply, onReact }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="flex gap-3">
      
      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm shadow-sm flex-shrink-0 mt-1">
        {comment.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm p-3 shadow-sm">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="font-mono font-semibold text-slate-800 text-xs">
              {comment.userId}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {comment.createdAt}
            </span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-1.5 ml-2">
          <button
            onClick={() => onReact(comment.id, 'like')}
            className="text-xs font-medium text-slate-500 hover:text-pink-600 transition-colors flex items-center gap-1">
            
            Like {comment.reactionCount > 0 && `(${comment.reactionCount})`}
          </button>
          <button
            onClick={() => onReply(comment.id)}
            className="text-xs font-medium text-slate-500 hover:text-pink-600 transition-colors">
            
            Reply
          </button>
          <button className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors ml-auto">
            <Flag size={12} />
          </button>
        </div>

        {replies.length > 0 &&
        <div className="mt-2">
            {!showReplies ?
          <button
            onClick={() => setShowReplies(true)}
            className="text-xs font-medium text-[#D82B7D] hover:underline flex items-center gap-1 ml-2">
            
                <MessageCircle size={12} />
                View {replies.length}{' '}
                {replies.length === 1 ? 'reply' : 'replies'}
              </button> :

          <div className="space-y-3 mt-3 border-l-2 border-slate-100 pl-3">
                {replies.map((reply) =>
            <motion.div
              key={reply.id}
              initial={{
                opacity: 0,
                x: -10
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              className="flex gap-2.5">
              
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs shadow-sm flex-shrink-0 mt-1">
                      {reply.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm p-2.5 shadow-sm">
                        <div className="flex items-baseline justify-between gap-2 mb-0.5">
                          <span className="font-mono font-semibold text-slate-800 text-[11px]">
                            {reply.userId}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium">
                            {reply.createdAt}
                          </span>
                        </div>
                        <p className="text-slate-700 text-[13px] leading-relaxed whitespace-pre-wrap">
                          {reply.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1 ml-2">
                        <button
                    onClick={() => onReact(reply.id, 'like')}
                    className="text-[11px] font-medium text-slate-500 hover:text-pink-600 transition-colors">
                    
                          Like{' '}
                          {reply.reactionCount > 0 &&
                    `(${reply.reactionCount})`}
                        </button>
                        <button className="text-[11px] font-medium text-slate-400 hover:text-red-500 transition-colors ml-auto">
                          <Flag size={10} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
            )}
              </div>
          }
          </div>
        }
      </div>
    </motion.div>);

}