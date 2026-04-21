import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignupFlow } from './SignupFlow';
import { SigninFlow } from './SigninFlow';
import { Sparkles, Zap, Fingerprint } from 'lucide-react';

export const AuthPage = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');

  // Decorative backgrounds
  const Background = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      {/* Animated Gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-pink-500/10 blur-[120px] rounded-full"
      />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
        
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.05]" 
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  );

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center font-sans">
      <Background />
      
      {/* Logo / Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-8 flex items-center gap-2"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center shadow-lg shadow-primary/20">
          <Fingerprint className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-white uppercase italic">Addis<span className="text-primary">Net</span></span>
      </motion.div>

      {/* Main Content */}
      <div className="w-full relative z-10 px-4">
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
      </div>

      {/* Floating badges for flavor */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-6 opacity-40 pointer-events-none px-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <Zap size={14} className="text-primary" />
          End-to-End Encrypted
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-400 text-xs uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <Sparkles size={14} className="text-pink-500" />
          Web3 Protocol
        </div>
      </div>
    </div>
  );
};
