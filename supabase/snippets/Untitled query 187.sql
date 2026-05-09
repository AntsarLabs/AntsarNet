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