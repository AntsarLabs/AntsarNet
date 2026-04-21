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
    <div className="w-full max-w-xl mx-auto px-4 py-12">
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2 border border-primary/20">
                <Shield size={32} />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white">Secure Your Identity</h1>
              <p className="text-slate-400 text-lg max-w-md mx-auto">
                This seed phrase is the <span className="text-white font-medium">only way</span> to recover your account. We don't store it on our servers.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-pink-500/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {seedPhrase.map((word, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg p-3 group/word transition-all hover:bg-white/10 hover:border-white/20">
                      <span className="text-xs font-mono text-slate-500 w-4">{i + 1}</span>
                      <span className="text-sm md:text-base font-medium text-slate-200">{word}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4 items-center justify-between border-t border-white/5 pt-6">
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all border border-white/5"
                  >
                    {copied ? <CheckCircle2 size={18} className="text-green-400" /> : <Copy size={18} />}
                    <span className="text-sm font-medium">{copied ? 'Copied' : 'Copy Phrase'}</span>
                  </button>
                  
                  <div className="flex gap-3">
                     <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-all" title="Screenshot backup">
                        <Camera size={20} />
                     </button>
                     <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-all" title="Cloud backup">
                        <Upload size={20} />
                     </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-4">
              <AlertCircle className="text-amber-500 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-200 uppercase tracking-wider">Crucial Warning</p>
                <p className="text-sm text-amber-200/70 leading-relaxed">
                  Take a screenshot, write it down, or backup to Google Drive. If you lose this, you lose access to your account forever.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleNext}
                className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 active:scale-[0.98] transition-all shadow-xl shadow-white/10"
              >
                I've Saved It
                <ArrowRight size={20} />
              </button>
              
              <button 
                onClick={onSwitchToSignin}
                className="w-full text-slate-400 text-sm hover:text-white transition-colors py-2"
              >
                Already have an account? Sign In
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
                className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-4 group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Go back
              </button>
              <h1 className="text-4xl font-bold tracking-tight text-white">Verify Your Phrase</h1>
              <p className="text-slate-400 text-lg max-w-md mx-auto">
                Tap the words in the <span className="text-white">exact order</span> they appeared.
              </p>
            </div>

            <div className="space-y-6">
              {/* Selected Words Display */}
              <div className="min-h-[160px] bg-slate-900/50 border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-wrap gap-2 items-start content-start">
                {verifyingWords.map((word, i) => (
                  <motion.button
                    layoutId={`word-${word}`}
                    key={i}
                    onClick={() => handleWordSelect(word)}
                    className="flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary-foreground px-3 py-1.5 rounded-lg text-sm transition-all hover:bg-primary/30"
                  >
                    <span className="text-[10px] opacity-50">{i + 1}</span>
                    {word}
                  </motion.button>
                ))}
                {verifyingWords.length === 0 && (
                  <p className="text-slate-500 text-sm m-auto italic">Your words will appear here...</p>
                )}
              </div>

              {/* Word Pool */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {[...seedPhrase].sort().map((word, i) => {
                  const isSelected = verifyingWords.includes(word);
                  return (
                    <motion.button
                      key={i}
                      disabled={isSelected}
                      onClick={() => handleWordSelect(word)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                        isSelected 
                        ? 'bg-slate-800/50 border-transparent text-slate-600 cursor-not-allowed opacity-50' 
                        : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/20 active:bg-white/15'
                      }`}
                    >
                      {word}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <button
                disabled={!isVerified}
                onClick={handleNext}
                className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
                  isVerified 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98]' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                }`}
              >
                {isVerified ? 'Confirm & Sign In' : 'Select words in order'}
                {isVerified && <CheckCircle2 size={20} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
