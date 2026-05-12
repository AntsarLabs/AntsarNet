-- RLS Policy for allowing users to delete chats they participate in
-- This allows both sender and receiver to delete their own chats

CREATE POLICY "Users can delete their own chats"
    ON public.chats FOR DELETE
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
