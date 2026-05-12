export interface User {
  id: string;
  username: string;
  emoji: string;
  bio?: string;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}


export interface UserCardProps {
  user: User;
  index: number;
  highlightIndex: number | null;
  winnerId: string | null;
  isSpinning: boolean;
  spinComplete: boolean;
  onSelect?: (id: string) => void;
  itemVariants: any;
  cardRef?: (el: HTMLDivElement | null) => void;
}

export interface UsersListProps {
  onSelect?: (id: string) => void;
  isSpinning?: boolean;
  spinComplete?: boolean;
  highlightIndex?: number | null;
  winnerId?: string | null;
  searchQuery?: string;
}

export interface UsersToolbarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onConnect: (e?: React.FormEvent) => void;
  error: boolean;
  isSearching?: boolean;
  isSpinning: boolean;
  onRandomPick: () => void;
  activeCount: number;
  hasContacts: boolean;
}
