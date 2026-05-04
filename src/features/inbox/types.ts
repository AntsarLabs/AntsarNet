export interface InboxMessage {
  id: string;
  from: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  repliedAt?: string;
}

export interface ShareInboxCardProps {
  isShareOpen: boolean;
  setIsShareOpen: (isOpen: boolean) => void;
  copied: boolean;
  displayUrl: string;
  handleCopy: () => void;
  subject: string;
  setSubject: (subject: string) => void;
  instruction: string;
  setInstruction: (instruction: string) => void;
}

export interface InboxMessageCardProps {
  msg: InboxMessage;
  index: number;
  isExpanded: boolean;
  onToggleExpand: (id: string, isRead: boolean) => void;
}

export interface InboxMessageListProps {
  inboxMessages: InboxMessage[];
  expandedIds: Set<string>;
  onToggleExpand: (id: string, isRead: boolean) => void;
}
