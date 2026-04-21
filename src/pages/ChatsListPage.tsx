import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, MapPin, Search, Edit3 } from 'lucide-react';
import { ChatSession, Contact, Message, InboxMessage } from '../types/chat';
import { ChatPage } from './ChatPage';
import { InboxSection } from '../components/InboxSection';
interface ChatsListPageProps {
  sessions: ChatSession[];
  contacts: Contact[];
  messages: Record<string, Message[]>;
  inboxMessages?: InboxMessage[];
  inboxUrl?: string;
  onOpenChat: (contactId: string) => void;
  onSendMessage?: (contactId: string, text: string) => void;
  onMarkInboxRead?: (id: string) => void;
  onReplyInbox?: (id: string, text: string) => void;
}
export function ChatsListPage({
  sessions,
  contacts,
  messages,
  inboxMessages = [],
  inboxUrl = '',
  onOpenChat,
  onSendMessage,
  onMarkInboxRead,
  onReplyInbox
}: ChatsListPageProps) {
  const [desktopSelectedId, setDesktopSelectedId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<'chats' | 'inbox'>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;
    return 0;
  });
  const filteredSessions = sortedSessions.filter((session) => {
    const contact = contacts.find((c) => c.id === session.contactId);
    if (!contact) return false;
    return contact.friendId.toLowerCase().includes(searchQuery.toLowerCase());
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
      onOpenChat(contactId);
    }
  };
  const selectedContact = desktopSelectedId ?
  contacts.find((c) => c.id === desktopSelectedId) :
  null;
  const unreadInboxCount = inboxMessages.filter((m) => !m.isRead).length;
  const renderSessionsList = (compact?: boolean) =>
  <>
      {filteredSessions.length === 0 ?
    <div className={`text-center ${compact ? 'py-12' : 'py-20'} px-4`}>
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center shadow-inner">
            <MessageCircle size={36} className="text-slate-500" />
          </div>
          <h3
        className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-slate-200 mb-2`}>
        
            No conversations found
          </h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            {searchQuery ?
        "We couldn't find any chats matching your search." :
        'Discover someone nearby to start chatting!'}
          </p>
        </div> :

    <div className="space-y-1 sm:space-y-2">
          {filteredSessions.map((session, index) => {
        const contact = contacts.find((c) => c.id === session.contactId);
        if (!contact) return null;
        const isActive = session.status === 'active';
        const lastMessage = getLastMessage(session.contactId);
        const unreadCount = getUnreadCount(session);
        const isSelected = desktopSelectedId === contact.id;
        return (
          <motion.button
            key={session.id}
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: index * 0.03
            }}
            onClick={() => handleSelectChat(contact.id)}
            className={`w-full flex items-center gap-3 sm:gap-4 ${compact ? 'p-3' : 'p-4'} rounded-2xl transition-all text-left group relative ${isSelected ? 'bg-slate-800/80 shadow-sm' : 'hover:bg-slate-800/40 active:bg-slate-800/60'}`}>
            
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                className={`${compact ? 'w-12 h-12 text-xl' : 'w-14 h-14 text-2xl'} rounded-full bg-slate-800 flex items-center justify-center shadow-sm border border-white/5 group-hover:border-white/10 transition-colors`}>
                
                    {contact.emoji}
                  </div>
                  {contact.isOnline &&
              <span
                className={`absolute bottom-0 right-0 ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} rounded-full bg-green-500 border-2 border-slate-900`} />

              }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <h3
                    className={`font-semibold text-[15px] truncate ${unreadCount > 0 ? 'text-white' : 'text-slate-200'}`}>
                    
                        {contact.friendId}
                      </h3>
                      {isActive &&
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-pink-500/10 text-pink-400 uppercase tracking-wider border border-pink-500/20">
                          Active
                        </span>
                  }
                    </div>
                    <span
                  className={`text-xs font-medium flex-shrink-0 ${unreadCount > 0 ? 'text-pink-400' : 'text-slate-500'}`}>
                  
                      {session.lastMessageAt.split(',')[1]?.trim() ||
                  session.lastMessageAt.split(',')[0]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p
                  className={`text-sm truncate ${unreadCount > 0 ? 'text-slate-300 font-medium' : 'text-slate-400'}`}>
                  
                      {lastMessage}
                    </p>
                    {/* Unread Badge */}
                    {unreadCount > 0 &&
                <div className="flex-shrink-0">
                        <div className="min-w-[20px] h-[20px] px-1.5 rounded-full bg-pink-500 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                          {unreadCount}
                        </div>
                      </div>
                }
                  </div>
                </div>
              </motion.button>);

      })}
        </div>
    }
    </>;

  return (
    <div className="flex-1 w-full relative bg-slate-950 pb-20 md:pb-0">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 z-0" />
      <div className="absolute inset-0 bg-[url('https://cdn.magicpatterns.com/uploads/buFFB14RxN7rp2dVxCiLRi/64b6005b9b1c73650c503c0f921982ab.2-1-super.1.jpg')] bg-cover bg-center opacity-5 mix-blend-overlay z-0" />

      {/* === MOBILE LAYOUT === */}
      <div className="md:hidden relative z-10 w-full max-w-3xl mx-auto flex flex-col h-full">
        <div className="px-4 pt-6 pb-0 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-20 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Messages
            </h2>
            <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
              <Edit3 size={18} />
            </button>
          </div>

          <div className="flex gap-6 border-b border-white/10 mb-4">
            <button
              onClick={() => setActiveTab('chats')}
              className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'chats' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              
              Chats
              {activeTab === 'chats' &&
              <motion.div
                layoutId="mobileTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />

              }
            </button>
            <button
              onClick={() => setActiveTab('inbox')}
              className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-1.5 ${activeTab === 'inbox' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              
              Inbox
              {unreadInboxCount > 0 &&
              <span className="w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadInboxCount}
                </span>
              }
              {activeTab === 'inbox' &&
              <motion.div
                layoutId="mobileTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />

              }
            </button>
          </div>

          {activeTab === 'chats' &&
          <div className="relative mb-4">
              <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18} />
            
              <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all" />
            
            </div>
          }
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {activeTab === 'chats' ?
          renderSessionsList() :

          <InboxSection
            inboxMessages={inboxMessages}
            inboxUrl={inboxUrl}
            onMarkRead={onMarkInboxRead || (() => {})}
            onReply={onReplyInbox || (() => {})} />

          }
        </div>
      </div>

      {/* === DESKTOP LAYOUT === */}
      <div className="hidden md:flex relative z-10 w-full h-full max-w-7xl mx-auto bg-slate-950/50 backdrop-blur-sm border-x border-white/5">
        {/* Left Panel: Chat List */}
        <div className="w-[340px] lg:w-[400px] flex-shrink-0 border-r border-white/5 flex flex-col h-[calc(100vh-57px)] bg-slate-900/30">
          <div className="p-5 pb-0 flex-shrink-0 border-b border-white/5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Messages
              </h2>
              <button className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                <Edit3 size={18} />
              </button>
            </div>

            <div className="flex gap-6 border-b border-white/10 mb-4">
              <button
                onClick={() => setActiveTab('chats')}
                className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'chats' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                
                Chats
                {activeTab === 'chats' &&
                <motion.div
                  layoutId="desktopTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />

                }
              </button>
              <button
                onClick={() => setActiveTab('inbox')}
                className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-1.5 ${activeTab === 'inbox' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                
                Inbox
                {unreadInboxCount > 0 &&
                <span className="w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadInboxCount}
                  </span>
                }
                {activeTab === 'inbox' &&
                <motion.div
                  layoutId="desktopTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />

                }
              </button>
            </div>

            {activeTab === 'chats' &&
            <div className="relative mb-4">
                <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                size={16} />
              
                <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-pink-500/50 transition-all" />
              
              </div>
            }
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-3 scrollbar-hide">
            {activeTab === 'chats' ?
            renderSessionsList(true) :

            <InboxSection
              inboxMessages={inboxMessages}
              inboxUrl={inboxUrl}
              onMarkRead={onMarkInboxRead || (() => {})}
              onReply={onReplyInbox || (() => {})} />

            }
          </div>
        </div>

        {/* Right Panel: Chat Window */}
        <div className="flex-1 flex flex-col h-[calc(100vh-57px)] min-w-0 bg-slate-950">
          <AnimatePresence mode="wait">
            {selectedContact && onSendMessage ?
            <motion.div
              key={desktopSelectedId}
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}
              transition={{
                duration: 0.15
              }}
              className="flex-1 flex flex-col h-full">
              
                <ChatPage
                contact={selectedContact}
                messages={messages[desktopSelectedId!] || []}
                onBack={() => setDesktopSelectedId(null)}
                onSend={(text) => onSendMessage(desktopSelectedId!, text)}
                hideBackButton />
              
              </motion.div> :

            <motion.div
              key="empty"
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-5 bg-slate-900/20">
              
                <div className="w-24 h-24 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center shadow-inner">
                  <MessageCircle size={40} className="text-slate-500" />
                </div>
                <div className="max-w-sm">
                  <h3 className="text-xl font-semibold text-slate-200 mb-2">
                    Your Messages
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Select a conversation from the list to start chatting. All
                    messages are anonymous and end-to-end encrypted.
                  </p>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>);

}