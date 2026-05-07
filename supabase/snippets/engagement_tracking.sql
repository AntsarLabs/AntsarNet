-- ==========================================
-- ENGAGEMENT TRACKING FOR POSTS
-- ==========================================
-- Adds reaction_count and comment_count to posts
-- and triggers to keep them updated.

-- 1. Add columns to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS reaction_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- 2. Create function to update post comment count
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

-- 3. Create function to update post reaction count
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

-- 4. Attach triggers
DROP TRIGGER IF EXISTS trg_post_comment_count ON public.post_comments;
CREATE TRIGGER trg_post_comment_count
AFTER INSERT OR DELETE ON public.post_comments
FOR EACH ROW EXECUTE FUNCTION public.handle_post_comment_count();

DROP TRIGGER IF EXISTS trg_post_reaction_count ON public.reactions;
CREATE TRIGGER trg_post_reaction_count
AFTER INSERT OR DELETE ON public.reactions
FOR EACH ROW EXECUTE FUNCTION public.handle_post_reaction_count();

-- 5. Initialize existing counts
UPDATE public.posts p
SET 
    comment_count = (SELECT count(*) FROM public.post_comments WHERE post_id = p.id),
    reaction_count = (SELECT count(*) FROM public.reactions WHERE post_id = p.id);
