import { motion, AnimatePresence } from 'framer-motion';
import { Share2, ChevronUp, ChevronDown, Copy } from 'lucide-react';
import { ShareInboxCardProps } from '../types';

export function ShareInboxCard({
  isShareOpen,
  setIsShareOpen,
  copied,
  displayUrl,
  handleCopy,
  subject,
  setSubject,
  instruction,
  setInstruction
}: ShareInboxCardProps) {
  return (
    <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm transition-all duration-300">
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setIsShareOpen(!isShareOpen)}
          className="flex items-center justify-between w-full group outline-none"
        >
          <div className="flex items-center gap-2">
            <Share2 size={18} className={`transition-colors ${isShareOpen ? 'text-pink-500' : 'text-slate-400 group-hover:text-pink-500'}`} />
            <h3 className={`text-sm font-bold tracking-tight transition-colors ${isShareOpen ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'}`}>Share Your Inbox Link</h3>
          </div>
          <div className="flex items-center gap-3">
            {copied && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider"
              >
                Copied
              </motion.span>
            )}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isShareOpen ? 'bg-pink-50 text-pink-500' : 'bg-slate-50 text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-500'}`}>
              {isShareOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
        </button>

        <AnimatePresence>
          {isShareOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex flex-col gap-3 mb-1">
                  <input
                    type="text"
                    placeholder="Custom Subject (e.g. Birthday Confessions)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-slate-400"
                  />
                  <textarea
                    placeholder="Inbox Description / Bio (e.g. Send me your anonymous birthday wishes!)"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-slate-400 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={displayUrl}
                      readOnly
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-slate-600 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleCopy}
                    className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all active:scale-95 border border-slate-200 shadow-sm"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
