create table public_users (
  id UUID primary key,
  username TEXT,
  emoji TEXT,
  bio TEXT,
  pve_rxn_count INT default 0,
  nve_rxn_count INT default 0,
  confession_count INT default 0,
  is_online BOOLEAN default false,
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

create table inbox_key_lookup (
  inbox_id TEXT primary key,
  public_key TEXT not null
);

-- =========================
-- PUBLIC USERS SYNC
-- =========================
create or replace function sync_public_users () RETURNS TRIGGER as $$
BEGIN

    -- INSERT
    IF TG_OP = 'INSERT' THEN

        INSERT INTO public_users (
            id,
            username,
            emoji,
            bio,
            pve_rxn_count,
            nve_rxn_count,
            confession_count,
            is_online,
            status,
            created_at,
            updated_at
        )
        VALUES (
            NEW.id,
            NEW.username,
            NEW.emoji,
            NEW.bio,
            NEW.pve_rxn_count,
            NEW.nve_rxn_count,
            NEW.confession_count,
            NEW.is_online,
            NEW.status,
            NEW.created_at,
            NEW.updated_at
        );

        RETURN NEW;
    END IF;

    -- UPDATE
    IF TG_OP = 'UPDATE' THEN

        UPDATE public_users
        SET
            username = NEW.username,
            emoji = NEW.emoji,
            bio = NEW.bio,
            pve_rxn_count = NEW.pve_rxn_count,
            nve_rxn_count = NEW.nve_rxn_count,
            confession_count = NEW.confession_count,
            is_online = NEW.is_online,
            status = NEW.status,
            updated_at = NEW.updated_at
        WHERE id = NEW.id;

        RETURN NEW;
    END IF;

    -- DELETE
    IF TG_OP = 'DELETE' THEN

        DELETE FROM public_users
        WHERE id = OLD.id;

        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

create or replace trigger trg_sync_public_users
after INSERT
or
update
or DELETE on users for EACH row
execute FUNCTION sync_public_users ();

-- Inbox Key Lookup Sync
create or replace function sync_inbox_key_lookup () RETURNS TRIGGER as $$
BEGIN

    -- INSERT
    IF TG_OP = 'INSERT' THEN

        INSERT INTO inbox_key_lookup (
            inbox_id,
            public_key
        )
        VALUES (
            NEW.inbox_id,
            NEW.public_key
        );

        RETURN NEW;
    END IF;

    -- UPDATE
    IF TG_OP = 'UPDATE' THEN

        -- handle inbox_id change safely
        DELETE FROM inbox_key_lookup
        WHERE inbox_id = OLD.inbox_id;

        INSERT INTO inbox_key_lookup (
            inbox_id,
            public_key
        )
        VALUES (
            NEW.inbox_id,
            NEW.public_key
        );

        RETURN NEW;
    END IF;

    -- DELETE
    IF TG_OP = 'DELETE' THEN

        DELETE FROM inbox_key_lookup
        WHERE inbox_id = OLD.inbox_id;

        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

create trigger trg_sync_inbox_key_lookup
after INSERT
or
update
or DELETE on users for EACH row
execute FUNCTION sync_inbox_key_lookup ();