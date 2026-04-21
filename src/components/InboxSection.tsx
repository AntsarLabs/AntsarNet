import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Share2,
  Check,
  Inbox,
  Send,
  ChevronLeft,
  Reply,
  ShieldCheck,
  ExternalLink } from
'lucide-react';
import { InboxMessage } from '../types/chat';
interface InboxSectionProps {
  inboxMessages: InboxMessage[];
  inboxUrl: string;
  onMarkRead: (id: string) => void;
  onReply: (id: string, replyContent: string) => void;
}
export function InboxSection({
  inboxMessages,
  inboxUrl,
  onMarkRead,
  onReply
}: InboxSectionProps) {
  const [copied, setCopied] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [replyText, setReplyText] = useState('');
  const handleCopy = () => {
    navigator.clipboard.writeText(inboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const selectedMessage = inboxMessages.find((m) => m.id === selectedMessageId);
  const handleOpenMessage = (msg: InboxMessage) => {
    if (!msg.isRead) {
      onMarkRead(msg.id);
    }
    setSelectedMessageId(msg.id);
  };
  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessageId) return;
    onReply(selectedMessageId, replyText);
    setReplyText('');
  };
  return (
    <div className="flex flex-col h-full relative">
      {/* Shareable Link Card */}
      <div className="p-4 sm:p-5 flex-shrink-0">
        <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Inbox size={20} className="text-pink-400" />
              Anonymous Inbox Link
            </h3>
            <p className="text-sm text-slate-300 mb-3">
              Share this link anywhere — anyone can send you a message through
              it,{' '}
              <span className="text-pink-400 font-medium">
                no account needed
              </span>
              . Your identity stays completely hidden.
            </p>

            <div className="flex items-center gap-1.5 mb-4 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
              <ShieldCheck
                size={14}
                className="text-emerald-400 flex-shrink-0" />
              
              <p className="text-xs text-slate-400 leading-relaxed">
                This link doesn't expose your code name, emoji, or any account
                details. Visitors only see a simple text box to type a message.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-950/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-300 font-mono truncate select-all">
                {inboxUrl}
              </div>
              <button
                onClick={handleCopy}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10 flex-shrink-0"
                title="Copy Link">
                
                {copied ?
                <Check size={18} className="text-green-400" /> :

                <Copy size={18} />
                }
              </button>
              <button
                className="p-2.5 bg-[#D82B7D] hover:bg-[#C0266F] text-white rounded-xl transition-colors shadow-sm flex-shrink-0"
                title="Share">
                
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
          Received Messages ({inboxMessages.length})
        </h4>

        {inboxMessages.length === 0 ?
        <div className="text-center py-12 px-4">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center shadow-inner">
              <Inbox size={36} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">
              No messages yet
            </h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Share your inbox link on social media, with friends, or anywhere —
              people can message you anonymously without creating an account.
            </p>
          </div> :

        <div className="space-y-2">
            {inboxMessages.map((msg) =>
          <motion.button
            key={msg.id}
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            onClick={() => handleOpenMessage(msg)}
            className={`w-full flex flex-col gap-2 p-4 rounded-2xl transition-all text-left group relative border ${!msg.isRead ? 'bg-slate-800/60 border-pink-500/30 shadow-sm' : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/40'}`}>
            
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {!msg.isRead &&
                <span className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0" />
                }
                    <span
                  className={`font-semibold text-sm ${!msg.isRead ? 'text-white' : 'text-slate-300'}`}>
                  
                      {msg.senderLabel}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-800 text-slate-400 border border-white/5">
                      via link
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {msg.createdAt}
                  </span>
                </div>

                <p
              className={`text-sm line-clamp-2 ${!msg.isRead ? 'text-slate-200' : 'text-slate-400'}`}>
              
                  {msg.content}
                </p>

                {msg.repliedAt &&
            <div className="flex items-center gap-1.5 mt-1 text-xs text-pink-400/80 font-medium">
                    <Reply size={12} />
                    Replied
                  </div>
            }
              </motion.button>
          )}
          </div>
        }
      </div>

      {/* Message Detail Overlay */}
      <AnimatePresence>
        {selectedMessage &&
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
          className="absolute inset-0 bg-slate-950 z-30 flex flex-col">
          
            <div className="h-14 flex items-center px-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex-shrink-0">
              <button
              onClick={() => setSelectedMessageId(null)}
              className="p-2 -ml-2 text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/10">
              
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-lg font-semibold ml-2 text-white">
                Inbox Message
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="max-w-2xl mx-auto">
                {/* Source info */}
                <div className="flex items-center gap-2 mb-4 px-1">
                  <ExternalLink size={14} className="text-slate-500" />
                  <span className="text-xs text-slate-500">
                    Sent via your public inbox link — this person doesn't have
                    an AddisFriend account
                  </span>
                </div>

                <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl border border-white/5">
                        🕵️
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {selectedMessage.senderLabel}
                        </div>
                        <div className="text-xs text-slate-500">
                          {selectedMessage.createdAt} · via inbox link
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </div>

                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 sm:p-5">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Reply size={16} className="text-pink-400" />
                    Public Reply
                  </h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Since the sender used your public link and has no account,
                    your reply will be posted on your inbox page. They can check
                    back to see your response.
                  </p>

                  {selectedMessage.repliedAt ?
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="text-xs text-slate-500 mb-2">
                        You replied on {selectedMessage.repliedAt}
                      </div>
                      <p className="text-sm text-slate-300">
                        You have already replied to this message.
                      </p>
                    </div> :

                <div className="flex flex-col gap-3">
                      <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a public reply..."
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-pink-500/50 resize-none min-h-[100px]" />
                  
                      <div className="flex justify-end">
                        <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="px-5 py-2 bg-[#D82B7D] text-white rounded-xl font-medium hover:bg-[#C0266F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm">
                      
                          <Send size={16} />
                          Post Reply
                        </button>
                      </div>
                    </div>
                }
                </div>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}