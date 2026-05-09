import { motion } from 'framer-motion';
import { CheckCheck, Check } from 'lucide-react';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  isOptimistic?: boolean;
}

export function MessageBubble({ message, isMe, isOptimistic }: MessageBubbleProps) {
  // Format timestamp
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`flex w-full mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] md:max-w-[70%] px-4 py-2.5 shadow-sm relative group ${
          isMe
            ? 'bg-gradient-to-br from-[#D82B7D] to-[#B5246A] text-white rounded-2xl rounded-br-sm'
            : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm'
        } ${isOptimistic ? 'opacity-70' : ''}`}
      >
        <p className="text-[15px] leading-relaxed break-words">{message.text}</p>
        <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
          <span
            className={`text-[10px] font-medium ${
              isMe ? 'text-pink-100/80' : 'text-slate-400'
            }`}
          >
            {formatTime(message.createdAt)}
          </span>
          {isMe && (
            <>
              {message.seenAt ? (
                <CheckCheck size={14} className="text-pink-200/80 ml-0.5" />
              ) : (
                <Check size={14} className="text-pink-200/60 ml-0.5" />
              )}
            </>
          )}
          {isOptimistic && (
            <span className="text-[10px] text-slate-400 ml-1">Sending...</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default MessageBubble;
