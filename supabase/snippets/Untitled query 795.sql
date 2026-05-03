SELECT 
  ub.blocked_id,
  u.username,
  u.emoji
FROM 
  public.user_blocks ub
JOIN 
  public.users u ON ub.blocked_id = u.id
WHERE 
  ub.user_id = '95d2c5c0-eeda-467e-8405-c2cab75fccb9'; -- Replace with the actual user_id
