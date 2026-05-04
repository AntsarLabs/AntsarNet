import React from 'react';
import { motion } from 'framer-motion';
import { EyeOff, ShieldCheck, Users, MapPin, MessageSquare } from 'lucide-react';

interface SendInboxDesktopViewProps {
  inboxId?: string;
  subject: string;
  setSubject: (s: string) => void;
  message: string;
  setMessage: (m: string) => void;
  instruction: string;
  isSending: boolean;
  isSent: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  onNavigateHome: () => void;
}

export function SendInboxDesktopView({
  inboxId,
  subject,
  setSubject,
  message,
  setMessage,
  instruction,
  isSending,
  isSent,
  handleSubmit,
  onNavigateHome
}: SendInboxDesktopViewProps) {
  if (isSent) {
    return (
      <div className="hidden md:flex relative z-10 flex-1 items-center justify-center px-8 py-20">
        <div className="bg-white shadow-2xl rounded-[3rem] p-16 text-center max-w-md w-full border border-white/40">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Delivered!</h2>
          <p className="text-slate-500 font-bold mb-8">Your secret is safe with us.</p>
          <button
            onClick={onNavigateHome}
            className="w-full h-16 bg-[#D82B7D] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-pink-500/20 active:scale-[0.98] transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex relative z-10 flex-1 items-center justify-center px-8 py-20">
      <div className="w-full max-w-7xl grid grid-cols-[300px_1fr_300px] gap-12 items-start">
        <div className="flex flex-col gap-6">
          <div className="bg-white/85 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-sm transition-all hover:bg-white hover:shadow-md">
            <EyeOff size={28} className="text-pink-500 mb-4" />
            <h3 className="text-slate-900 font-bold mb-2">100% Anonymous</h3>
            <p className="text-slate-500 text-sm leading-relaxed">No tracking, no IDs disclosed. Your privacy is our priority.</p>
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-sm transition-all hover:bg-white hover:shadow-md">
            <ShieldCheck size={28} className="text-blue-500 mb-4" />
            <h3 className="text-slate-900 font-bold mb-2">Encrypted</h3>
            <p className="text-slate-500 text-sm leading-relaxed">End-to-end encryption ensures only the receiver can read it.</p>
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-[3rem] p-12 overflow-hidden relative border border-white/40">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
              <MessageSquare size={32} className="text-[#D82B7D]" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Anonymous Inbox</h1>
            <span className="text-[10px] font-black font-mono text-pink-600 bg-pink-50 px-4 py-1.5 rounded-lg border border-pink-100 uppercase tracking-widest">To: #{inboxId?.toUpperCase()}</span>
          </div>

          {instruction && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-center relative"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Instruction</span>
              <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                "{instruction}"
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
              <input
                type="text"
                placeholder="Optional subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl px-5 text-slate-900 focus:outline-none focus:border-pink-300 shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
              <textarea
                placeholder="Type your message..."
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-pink-300 resize-none shadow-sm font-bold"
              />
            </div>
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="w-full h-16 bg-[#D82B7D] hover:bg-[#C0266F] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-pink-500/20 active:scale-[0.98] transition-all"
            >
              {isSending ? "Sending..." : "Send Anonymous Whisper"}
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white/85 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-sm transition-all hover:bg-white hover:shadow-md">
            <Users size={28} className="text-emerald-500 mb-4" />
            <h3 className="text-slate-900 font-bold mb-2">Join the Club</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Join 10k+ users in Addis sharing thoughts freely.</p>
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-sm transition-all hover:bg-white hover:shadow-md">
            <MapPin size={28} className="text-amber-500 mb-4" />
            <h3 className="text-slate-900 font-bold mb-2">Local & Safe</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Connect with people in your neighborhood safely.</p>
          </div>
          <button
            onClick={onNavigateHome}
            className="w-full bg-[#D82B7D] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-pink-500/20"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
