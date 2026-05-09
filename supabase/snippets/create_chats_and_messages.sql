-- Function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Chats Table
CREATE TABLE public.chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.public_users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.public_users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    sender_deleted_at TIMESTAMP WITH TIME ZONE NULL,
    receiver_deleted_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    -- Constraint to prevent duplicate chats between same two people in the same direction
    UNIQUE(sender_id, receiver_id)
);

-- Messages Table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.public_users(id) ON DELETE CASCADE,
    encrypted_text TEXT NOT NULL,
    nonce TEXT NOT NULL,
    sender_public_key TEXT NULL,
    seen_at TIMESTAMP WITH TIME ZONE NULL,
    sender_deleted_at TIMESTAMP WITH TIME ZONE NULL,
    receiver_deleted_at TIMESTAMP WITH TIME ZONE NULL,
    auto_delete_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Triggers for updated_at
CREATE TRIGGER set_chats_updated_at
    BEFORE UPDATE ON public.chats
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Chats Policies
CREATE POLICY "Users can view their own chats"
    ON public.chats FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create chats if not blocked"
    ON public.chats FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        NOT EXISTS (
            SELECT 1 FROM public.user_blocks
            WHERE user_id = receiver_id AND blocked_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own chats"
    ON public.chats FOR UPDATE
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id)
    WITH CHECK (
        -- Only receiver can set status to accepted
        (status != 'accepted' OR auth.uid() = receiver_id)
    );

-- Messages Policies
CREATE POLICY "Users can view messages in their chats"
    ON public.messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = messages.chat_id
            AND (chats.sender_id = auth.uid() OR chats.receiver_id = auth.uid())
        )
    );

CREATE POLICY "Users can insert messages if not blocked"
    ON public.messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.chats c
            WHERE c.id = chat_id
            AND (
                (c.sender_id = auth.uid() AND NOT EXISTS (SELECT 1 FROM public.user_blocks WHERE user_id = c.receiver_id AND blocked_id = auth.uid()))
                OR
                (c.receiver_id = auth.uid() AND NOT EXISTS (SELECT 1 FROM public.user_blocks WHERE user_id = c.sender_id AND blocked_id = auth.uid()))
            )
        )
    );

CREATE POLICY "Users can update their own messages visibility"
    ON public.messages FOR UPDATE
    USING (
        auth.uid() = sender_id OR 
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = messages.chat_id
            AND (chats.sender_id = auth.uid() OR chats.receiver_id = auth.uid())
        )
    );




CREATE UNIQUE INDEX chats_unique_pair_idx
ON chats (
  LEAST(sender_id, receiver_id),
  GREATEST(sender_id, receiver_id)
);