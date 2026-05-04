-- Generic updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--- auto fill user id column in inbox table
CREATE OR REPLACE FUNCTION fill_inbox_user_ids()
RETURNS TRIGGER AS $$
BEGIN
    -- fetch sender user id from users table using sender inbox id
    SELECT id
    INTO NEW.user_id
    FROM users
    WHERE inbox_id = NEW.inbox_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;