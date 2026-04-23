import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Fingerprint, ShieldCheck, ChevronLeft, Lock, FileKey2, Upload, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { GlobalBackground } from '../components/GlobalBackground';

const MOCK_WORDS = [
  'eternal', 'summit', 'ocean', 'wisdom', 'crystal', 'spirit',
  'galaxy', 'harbor', 'legend', 'nature', 'phoenix', 'valley',
  'ancient', 'beyond', 'canvas', 'dream', 'echo', 'forest',
  'glory', 'humble', 'island', 'journey', 'kindle', 'lunar'
];

const generateSeedPhrase = () => {
  return [...MOCK_WORDS].sort(() => Math.random() - 0.5).slice(0, 12);
};

export const AuthPage = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [isProcessing, setIsProcessing] = useState<'generating' | 'uploading' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    setIsProcessing('generating');
    setError(null);
    const phrase = generateSeedPhrase().join(' ');
    const fileContent = `ADDISNET IDENTITY CARD\n\nKEEP THIS SAFE. THIS IS THE ONLY WAY TO ACCESS YOUR ACCOUNT.\n\n${phrase}`;

    // Create and download file
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'addisnet-identity.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // After download, give a slight delay before triggering success to let user see it happened
    setTimeout(() => {
      setIsProcessing(null);
      onAuthSuccess();
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing('uploading');
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Very basic validation - looking for 12 words at the end
      const phrase = text.split('\n').pop()?.trim() || "";
      const words = phrase.split(/\s+/).filter(w => w.length > 0);

      setTimeout(() => {
        setIsProcessing(null);
        if (words.length >= 12) {
          onAuthSuccess();
        } else {
          setError("Invalid Identity Card. Please upload a valid .txt card.");
        }
      }, 1500);
    };
    reader.onerror = () => {
      setIsProcessing(null);
      setError("Failed to read file.");
    };
    reader.readAsText(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans overflow-x-hidden selection:text-pink-600 selection:bg-pink-100 bg-transparent">

      {/* MOBILE UI HEADER */}
      <div className="md:hidden relative z-50 flex items-center justify-between px-4 py-6 shrink-0">
        <button
          onClick={() => window.location.href = '/'}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-600 border border-slate-200/60 shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center group">
          <span className="text-[9px] font-black tracking-[0.3em] text-pink-500 uppercase">System Status</span>
          <div className="flex items-center gap-1.5">
            <Lock size={12} className="text-rose-500" />
            <span className="text-slate-800 font-bold text-sm tracking-tight">SECURE_NODE</span>
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* DESKTOP LOGO (Hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:flex fixed top-8 left-10 items-center gap-4 z-50 cursor-pointer group"
        onClick={() => window.location.href = '/'}
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <Fingerprint className="text-white group-hover:rotate-12 transition-transform relative z-10" size={24} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">
            ADDIS<span className="text-pink-500">NET</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.3em] mt-1">
            PROTOCOL // V2.4
          </span>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:justify-center relative z-10 w-full xl:max-w-[1400px] xl:mx-auto">
        <div className="w-full flex-1 md:flex-none flex items-center justify-center px-4 md:px-8 py-8 md:py-0">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[1000px] relative"
          >
            {/* Ambient Background Glow for the Card */}
            <div className="absolute -inset-16 bg-gradient-to-tr from-pink-200/20 via-rose-100/10 to-purple-200/15 blur-[100px] rounded-[4rem] md:rounded-[6rem] pointer-events-none -z-10 hidden md:block"></div>

            <div className="relative bg-white/90 md:bg-white/80 backdrop-blur-2xl border border-slate-200/60 rounded-3xl md:rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row gap-8 md:gap-16 p-6 md:p-12 lg:p-16 w-full">

              {/* LEFT COLUMN: BRANDING & COPY */}
              <div className="flex-1 flex flex-col justify-between relative z-10">
                <div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center mb-6 md:mb-10 shadow-sm"
                  >
                    <FileKey2 className="text-rose-500 w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
                  </motion.div>

                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-4 md:mb-6 leading-[1.05] uppercase">
                    IDENTITY <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-rose-600">
                      PROTOCOL
                    </span>
                  </h1>

                  <p className="text-slate-500 font-mono text-xs md:text-sm leading-relaxed max-w-sm tracking-wide">
                    AddisNet utilizes zero-knowledge architecture. No passwords. No emails. Your identity is a singular cryptographic footprint stored offline, exclusively on your device.
                  </p>
                </div>

                {/* Decorative Hex String */}
                <div className="hidden md:block mt-12 pt-8 border-t border-slate-200/60">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-rose-500/80 font-mono text-[10px] tracking-[0.2em] uppercase">
                      <ShieldCheck size={14} className="shrink-0" />
                      <span>End-to-End Encrypted Handshake</span>
                    </div>
                    <div className="text-slate-300 font-mono text-[9px] tracking-widest break-all opacity-70">
                      SYS_MEM: 0x{Array.from({ length: 4 }, () => Math.random().toString(16).slice(2)).join('').substring(0, 32).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: ACTIONS */}
              <div className="flex-[1.2] flex flex-col gap-4 md:gap-5 relative z-10 w-full max-w-md mx-auto md:max-w-none">

                {/* OPTION A: MINT NEW */}
                <div className="relative group/mint">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-pink-500/30 to-rose-600/30 rounded-3xl blur-md opacity-0 group-hover/mint:opacity-60 transition duration-500 -z-10"></div>
                  <button
                    onClick={handleGenerate}
                    disabled={isProcessing !== null}
                    className="relative w-full bg-white border border-slate-200/60 rounded-3xl p-5 md:p-7 text-left hover:bg-slate-50/80 transition-all flex items-start gap-5 overflow-hidden group/btn shadow-sm hover:shadow-md"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 group-hover/btn:scale-105 transition-transform duration-300">
                      {isProcessing === 'generating' ? <RefreshCw className="animate-spin w-5 h-5 md:w-6 md:h-6" /> : <Download className="w-5 h-5 md:w-6 md:h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-pink-500 font-mono text-[9px] md:text-[10px] tracking-widest uppercase mb-1">New Connection</div>
                      <h3 className="text-slate-900 font-black text-lg md:text-xl mb-1 md:mb-1.5 tracking-tight uppercase">Mint Identity Card</h3>
                      <p className="text-slate-500 text-xs md:text-sm font-light leading-relaxed">System will generate and download your encrypted footprint as a .txt file.</p>
                    </div>

                    {/* Technical scanning effect on hover */}
                    <div className="absolute left-0 top-0 w-1 h-full bg-pink-500 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                  </button>
                </div>

                {/* OR DIVIDER */}
                <div className="flex items-center gap-4 my-2 opacity-60">
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent flex-1"></div>
                  <span className="text-slate-400 font-mono text-[9px] tracking-[0.3em]">OR_AUTHENTICATE</span>
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent flex-1"></div>
                </div>

                {/* OPTION B: UPLOAD EXISTING */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing !== null}
                  className="w-full bg-slate-50/80 border border-slate-200/60 rounded-3xl p-5 md:p-7 text-left hover:bg-white transition-all flex items-start gap-5 group/upload relative overflow-hidden shadow-sm hover:shadow-md"
                >
                  <input type="file" accept=".txt" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

                  <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover/upload:-translate-y-1 group-hover/upload:text-slate-800 transition-all duration-300 shadow-sm">
                    {isProcessing === 'uploading' ? <RefreshCw className="animate-spin w-5 h-5 md:w-6 md:h-6 text-blue-500" /> : <Upload className="w-5 h-5 md:w-6 md:h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-400 font-mono text-[9px] md:text-[10px] tracking-widest uppercase mb-1">Returning User</div>
                    <h3 className="text-slate-900 font-black text-lg md:text-xl mb-1 md:mb-1.5 tracking-tight uppercase">Insert Identity Card</h3>
                    <p className="text-slate-500 text-xs md:text-sm font-light leading-relaxed">Provide your previously downloaded addisnet-identity.txt to unlock vault.</p>
                  </div>
                </button>

                {/* Error State Block */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 bg-red-50 border border-red-200/60 rounded-2xl p-4 flex gap-3 items-center text-red-600 shadow-sm">
                        <AlertCircle size={20} className="shrink-0" />
                        <p className="font-mono text-xs tracking-wide leading-tight">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}
      </style>
    </div>
  );
};
