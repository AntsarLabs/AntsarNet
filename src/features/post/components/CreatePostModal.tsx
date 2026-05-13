import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Tag } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import { useTags } from '../hooks';
import { CreatePostModalProps, PostType, POST_TYPE_META } from '../types';

const POST_TYPES: PostType[] = ['confession', 'vent', 'question', 'advice'];

export function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
}: CreatePostModalProps) {
  const user = useAuthStore((s) => s.user);

  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('confession');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const { data: tags = [] } = useTags();

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else if (selectedTagIds.length < 7) {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const CONTENT_MAX_LENGTH = 3000;
  const handleSubmit = () => {
    if (!content.trim() || selectedTagIds.length === 0) return;
    if(content.length > CONTENT_MAX_LENGTH) return;
    onSubmit(content, postType, selectedTagIds);
    setContent('');
    setSelectedTagIds([]);
    setPostType('confession');
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
                    New Post
                  </h2>
                  <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-3 sm:p-5 overflow-y-auto flex-1 no-scrollbar">
                  {/* User info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg sm:text-xl shadow-inner flex-shrink-0">
                      {user?.emoji || '😶'}
                    </div>
                    <div>
                      <div className="font-mono font-semibold text-slate-800 text-xs sm:text-sm">
                        {user?.username || 'Anonymous'}
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1">
                        <ShieldAlert size={10} /> Posting anonymously
                      </div>
                    </div>
                  </div>

                  {/* Post type selector */}
                  <div className="mb-4">
                    <div className="text-xs sm:text-sm font-medium text-slate-700 mb-2">
                      Post type
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {POST_TYPES.map((type) => {
                        const meta = POST_TYPE_META[type];
                        const Icon = meta.icon;
                        const isSelected = postType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setPostType(type)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold transition-all border ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <Icon size={14} />
                            {meta.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Content textarea */}
                  <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, CONTENT_MAX_LENGTH))}
                  placeholder={
                    postType === 'confession' ? "What's your confession?" :
                    postType === 'vent' ? "Let it all out..." :
                    postType === 'question' ? "What do you want to ask?" :
                    "Share your advice..."
                  }
                  className="w-full h-28 sm:h-32 bg-transparent text-slate-800 text-sm sm:text-base placeholder:text-slate-400 focus:outline-none resize-none"
                  autoFocus />
                

                  <div className="flex items-center justify-between mt-1 mb-3">
                    <span className="text-xs font-medium text-slate-400">
                      {content.length}/{CONTENT_MAX_LENGTH}
                    </span>
                  </div>

                  {/* Tags Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                        <Tag size={14} />
                        <span>Tags</span>
                        <span className="text-slate-400 font-normal">
                          ({selectedTagIds.length}/7)
                        </span>
                      </div>
                      {selectedTagIds.length === 0 &&
                    <span className="text-[10px] sm:text-xs text-red-400 font-medium">
                          Pick at least 1
                        </span>
                    }
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {tags.map((tag) => {
                      const isSelected = selectedTagIds.includes(tag.id);
                      const isDisabled =
                      !isSelected && selectedTagIds.length >= 7;
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.id)}
                          disabled={isDisabled}
                          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all border ${isSelected ? 'bg-[#D82B7D] text-white border-[#D82B7D] shadow-sm' : isDisabled ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-600 border-slate-200 hover:border-pink-300 hover:text-pink-600'}`}>
                            {tag.name}
                          </button>);

                    })}
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 flex-shrink-0">
                  <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || selectedTagIds.length === 0}
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