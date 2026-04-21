import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Upload, FileText, ArrowRight, AlertCircle, RefreshCw, Key } from 'lucide-react';

export const SigninFlow = ({ onComplete, onSwitchToSignup }: { onComplete: () => void; onSwitchToSignup: () => void }) => {
  const [phrase, setPhrase] = useState<string[]>(new Array(12).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    const newPhrase = [...phrase];
    if (value.includes(' ')) {
      const words = value.trim().split(/\s+/);
      words.forEach((word, i) => {
        if (index + i < 12) newPhrase[index + i] = word;
      });
    } else {
      newPhrase[index] = value.trim();
    }
    setPhrase(newPhrase);
    setError(null);
  };

  const isComplete = phrase.every(word => word.trim() !== '');

  const handleSignin = () => {
    if (isComplete) {
      onComplete();
    } else {
      setError('Please enter all 12 words of your recovery phrase.');
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setPhrase(['eternal', 'summit', 'ocean', 'wisdom', 'crystal', 'spirit', 'galaxy', 'harbor', 'legend', 'nature', 'phoenix', 'valley']);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-6 md:px-4 py-4 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-3">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-pink-500/10 text-pink-500 mb-4 border border-pink-500/20 shadow-inner"
          >
            <Key size={40} className="drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto font-light leading-relaxed">
            Enter your <span className="text-slate-200 font-medium italic underline decoration-pink-500/50 underline-offset-4">12-word recovery phrase</span> to unlock your vault.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#D82B7D]/50 to-rose-500/50 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {phrase.map((word, i) => (
                <div key={i} className="relative group/input">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-600 group-focus-within/input:text-pink-500 transition-colors">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-700 focus:bg-white/[0.08] focus:border-pink-500/40 focus:ring-2 focus:ring-pink-500/10 outline-none transition-all font-medium text-center md:text-left shadow-sm md:shadow-none"
                    placeholder="word"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={simulateUpload}
                disabled={isUploading}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 transition-all border border-white/5 group shadow-lg"
              >
                {isUploading ? (
                  <RefreshCw size={18} className="animate-spin text-pink-500" />
                ) : (
                  <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform text-slate-400 group-hover:text-pink-500" />
                )}
                <span className="text-sm font-bold tracking-wide uppercase">{isUploading ? 'Scanning...' : 'Backup File'}</span>
              </button>

              <button
                onClick={() => { }} 
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 transition-all border border-white/5 group shadow-lg"
              >
                <FileText size={18} className="group-hover:-translate-y-0.5 transition-transform text-slate-400 group-hover:text-pink-500" />
                <span className="text-sm font-bold tracking-wide uppercase">QR Code</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 items-center text-red-400 text-sm shadow-xl"
          >
            <AlertCircle size={18} className="shrink-0" />
            <p className="font-medium">{error}</p>
          </motion.div>
        )}

        <div className="space-y-6 pt-4">
          <button
            onClick={handleSignin}
            className={`w-full font-black py-5 rounded-[1.25rem] flex items-center justify-center gap-3 transition-all text-lg tracking-tight shadow-2xl ${isComplete
                ? 'bg-gradient-to-r from-[#D82B7D] to-rose-600 text-white shadow-[#D82B7D]/20 hover:shadow-[#D82B7D]/40 md:hover:-translate-y-0.5 active:scale-95 md:active:translate-y-0'
                : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5 shadow-none'
              }`}
          >
            RESTORE ACCOUNT
            <ArrowRight size={22} className={isComplete ? 'animate-pulse' : ''} />
          </button>

          <button
            onClick={onSwitchToSignup}
            className="w-full text-slate-500 text-sm hover:text-white transition-colors py-2 font-medium tracking-wide uppercase bg-transparent border-none"
          >
            New Here? <span className="text-pink-500 font-bold ml-1">Create Account</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};


