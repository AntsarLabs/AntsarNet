-- ==========================================
-- REACTION COUNTS VIEW
-- ==========================================
-- Provides an aggregated breakdown of emojis per post.

CREATE OR REPLACE VIEW public.post_reaction_counts WITH (security_invoker = true) AS
SELECT 
    post_id,
    emoji,
    count(*) as count
FROM public.reactions
WHERE post_id IS NOT NULL
GROUP BY post_id, emoji;

-- Same for comments
CREATE OR REPLACE VIEW public.comment_reaction_counts WITH (security_invoker = true) AS
SELECT 
    comment_id,
    emoji,
    count(*) as count
FROM public.reactions
WHERE comment_id IS NOT NULL
GROUP BY comment_id, emoji;
