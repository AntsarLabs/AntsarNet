import React from 'react';

export interface InboxMessage {
  id: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  repliedAt?: string;
}

export interface InboxMessageCardProps {
  msg: InboxMessage;
  index: number;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface SendInboxDesktopViewProps {
  inboxId?: string;
  message: string;
  setMessage: (m: string) => void;
  title: string;
  isSending: boolean;
  isSent: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  onNavigateHome: () => void;
}

export interface SendInboxMobileViewProps {
  inboxId?: string;
  message: string;
  setMessage: (m: string) => void;
  title: string;
  isSending: boolean;
  isSent: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  onNavigateHome: () => void;
}
