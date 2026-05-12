import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import { AuthFormProps } from '../types';
import { useNavigate } from 'react-router-dom';

export const LoginForm = ({ switchToAuthType }: AuthFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        try {
          await login(content.trim());
          navigate('/discover');
        } catch (err) {
          console.error("Login failed:", err);
        }
      }
    };
    reader.readAsText(file);

    // Reset input so the same file can be uploaded again if needed
    e.target.value = '';
  };

  const handleButtonClick = () => {
    clearError();
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 w-full"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".txt"
      />

      <button
        onClick={handleButtonClick}
        disabled={isLoading}
        className="w-full bg-slate-50/80 border border-slate-200/60 rounded-3xl p-5 md:p-7 text-left hover:bg-white transition-all flex items-start gap-5 group/upload relative overflow-hidden shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover/upload:-translate-y-1 group-hover/upload:text-slate-800 transition-all duration-300 shadow-sm">
          {isLoading ? (
            <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
          ) : (
            <Upload className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-slate-900 font-black text-lg md:text-xl mb-1 md:mb-1.5 tracking-tight uppercase">
            {isLoading ? 'Logging in...' : 'Login in with PassCard'}
          </h3>
          <p className="text-slate-500 text-xs md:text-sm font-light leading-relaxed">
            Provide your previously downloaded <span className='font-semibold text-slate-900'>Anstarnet-passcard.txt</span> to login.
          </p>
        </div>
      </button>

      {error && (
        <div className="px-4 py-2 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium text-center">
          {error}
        </div>
      )}

      <div className="text-center mt-4">
        <button
          onClick={() => switchToAuthType('register')}
          disabled={isLoading}
          className="text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium disabled:opacity-50"
        >
          Don't have a PassCard? <span className="text-pink-600 hover:underline">Create one</span>
        </button>
      </div>
    </motion.div>
  );
};
