import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Share2,
  Check,
  Inbox,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  Send
} from 'lucide-react';
import { InboxMessage } from '../types/chat';

interface InboxSectionProps {
  inboxMessages: InboxMessage[];
  inboxUrl: string;
  onMarkRead: (id: string) => void;
  hideList?: boolean;
}

export function InboxSection({
  inboxMessages,
  inboxUrl,
  onMarkRead,
  hideList = false,
}: InboxSectionProps) {
  const [copied, setCopied] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [instruction, setInstruction] = useState('');

  const queryParams = new URLSearchParams();
  if (subject) queryParams.append('subject', subject);
  if (instruction) queryParams.append('instruction', instruction);
  const queryString = queryParams.toString();
  const displayUrl = queryString ? `${inboxUrl}${inboxUrl.includes('?') ? '&' : '?'}${queryString}` : inboxUrl;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(displayUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleExpand = (id: string, isRead: boolean) => {
    if (!isRead) {
      onMarkRead(id);
    }
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full relative font-sans space-y-6">
      {/* Sharing Header */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm transition-all duration-300">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setIsShareOpen(!isShareOpen)}
            className="flex items-center justify-between w-full group outline-none"
          >
            <div className="flex items-center gap-2">
              <Share2 size={18} className={`transition-colors ${isShareOpen ? 'text-pink-500' : 'text-slate-400 group-hover:text-pink-500'}`} />
              <h3 className={`text-sm font-bold tracking-tight transition-colors ${isShareOpen ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'}`}>Share Your Inbox Link</h3>
            </div>
            <div className="flex items-center gap-3">
              {copied && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider"
                >
                  Copied
                </motion.span>
              )}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isShareOpen ? 'bg-pink-50 text-pink-500' : 'bg-slate-50 text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-500'}`}>
                {isShareOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
          </button>

          <AnimatePresence>
            {isShareOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex flex-col gap-3 mb-1">
                    <input
                      type="text"
                      placeholder="Custom Subject (e.g. Birthday Confessions)"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-slate-400"
                    />
                    <textarea
                      placeholder="Inbox Description / Bio (e.g. Send me your anonymous birthday wishes!)"
                      value={instruction}
                      onChange={(e) => setInstruction(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-slate-400 resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={displayUrl}
                        readOnly
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-slate-600 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleCopy}
                      className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all active:scale-95 border border-slate-200 shadow-sm"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {inboxMessages.length === 0 ? (
        <div className="text-center py-20 bg-white/85 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm">
          <div className="w-20 h-20 mb-6 mx-auto rounded-full bg-slate-100 flex items-center justify-center relative border border-slate-200">
            <Sparkles className="text-slate-400" size={32} />
          </div>
          <p className="text-slate-800 text-lg font-bold mb-1">Waiting for the first message...</p>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            When someone sends an anonymous message, feedback, or confession, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4 pb-32">
          <AnimatePresence mode="popLayout">
            {inboxMessages.map((msg, index) => {
              const isExpanded = expandedIds.has(msg.id);
              const isLong = msg.message.length > 180;

              return (
                <motion.div
                  key={msg.id}
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
                          #{msg.id.slice(-5).toUpperCase()}
                        </span>
                        {!msg.isRead && (
                          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500 border-2 border-white shadow-[0_0_8px_rgba(216,43,125,0.5)] z-10" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] tabular-nums">
                        {msg.createdAt}
                      </span>
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
                        onClick={() => toggleExpand(msg.id, msg.isRead)}
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
                        onClick={() => toggleExpand(msg.id, msg.isRead)}
                        className="mt-3 text-[10px] font-bold text-slate-400 hover:text-pink-600 transition-colors uppercase tracking-[0.15em] flex items-center gap-1.5"
                      >
                        <Check size={12} />
                        Mark as read
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}