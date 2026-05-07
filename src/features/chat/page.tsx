import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/MainLayout';
import { useChatStore } from './store';
import { ChatPage } from './pages/ChatPage';

export function ChatsListPage() {
  const navigate = useNavigate();
  const { sessions, contacts, messages, sendMessage } = useChatStore();
  
  const [desktopSelectedId, setDesktopSelectedId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  
  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;
    return 0;
  });
  
  const filteredSessions = sortedSessions.filter((session) => {
    const contact = contacts.find((c) => c.id === session.contactId);
    if (!contact) return false;
    return contact.username.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const getLastMessage = (contactId: string): string => {
    const contactMessages = messages[contactId];
    if (!contactMessages || contactMessages.length === 0) {
      return 'No messages yet';
    }
    const lastMsg = contactMessages[contactMessages.length - 1];
    return lastMsg.text;
  };
  
  const getUnreadCount = (session: ChatSession): number => {
    return session.unrepliedCount || 0;
  };
  
  const handleSelectChat = (contactId: string) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setDesktopSelectedId(contactId);
    } else {
      navigate(`/chat/${contactId}`);
    }
  };
  
  const selectedContact = desktopSelectedId ?
    contacts.find((c) => c.id === desktopSelectedId) :
    null;

  const renderSessionsList = (compact?: boolean) =>
    <>
      {filteredSessions.length === 0 ?
        <div className={`text-center ${compact ? 'py-12' : 'py-20'} px-4`}>
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
            <MessageCircle size={36} className="text-slate-400" />
          </div>
          <h3
            className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-slate-700 mb-2`}>

            No conversations found
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            {searchQuery ?
              "We couldn't find any chats matching your search." :
              'Discover someone nearby to start chatting!'}
          </p>
        </div> :

        <div className="space-y-1 sm:space-y-2">
          {filteredSessions.map((session, index) => {
            const contact = contacts.find((c) => c.id === session.contactId);
            if (!contact) return null;

            const lastMessage = getLastMessage(session.contactId);
            const unreadCount = getUnreadCount(session);
            const isSelected = desktopSelectedId === contact.id;
            return (
              <motion.button
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleSelectChat(contact.id)}
                className={`w-full flex items-center gap-3 sm:gap-4 ${compact ? 'p-3' : 'p-5'} rounded-2xl transition-all text-left relative group ${
                  isSelected 
                    ? 'bg-white shadow-[0_8px_30px_rgba(216,43,125,0.1)] border border-pink-500/20 ring-1 ring-pink-500/10' 
                    : 'bg-white/85 backdrop-blur-md border border-white/60 hover:bg-white hover:shadow-md'
                }`}
              >
                 {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`${compact ? 'w-12 h-12 text-xl' : 'w-14 h-14 text-2xl'} rounded-full bg-slate-50 flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-slate-200 transition-colors`}>
                    {contact.emoji}
                  </div>
                  {contact.isOnline && (
                    <span className={`absolute bottom-0 right-0 ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} rounded-full bg-green-500 border-2 border-white`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <h3 className={`font-bold text-[15px] truncate ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>
                        @{contact.username}
                      </h3>

                    </div>

                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate ${unreadCount > 0 ? 'text-slate-700 font-bold' : 'text-slate-500 font-medium'}`}>
                      {lastMessage}
                    </p>
                    {unreadCount > 0 && (
                      <div className="flex-shrink-0">
                        <div className="min-w-[20px] h-[20px] px-1.5 rounded-full bg-pink-500 text-white text-[11px] font-black flex items-center justify-center shadow-[0_2px_10px_rgba(216,43,125,0.4)]">
                          {unreadCount}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      }
    </>;

  return (
    <MainLayout showFooter={false}>
      <div className="flex-1 w-full relative pb-20 md:pb-0 h-full bg-transparent">

        <div className="md:hidden relative z-10 w-full max-w-3xl mx-auto flex flex-col h-full">
          <div className="px-4 pt-8 pb-4 sticky top-0 z-20">


            <div className="relative mb-2">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-20">
            {renderSessionsList()}
          </div>
        </div>

        {/* === DESKTOP LAYOUT === */}
        <div className="hidden md:flex relative z-10 w-full h-full max-w-7xl mx-auto">
          {/* Left Panel: Navigation & List */}
          <div className="w-[340px] lg:w-[400px] flex-shrink-0 border-r border-slate-200/60 flex flex-col h-[calc(100vh-57px)] bg-white/40 backdrop-blur-sm">
            <div className="p-8 pb-4 flex-shrink-0">


              <div className="relative mb-4">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/90 border border-slate-200/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-pink-400 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-hide">
              {renderSessionsList(true)}
            </div>
          </div>

          {/* Right Panel: Content Area */}
          <div className="flex-1 flex flex-col h-[calc(100vh-57px)] min-w-0 bg-transparent">
            <AnimatePresence mode="wait">
              {selectedContact ? (
                <motion.div
                  key={desktopSelectedId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col h-full"
                >
                  <ChatPage
                    id={desktopSelectedId}
                    onBack={() => setDesktopSelectedId(null)}
                    hideBackButton
                    noLayout
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty-chats"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center space-y-5"
                >
                  <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                    <MessageCircle size={40} className="text-slate-400" />
                  </div>
                  <div className="max-w-sm">
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                      Your Messages
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Select a conversation from the list to start chatting. All
                      messages are anonymous and end-to-end encrypted.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
