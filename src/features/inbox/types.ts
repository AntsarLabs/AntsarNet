export interface InboxMessage {
  id: string;
  from: string;
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
}
