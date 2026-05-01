import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

interface LoginFormProps {
  onAuthSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onAuthSuccess, onSwitchToRegister }: LoginFormProps) => {
  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 w-full"
    >
      <button
        onClick={onAuthSuccess}
        className="w-full bg-slate-50/80 border border-slate-200/60 rounded-3xl p-5 md:p-7 text-left hover:bg-white transition-all flex items-start gap-5 group/upload relative overflow-hidden shadow-sm hover:shadow-md"
      >
        <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover/upload:-translate-y-1 group-hover/upload:text-slate-800 transition-all duration-300 shadow-sm">
          <Upload className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-slate-900 font-black text-lg md:text-xl mb-1 md:mb-1.5 tracking-tight uppercase">Use Existing PassCard</h3>
          <p className="text-slate-500 text-xs md:text-sm font-light leading-relaxed">Provide your previously downloaded addisnet-passcard.txt to unlock vault.</p>
        </div>
      </button>

      <div className="text-center mt-4">
        <button
          onClick={onSwitchToRegister}
          className="text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium"
        >
          Don't have a PassCard? <span className="text-pink-600 hover:underline">Create one</span>
        </button>
      </div>
    </motion.div>
  );
};
