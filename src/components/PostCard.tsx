import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Flag, MoreVertical, Send, Share2 } from 'lucide-react';
import { Post, Reaction } from '../types/chat';
import { ReactionBar, ReactionType, REACTION_EMOJIS } from './ReactionBar';
interface PostCardProps {
  post: Post;
  userReaction?: ReactionType | null;
  onReact: (postId: string, type: ReactionType) => void;
  onClick: (post: Post) => void;
}
export function PostCard({
  post,
  userReaction,
  onReact,
  onClick
}: PostCardProps) {
  const [showReactions, setShowReactions] = useState(false);
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
  return (
    <motion.div
      layoutId={`post-${post.id}`}
      onClick={() => onClick(post)}
      className="bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group">
      
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
      <div className="mb-4">
        <p className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-wrap line-clamp-4">
          {post.content}
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-4">
          {/* Reaction Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReactions(!showReactions);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${userReaction ? 'bg-pink-50 text-pink-600 border border-pink-100' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>
              
              {userReaction ?
              <span>{REACTION_EMOJIS[userReaction]}</span> :

              <span className="text-lg leading-none">🤍</span>
              }
              <span>{post.reactionCount}</span>
            </button>

            <AnimatePresence>
              {showReactions &&
              <ReactionBar
                onReact={(type) => {
                  onReact(post.id, type);
                  setShowReactions(false);
                }}
                onClose={() => setShowReactions(false)} />

              }
            </AnimatePresence>
          </div>

          {/* Comment Button */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 text-sm font-medium transition-colors">
            <MessageCircle size={16} />
            <span>{post.commentCount}</span>
          </button>

          {/* Send to Friend Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle send to friend
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 text-sm font-medium transition-colors"
            title="Send to Friend">
            
            <Send size={16} />
          </button>

          {/* Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle share
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 text-sm font-medium transition-colors"
            title="Share">
            
            <Share2 size={16} />
          </button>
        </div>

        {/* Top Reactions Preview */}
        {topReactions.length > 0 &&
        <div className="flex items-center -space-x-1">
            {topReactions.map((type, i) =>
          <div
            key={type}
            className="w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[10px] shadow-sm z-[3-i]"
            style={{
              zIndex: 3 - i
            }}>
            
                {REACTION_EMOJIS[type]}
              </div>
          )}
          </div>
        }
      </div>
    </motion.div>);

}