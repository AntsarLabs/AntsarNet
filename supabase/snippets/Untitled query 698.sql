create table post_flags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references public_users(id) on delete cascade,
  reason text,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);