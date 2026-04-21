import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignupFlow } from './SignupFlow';
import { SigninFlow } from './SigninFlow';
import { Sparkles, Zap, Fingerprint, ShieldCheck, ChevronLeft, Lock } from 'lucide-react';
import { GlobalBackground } from '../../components/GlobalBackground';

export const AuthPage = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');

  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans overflow-x-hidden">
      <GlobalBackground showFloatingEmojis={true} />

      {/* MOBILE UI HEADER */}
      <div className="md:hidden relative z-50 flex items-center justify-between px-4 py-6 shrink-0">
        <button 
          onClick={() => window.location.href = '/'}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center group">
          <span className="text-[10px] font-black tracking-[0.3em] text-pink-400 uppercase">Secure Portal</span>
          <div className="flex items-center gap-1">
            <Lock size={10} className="text-slate-400" />
            <span className="text-white font-bold text-sm tracking-tight">AddisNet Auth</span>
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* DESKTOP LOGO (Hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:flex fixed top-8 left-8 items-center gap-3 z-50 cursor-pointer"
        onClick={() => window.location.href = '/'}
      >
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-xl shadow-pink-500/20 group hover:scale-105 transition-transform">
          <Fingerprint className="text-white group-hover:rotate-12 transition-transform" size={24} />
        </div>
        <div className="flex flex-col -space-y-1">
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Addis<span className="text-pink-500">Net</span>
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] ml-0.5">
            Privacy First
          </span>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:justify-center relative z-10 w-full overflow-y-auto hide-scrollbar">
        <div className="w-full max-w-xl mx-auto flex flex-col min-h-full">
          {/* Mobile Bottom Sheet style card */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 md:flex-none flex flex-col bg-slate-900/60 md:bg-transparent backdrop-blur-2xl md:backdrop-blur-none rounded-t-[2.5rem] md:rounded-none border-t border-white/10 md:border-none shadow-2xl md:shadow-none pb-12 md:pb-0"
          >
            {/* Native sheet handle indicator */}
            <div className="md:hidden w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-6 mb-2 opacity-50" />
            
            <AnimatePresence mode="wait">
              {mode === 'signup' ? (
                <SignupFlow
                  key="signup"
                  onComplete={onAuthSuccess}
                  onSwitchToSignin={() => setMode('signin')}
                />
              ) : (
                <SigninFlow
                  key="signin"
                  onComplete={onAuthSuccess}
                  onSwitchToSignup={() => setMode('signup')}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Floating badges (Adjusted for mobile bottom sheet) */}
      <div className="hidden md:flex fixed bottom-8 left-0 right-0 justify-center gap-8 opacity-60 pointer-events-none px-4 z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 text-slate-300 text-xs uppercase tracking-[0.15em] bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 shadow-2xl"
        >
          <ShieldCheck size={14} className="text-green-400" />
          End-to-End Encrypted
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-2 text-slate-300 text-xs uppercase tracking-[0.15em] bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 shadow-2xl"
        >
          <Zap size={14} className="text-pink-500" />
          Zero Knowledge
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex items-center gap-2 text-slate-300 text-xs uppercase tracking-[0.15em] bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 shadow-2xl"
        >
          <Sparkles size={14} className="text-blue-400" />
          Anonymous
        </motion.div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};


