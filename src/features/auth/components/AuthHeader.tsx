import { motion } from 'framer-motion';
import { Fingerprint, ChevronLeft, Lock } from 'lucide-react';

export const AuthHeader = () => {
  return (
    <>
      {/* MOBILE UI HEADER */}
      <div className="md:hidden relative z-50 flex items-center justify-between px-4 py-6 shrink-0">
        <button
          onClick={() => window.location.href = '/'}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-600 border border-slate-200/60 shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center group">
          <div className="flex items-center gap-1.5 align-baseline">
            <Lock size={24} className="text-slate-800" />
            <span className="text-slate-800 font-bold text-[24px] tracking-tighter ">Anstar<span className="text-pink-500">NET</span></span>
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
            Anstar<span className="text-pink-500">NET</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.3em] mt-1">
            Self-governing and anonymous network
          </span>
        </div>
      </motion.div>
    </>
  );
};
