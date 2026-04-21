import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Upload, FileText, ArrowRight, AlertCircle, RefreshCw, Key } from 'lucide-react';

export const SigninFlow = ({ onComplete, onSwitchToSignup }: { onComplete: () => void; onSwitchToSignup: () => void }) => {
  const [phrase, setPhrase] = useState<string[]>(new Array(12).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    const newPhrase = [...phrase];
    // Handle paste of whole phrase
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
    // In a real app, we would validate the mnemonic here
    if (isComplete) {
      onComplete();
    } else {
      setError('Please enter all 12 words of your recovery phrase.');
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      // Simulate finding a phrase in a "backup file"
      setPhrase(['eternal', 'summit', 'ocean', 'wisdom', 'crystal', 'spirit', 'galaxy', 'harbor', 'legend', 'nature', 'phoenix', 'valley']);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-500/10 text-pink-500 mb-2 border border-pink-500/20">
            <Key size={32} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Welcome Back</h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Enter your 12-word recovery phrase to access your account.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/50 to-primary/50 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {phrase.map((word, i) => (
                <div key={i} className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-600">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-8 pr-3 text-sm text-slate-200 focus:bg-white/10 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 outline-none transition-all font-medium"
                    placeholder="word"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={simulateUpload}
                disabled={isUploading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all border border-white/5 group"
              >
                {isUploading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                )}
                <span className="text-sm font-semibold">{isUploading ? 'Scanning...' : 'Upload Backup File'}</span>
              </button>
              
              <div className="flex items-center justify-center sm:hidden text-slate-600 text-xs font-medium uppercase tracking-widest">
                — or —
              </div>

               <button
                onClick={() => {}} // Could trigger file picker
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all border border-white/5 group"
              >
                <FileText size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                <span className="text-sm font-semibold">Scan QR Code</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 items-center text-red-400 text-sm"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        <div className="space-y-4 pt-4">
          <button
            onClick={handleSignin}
            className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl ${
              isComplete 
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/20 hover:scale-[1.01] active:scale-[0.99]' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 shadow-none'
            }`}
          >
            Access Vault
            <ArrowRight size={20} />
          </button>
          
          <button 
            onClick={onSwitchToSignup}
            className="w-full text-slate-400 text-sm hover:text-white transition-colors py-2"
          >
            Don't have a phrase? Create New Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};
