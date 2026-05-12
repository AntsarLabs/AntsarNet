import { ShieldCheck } from 'lucide-react';

export const AuthHero = () => {
  return (
    <div className="flex-1 flex flex-col justify-between relative z-10 mt-10">
      <div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-4 md:mb-6 leading-[1.05] uppercase">
          AnstarNet <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-rose-600">
            PassCard
          </span>
        </h1>

        <p className="text-slate-500 font-mono text-xs md:text-sm leading-relaxed max-w-sm tracking-wide">
          AnstarNet utilizes zero-knowledge architecture. No passwords. No emails. Your identity is a singular cryptographic footprint stored offline, exclusively on your device.
        </p>
      </div>

      {/* Decorative Hex String */}
      <div className="hidden md:block mt-12 pt-8 border-t border-slate-200/60">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-rose-500/80 font-mono text-[10px] tracking-[0.2em] uppercase">
            <ShieldCheck size={14} className="shrink-0" />
            <span>End-to-End Encrypted Handshake</span>
          </div>
        </div>
      </div>
    </div>
  );
};
