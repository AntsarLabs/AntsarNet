import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, UserPlus, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/MainLayout';
import { useAuthStore } from '@/features/auth/store';
import { useChatStore } from './store';
import {
  useChatsWithLastMessage,
  useMessages,
  useSendMessage,
  useUpdateChatStatus,
  useMarkAsRead,
  useChatRealtime,
} from './hooks';
import { chatApi } from './api';
import { ChatListItem, ChatRequestModal, ChatWindow } from './components';
import type { PendingChatRequest } from './types';

// --- Global Styles to hide scrollbars ---
const HideScrollbarGlobal = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}} />
);

// --- Main Page Component ---

export function ChatPage() {
  const navigate = useNavigate();
  const { id: chatIdFromUrl } = useParams<{ id: string }>();
  const { user: currentUser } = useAuthStore();

  // Store state
  const {
    activeChatId,
    setActiveChatId,
    showRequestsModal,
    setShowRequestsModal,
    optimisticMessages,
  } = useChatStore();

  // Data fetching
  const {
    data: chats = [],
    isLoading: isLoadingChats,
    error: chatsError,
  } = useChatsWithLastMessage();
  const { mutate: sendMessage, isPending: isSendingMessage } = useSendMessage();
  const { mutate: updateChatStatus, isPending: isUpdatingStatus } = useUpdateChatStatus();

  // Realtime subscriptions
  useChatRealtime();

  // Sync URL param with active chat
  useEffect(() => {
    if (chatIdFromUrl) {
      setActiveChatId(chatIdFromUrl);
    } else {
      setActiveChatId(null);
    }
  }, [chatIdFromUrl, setActiveChatId]);

  // Get active chat data
  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId) || null;
  }, [chats, activeChatId]);

  // Fetch messages for active chat
  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useMessages(activeChatId || '', { limit: 10 });

  // Mark unread messages as read
  const { mutate: markAsRead } = useMarkAsRead();

  useEffect(() => {
    if (!currentUser || !messages.length) return;

    // Mark messages from others that are unread
    messages.forEach((msg) => {
      if (msg.senderId !== currentUser.id && !msg.seenAt) {
        markAsRead(msg.id);
      }
    });
  }, [messages, currentUser, markAsRead]);

  // Debug: Log any message loading errors
  if (messagesError) {
    console.error('[Chat] Messages error:', messagesError);
  }

  // Pending requests calculation
  const pendingRequests = useMemo<PendingChatRequest[]>(() => {
    if (!currentUser) return [];
    return chats
      .filter((c) => c.status === 'pending')
      .map((c) => {
        const isIncoming = c.receiverId === currentUser.id;
        return {
          ...c,
          isIncoming,
          requester: isIncoming ? (c.sender!) : (c.receiver!),
        };
      });
  }, [chats, currentUser]);

  // Handlers
  const handleChatSelect = (chatId: string) => {
    navigate(`/chats/${chatId}`);
  };

  const handleSendMessage = (text: string) => {
    if (!activeChatId || !currentUser) return;

    // Send actual message
    sendMessage({ chatId: activeChatId, text });
  };

  const handleAcceptRequest = (chatId: string) => {
    updateChatStatus({ chatId, status: 'accepted' });
  };

  const handleDeclineRequest = (chatId: string) => {
    updateChatStatus({ chatId, status: 'declined' });
  };

  // Render chat sidebar
  const renderSidebar = () => (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-sm">
      {/* Header with requests button */}
      <div className="px-4 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Messages</h2>
          {pendingRequests.length > 0 && (
            <button
              onClick={() => setShowRequestsModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-full text-xs font-semibold transition-colors"
            >
              <UserPlus size={14} />
              {pendingRequests.length} request{pendingRequests.length !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-20 pt-2 no-scrollbar">
        {isLoadingChats ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-pink-500 mb-2" />
            <p className="text-sm text-slate-400">Loading chats...</p>
          </div>
        ) : chatsError ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-sm text-red-500 text-center">Failed to load chats</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-xs text-pink-600 font-semibold hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium text-center">No chats yet</p>
            <p className="text-xs text-slate-400 text-center mt-1">
              Go to Discover to find people and start chatting
            </p>
          </div>
        ) : (
          chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === activeChatId}
              currentUserId={currentUser?.id || ''}
              onClick={() => handleChatSelect(chat.id)}
            />
          ))
        )}
      </div>
    </div>
  );

  // Empty state when no chat selected
  const renderEmptyState = () => (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
        <MessageCircle size={40} className="text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Select a Conversation</h3>
      <p className="text-slate-500 max-w-xs">
        Choose a chat from the sidebar to start messaging anonymously.
      </p>
      {pendingRequests.length > 0 && (
        <button
          onClick={() => setShowRequestsModal(true)}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl text-sm font-semibold transition-colors"
        >
          <UserPlus size={18} />
          View {pendingRequests.length} Pending Request{pendingRequests.length !== 1 ? 's' : ''}
        </button>
      )}
    </div>
  );

  return (
    <MainLayout showFooter={false}>
      <HideScrollbarGlobal />
      <div className="flex-1 flex w-full h-full bg-transparent overflow-hidden no-scrollbar">
        {/* Mobile View */}
        <div className="md:hidden w-full h-[calc(100vh-57px)]">
          {activeChatId && activeChat ? (
            <div className="fixed inset-0 z-[60] bg-white">
              <ChatWindow
                chat={activeChat}
                messages={messages}
                optimisticMessages={optimisticMessages[activeChatId] || []}
                currentUserId={currentUser?.id || ''}
                isLoading={isLoadingMessages}
                onBack={() => navigate('/chats')}
                onSendMessage={handleSendMessage}
                onAccept={() => handleAcceptRequest(activeChatId)}
                onDecline={() => handleDeclineRequest(activeChatId)}
                isSending={isSendingMessage}
                onLoadMoreMessages={(offset, limit) => chatApi.getMessages(activeChatId, { offset, limit })}
              />
            </div>
          ) : (
            renderSidebar()
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex w-full h-[calc(100vh-57px)]">
          {/* Sidebar */}
          <div className="w-[350px] lg:w-[400px] border-r border-slate-200">
            {renderSidebar()}
          </div>

          {/* Main Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeChatId && activeChat ? (
                <motion.div
                  key={activeChatId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <ChatWindow
                    chat={activeChat}
                    messages={messages}
                    optimisticMessages={optimisticMessages[activeChatId] || []}
                    currentUserId={currentUser?.id || ''}
                    isLoading={isLoadingMessages}
                    onBack={() => navigate('/chats')}
                    onSendMessage={handleSendMessage}
                    onAccept={() => handleAcceptRequest(activeChatId)}
                    onDecline={() => handleDeclineRequest(activeChatId)}
                    isSending={isSendingMessage}
                    onLoadMoreMessages={(offset, limit) => chatApi.getMessages(activeChatId, { offset, limit })}
                  />
                </motion.div>
              ) : (
                renderEmptyState()
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Chat Request Modal */}
      <ChatRequestModal
        isOpen={showRequestsModal}
        onClose={() => setShowRequestsModal(false)}
        requests={pendingRequests}
        onAccept={handleAcceptRequest}
        onDecline={handleDeclineRequest}
        isPending={isUpdatingStatus}
      />
    </MainLayout>
  );
}
