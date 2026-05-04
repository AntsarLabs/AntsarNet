import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, ChevronUp, ChevronDown, Copy } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import { inboxApi } from '../api';

export function ShareInboxCard() {
  const { user, updateUser } = useAuthStore();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [title, setTitle] = useState('');
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const MAX_TITLE_LENGTH = 70;

  const generateInboxUrl = (title?: string) => {
    const baseInboxUrl = `${import.meta.env.VITE_FRONTEND_URL}/inbox/${user?.inbox_id}`;
    const queryParams = new URLSearchParams();
    if (title) {
      // Obfuscate the title so it's not human-readable but reversible
      const encodedTitle = btoa(encodeURIComponent(title));
      queryParams.append('t', encodedTitle);
    }
    const queryString = queryParams.toString();
    return queryString ? `${baseInboxUrl}?${queryString}` : baseInboxUrl;
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(generateInboxUrl(title));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateNewId = async () => {
    if (!user) return;
    setIsGeneratingId(true);
    try {
      const newId = await inboxApi.generateNewInboxId(user.id);
      updateUser({ inbox_id: newId });
    } catch (error) {
      console.error('Failed to generate new inbox id:', error);
    } finally {
      setIsGeneratingId(false);
    }
  };

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
                  <label htmlFor="inbox-title" className="text-xs text-slate-600 font-semibold">Inbox Title</label>
                  <input
                    id='inbox-title'
                    type="text"
                    maxLength={MAX_TITLE_LENGTH}
                    placeholder="e.g. Mahi & Leyu's Stories Receiving Inbox"
                    value={title}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_TITLE_LENGTH) {
                        setTitle(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-slate-400"
                  />
                  {/** show total len/max length **/}
                  <p className={`text-xs font-semibold ${title.length >= MAX_TITLE_LENGTH ? 'text-pink-500' : 'text-slate-400'}`}>Total: {title.length}/{MAX_TITLE_LENGTH} characters max</p>

                </div>
                {/** inbox id box and update button **/}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <label htmlFor="inbox-id" className="text-xs text-slate-600 font-semibold">Inbox Anonymous ID</label>

                    <div className='flex gap-2'>
                      <input
                        id='inbox-id'
                        type="text"
                        value={user?.inbox_id || ''}
                        readOnly
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-slate-600 focus:outline-none"
                      />
                      <button
                        onClick={handleGenerateNewId}
                        disabled={isGeneratingId}
                        className="w-36 h-12 flex items-center justify-center bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all active:scale-95 border border-slate-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingId ? 'Generating...' : 'Get New ID'}
                      </button>
                    </div>
                  </div>

                </div>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <label htmlFor="inbox-url" className="text-xs text-slate-600 font-semibold py-2">Inbox URL(share this for other users to recive messages under the current title you set)</label>
                    <div className='flex gap-2'>
                      <input
                        id='inbox-url'
                        type="text"
                        value={generateInboxUrl(title)}
                        readOnly
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-slate-600 focus:outline-none"
                      />
                      <button
                        onClick={handleCopy}
                        className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all active:scale-95 border border-slate-200 shadow-sm"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
