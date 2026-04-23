import React from 'react';
import { motion } from 'framer-motion';
import { CheckCheck } from 'lucide-react';
import { Message } from '../types/chat';
interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}
export function MessageBubble({ message, isMe }: MessageBubbleProps) {
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
      transition={{
        duration: 0.2,
        ease: 'easeOut'
      }}
      className={`flex w-full mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
      
      <div
        className={`max-w-[80%] md:max-w-[70%] px-4 py-2.5 shadow-sm relative group ${isMe ? 'bg-gradient-to-br from-[#D82B7D] to-[#B5246A] text-white rounded-2xl rounded-br-sm shadow-[0_2px_10px_rgba(216,43,125,0.2)]' : 'bg-white border border-slate-200/60 text-slate-800 rounded-2xl rounded-bl-sm'}`}>
        
        <p className="text-[15px] leading-relaxed break-words">
          {message.text}
        </p>
        <div
          className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
          
          <span
            className={`text-[10px] font-medium ${isMe ? 'text-pink-100/80' : 'text-slate-400'}`}>
            
            {message.timestamp}
          </span>
          {isMe && <CheckCheck size={14} className="text-pink-200/80 ml-0.5" />}
        </div>
      </div>
    </motion.div>);

}