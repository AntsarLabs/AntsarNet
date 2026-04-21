import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  MoreVertical,
  Send,
  Ban,
  Flag,
  MapPin,
  Phone,
  Video,
  Info } from
'lucide-react';
import { Contact, Message } from '../types/chat';
import { MessageBubble } from '../components/MessageBubble';
interface ChatPageProps {
  contact: Contact;
  messages: Message[];
  onBack: () => void;
  onSend: (text: string) => void;
  hideBackButton?: boolean;
}
export function ChatPage({
  contact,
  messages,
  onBack,
  onSend,
  hideBackButton
}: ChatPageProps) {
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
  }, [messages, isTyping]);
  const handleSend = () => {
    if (!inputText.trim()) return;
    onSend(inputText.trim());
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
  const isBlockedByMe = contact.blockStatus === 'blocked_by_you';
  const isBlockedByThem = contact.blockStatus === 'blocked_you';
  const canChat = !isBlockedByMe && !isBlockedByThem;
  return (
    <div className="flex flex-col h-full w-full text-slate-50 relative bg-slate-950">
      {/* Background with subtle gradient/blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 z-0" />
      <div className="absolute inset-0 bg-[url('https://cdn.magicpatterns.com/uploads/buFFB14RxN7rp2dVxCiLRi/64b6005b9b1c73650c503c0f921982ab.2-1-super.1.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay z-0" />

      {/* Header */}
      <div className="h-[72px] flex items-center justify-between px-2 sm:px-4 sticky top-0 z-20 bg-slate-900/70 backdrop-blur-xl border-b border-white/5 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-1 sm:gap-3">
          {!hideBackButton &&
          <button
            onClick={onBack}
            className="p-2 text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/10 active:bg-white/20">
            
              <ChevronLeft size={24} />
            </button>
          }

          <div className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-2xl hover:bg-white/5 transition-colors">
            <div className="relative">
              <div
                className={`w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-xl shadow-sm transition-all ${contact.isOnline ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-slate-900' : 'ring-1 ring-white/10'}`}>
                
                {contact.emoji}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-semibold text-[15px] text-white leading-tight">
                {contact.friendId}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {contact.isOnline ?
                <span className="text-xs text-green-400 font-medium">
                    Online
                  </span> :

                <span className="text-xs text-slate-400 font-medium">
                    Offline
                  </span>
                }
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="text-xs text-slate-400 flex items-center gap-0.5">
                  <MapPin size={10} />
                  {contact.distance}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-2.5 text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/10 hidden sm:block">
            <Phone size={18} />
          </button>
          <button className="p-2.5 text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/10 hidden sm:block">
            <Video size={18} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/10">
              
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
                  className="absolute right-0 top-full mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-40 py-1.5 overflow-hidden">
                  
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 transition-colors">
                      <Info size={16} className="text-slate-400" />
                      View Profile
                    </button>
                    <div className="h-px w-full bg-white/5 my-1" />
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 transition-colors">
                      <Ban size={16} className="text-slate-400" />
                      {isBlockedByMe ? 'Unblock User' : 'Block User'}
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
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
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/5 p-3 flex items-center justify-between px-4 flex-shrink-0 z-10">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Ban size={16} className="text-slate-400" />
            <span>You blocked this user</span>
          </div>
          <button className="text-sm font-semibold text-pink-500 hover:text-pink-400 transition-colors px-3 py-1.5 rounded-full hover:bg-pink-500/10">
            Unblock
          </button>
        </div>
      }
      {isBlockedByThem &&
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/5 p-3 flex items-center justify-center px-4 flex-shrink-0 text-sm text-slate-400 z-10">
          <Ban size={16} className="mr-2" />
          <span>This user has blocked you</span>
        </div>
      }

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 relative z-10 scroll-smooth">
        {messages.length === 0 ?
        <div className="h-full flex flex-col items-center justify-center text-center space-y-5 opacity-80">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-5xl shadow-lg">
              {contact.emoji}
            </div>
            <div className="max-w-xs">
              <p className="text-slate-200 font-semibold text-lg mb-2">
                Say hi to {contact.friendId}!
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Messages are anonymous, end-to-end encrypted, and disappear
                after 24 hours.
              </p>
            </div>
          </div> :

        <div className="py-2">
            <div className="text-center mb-8 mt-2">
              <span className="px-3 py-1.5 rounded-full bg-slate-800/60 backdrop-blur-md border border-white/5 text-[11px] font-medium text-slate-300 shadow-sm">
                Today
              </span>
            </div>
            {messages.map((msg, idx) => {
            const prevMsg = messages[idx - 1];
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
            
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3.5 shadow-sm flex items-center gap-1.5 w-16 h-10">
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
      <div className="p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xl border-t border-white/5 flex-shrink-0 relative z-10 pb-safe">
        <div className="max-w-4xl mx-auto relative flex items-end gap-2 sm:gap-3">
          <div className="flex-1 relative bg-slate-800/50 border border-white/10 rounded-3xl focus-within:bg-slate-800 focus-within:border-white/20 transition-all shadow-inner">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!canChat}
              placeholder={
              canChat ? 'Message anonymously...' : 'Cannot send messages'
              }
              className="w-full bg-transparent px-5 py-3.5 text-[15px] text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none max-h-32 min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed scrollbar-hide"
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
    </div>);

}