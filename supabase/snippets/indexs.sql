-- user_blocks table (account feature)
CREATE INDEX IF NOT EXISTS idx_user_blocks_user_id ON user_blocks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked_id ON user_blocks(blocked_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_user_blocked ON user_blocks(user_id, blocked_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_created_at ON user_blocks(created_at DESC);

-- chats table (chat feature)
CREATE INDEX IF NOT EXISTS idx_chats_sender_id ON chats(sender_id);
CREATE INDEX IF NOT EXISTS idx_chats_receiver_id ON chats(receiver_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at DESC);

-- messages table (chat feature)
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_from ON messages(from);
CREATE INDEX IF NOT EXISTS idx_messages_seen_at ON messages(seen_at);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_created ON messages(chat_id, created_at DESC);

-- users table (chat feature - for public key lookups)
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);

-- inbox_key_lookup table (inbox feature)
CREATE INDEX IF NOT EXISTS idx_inbox_key_lookup_inbox_id ON inbox_key_lookup(inbox_id);

-- inbox table (inbox feature)
CREATE INDEX IF NOT EXISTS idx_inbox_user_id ON inbox(user_id);
CREATE INDEX IF NOT EXISTS idx_inbox_created_at ON inbox(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inbox_user_created ON inbox(user_id, created_at DESC);

-- posts table (post feature)
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_post_type ON posts(post_type);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_reaction_count ON posts(reaction_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_comment_count ON posts(comment_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status_created ON posts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_created ON posts(user_id, created_at DESC);

-- public_users table (post & user features)
CREATE INDEX IF NOT EXISTS idx_public_users_id ON public_users(id);
CREATE INDEX IF NOT EXISTS idx_public_users_username ON public_users(username);
CREATE INDEX IF NOT EXISTS idx_public_users_is_online ON public_users(is_online);
CREATE INDEX IF NOT EXISTS idx_public_users_updated_at ON public_users(updated_at DESC);

-- post_comments table (post feature)
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at ASC);

-- reactions table (post feature)
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_comment_id ON reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_post ON reactions(user_id, post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_comment ON reactions(user_id, comment_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_post_emoji ON reactions(user_id, post_id, emoji);
CREATE INDEX IF NOT EXISTS idx_reactions_user_comment_emoji ON reactions(user_id, comment_id, emoji);