CREATE TABLE public.users (
    -- Primary key linked to Supabase Auth users
    id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    -- Public profile information
    username TEXT UNIQUE NOT NULL,
    emoji TEXT NOT NULL,
    bio TEXT,

    -- Public encryption key for end-to-end encryption (Base64 encoded)
    public_key TEXT UNIQUE NOT NULL,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


--- status column
ALTER TABLE public.users
ADD COLUMN status TEXT NOT NULL DEFAULT 'active'
CHECK (status IN ('active', 'suspended', 'deleted'));

--- add stat columns
ALTER TABLE public.users
ADD COLUMN pve_rxn_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN nve_rxn_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN confession_count INTEGER NOT NULL DEFAULT 0;


-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 1. Public profiles are viewable
-- Only authenticated users can view active profiles
CREATE POLICY "Authenticated users can view active profiles"
ON public.users
FOR SELECT
TO authenticated
USING (status = 'active');

-- 2. Users can update their own profile
-- Although the Edge Function uses the service role to bypass RLS, this policy 
-- ensures that any direct client-side updates are restricted to the owner.
CREATE POLICY "Users can update own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id AND status = 'active')
WITH CHECK (auth.uid() = id);

--- update at trigres
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_fill_inbox_user_id
BEFORE INSERT ON inbox
FOR EACH ROW
EXECUTE FUNCTION fill_inbox_user_ids();