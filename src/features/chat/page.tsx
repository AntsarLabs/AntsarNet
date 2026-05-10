import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, UserPlus, Loader2, ChevronDown } from 'lucide-react';
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
import { ChatListItem, ChatWindow } from './components';
import type { PendingChatRequest, ChatWithLastMessage } from './types';

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
    optimisticMessages,
  } = useChatStore();

  // Data fetching
  const [allChats, setAllChats] = useState<ChatWithLastMessage[]>([]);
  const [hasMoreChats, setHasMoreChats] = useState(true);
  const [isLoadingMoreChats, setIsLoadingMoreChats] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const CHAT_LIMIT = 10;

  // Ref for chat list scroll container
  const chatListRef = useRef<HTMLDivElement>(null);

  const {
    data: chats = [],
    isLoading: isLoadingChats,
    error: chatsError,
  } = useChatsWithLastMessage({ limit: CHAT_LIMIT, offset: 0 });
  const { mutate: sendMessage, isPending: isSendingMessage } = useSendMessage();
  const { mutate: updateChatStatus } = useUpdateChatStatus();

  // Realtime subscriptions
  useChatRealtime();

  // Initial load - only runs once
  useEffect(() => {
    if (!isLoadingChats && isInitialLoading) {
      setAllChats(chats);
      setHasMoreChats(chats.length === CHAT_LIMIT);
      setIsInitialLoading(false);
    }
  }, [chats, isLoadingChats, isInitialLoading]);

  // Load more chats handler - preserves scroll position
  const handleLoadMoreChats = async () => {
    if (isLoadingMoreChats || !hasMoreChats) return;

    // Save current scroll position and height
    const container = chatListRef.current;
    const scrollTopBefore = container?.scrollTop || 0;
    const scrollHeightBefore = container?.scrollHeight || 0;

    setIsLoadingMoreChats(true);
    const newOffset = allChats.length;

    try {
      const newChats = await chatApi.getChatsWithLastMessage({ offset: newOffset, limit: CHAT_LIMIT });
      // Filter out any chats that already exist to prevent duplicates
      const existingIds = new Set(allChats.map(c => c.id));
      const uniqueNewChats = newChats.filter(c => !existingIds.has(c.id));
      
      if (uniqueNewChats.length > 0) {
        setAllChats(prev => [...prev, ...uniqueNewChats]);
      }
      setHasMoreChats(newChats.length === CHAT_LIMIT);

      // Restore scroll position after new content is added
      requestAnimationFrame(() => {
        if (container) {
          const scrollHeightAfter = container.scrollHeight;
          const heightDiff = scrollHeightAfter - scrollHeightBefore;
          container.scrollTop = scrollTopBefore + heightDiff;
        }
      });
    } catch (error) {
      console.error('Failed to load more chats:', error);
    } finally {
      setIsLoadingMoreChats(false);
    }
  };

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
    return allChats.find((c) => c.id === activeChatId) || null;
  }, [allChats, activeChatId]);

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
    return allChats
      .filter((c) => c.status === 'pending')
      .map((c) => {
        const isIncoming = c.receiverId === currentUser.id;
        return {
          ...c,
          isIncoming,
          requester: isIncoming ? (c.sender!) : (c.receiver!),
        };
      });
  }, [allChats, currentUser]);

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
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-full text-xs font-semibold">
              <UserPlus size={14} />
              {pendingRequests.length} request{pendingRequests.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div ref={chatListRef} className="flex-1 overflow-y-auto px-3 space-y-1 pb-20 pt-2 no-scrollbar">
        {isInitialLoading ? (
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
        ) : allChats.length === 0 ? (
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
          <>
            {allChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChatId}
                currentUserId={currentUser?.id || ''}
                onClick={() => handleChatSelect(chat.id)}
              />
            ))}
            {hasMoreChats && (
              <div className="flex justify-center py-3">
                <button
                  onClick={handleLoadMoreChats}
                  disabled={isLoadingMoreChats}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isLoadingMoreChats ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      Load more
                    </>
                  )}
                </button>
              </div>
            )}
          </>
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

    </MainLayout>
  );
}
