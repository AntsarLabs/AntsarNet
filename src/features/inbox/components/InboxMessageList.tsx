import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { InboxMessageCard } from './InboxMessageCard';
import { EmptyInboxState } from './EmptyInboxState';
import { MOCK_INBOX_MESSAGES } from '../constants';

export function InboxMessageList() {
  const [inboxMessages, setInboxMessages] = useState(MOCK_INBOX_MESSAGES);

  const handleMarkRead = (id: string) => {
    setInboxMessages((prev) => prev.map((msg) => msg.id === id ? { ...msg, isRead: true } : msg));
  };

  if (inboxMessages.length === 0) {
    return <EmptyInboxState />;
  }

  return (
    <div className="space-y-4 pb-32">
      <AnimatePresence mode="popLayout">
        {inboxMessages.map((msg, index) => (
          <InboxMessageCard
            key={msg.id}
            msg={msg}
            index={index}
            onMarkRead={handleMarkRead}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
