import { LucideIcon } from 'lucide-react';

export type AccountTab = 'profile' | 'confessions' | 'blocked';

export interface TabItem {
  id: AccountTab;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface AccountUser {
  emoji: string;
  friendId: string;
  bio?: string;
  location?: string;
}

export interface AccountPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export interface AccountSidebarProps {
  tabs: TabItem[];
  activeTab: AccountTab | null;
  onTabChange: (tab: AccountTab) => void;
  currentUser: AccountUser;
}
