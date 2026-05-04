CREATE TABLE public.inbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- The recipient of the message (linked via friend_id on the frontend)
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Message details (encrypted)
    subject TEXT,
    message TEXT NOT NULL,
    nonce TEXT NOT NULL,
    
    -- Status and metadata
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.inbox ENABLE ROW LEVEL SECURITY;

-- 2. Owner Select: Only the recipient can view their messages
CREATE POLICY "Users can view their own inbox"
ON public.inbox
FOR SELECT
USING (auth.uid() = user_id);

-- 3. Owner Update: Only the recipient can mark messages as read
CREATE POLICY "Users can update their own messages"
ON public.inbox
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Owner Delete: Only the recipient can delete messages
CREATE POLICY "Users can delete their own messages"
ON public.inbox
FOR DELETE
USING (auth.uid() = user_id);

--- trigger fill_inbox_user_ids()
CREATE TRIGGER trg_fill_inbox_user_ids
BEFORE INSERT ON inbox
FOR EACH ROW
EXECUTE FUNCTION fill_inbox_user_ids();
