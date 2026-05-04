import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, MessageSquare, ArrowRight, ChevronLeft } from 'lucide-react';
import { SendInboxPromoCards } from './InboxFormPromoCards';

interface SendInboxMobileViewProps {
  inboxId?: string;
  message: string;
  setMessage: (m: string) => void;
  title: string;
  isSending: boolean;
  isSent: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  onNavigateHome: () => void;
}

export function SendInboxMobileView({
  inboxId,
  message,
  setMessage,
  title,
  isSending,
  isSent,
  handleSubmit,
  onNavigateHome
}: SendInboxMobileViewProps) {
  return (
    <div className="md:hidden relative z-20 flex flex-col min-h-screen">
      <div className="flex items-center justify-between px-4 py-6 shrink-0">
        <button
          onClick={onNavigateHome}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-600 border border-slate-200/60 shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black tracking-[0.3em] text-pink-500 uppercase">Whisper Portal</span>
          <span className="text-slate-800 font-bold text-sm">#{inboxId?.toUpperCase()}</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <AnimatePresence mode="wait">
            <motion.div
              key="mobile-form"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="flex-1 flex flex-col bg-white rounded-t-[2.5rem] shadow-2xl relative"
            >
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6 mt-4 opacity-50" />
              <div className="px-6 pb-6">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Send Your <br />
                  <span className="text-pink-500">Anonymous</span> Message
                </h1>

                {title && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-4 p-4 bg-pink-50 border border-pink-100 rounded-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <MessageSquare size={40} className="text-pink-600" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-pink-500 mb-1 block">Inbox Title</span>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
                      "{title}"
                    </p>
                  </motion.div>
                )}
              </div>

              <SendInboxPromoCards />

              <form onSubmit={handleSubmit} className="px-6 pt-2 flex flex-col gap-5 pb-12">
                <AnimatePresence>
                  {isSent && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-2xl text-sm font-bold border border-emerald-100 flex items-center justify-center gap-2 overflow-hidden shadow-sm"
                    >
                      <Check size={18} />
                      Message sent securely!
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                  <textarea
                    placeholder="Write something honest..."
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-5 py-5 text-slate-900 focus:outline-none focus:border-pink-300 transition-all font-bold resize-none placeholder:text-slate-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSending || !message.trim()}
                    className="w-full h-16 bg-[#D82B7D] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-pink-500/20 active:scale-95"
                  >
                    {isSending ? (
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <div className="flex items-center gap-3">
                        <Send size={18} />
                        <span>Send</span>
                      </div>
                    )}
                  </button>

                  <div
                    onClick={onNavigateHome}
                    className="mt-6 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Want your own inbox?</span>
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest group-hover:underline">Create Now</span>
                  </div>
                </div>
              </form>
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
