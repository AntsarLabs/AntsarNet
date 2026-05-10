CREATE POLICY "Users can access peer public keys if in chat"
ON public.users
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM chats
    WHERE
      (
        chats.sender_id = auth.uid()
        AND chats.receiver_id = users.id
      )
      OR
      (
        chats.receiver_id = auth.uid()
        AND chats.sender_id = users.id
      )
  )
);


-- Even simpler version using the chat relationship
-- Drop the existing policy
DROP POLICY IF EXISTS "Users can insert messages if not blocked" ON public.messages;
 
-- Create the new policy
CREATE POLICY "Users can insert messages if not blocked"
ON public.messages FOR INSERT
WITH CHECK (
    auth.uid() = "from" AND
    EXISTS (
        SELECT 1 FROM public.chats c
        WHERE c.id = chat_id
        AND (c.sender_id = auth.uid() OR c.receiver_id = auth.uid())
        AND NOT EXISTS (
            SELECT 1 FROM public.user_blocks ub
            WHERE (ub.user_id = c.sender_id AND ub.blocked_id = c.receiver_id)
            OR (ub.user_id = c.receiver_id AND ub.blocked_id = c.sender_id)
        )
    )
);