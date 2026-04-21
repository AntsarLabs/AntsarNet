import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Contact } from '../types/chat';
interface ContactListProps {
  contacts: Contact[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
export function ContactList({
  contacts,
  selectedId,
  onSelect
}: ContactListProps) {
  const [search, setSearch] = useState('');
  const filtered = contacts.filter((c) =>
  c.friendId.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm z-10">
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-pink-500 transition-colors"
            size={16} />
          
          <input
            type="text"
            placeholder="Search by Friend ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/50 border border-border/50 rounded-lg pl-9 pr-4 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-pink-500 focus:bg-muted transition-all placeholder:text-muted-foreground/70" />
          
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {filtered.length === 0 ?
        <div className="p-4 text-center text-sm text-muted-foreground">
            No contacts found.
          </div> :

        filtered.map((contact) =>
        <button
          key={contact.id}
          onClick={() => onSelect(contact.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left relative ${selectedId === contact.id ? 'bg-muted/80 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-pink-600' : ''}`}>
          
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-2xl shadow-sm border border-border/50">
                  {contact.emoji}
                </div>
                {contact.isOnline &&
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card"></span>
            }
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3
                className={`font-medium text-[15px] truncate font-mono tracking-wide ${selectedId === contact.id ? 'text-foreground' : 'text-foreground/90'}`}>
                
                    {contact.friendId}
                  </h3>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap ml-2 font-medium">
                    {contact.lastMessageTime}
                  </span>
                </div>
                <p
              className={`text-[13px] truncate ${contact.unreadCount ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              
                  {contact.lastMessage || 'No messages yet'}
                </p>
              </div>

              {contact.unreadCount ?
          <div className="w-5 h-5 rounded-full bg-pink-600 flex items-center justify-center text-[11px] font-bold text-white shadow-sm flex-shrink-0">
                  {contact.unreadCount}
                </div> :
          null}
            </button>
        )
        }
      </div>
    </div>);

}