import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MoreVertical, Ban, Flag, Info, Send, Check, X } from 'lucide-react';
import { useOnlineStatus } from '@/features/live/store';
import { MessageBubble } from './MessageBubble';
import type { Chat, Message } from '../types';

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  optimisticMessages?: Message[];
  currentUserId: string;
  isLoading: boolean;
  onBack?: () => void;
  onSendMessage: (text: string) => void;
  onAccept?: () => void;
  onDecline?: () => void;
  isSending: boolean;
}

export function ChatWindow({
  chat,
  messages,
  optimisticMessages = [],
  currentUserId,
  isLoading,
  onBack,
  onSendMessage,
  onAccept,
  onDecline,
  isSending,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine the other participant
  const isSender = chat.senderId === currentUserId;
  const otherParticipant = isSender ? chat.receiver : chat.sender;
  const onlineStatus = useOnlineStatus((state) => state.onlineStatus[otherParticipant?.id || ''] ?? otherParticipant?.is_online);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, optimisticMessages]);

  const handleSend = () => {
    if (!inputText.trim() || chat.status !== 'accepted') return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Combine real and optimistic messages, filter out optimistic ones that have real counterparts
  const allMessages = [...messages];
  const pendingOptimistic = optimisticMessages.filter(
    (opt) => !messages.some((real) => real.id === opt.id)
  );

  return (
    <div className="flex flex-col h-full w-full bg-white/60 backdrop-blur-md relative overflow-hidden">
      {/* Header */}
      <header className="h-[72px] flex items-center justify-between px-4 sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-full bg-white flex items-center justify-center text-xl border ${
                onlineStatus
                  ? 'ring-2 ring-green-500 ring-offset-2'
                  : 'border-slate-200'
              }`}
            >
              {otherParticipant?.emoji || '😶'}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900 leading-tight">
                @{otherParticipant?.username || 'Unknown'}
              </span>
              <span
                className={`text-xs ${
                  onlineStatus ? 'text-green-600' : 'text-slate-400'
                }`}
              >
                {chat.status === 'pending'
                  ? isSender
                    ? 'Request pending...'
                    : 'New request'
                  : chat.status === 'declined'
                  ? 'Request declined'
                  : onlineStatus
                  ? 'Online'
                  : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <MoreVertical size={20} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-40 py-1.5 overflow-hidden"
              >
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <Info size={16} className="text-slate-400" /> View Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <Ban size={16} className="text-slate-400" /> Block User
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  <Flag size={16} /> Report User
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-slate-400">Loading messages...</div>
          </div>
        ) : chat.status === 'pending' ? (
          /* Pending Request UI */
          <div className="flex flex-col items-center justify-center h-full px-6">
            <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center text-4xl mb-4">
              {otherParticipant?.emoji}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">
              {isSender ? 'Request Sent' : 'New Chat Request'}
            </h3>
            <p className="text-slate-500 text-center mb-6 max-w-xs">
              {isSender
                ? `Waiting for @${otherParticipant?.username} to accept your chat request.`
                : `@${otherParticipant?.username} wants to start a chat with you.`}
            </p>

            {isSender ? (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="font-medium">Waiting for response...</span>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={onDecline}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  <X size={18} />
                  Decline
                </button>
                <button
                  onClick={onAccept}
                  className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold transition-colors"
                >
                  <Check size={18} />
                  Accept
                </button>
              </div>
            )}
          </div>
        ) : chat.status === 'declined' ? (
          /* Declined Request UI */
          <div className="flex flex-col items-center justify-center h-full px-6">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <X size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {isSender ? 'Request Declined' : 'Request Declined'}
            </h3>
            <p className="text-slate-500 text-center max-w-xs">
              {isSender
                ? `@${otherParticipant?.username} declined your chat request.`
                : `You declined the chat request from @${otherParticipant?.username}.`}
            </p>
          </div>
        ) : allMessages.length === 0 && pendingOptimistic.length === 0 ? (
          /* Empty Chat */
          <div className="flex flex-col items-center justify-center h-full px-6">
            <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center text-4xl mb-4">
              👋
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Start Chatting</h3>
            <p className="text-slate-500 text-center max-w-xs">
              Send a message to start the conversation with @{otherParticipant?.username}
            </p>
          </div>
        ) : (
          /* Messages List */
          <>
            {allMessages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isMe={message.senderId === currentUserId}
              />
            ))}
            {pendingOptimistic.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isMe={true}
                isOptimistic={true}
              />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Only show for accepted chats */}
      {chat.status === 'accepted' && (
        <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200">
          <div className="max-w-4xl mx-auto flex items-end gap-3">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-3xl focus-within:bg-white focus-within:border-slate-300 transition-all">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full bg-transparent px-5 py-3.5 text-[15px] text-slate-800 focus:outline-none resize-none max-h-32 min-h-[52px]"
                rows={1}
                disabled={isSending}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isSending}
              className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#D82B7D] to-[#B5246A] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
