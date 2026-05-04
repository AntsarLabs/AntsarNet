import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { InboxMessageListProps } from '../types';
import { InboxMessageCard } from './InboxMessageCard';
import { EmptyInboxState } from './EmptyInboxState';

export function InboxMessageList({
  inboxMessages,
  expandedIds,
  onToggleExpand
}: InboxMessageListProps) {
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
            isExpanded={expandedIds.has(msg.id)}
            onToggleExpand={onToggleExpand}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
