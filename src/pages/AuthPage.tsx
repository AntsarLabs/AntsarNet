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
    <div className="min-h-screen w-full relative flex flex-col font-sans overflow-x-hidden selection:text-pink-500 selection:bg-pink-500/20 bg-[#020205]">
      <GlobalBackground showFloatingEmojis={true} />

      {/* MOBILE UI HEADER */}
      <div className="md:hidden relative z-50 flex items-center justify-between px-4 py-6 shrink-0">
        <button 
          onClick={() => window.location.href = '/'}
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-white border border-white/10"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center group">
          <span className="text-[9px] font-black tracking-[0.3em] text-pink-500 uppercase">System Status</span>
          <div className="flex items-center gap-1.5">
            <Lock size={12} className="text-rose-500" />
            <span className="text-slate-100 font-bold text-sm tracking-tight">SECURE_NODE</span>
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
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.3)] group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-50 mix-blend-overlay"></div>
          <Fingerprint className="text-white group-hover:rotate-12 transition-transform relative z-10" size={24} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
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
            <div className="absolute -inset-16 bg-gradient-to-tr from-pink-600/10 via-rose-500/5 to-purple-600/10 blur-[100px] rounded-[4rem] md:rounded-[6rem] pointer-events-none -z-10 hidden md:block"></div>

            <div className="relative bg-[#0F1117] md:bg-[#0A0C10]/80 backdrop-blur-3xl border border-white/[0.08] rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row gap-8 md:gap-16 p-6 md:p-12 lg:p-16 w-full">
              
              {/* Scanline / Grain Texture overlay for the card */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-screen bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjEiLz4KPC9zdmc+')]"></div>
              
              {/* LEFT COLUMN: BRANDING & COPY */}
              <div className="flex-1 flex flex-col justify-between relative z-10">
                <div>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6 md:mb-10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
                  >
                    <FileKey2 className="text-rose-500 w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
                  </motion.div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter mb-4 md:mb-6 leading-[1.05] uppercase">
                    IDENTITY <br className="hidden md:block" /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-rose-600">
                      PROTOCOL
                    </span>
                  </h1>
                  
                  <p className="text-slate-400 font-mono text-xs md:text-sm leading-relaxed max-w-sm tracking-wide">
                    AddisNet utilizes zero-knowledge architecture. No passwords. No emails. Your identity is a singular cryptographic footprint stored offline, exclusively on your device.
                  </p>
                </div>
                
                {/* Decorative Hex String */}
                <div className="hidden md:block mt-12 pt-8 border-t border-white/[0.05]">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-rose-500/80 font-mono text-[10px] tracking-[0.2em] uppercase">
                      <ShieldCheck size={14} className="shrink-0" />
                      <span>End-to-End Encrypted Handshake</span>
                    </div>
                    <div className="text-slate-600 font-mono text-[9px] tracking-widest break-all opacity-50">
                      SYS_MEM: 0x{Array.from({length: 4}, () => Math.random().toString(16).slice(2)).join('').substring(0, 32).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: ACTIONS */}
              <div className="flex-[1.2] flex flex-col gap-4 md:gap-5 relative z-10 w-full max-w-md mx-auto md:max-w-none">
                
                {/* OPTION A: MINT NEW */}
                <div className="relative group/mint">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-pink-500/60 to-rose-600/60 rounded-3xl blur-md opacity-20 group-hover/mint:opacity-60 transition duration-500 -z-10"></div>
                  <button 
                    onClick={handleGenerate}
                    disabled={isProcessing !== null}
                    className="relative w-full bg-[#1A1D24]/80 backdrop-blur-xl border border-white/[0.1] rounded-3xl p-5 md:p-7 text-left hover:bg-[#1f2229] transition-all flex items-start gap-5 overflow-hidden group/btn shadow-xl shadow-black/50"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-inner group-hover/btn:scale-105 transition-transform duration-300">
                      {isProcessing === 'generating' ? <RefreshCw className="animate-spin w-5 h-5 md:w-6 md:h-6" /> : <Download className="w-5 h-5 md:w-6 md:h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-pink-400 font-mono text-[9px] md:text-[10px] tracking-widest uppercase mb-1">New Connection</div>
                      <h3 className="text-white font-black text-lg md:text-xl mb-1 md:mb-1.5 tracking-tight uppercase">Mint Identity Card</h3>
                      <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed">System will generate and download your encrypted footprint as a .txt file.</p>
                    </div>

                    {/* Technical scanning effect on hover */}
                    <div className="absolute left-0 top-0 w-1 h-full bg-pink-500 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent -translate-x-[100%] group-hover/btn:animate-sweep pointer-events-none mix-blend-screen"></div>
                  </button>
                </div>

                {/* OR DIVIDER */}
                <div className="flex items-center gap-4 my-2 opacity-60">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
                  <span className="text-slate-500 font-mono text-[9px] tracking-[0.3em]">OR_AUTHENTICATE</span>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
                </div>

                {/* OPTION B: UPLOAD EXISTING */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing !== null}
                  className="w-full bg-white/[0.02] border border-white/[0.08] rounded-3xl p-5 md:p-7 text-left hover:bg-white/[0.05] transition-all flex items-start gap-5 group/upload relative overflow-hidden shadow-lg shadow-black/20"
                >
                  <input type="file" accept=".txt" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                  
                  <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-slate-800/80 border border-slate-600 flex items-center justify-center text-slate-300 group-hover/upload:-translate-y-1 group-hover/upload:text-white transition-all duration-300 shadow-inner">
                    {isProcessing === 'uploading' ? <RefreshCw className="animate-spin w-5 h-5 md:w-6 md:h-6 text-blue-400" /> : <Upload className="w-5 h-5 md:w-6 md:h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-500 font-mono text-[9px] md:text-[10px] tracking-widest uppercase mb-1">Returning User</div>
                    <h3 className="text-white font-black text-lg md:text-xl mb-1 md:mb-1.5 tracking-tight uppercase">Insert Identity Card</h3>
                    <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed">Provide your previously downloaded addisnet-identity.txt to unlock vault.</p>
                  </div>

                  {/* Scanline on hover */}
                  <div className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-[150%] opacity-0 group-hover/upload:opacity-100 group-hover/upload:animate-scanline pointer-events-none mix-blend-screen"></div>
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
                      <div className="mt-2 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 items-center text-red-400 shadow-xl backdrop-blur-md">
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
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(200px); }
        }
        .animate-sweep {
          animation: sweep 1.5s ease-in-out infinite;
        }
        .animate-scanline {
          animation: scanline 2.5s linear infinite;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};


