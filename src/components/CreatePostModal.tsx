import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Lock, ShieldAlert, Tag } from 'lucide-react';
const AVAILABLE_TAGS = [
'Crush',
'Vent',
'Funny',
'Advice',
'Relationship',
'School',
'Work',
'Family',
'Friendship',
'Mental Health',
'Awkward',
'Secret',
'Regret',
'Wholesome',
'Late Night Thoughts'];

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
  content: string,
  visibility: 'public' | 'anonymous_room',
  tags: string[])
  => void;
  currentUser: {
    emoji: string;
    friendId: string;
  };
}
export function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
  currentUser
}: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'anonymous_room'>(
    'public'
  );
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  const handleSubmit = () => {
    if (!content.trim() || selectedTags.length === 0) return;
    onSubmit(content, visibility, selectedTags);
    setContent('');
    setSelectedTags([]);
    onClose();
  };
  return typeof document !== 'undefined' ? createPortal(
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-500/30 backdrop-blur-sm z-[100]" />
        
          <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <motion.div
            initial={{
              opacity: 0,
              y: '100%'
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: '100%'
            }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300 
            }}
            className="w-full max-w-lg pointer-events-auto max-h-[90vh] flex flex-col">
            
              <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-100 flex-shrink-0">
                  <h2 className="text-base sm:text-lg font-bold text-slate-800">
                    New Confession
                  </h2>
                  <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  
                    <X size={20} />
                  </button>
                </div>

                <div className="p-3 sm:p-5 overflow-y-auto flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg sm:text-xl shadow-inner flex-shrink-0">
                      {currentUser.emoji}
                    </div>
                    <div>
                      <div className="font-mono font-semibold text-slate-800 text-xs sm:text-sm">
                        {currentUser.friendId}
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1">
                        <ShieldAlert size={10} /> Posting anonymously
                      </div>
                    </div>
                  </div>

                  <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, 500))}
                  placeholder="What's on your mind? Vent, confess, or share a secret..."
                  className="w-full h-28 sm:h-32 bg-transparent text-slate-800 text-sm sm:text-base placeholder:text-slate-400 focus:outline-none resize-none"
                  autoFocus />
                

                  <div className="flex items-center justify-between mt-1 mb-3">
                    <span className="text-xs font-medium text-slate-400">
                      {content.length}/500
                    </span>
                  </div>

                  {/* Tags Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                        <Tag size={14} />
                        <span>Tags</span>
                        <span className="text-slate-400 font-normal">
                          ({selectedTags.length}/3)
                        </span>
                      </div>
                      {selectedTags.length === 0 &&
                    <span className="text-[10px] sm:text-xs text-red-400 font-medium">
                          Pick at least 1
                        </span>
                    }
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {AVAILABLE_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      const isDisabled =
                      !isSelected && selectedTags.length >= 3;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          disabled={isDisabled}
                          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all border ${isSelected ? 'bg-[#D82B7D] text-white border-[#D82B7D] shadow-sm' : isDisabled ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-600 border-slate-200 hover:border-pink-300 hover:text-pink-600'}`}>
                          
                            {tag}
                          </button>);

                    })}
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 flex-shrink-0">
                  <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || selectedTags.length === 0}
                  className="px-6 py-2 bg-[#D82B7D] text-white rounded-xl font-semibold hover:bg-[#C0266F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm text-sm sm:text-base">
                  
                    Post
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>,
    document.body
  ) : null;
}