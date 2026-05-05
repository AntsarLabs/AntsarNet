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
RETURNS TRIGGER 
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    RAISE NOTICE 'inbox_id received: %', NEW.inbox_id;

    SELECT id
    INTO v_user_id
    FROM users
    WHERE inbox_id = NEW.inbox_id;

    RAISE NOTICE 'resolved user_id: %', v_user_id;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Invalid inbox_id: user not found';
    END IF;

    NEW.user_id := v_user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;