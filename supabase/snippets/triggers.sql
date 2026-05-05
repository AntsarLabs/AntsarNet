-- ==========================================
-- UNIFIED USER DATA SYNC TRIGGER
-- ==========================================
-- This script ensures that any CRUD operation on the 'users' table 
-- is immediately reflected in 'public_users' and 'inbox_key_lookup'.

-- 1. Ensure target tables exist
CREATE TABLE IF NOT EXISTS public_users (
    id UUID PRIMARY KEY,
    username TEXT NOT NULL,
    emoji TEXT NOT NULL,
    bio TEXT,
    pve_rxn_count INT DEFAULT 0,
    nve_rxn_count INT DEFAULT 0,
    confession_count INT DEFAULT 0,
    is_online BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inbox_key_lookup (
    inbox_id TEXT PRIMARY KEY,
    public_key TEXT NOT NULL
);

-- 2. Create the unified sync function
CREATE OR REPLACE FUNCTION handle_user_metadata_sync()
RETURNS TRIGGER AS $$
BEGIN
    -- ==========================================
    -- HANDLE INSERT
    -- ==========================================
    IF (TG_OP = 'INSERT') THEN
        -- Sync to public_users
        INSERT INTO public_users (
            id, username, emoji, bio, 
            pve_rxn_count, nve_rxn_count, confession_count, 
            is_online, status, created_at, updated_at
        )
        VALUES (
            NEW.id, NEW.username, NEW.emoji, NEW.bio, 
            NEW.pve_rxn_count, NEW.nve_rxn_count, NEW.confession_count, 
            NEW.is_online, NEW.status, NEW.created_at, NEW.updated_at
        );

        -- Sync to inbox_key_lookup (if inbox_id is present)
        IF NEW.inbox_id IS NOT NULL THEN
            INSERT INTO inbox_key_lookup (inbox_id, public_key)
            VALUES (NEW.inbox_id, NEW.public_key)
            ON CONFLICT (inbox_id) DO UPDATE 
            SET public_key = EXCLUDED.public_key;
        END IF;

    -- ==========================================
    -- HANDLE UPDATE
    -- ==========================================
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Sync to public_users
        UPDATE public_users
        SET username = NEW.username,
            emoji = NEW.emoji,
            bio = NEW.bio,
            pve_rxn_count = NEW.pve_rxn_count,
            nve_rxn_count = NEW.nve_rxn_count,
            confession_count = NEW.confession_count,
            is_online = NEW.is_online,
            status = NEW.status,
            updated_at = NEW.updated_at
        WHERE id = NEW.id;

        -- Sync to inbox_key_lookup
        -- We handle potential changes to inbox_id or public_key
        IF (OLD.inbox_id IS DISTINCT FROM NEW.inbox_id) OR (OLD.public_key IS DISTINCT FROM NEW.public_key) THEN
            -- Remove old entry if it exists and changed
            IF OLD.inbox_id IS NOT NULL AND OLD.inbox_id != NEW.inbox_id THEN
                DELETE FROM inbox_key_lookup WHERE inbox_id = OLD.inbox_id;
            END IF;

            -- Add/Update new entry
            IF NEW.inbox_id IS NOT NULL THEN
                INSERT INTO inbox_key_lookup (inbox_id, public_key)
                VALUES (NEW.inbox_id, NEW.public_key)
                ON CONFLICT (inbox_id) DO UPDATE 
                SET public_key = EXCLUDED.public_key;
            END IF;
        END IF;

    -- ==========================================
    -- HANDLE DELETE
    -- ==========================================
    ELSIF (TG_OP = 'DELETE') THEN
        DELETE FROM public_users WHERE id = OLD.id;
        
        IF OLD.inbox_id IS NOT NULL THEN
            DELETE FROM inbox_key_lookup WHERE inbox_id = OLD.inbox_id;
        END IF;
    END IF;

    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Attach the trigger to the users table
-- Drop existing triggers first to avoid duplication
DROP TRIGGER IF EXISTS trg_sync_public_users ON users;
DROP TRIGGER IF EXISTS trg_sync_inbox_key_lookup ON users;
DROP TRIGGER IF EXISTS trg_user_metadata_sync ON users;

CREATE TRIGGER trg_user_metadata_sync
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION handle_user_metadata_sync();