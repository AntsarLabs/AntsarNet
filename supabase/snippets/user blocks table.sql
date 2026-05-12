CREATE TABLE public.user_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- The user who is performing the block
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- The user who is being blocked
    blocked_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Timestamp of the block action
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints to prevent duplicate blocks and self-blocking
    UNIQUE(user_id, blocked_id),
    CHECK (user_id <> blocked_id)
);


-- Enable RLS
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

-- 1. Users can view their own block relationships
-- Allows the UI to determine if 'blockStatus' is 'blocked_by_you' or 'blocked_you'
CREATE POLICY "Users can view their own block relationships" 
ON public.user_blocks 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Users can manage (block/unblock) their own outgoing blocks
-- Restricts a user to only creating or deleting blocks where they are the 'blocker_id'
CREATE POLICY "Users can manage their outgoing blocks" 
ON public.user_blocks 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
