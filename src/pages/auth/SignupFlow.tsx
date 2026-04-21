import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Copy, CheckCircle2, AlertCircle, Camera, Upload, ArrowRight, ArrowLeft, Download, Info } from 'lucide-react';

const MOCK_WORDS = [
  'eternal', 'summit', 'ocean', 'wisdom', 'crystal', 'spirit',
  'galaxy', 'harbor', 'legend', 'nature', 'phoenix', 'valley',
  'ancient', 'beyond', 'canvas', 'dream', 'echo', 'forest',
  'glory', 'humble', 'island', 'journey', 'kindle', 'lunar'
];

const generateSeedPhrase = () => {
  return [...MOCK_WORDS].sort(() => Math.random() - 0.5).slice(0, 12);
};

export const SignupFlow = ({ onComplete, onSwitchToSignin }: { onComplete: () => void; onSwitchToSignin: () => void }) => {
  const [step, setStep] = useState<'generate' | 'verify'>('generate');
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [verifyingWords, setVerifyingWords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSeedPhrase(generateSeedPhrase());
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(seedPhrase.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWordSelect = (word: string) => {
    if (verifyingWords.includes(word)) {
      setVerifyingWords(prev => prev.filter(w => w !== word));
    } else {
      if (verifyingWords.length < 12) {
        setVerifyingWords(prev => [...prev, word]);
      }
    }
  };

  const isVerified = verifyingWords.length === 12 && verifyingWords.every((word, i) => word === seedPhrase[i]);

  const handleNext = () => {
    if (step === 'generate') setStep('verify');
    else if (isVerified) onComplete();
  };

  return (
    <div className="w-full max-w-xl mx-auto px-6 md:px-4 py-4 md:py-8">
      <AnimatePresence mode="wait">
        {step === 'generate' ? (
          <motion.div
            key="generate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-3">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-pink-500/10 text-pink-500 mb-4 border border-pink-500/20 shadow-inner"
              >
                <Shield size={40} className="drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">Secure Identity</h1>
              <p className="text-slate-400 text-lg max-w-md mx-auto font-light leading-relaxed">
                This phrase is the <span className="text-white font-medium italic underline decoration-pink-500/50 underline-offset-4">only way</span> to recover your account. Authenticity is key.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D82B7D]/50 to-pink-500/50 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {seedPhrase.map((word, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-xl p-3.5 group/word transition-all hover:bg-white/[0.08] hover:border-white/10 shadow-sm md:shadow-none">
                      <span className="text-[10px] font-mono font-bold text-slate-600 w-4">{(i + 1).toString().padStart(2, '0')}</span>
                      <span className="text-sm md:text-base font-semibold text-slate-100">{word}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4 items-center justify-between border-t border-white/5 pt-8">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 transition-all border border-white/5 shadow-lg group"
                  >
                    {copied ? <CheckCircle2 size={18} className="text-green-400" /> : <Copy size={18} className="text-slate-400 group-hover:text-pink-500 transition-colors" />}
                    <span className="text-sm font-bold tracking-wide uppercase">{copied ? 'Copied' : 'Copy Phrase'}</span>
                  </button>

                  <div className="flex gap-3">
                    <button className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-blue-400 border border-white/5 transition-all shadow-lg" title="Camera backup">
                      <Camera size={20} />
                    </button>
                    <button className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-indigo-400 border border-white/5 transition-all shadow-lg" title="Cloud backup">
                      <Upload size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 flex gap-4 backdrop-blur-md shadow-xl">
              <Info className="text-amber-500 shrink-0 mt-0.5" size={24} />
              <div className="space-y-1">
                <p className="text-sm font-black text-amber-500 uppercase tracking-widest">Store it safely</p>
                <p className="text-sm text-amber-200/60 leading-relaxed font-light">
                  If you lose this, your account and all data are <span className="text-amber-200 font-medium">gone forever</span>.
                </p>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <button
                onClick={handleNext}
                className="w-full bg-white text-slate-950 font-black py-5 rounded-[1.25rem] flex items-center justify-center gap-3 hover:bg-slate-100 active:scale-[0.99] transition-all text-lg tracking-tight shadow-xl shadow-white/5"
              >
                I HAVE STORED IT SECURELY
                <ArrowRight size={22} />
              </button>

              <button
                onClick={onSwitchToSignin}
                className="w-full text-slate-500 text-sm hover:text-white transition-colors py-2 font-medium tracking-wide"
              >
                ALREADY HAVE A VAULT? <span className="text-pink-500 font-bold ml-1 uppercase">Sign In</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="verify"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-3">
              <button
                onClick={() => setStep('generate')}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 group bg-white/5 px-4 py-1.5 rounded-full border border-white/5"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest">Restart Process</span>
              </button>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">Verify Phrase</h1>
              <p className="text-slate-400 text-lg max-w-md mx-auto font-light leading-relaxed">
                Reconstruct your sequence in the <span className="text-white font-medium italic underline decoration-pink-500/50 underline-offset-4">exact order</span> it appeared.
              </p>
            </div>

            <div className="space-y-8">
              {/* Selected Words Display */}
              <div className="min-h-[160px] bg-slate-900/30 backdrop-blur-xl border-2 border-dashed border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-wrap gap-3 items-start content-start shadow-inner">
                {verifyingWords.map((word, i) => (
                  <motion.button
                    layoutId={`word-${word}`}
                    key={i}
                    onClick={() => handleWordSelect(word)}
                    className="flex items-center gap-2 bg-[#D82B7D]/20 border border-[#D82B7D]/30 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-[#D82B7D]/30 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <span className="text-[10px] font-bold opacity-40 italic">{(i + 1).toString().padStart(2, '0')}</span>
                    {word}
                  </motion.button>
                ))}
                {verifyingWords.length === 0 && (
                  <div className="w-full h-24 flex items-center justify-center">
                    <p className="text-slate-700 text-sm font-medium italic tracking-wide uppercase">Queue is empty...</p>
                  </div>
                )}
              </div>

              {/* Word Pool */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[...seedPhrase].sort().map((word, i) => {
                  const isSelected = verifyingWords.includes(word);
                  return (
                    <motion.button
                      key={i}
                      disabled={isSelected}
                      onClick={() => handleWordSelect(word)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${isSelected
                          ? 'bg-slate-900/50 border-transparent text-slate-700 cursor-not-allowed opacity-30 shadow-none'
                          : 'bg-white/[0.03] border-white/10 text-slate-200 hover:bg-white/[0.08] hover:border-white/20 active:bg-white/[0.12] hover:-translate-y-0.5 shadow-md'
                        }`}
                    >
                      {word}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <button
                disabled={!isVerified}
                onClick={handleNext}
                className={`w-full font-black py-5 rounded-[1.25rem] flex items-center justify-center gap-3 transition-all text-xl tracking-tight shadow-2xl ${isVerified
                    ? 'bg-gradient-to-r from-[#D82B7D] to-rose-600 text-white shadow-[#D82B7D]/30 hover:-translate-y-1 active:translate-y-0'
                    : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5 shadow-none'
                  }`}
              >
                {isVerified ? 'REALIZE ACCOUNT' : 'VERIFY SEQUENCE'}
                {isVerified ? <CheckCircle2 size={24} className="animate-bounce" /> : <div className="w-6 h-6 border-2 border-slate-700 rounded-full border-t-transparent" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

