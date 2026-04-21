import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
export type ReactionType = 'like' | 'love' | 'laugh' | 'sad' | 'angry' | 'fire';
export const REACTION_EMOJIS: Record<ReactionType, string> = {
  like: '👍',
  love: '❤️',
  laugh: '😂',
  sad: '😢',
  angry: '😡',
  fire: '🔥'
};
interface ReactionBarProps {
  onReact: (type: ReactionType) => void;
  onClose: () => void;
}
export function ReactionBar({ onReact, onClose }: ReactionBarProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.8,
        y: 10
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        y: 10
      }}
      className="absolute bottom-full left-0 mb-2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full shadow-lg p-1.5 flex items-center gap-1 z-50">
      
      {(Object.entries(REACTION_EMOJIS) as [ReactionType, string][]).map(
        ([type, emoji]) =>
        <motion.button
          key={type}
          whileHover={{
            scale: 1.2,
            y: -4
          }}
          whileTap={{
            scale: 0.9
          }}
          onClick={(e) => {
            e.stopPropagation();
            onReact(type);
            onClose();
          }}
          className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-slate-100 rounded-full transition-colors">
          
            {emoji}
          </motion.button>

      )}
    </motion.div>);

}