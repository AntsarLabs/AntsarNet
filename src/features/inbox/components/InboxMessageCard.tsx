import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Check, Trash2 } from 'lucide-react';
import { InboxMessageCardProps } from '../types';

export function InboxMessageCard({
  msg,
  index,
  onMarkRead,
  onDelete
}: InboxMessageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = msg.message.length > 180;

  const handleToggleExpand = () => {
    if (!msg.isRead) {
      onMarkRead(msg.id);
    }
    setIsExpanded(!isExpanded);
  };

  const handleMarkReadOnly = () => {
    if (!msg.isRead) {
      onMarkRead(msg.id);
    }
  };

  return (
    <motion.div
      layoutId={`whisper-${msg.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative flex flex-col gap-4 p-5 rounded-2xl transition-all duration-300 ${!msg.isRead
          ? 'bg-white shadow-[0_8px_30px_rgba(216,43,125,0.1)] border-l-4 border-l-pink-500 border-y border-r border-white/60'
          : 'bg-white/85 backdrop-blur-md border border-white/60 hover:bg-white transition-all shadow-sm'
        }`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-[10px] font-black font-mono text-pink-500 bg-pink-50 px-2.5 py-1.5 rounded-lg border border-pink-100 uppercase tracking-widest shadow-sm">
              #{msg.id.slice(-7).toUpperCase()}
            </span>
            {!msg.isRead && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500 border-2 border-white shadow-[0_0_8px_rgba(216,43,125,0.5)] z-10" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] tabular-nums">
            {msg.createdAt}
          </span>
          <button 
            onClick={() => onDelete(msg.id)}
            className="text-slate-300 hover:text-red-500 transition-colors p-1.5 -mr-1.5 rounded-full hover:bg-red-50"
            title="Delete message"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="relative space-y-2">
        <h4 className="text-[15px] font-bold text-slate-800 tracking-tight">
          {msg.subject}
        </h4>
        <p
          className={`text-[14px] leading-relaxed transition-all duration-300 text-slate-600 ${!isExpanded && isLong ? 'line-clamp-3' : ''
            }`}
        >
          {msg.message}
        </p>

        {isLong && (
          <button
            onClick={handleToggleExpand}
            className="mt-3 flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 transition-colors group/btn bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-100 w-fit"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp size={14} className="transition-transform group-hover/btn:-translate-y-0.5" />
              </>
            ) : (
              <>
                Read full message <ChevronDown size={14} className="transition-transform group-hover/btn:translate-y-0.5" />
              </>
            )}
          </button>
        )}

        {!isLong && !msg.isRead && (
          <button
            onClick={handleMarkReadOnly}
            className="mt-3 text-[10px] font-bold text-slate-400 hover:text-pink-600 transition-colors uppercase tracking-[0.15em] flex items-center gap-1.5"
          >
            <Check size={12} />
            Mark as read
          </button>
        )}
      </div>
    </motion.div>
  );
}
