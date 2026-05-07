import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  MoreVertical,
  Send,
  Ban,
  Flag,
  Info
} from
  'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/MainLayout';
import { useChatStore } from '../store';
import { MessageBubble } from '../components/MessageBubble';

interface ChatPageProps {
  id?: string;
  hideBackButton?: boolean;
  onBack?: () => void;
  noLayout?: boolean;
}

export function ChatPage({
  id: propId,
  hideBackButton,
  onBack,
  noLayout
}: ChatPageProps) {
  const { id: routeId } = useParams<{ id: string }>();
  const id = propId || routeId;
  const navigate = useNavigate();
  const { contacts, messages, sendMessage } = useChatStore();
  
  const contact = contacts.find((c) => c.id === id);
  const chatMessages = id ? messages[id] || [] : [];
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);
  
  const handleSend = () => {
    if (!inputText.trim() || !id) return;
    sendMessage(id, inputText.trim());
    setInputText('');
    // Mock typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAF8F5]">
        <p className="text-slate-500">Contact not found</p>
      </div>
    );
  }

  const isBlockedByMe = contact.blockStatus === 'blocked_by_you';
  const isBlockedByThem = contact.blockStatus === 'blocked_you';
  const canChat = !isBlockedByMe && !isBlockedByThem;

  const content = (
    <div className="flex flex-col h-full w-full text-slate-800 relative bg-[#FAF8F5]">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-[#FAF8F5] z-0" />

      {/* Header */}
      <div className="h-[72px] flex items-center justify-between px-2 sm:px-4 sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex-shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-1 sm:gap-3">
          {!hideBackButton &&
            <button
              onClick={onBack || (() => navigate(-1))}
              className="p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100 active:bg-slate-200">

              <ChevronLeft size={24} />
            </button>
          }

          <div className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-2xl hover:bg-slate-50 transition-colors">
            <div className="relative">
              <div
                className={`w-11 h-11 rounded-full bg-white flex items-center justify-center text-xl shadow-sm transition-all border ${contact.isOnline ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-white border-slate-100' : 'border-slate-200'}`}>

                {contact.emoji}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-semibold text-[15px] text-slate-900 leading-tight">
                @{contact.username}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {contact.isOnline ?
                  <span className="text-xs text-green-600 font-medium">
                    Online
                  </span> :

                  <span className="text-xs text-slate-400 font-medium">
                    Offline
                  </span>
                }

              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 text-slate-400 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100">

              <MoreVertical size={20} />
            </button>

            <AnimatePresence>
              {showMenu &&
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowMenu(false)} />

                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.95,
                      y: 10
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      y: 10
                    }}
                    transition={{
                      duration: 0.15
                    }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl z-40 py-1.5 overflow-hidden">

                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <Info size={16} className="text-slate-400" />
                      View Profile
                    </button>
                    <div className="h-px w-full bg-slate-100 my-1" />
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <Ban size={16} className="text-slate-400" />
                      {isBlockedByMe ? 'Unblock User' : 'Block User'}
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <Flag size={16} />
                      Report User
                    </button>
                  </motion.div>
                </>
              }
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Block Banners */}
      {isBlockedByMe &&
        <div className="bg-amber-50 border-b border-amber-200/60 p-3 flex items-center justify-between px-4 flex-shrink-0 z-10">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <Ban size={16} className="text-amber-500" />
            <span>You blocked this user</span>
          </div>
          <button className="text-sm font-semibold text-pink-600 hover:text-pink-500 transition-colors px-3 py-1.5 rounded-full hover:bg-pink-50">
            Unblock
          </button>
        </div>
      }
      {isBlockedByThem &&
        <div className="bg-slate-50 border-b border-slate-200/60 p-3 flex items-center justify-center px-4 flex-shrink-0 text-sm text-slate-500 z-10">
          <Ban size={16} className="mr-2" />
          <span>This user has blocked you</span>
        </div>
      }

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 relative z-10 scroll-smooth">
        {chatMessages.length === 0 ?
          <div className="h-full flex flex-col items-center justify-center text-center space-y-5 opacity-80">
            <div className="w-24 h-24 rounded-full bg-white border border-slate-200 flex items-center justify-center text-5xl shadow-sm">
              {contact.emoji}
            </div>
            <div className="max-w-xs">
              <p className="text-slate-800 font-semibold text-lg mb-2">
                Say hi to @{contact.username}!
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Messages are anonymous, end-to-end encrypted, and disappear
                after 24 hours.
              </p>
            </div>
          </div> :

          <div className="py-2">
            <div className="text-center mb-8 mt-2">
              <span className="px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/60 text-[11px] font-medium text-slate-500 shadow-sm">
                Today
              </span>
            </div>
            {chatMessages.map((msg, idx) => {
              const prevMsg = chatMessages[idx - 1];
              const isFirstInGroup =
                !prevMsg || prevMsg.senderId !== msg.senderId;
              return (
                <div key={msg.id} className={isFirstInGroup ? 'mt-4' : 'mt-1'}>
                  <MessageBubble message={msg} isMe={msg.senderId === 'me'} />
                </div>);

            })}

            {isTyping &&
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.95
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }}
                className="flex w-full mb-4 justify-start mt-4">

                <div className="bg-white border border-slate-200/60 rounded-2xl rounded-bl-sm px-4 py-3.5 shadow-sm flex items-center gap-1.5 w-16 h-10">
                  <span
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{
                      animationDelay: '0ms'
                    }} />

                  <span
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{
                      animationDelay: '150ms'
                    }} />

                  <span
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{
                      animationDelay: '300ms'
                    }} />

                </div>
              </motion.div>
            }
          </div>
        }
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 flex-shrink-0 relative z-10 pb-safe shadow-[0_-1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-4xl mx-auto relative flex items-end gap-2 sm:gap-3">
          <div className="flex-1 relative bg-slate-50 border border-slate-200/60 rounded-3xl focus-within:bg-white focus-within:border-slate-300 transition-all shadow-sm">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!canChat}
              placeholder={
                canChat ? 'Message anonymously...' : 'Cannot send messages'
              }
              className="w-full bg-transparent px-5 py-3.5 text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none max-h-32 min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed scrollbar-hide"
              rows={1} />

          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || !canChat}
            className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#D82B7D] to-[#B5246A] text-white flex items-center justify-center hover:shadow-[0_0_20px_rgba(216,43,125,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all flex-shrink-0 shadow-md">

            <Send size={20} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );

  // If this component is being used as a full page (not within the hub)
  // we wrap it in MainLayout.
  if (noLayout) return content;

  return (
    <MainLayout showHeader={false} showBottomNav={false} showFooter={false}>
      {content}
    </MainLayout>
  );
}