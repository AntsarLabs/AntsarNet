import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, MessageSquare, ArrowRight, ShieldCheck, Users, EyeOff, MapPin, ChevronLeft } from 'lucide-react';

export function SendAnonymousMessagePage() {
  const { inboxId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  // Mocking the user's custom instruction
  const [instruction] = useState('Tell me something you never had the courage to say in person... 💭');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setSubject('');
      setMessage('');
    }, 1500);
  };

  const PromoCards = () => (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="flex gap-3 overflow-x-auto pb-4 px-6 hide-scrollbar">
        <div className="shrink-0 w-[140px] bg-slate-50 border border-slate-100 p-4 rounded-2xl">
          <EyeOff size={18} className="text-pink-500 mb-2" />
          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Anonymous</h4>
          <p className="text-[9px] text-slate-500 mt-1 leading-tight">No tracking, your identity is hidden.</p>
        </div>
        <div className="shrink-0 w-[140px] bg-slate-50 border border-slate-100 p-4 rounded-2xl">
          <ShieldCheck size={18} className="text-blue-500 mb-2" />
          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Private</h4>
          <p className="text-[9px] text-slate-500 mt-1 leading-tight">End-to-end encrypted delivery.</p>
        </div>
        <div className="shrink-0 w-[140px] bg-slate-50 border border-slate-100 p-4 rounded-2xl">
          <Users size={18} className="text-emerald-500 mb-2" />
          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight">10k+ Local</h4>
          <p className="text-[9px] text-slate-500 mt-1 leading-tight">Join residents in your area.</p>
        </div>
        <div className="shrink-0 w-[140px] bg-slate-50 border border-slate-100 p-4 rounded-2xl">
          <MapPin size={18} className="text-amber-500 mb-2" />
          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Discovery</h4>
          <p className="text-[9px] text-slate-500 mt-1 leading-tight">Meet local friends safely.</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen w-full relative bg-transparent font-sans overflow-x-hidden flex flex-col">
      {/* BACKGROUND REMOVED - using GlobalBackground instead */}

      {/* MOBILE UI */}
      <div className="md:hidden relative z-20 flex flex-col min-h-screen">
        <div className="flex items-center justify-between px-4 py-6 shrink-0">
          <button
            onClick={() => navigate('/')}
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
            {!isSent ? (
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

                  {instruction && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="mt-4 p-4 bg-pink-50 border border-pink-100 rounded-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <MessageSquare size={40} className="text-pink-600" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-pink-500 mb-1 block">Inbox Instruction</span>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
                        "{instruction}"
                      </p>
                    </motion.div>
                  )}
                </div>

                <PromoCards />

                <form onSubmit={handleSubmit} className="px-6 pt-2 flex flex-col gap-5 pb-12">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                    <input
                      type="text"
                      placeholder="What is this about? (Optional)"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-slate-900 focus:outline-none focus:border-pink-300 transition-all font-bold placeholder:text-slate-400"
                    />
                  </div>

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
                          <span>Send Whisper</span>
                        </div>
                      )}
                    </button>

                    <div
                      onClick={() => navigate('/')}
                      className="mt-6 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Want your own inbox?</span>
                      <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest group-hover:underline">Create Now</span>
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="mobile-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col bg-white rounded-t-[2.5rem] items-center justify-center p-8 text-center"
              >
                <div className="w-24 h-24 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 shadow-sm relative">
                  <Check size={40} className="text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Whisper Sent!</h2>
                <p className="text-slate-500 text-sm font-bold mb-10 max-w-[240px]">Your message has been delivered safely and anonymously.</p>

                <div className="w-full space-y-3">
                  <button
                    onClick={() => setIsSent(false)}
                    className="w-full h-14 bg-slate-100 text-slate-700 rounded-2xl font-bold border border-slate-200"
                  >
                    Send Another
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full h-16 bg-pink-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                  >
                    Create Your Inbox
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* DESKTOP UI */}
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
              onClick={() => navigate('/')}
              className="w-full bg-[#D82B7D] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-pink-500/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
