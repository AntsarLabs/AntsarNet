import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';
import { useOnlineStatus } from '@/features/live/store';
import type { ChatWithLastMessage } from '../types';

interface ChatListItemProps {
  chat: ChatWithLastMessage;
  isActive: boolean;
  currentUserId: string;
  onClick: () => void;
}

export function ChatListItem({ chat, isActive, currentUserId, onClick }: ChatListItemProps) {
  // Determine the other participant (not the current user)
  const isSender = chat.senderId === currentUserId;
  const otherParticipant = isSender ? chat.receiver : chat.sender;
  const onlineStatus = useOnlineStatus((state) => state.onlineStatus[otherParticipant?.id || ''] ?? otherParticipant?.is_online);

  // Format last message time
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Get status icon based on chat status
  const getStatusIcon = () => {
    switch (chat.status) {
      case 'pending':
        return <Clock size={14} className="text-amber-500" />;
      case 'declined':
        return <AlertCircle size={14} className="text-red-500" />;
      default:
        return null;
    }
  };

  // Get display text for last message
  const getLastMessageText = () => {
    if (chat.status === 'pending') {
      return isSender ? 'Waiting for response...' : 'New chat request';
    }
    if (chat.status === 'declined') {
      return isSender ? 'Request declined' : 'You declined this chat';
    }
    if (!chat.lastMessage) {
      return 'No messages yet';
    }
    const prefix = chat.lastMessage.senderId === currentUserId ? 'You: ' : '';
    return `${prefix}${chat.lastMessage.text}`;
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left relative group ${
        isActive
          ? 'bg-white shadow-md border border-pink-500/20'
          : 'hover:bg-white/60 border border-transparent'
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-xl border border-slate-100 shadow-sm ${
            onlineStatus ? 'ring-2 ring-green-500 ring-offset-1' : ''
          }`}
        >
          {otherParticipant?.emoji || '😶'}
        </div>
        {chat.unreadCount && chat.unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="font-semibold text-slate-900 truncate text-sm">
            @{otherParticipant?.username || 'Unknown'}
          </h3>
          {chat.lastMessage?.createdAt && (
            <span className="text-[10px] text-slate-400 flex-shrink-0">
              {formatTime(chat.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {getStatusIcon()}
          <p
            className={`text-xs truncate ${
              chat.status === 'pending'
                ? 'text-amber-600 font-medium'
                : chat.status === 'declined'
                ? 'text-red-500'
                : chat.unreadCount && chat.unreadCount > 0
                ? 'text-slate-700 font-medium'
                : 'text-slate-500'
            }`}
          >
            {getLastMessageText()}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export default ChatListItem;
