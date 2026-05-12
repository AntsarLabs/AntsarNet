-- ==========================================
-- TAGS, POSTS, POST_TAGS, POST_COMMENTS, REACTIONS
-- ==========================================
-- Tables for the confession/post system.
-- Covers: tags → posts → post_tags → post_comments → reactions

-- ==========================================
-- 1. TAGS
-- ==========================================
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Tags are publicly readable by authenticated users
CREATE POLICY "Authenticated users can view tags"
ON public.tags
FOR SELECT
TO authenticated
USING (true);

-- Only service role (backend) manages tags; no client-side insert/update/delete policies

-- Auto-update updated_at
CREATE TRIGGER trg_tags_updated_at
BEFORE UPDATE ON public.tags
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


-- ==========================================
-- 2. POSTS
-- ==========================================
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Author (nullable if truly anonymous in future, but FK enforced for now)
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

    -- Post classification
    post_type TEXT NOT NULL DEFAULT 'confession'
        CHECK (post_type IN ('confession', 'vent', 'question', 'advice')),

    -- Content
    content TEXT NOT NULL,

    -- Moderation status
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('published', 'pending', 'flagged', 'deleted')),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Engagement (auto-updated via triggers)
    reaction_count INTEGER NOT NULL DEFAULT 0,
    comment_count INTEGER NOT NULL DEFAULT 0
);

-- Indexes for common query patterns
CREATE INDEX idx_posts_user_id ON public.posts (user_id);
CREATE INDEX idx_posts_status_created ON public.posts (status, created_at DESC)
    WHERE status = 'published';  -- partial index: most reads target published posts

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 1. Anyone authenticated can view published posts
CREATE POLICY "Authenticated users can view published posts"
ON public.posts
FOR SELECT
TO authenticated
USING (status = 'published');

-- 2. Authors can view their own posts regardless of status
CREATE POLICY "Authors can view own posts"
ON public.posts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 4. Authors can update their own posts
CREATE POLICY "Authors can update own posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Authors can soft-delete (update status) their own posts
CREATE POLICY "Authors can delete own posts"
ON public.posts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER trg_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


-- ==========================================
-- ENGAGEMENT TRACKING TRIGGERS
-- ==========================================

-- Function to update post comment count
CREATE OR REPLACE FUNCTION public.handle_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.posts 
        SET comment_count = comment_count + 1 
        WHERE id = NEW.post_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.posts 
        SET comment_count = comment_count - 1 
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update post reaction count
CREATE OR REPLACE FUNCTION public.handle_post_reaction_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF NEW.post_id IS NOT NULL THEN
            UPDATE public.posts 
            SET reaction_count = reaction_count + 1 
            WHERE id = NEW.post_id;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF OLD.post_id IS NOT NULL THEN
            UPDATE public.posts 
            SET reaction_count = reaction_count - 1 
            WHERE id = OLD.post_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers to post_comments and reactions
CREATE TRIGGER trg_post_comment_count
AFTER INSERT OR DELETE ON public.post_comments
FOR EACH ROW EXECUTE FUNCTION public.handle_post_comment_count();

CREATE TRIGGER trg_post_reaction_count
AFTER INSERT OR DELETE ON public.reactions
FOR EACH ROW EXECUTE FUNCTION public.handle_post_reaction_count();


-- ==========================================
-- 3. POST_TAGS (junction table)
-- ==========================================
CREATE TABLE public.post_tags (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,

    PRIMARY KEY (post_id, tag_id)
);

-- Index for reverse lookups: "find all posts with tag X"
CREATE INDEX idx_post_tags_tag_id ON public.post_tags (tag_id);

-- Enable RLS
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

-- Readable by all authenticated users
CREATE POLICY "Authenticated users can view post tags"
ON public.post_tags
FOR SELECT
TO authenticated
USING (true);

-- Authors can tag their own posts (validated via posts ownership)
CREATE POLICY "Post authors can insert tags"
ON public.post_tags
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.posts
        WHERE posts.id = post_id
          AND posts.user_id = auth.uid()
    )
);

-- Authors can remove tags from their own posts
CREATE POLICY "Post authors can delete tags"
ON public.post_tags
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.posts
        WHERE posts.id = post_id
          AND posts.user_id = auth.uid()
    )
);


-- ==========================================
-- 4. POST_COMMENTS
-- ==========================================
CREATE TABLE public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Parent post
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,

    -- Comment author
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

    -- Self-referencing for threaded replies (NULL = top-level comment)
    parent_comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,

    -- Content
    content TEXT NOT NULL,

    -- Moderation status
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'deleted', 'flagged')),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_post_comments_post_id ON public.post_comments (post_id);
CREATE INDEX idx_post_comments_user_id ON public.post_comments (user_id);
CREATE INDEX idx_post_comments_parent ON public.post_comments (parent_comment_id)
    WHERE parent_comment_id IS NOT NULL;  -- partial: only threaded replies

-- Enable RLS
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- 1. Authenticated users can view active comments
CREATE POLICY "Authenticated users can view active comments"
ON public.post_comments
FOR SELECT
TO authenticated
USING (status = 'active');

-- 2. Authors can view their own comments regardless of status
CREATE POLICY "Authors can view own comments"
ON public.post_comments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
ON public.post_comments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 4. Authors can update their own comments
CREATE POLICY "Authors can update own comments"
ON public.post_comments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Authors can delete their own comments
CREATE POLICY "Authors can delete own comments"
ON public.post_comments
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER trg_post_comments_updated_at
BEFORE UPDATE ON public.post_comments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


-- ==========================================
-- 5. REACTIONS (shared across posts & comments)
-- ==========================================
-- A reaction targets EITHER a post OR a comment (never both).
-- Enforced via a CHECK constraint.
CREATE TABLE public.reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Who reacted
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

    -- Polymorphic target: exactly one must be set
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,

    -- Reaction emoji
    emoji TEXT NOT NULL,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure exactly one target is set
    CONSTRAINT reaction_target_check CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL)
        OR
        (post_id IS NULL AND comment_id IS NOT NULL)
    ),

    -- One reaction per user per target (prevents duplicate reactions)
    CONSTRAINT unique_user_post_reaction UNIQUE (user_id, post_id),
    CONSTRAINT unique_user_comment_reaction UNIQUE (user_id, comment_id)
);

-- Indexes for looking up reactions by target
CREATE INDEX idx_reactions_post_id ON public.reactions (post_id)
    WHERE post_id IS NOT NULL;
CREATE INDEX idx_reactions_comment_id ON public.reactions (comment_id)
    WHERE comment_id IS NOT NULL;
CREATE INDEX idx_reactions_user_id ON public.reactions (user_id);

-- Enable RLS
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- 1. Authenticated users can view all reactions
CREATE POLICY "Authenticated users can view reactions"
ON public.reactions
FOR SELECT
TO authenticated
USING (true);

-- 2. Authenticated users can create reactions
CREATE POLICY "Authenticated users can create reactions"
ON public.reactions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own reactions (e.g., change emoji)
CREATE POLICY "Users can update own reactions"
ON public.reactions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Users can delete their own reactions
CREATE POLICY "Users can delete own reactions"
ON public.reactions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER trg_reactions_updated_at
BEFORE UPDATE ON public.reactions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
