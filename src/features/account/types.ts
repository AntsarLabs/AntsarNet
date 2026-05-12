import { LucideIcon } from 'lucide-react';

export type AccountTab = 'profile' | 'confessions' | 'blocked';

export interface TabItem {
  id: AccountTab;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface AccountUser {
  id: string;
  username: string;
  emoji: string;
  public_key: string;
  bio?: string;
  created_at?: string;
  city_code?: string;
}

export interface AccountPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export interface AccountSidebarProps {
  tabs: TabItem[];
  activeTab: AccountTab | null;
  onTabChange: (tab: AccountTab) => void;
}
