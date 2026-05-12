import type { LucideIcon } from 'lucide-react';
import { MessageSquare, Flame, HelpCircle, Lightbulb } from 'lucide-react';

export type PostType = 'confession' | 'vent' | 'question' | 'advice';

export type ReactionType = string;

export const REACTION_EMOJIS: Record<string, string> = {
  like: '👍',
  love: '❤️',
  laugh: '😂',
  sad: '😢',
  angry: '😡',
  fire: '🔥',
};

export const POST_TYPE_META: Record<PostType, { label: string; icon: LucideIcon }> = {
  confession: { label: 'Confession', icon: MessageSquare },
  vent: { label: 'Vent', icon: Flame },
  question: { label: 'Question', icon: HelpCircle },
  advice: { label: 'Advice', icon: Lightbulb },
};

// ── DB-shaped interfaces ──────────────────────────────

export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface Post {
  id: string;
  user_id: string;
  post_type: PostType;
  content: string;
  status: 'published' | 'pending' | 'flagged' | 'deleted';
  created_at: string;
  updated_at: string;
  // Joined / computed
  tags: Tag[];
  user?: { emoji: string; username: string };
  reaction_count: number;
  reaction_counts: Record<string, number>;
  comment_count: number;
  user_reaction: ReactionType | null;
  top_reactions: string[];
  is_reported?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id: string | null;
  content: string;
  status: 'active' | 'deleted' | 'flagged';
  created_at: string;
  updated_at: string;
  // Joined
  user?: { emoji: string; username: string };
  reaction_count: number;
}

export interface Reaction {
  id: string;
  user_id: string;
  post_id: string | null;
  comment_id: string | null;
  emoji: string;
  created_at: string;
}

// ── Component prop interfaces ─────────────────────────

export interface PostCardProps {
  post: Post;
  comments?: Comment[];
  userReaction?: ReactionType | null;
  onReact: (postId: string, type: ReactionType, isComment?: boolean) => void;
  onAddComment?: (postId: string, content: string, parentId?: string) => void;
}

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    content: string,
    postType: PostType,
    tagIds: string[]
  ) => void;
}

export interface ReactionBarProps {
  onReact: (type: ReactionType) => void;
  onClose: () => void;
  position?: 'top' | 'bottom';
}
