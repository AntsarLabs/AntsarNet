import React, { useState } from 'react';
import { MessageCircle, Compass } from 'lucide-react';
import { Contact } from '../types/chat';
import { ContactList } from './ContactList';
import { UsersList } from '@/features/user/components/UsersList';
interface SidebarProps {
  contacts: Contact[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
export function Sidebar({ contacts, selectedId, onSelect }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'discover'>('chat');
  const totalUnread = contacts.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const onlineCount = contacts.filter((c) => c.isOnline).length;
  return (
    <div className="flex flex-col h-full bg-card">
      {/* Tab Bar */}
      <div className="flex border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all relative ${activeTab === 'chat' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'}`}>

          <MessageCircle size={18} />
          <span>Chats</span>
          {totalUnread > 0 &&
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-pink-600 text-[10px] font-bold text-white flex items-center justify-center">
              {totalUnread}
            </span>
          }
          {activeTab === 'chat' &&
            <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-pink-600 rounded-full" />
          }
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all relative ${activeTab === 'discover' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'}`}>

          <Compass size={18} />
          <span>Discover</span>
          {onlineCount > 0 &&
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-green-600 text-[10px] font-bold text-white flex items-center justify-center">
              {onlineCount}
            </span>
          }
          {activeTab === 'discover' &&
            <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-pink-600 rounded-full" />
          }
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === 'chat' ?
          <ContactList
            contacts={contacts}
            selectedId={selectedId}
            onSelect={onSelect} /> :


          <UsersList contacts={contacts} onViewProfile={onSelect} />
        }
      </div>
    </div>);

}