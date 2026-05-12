create extension if not exists "hypopg" with schema "extensions";

create extension if not exists "index_advisor" with schema "extensions";


  create table "public"."chats" (
    "id" uuid not null default gen_random_uuid(),
    "sender_id" uuid not null,
    "receiver_id" uuid not null,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."chats" enable row level security;


  create table "public"."inbox" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "title" text,
    "message" text not null,
    "nonce" text not null,
    "is_read" boolean not null default false,
    "created_at" timestamp with time zone default now(),
    "inbox_id" uuid,
    "public_key" text
      );


alter table "public"."inbox" enable row level security;


  create table "public"."inbox_key_lookup" (
    "inbox_id" text not null,
    "public_key" text not null
      );


alter table "public"."inbox_key_lookup" enable row level security;


  create table "public"."messages" (
    "id" uuid not null default gen_random_uuid(),
    "chat_id" uuid not null,
    "from" uuid not null,
    "encrypted_texts" json not null,
    "seen_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "to" uuid
      );


alter table "public"."messages" enable row level security;


  create table "public"."post_comments" (
    "id" uuid not null default gen_random_uuid(),
    "post_id" uuid not null,
    "user_id" uuid not null,
    "parent_comment_id" uuid,
    "content" text not null,
    "status" text not null default 'active'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."post_comments" enable row level security;


  create table "public"."post_reports" (
    "id" uuid not null default gen_random_uuid(),
    "post_id" uuid,
    "user_id" uuid,
    "reason" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."post_reports" enable row level security;


  create table "public"."post_tags" (
    "post_id" uuid not null,
    "tag_id" uuid not null
      );


alter table "public"."post_tags" enable row level security;


  create table "public"."posts" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "post_type" text not null default 'confession'::text,
    "content" text not null,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "reaction_count" integer default 0,
    "comment_count" integer default 0
      );


alter table "public"."posts" enable row level security;


  create table "public"."public_users" (
    "id" uuid not null,
    "username" text,
    "emoji" text,
    "bio" text,
    "pve_rxn_count" integer default 0,
    "nve_rxn_count" integer default 0,
    "confession_count" integer default 0,
    "is_online" boolean default false,
    "status" text,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
      );


alter table "public"."public_users" enable row level security;


  create table "public"."reactions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "post_id" uuid,
    "comment_id" uuid,
    "emoji" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."reactions" enable row level security;


  create table "public"."tags" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "count" integer not null default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."tags" enable row level security;


  create table "public"."user_blocks" (
    "user_id" uuid not null,
    "blocked_id" uuid not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."user_blocks" enable row level security;


  create table "public"."users" (
    "id" uuid not null,
    "username" text not null,
    "emoji" text not null,
    "bio" text,
    "public_key" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "status" text not null default 'active'::text,
    "pve_rxn_count" integer not null default 0,
    "nve_rxn_count" integer not null default 0,
    "confession_count" integer not null default 0,
    "is_online" boolean default false,
    "inbox_id" uuid default gen_random_uuid()
      );


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX chats_pkey ON public.chats USING btree (id);

CREATE UNIQUE INDEX chats_sender_id_receiver_id_key ON public.chats USING btree (sender_id, receiver_id);

CREATE UNIQUE INDEX chats_unique_pair_idx ON public.chats USING btree (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id));

CREATE INDEX idx_chats_created_at ON public.chats USING btree (created_at DESC);

CREATE INDEX idx_chats_receiver_id ON public.chats USING btree (receiver_id);

CREATE INDEX idx_chats_sender_id ON public.chats USING btree (sender_id);

CREATE INDEX idx_inbox_created_at ON public.inbox USING btree (created_at DESC);

CREATE INDEX idx_inbox_key_lookup_inbox_id ON public.inbox_key_lookup USING btree (inbox_id);

CREATE INDEX idx_inbox_user_created ON public.inbox USING btree (user_id, created_at DESC);

CREATE INDEX idx_inbox_user_id ON public.inbox USING btree (user_id);

CREATE INDEX idx_messages_chat_created ON public.messages USING btree (chat_id, created_at DESC);

CREATE INDEX idx_messages_chat_id ON public.messages USING btree (chat_id);

CREATE INDEX idx_messages_created_at ON public.messages USING btree (created_at DESC);

CREATE INDEX idx_messages_from ON public.messages USING btree ("from");

CREATE INDEX idx_messages_seen_at ON public.messages USING btree (seen_at);

CREATE INDEX idx_post_comments_created_at ON public.post_comments USING btree (created_at);

CREATE INDEX idx_post_comments_parent ON public.post_comments USING btree (parent_comment_id) WHERE (parent_comment_id IS NOT NULL);

CREATE INDEX idx_post_comments_post_id ON public.post_comments USING btree (post_id);

CREATE INDEX idx_post_comments_user_id ON public.post_comments USING btree (user_id);

CREATE INDEX idx_post_tags_tag_id ON public.post_tags USING btree (tag_id);

CREATE INDEX idx_posts_comment_count ON public.posts USING btree (comment_count DESC);

CREATE INDEX idx_posts_created_at ON public.posts USING btree (created_at DESC);

CREATE INDEX idx_posts_post_type ON public.posts USING btree (post_type);

CREATE INDEX idx_posts_reaction_count ON public.posts USING btree (reaction_count DESC);

CREATE INDEX idx_posts_status ON public.posts USING btree (status);

CREATE INDEX idx_posts_status_created ON public.posts USING btree (status, created_at DESC) WHERE (status = 'published'::text);

CREATE INDEX idx_posts_user_created ON public.posts USING btree (user_id, created_at DESC);

CREATE INDEX idx_posts_user_id ON public.posts USING btree (user_id);

CREATE INDEX idx_public_users_id ON public.public_users USING btree (id);

CREATE INDEX idx_public_users_is_online ON public.public_users USING btree (is_online);

CREATE INDEX idx_public_users_updated_at ON public.public_users USING btree (updated_at DESC);

CREATE INDEX idx_public_users_username ON public.public_users USING btree (username);

CREATE INDEX idx_reactions_comment_id ON public.reactions USING btree (comment_id) WHERE (comment_id IS NOT NULL);

CREATE INDEX idx_reactions_post_id ON public.reactions USING btree (post_id) WHERE (post_id IS NOT NULL);

CREATE INDEX idx_reactions_user_comment ON public.reactions USING btree (user_id, comment_id);

CREATE INDEX idx_reactions_user_comment_emoji ON public.reactions USING btree (user_id, comment_id, emoji);

CREATE INDEX idx_reactions_user_id ON public.reactions USING btree (user_id);

CREATE INDEX idx_reactions_user_post ON public.reactions USING btree (user_id, post_id);

CREATE INDEX idx_reactions_user_post_emoji ON public.reactions USING btree (user_id, post_id, emoji);

CREATE INDEX idx_user_blocks_blocked_id ON public.user_blocks USING btree (blocked_id);

CREATE INDEX idx_user_blocks_created_at ON public.user_blocks USING btree (created_at DESC);

CREATE INDEX idx_user_blocks_user_blocked ON public.user_blocks USING btree (user_id, blocked_id);

CREATE INDEX idx_user_blocks_user_id ON public.user_blocks USING btree (user_id);

CREATE INDEX idx_users_id ON public.users USING btree (id);

CREATE UNIQUE INDEX inbox_key_lookup_pkey ON public.inbox_key_lookup USING btree (inbox_id);

CREATE UNIQUE INDEX inbox_pkey ON public.inbox USING btree (id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

CREATE UNIQUE INDEX post_comments_pkey ON public.post_comments USING btree (id);

CREATE UNIQUE INDEX post_flags_pkey ON public.post_reports USING btree (id);

CREATE UNIQUE INDEX post_flags_post_id_user_id_key ON public.post_reports USING btree (post_id, user_id);

CREATE UNIQUE INDEX post_tags_pkey ON public.post_tags USING btree (post_id, tag_id);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX public_users_pkey ON public.public_users USING btree (id);

CREATE UNIQUE INDEX reactions_pkey ON public.reactions USING btree (id);

CREATE UNIQUE INDEX tags_name_key ON public.tags USING btree (name);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

CREATE UNIQUE INDEX unique_user_comment_reaction ON public.reactions USING btree (user_id, comment_id);

CREATE UNIQUE INDEX unique_user_post_reaction ON public.reactions USING btree (user_id, post_id);

CREATE UNIQUE INDEX user_blocks_pkey ON public.user_blocks USING btree (user_id);

CREATE UNIQUE INDEX user_blocks_user_id_blocked_id_key ON public.user_blocks USING btree (user_id, blocked_id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_public_key_key ON public.users USING btree (public_key);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

alter table "public"."chats" add constraint "chats_pkey" PRIMARY KEY using index "chats_pkey";

alter table "public"."inbox" add constraint "inbox_pkey" PRIMARY KEY using index "inbox_pkey";

alter table "public"."inbox_key_lookup" add constraint "inbox_key_lookup_pkey" PRIMARY KEY using index "inbox_key_lookup_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."post_comments" add constraint "post_comments_pkey" PRIMARY KEY using index "post_comments_pkey";

alter table "public"."post_reports" add constraint "post_flags_pkey" PRIMARY KEY using index "post_flags_pkey";

alter table "public"."post_tags" add constraint "post_tags_pkey" PRIMARY KEY using index "post_tags_pkey";

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."public_users" add constraint "public_users_pkey" PRIMARY KEY using index "public_users_pkey";

alter table "public"."reactions" add constraint "reactions_pkey" PRIMARY KEY using index "reactions_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."user_blocks" add constraint "user_blocks_pkey" PRIMARY KEY using index "user_blocks_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."chats" add constraint "chats_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES public.public_users(id) ON DELETE CASCADE not valid;

alter table "public"."chats" validate constraint "chats_receiver_id_fkey";

alter table "public"."chats" add constraint "chats_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES public.public_users(id) ON DELETE CASCADE not valid;

alter table "public"."chats" validate constraint "chats_sender_id_fkey";

alter table "public"."chats" add constraint "chats_sender_id_receiver_id_key" UNIQUE using index "chats_sender_id_receiver_id_key";

alter table "public"."chats" add constraint "chats_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text]))) not valid;

alter table "public"."chats" validate constraint "chats_status_check";

alter table "public"."inbox" add constraint "inbox_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."inbox" validate constraint "inbox_user_id_fkey";

alter table "public"."messages" add constraint "messages_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_chat_id_fkey";

alter table "public"."messages" add constraint "messages_sender_id_fkey" FOREIGN KEY ("from") REFERENCES public.public_users(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_sender_id_fkey";

alter table "public"."messages" add constraint "messages_to_fkey" FOREIGN KEY ("to") REFERENCES public.public_users(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_to_fkey";

alter table "public"."post_comments" add constraint "post_comments_parent_comment_id_fkey" FOREIGN KEY (parent_comment_id) REFERENCES public.post_comments(id) ON DELETE CASCADE not valid;

alter table "public"."post_comments" validate constraint "post_comments_parent_comment_id_fkey";

alter table "public"."post_comments" add constraint "post_comments_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."post_comments" validate constraint "post_comments_post_id_fkey";

alter table "public"."post_comments" add constraint "post_comments_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'deleted'::text, 'flagged'::text]))) not valid;

alter table "public"."post_comments" validate constraint "post_comments_status_check";

alter table "public"."post_comments" add constraint "post_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.public_users(id) ON DELETE CASCADE not valid;

alter table "public"."post_comments" validate constraint "post_comments_user_id_fkey";

alter table "public"."post_reports" add constraint "post_flags_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."post_reports" validate constraint "post_flags_post_id_fkey";

alter table "public"."post_reports" add constraint "post_flags_post_id_user_id_key" UNIQUE using index "post_flags_post_id_user_id_key";

alter table "public"."post_reports" add constraint "post_flags_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.public_users(id) ON DELETE CASCADE not valid;

alter table "public"."post_reports" validate constraint "post_flags_user_id_fkey";

alter table "public"."post_reports" add constraint "post_reports_reason_check" CHECK ((length(reason) < 500)) not valid;

alter table "public"."post_reports" validate constraint "post_reports_reason_check";

alter table "public"."post_tags" add constraint "post_tags_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."post_tags" validate constraint "post_tags_post_id_fkey";

alter table "public"."post_tags" add constraint "post_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE not valid;

alter table "public"."post_tags" validate constraint "post_tags_tag_id_fkey";

alter table "public"."posts" add constraint "posts_post_type_check" CHECK ((post_type = ANY (ARRAY['confession'::text, 'vent'::text, 'question'::text, 'advice'::text]))) not valid;

alter table "public"."posts" validate constraint "posts_post_type_check";

alter table "public"."posts" add constraint "posts_status_check" CHECK ((status = ANY (ARRAY['published'::text, 'pending'::text, 'flagged'::text, 'deleted'::text]))) not valid;

alter table "public"."posts" validate constraint "posts_status_check";

alter table "public"."posts" add constraint "posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.public_users(id) ON DELETE CASCADE not valid;

alter table "public"."posts" validate constraint "posts_user_id_fkey";

alter table "public"."reactions" add constraint "reaction_target_check" CHECK ((((post_id IS NOT NULL) AND (comment_id IS NULL)) OR ((post_id IS NULL) AND (comment_id IS NOT NULL)))) not valid;

alter table "public"."reactions" validate constraint "reaction_target_check";

alter table "public"."reactions" add constraint "reactions_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES public.post_comments(id) ON DELETE CASCADE not valid;

alter table "public"."reactions" validate constraint "reactions_comment_id_fkey";

alter table "public"."reactions" add constraint "reactions_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."reactions" validate constraint "reactions_post_id_fkey";

alter table "public"."reactions" add constraint "reactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.public_users(id) ON DELETE CASCADE not valid;

alter table "public"."reactions" validate constraint "reactions_user_id_fkey";

alter table "public"."reactions" add constraint "unique_user_comment_reaction" UNIQUE using index "unique_user_comment_reaction";

alter table "public"."reactions" add constraint "unique_user_post_reaction" UNIQUE using index "unique_user_post_reaction";

alter table "public"."tags" add constraint "tags_name_key" UNIQUE using index "tags_name_key";

alter table "public"."user_blocks" add constraint "user_blocks_blocked_id_fkey" FOREIGN KEY (blocked_id) REFERENCES public.public_users(id) ON DELETE CASCADE not valid;

alter table "public"."user_blocks" validate constraint "user_blocks_blocked_id_fkey";

alter table "public"."user_blocks" add constraint "user_blocks_check" CHECK ((user_id <> blocked_id)) not valid;

alter table "public"."user_blocks" validate constraint "user_blocks_check";

alter table "public"."user_blocks" add constraint "user_blocks_user_id_blocked_id_key" UNIQUE using index "user_blocks_user_id_blocked_id_key";

alter table "public"."user_blocks" add constraint "user_blocks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.public_users(id) ON DELETE CASCADE not valid;

alter table "public"."user_blocks" validate constraint "user_blocks_user_id_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_public_key_key" UNIQUE using index "users_public_key_key";

alter table "public"."users" add constraint "users_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'suspended'::text, 'deleted'::text]))) not valid;

alter table "public"."users" validate constraint "users_status_check";

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

set check_function_bodies = off;

create or replace view "public"."comment_reaction_counts" as  SELECT comment_id,
    emoji,
    count(*) AS count
   FROM public.reactions
  WHERE (comment_id IS NOT NULL)
  GROUP BY comment_id, emoji;


CREATE OR REPLACE FUNCTION public.fill_inbox_user_ids()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.fill_message_public_key()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Get receiver public key from users table
  SELECT public_key
  INTO NEW.public_key
  FROM users
  WHERE id = NEW."to";

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_chat_public_keys()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Fetch sender's public key from the users table
    SELECT public_key INTO NEW.sender_public_key
    FROM public.users
    WHERE id = NEW.sender_id;

    -- Fetch receiver's public key from the users table
    SELECT public_key INTO NEW.receiver_public_key
    FROM public.users
    WHERE id = NEW.receiver_id;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_post_comment_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.posts 
        SET comment_count = comment_count + 1 
        WHERE id = NEW.post_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.posts 
        SET comment_count = comment_count - 1 
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_post_reaction_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF NEW.post_id IS NOT NULL THEN
            UPDATE public.posts 
            SET reaction_count = reaction_count + 1 
            WHERE id = NEW.post_id;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF OLD.post_id IS NOT NULL THEN
            UPDATE public.posts 
            SET reaction_count = reaction_count - 1 
            WHERE id = OLD.post_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_user_metadata_sync()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

create or replace view "public"."post_reaction_counts" as  SELECT post_id,
    emoji,
    count(*) AS count
   FROM public.reactions
  WHERE (post_id IS NOT NULL)
  GROUP BY post_id, emoji;


CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_inbox_key_lookup()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.sync_inbox_keys()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO inbox_key_lookup (
        inbox_id,
        public_key
    )
    VALUES (
        NEW.inbox_id,
        NEW.public_key
    )
    ON CONFLICT (inbox_id)
    DO UPDATE SET
        public_key = EXCLUDED.public_key;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_public_users()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

grant delete on table "public"."chats" to "anon";

grant insert on table "public"."chats" to "anon";

grant references on table "public"."chats" to "anon";

grant select on table "public"."chats" to "anon";

grant trigger on table "public"."chats" to "anon";

grant truncate on table "public"."chats" to "anon";

grant update on table "public"."chats" to "anon";

grant delete on table "public"."chats" to "authenticated";

grant insert on table "public"."chats" to "authenticated";

grant references on table "public"."chats" to "authenticated";

grant select on table "public"."chats" to "authenticated";

grant trigger on table "public"."chats" to "authenticated";

grant truncate on table "public"."chats" to "authenticated";

grant update on table "public"."chats" to "authenticated";

grant delete on table "public"."chats" to "service_role";

grant insert on table "public"."chats" to "service_role";

grant references on table "public"."chats" to "service_role";

grant select on table "public"."chats" to "service_role";

grant trigger on table "public"."chats" to "service_role";

grant truncate on table "public"."chats" to "service_role";

grant update on table "public"."chats" to "service_role";

grant delete on table "public"."inbox" to "anon";

grant insert on table "public"."inbox" to "anon";

grant references on table "public"."inbox" to "anon";

grant select on table "public"."inbox" to "anon";

grant trigger on table "public"."inbox" to "anon";

grant truncate on table "public"."inbox" to "anon";

grant update on table "public"."inbox" to "anon";

grant delete on table "public"."inbox" to "authenticated";

grant insert on table "public"."inbox" to "authenticated";

grant references on table "public"."inbox" to "authenticated";

grant select on table "public"."inbox" to "authenticated";

grant trigger on table "public"."inbox" to "authenticated";

grant truncate on table "public"."inbox" to "authenticated";

grant update on table "public"."inbox" to "authenticated";

grant delete on table "public"."inbox" to "service_role";

grant insert on table "public"."inbox" to "service_role";

grant references on table "public"."inbox" to "service_role";

grant select on table "public"."inbox" to "service_role";

grant trigger on table "public"."inbox" to "service_role";

grant truncate on table "public"."inbox" to "service_role";

grant update on table "public"."inbox" to "service_role";

grant delete on table "public"."inbox_key_lookup" to "anon";

grant insert on table "public"."inbox_key_lookup" to "anon";

grant references on table "public"."inbox_key_lookup" to "anon";

grant select on table "public"."inbox_key_lookup" to "anon";

grant trigger on table "public"."inbox_key_lookup" to "anon";

grant truncate on table "public"."inbox_key_lookup" to "anon";

grant update on table "public"."inbox_key_lookup" to "anon";

grant delete on table "public"."inbox_key_lookup" to "authenticated";

grant insert on table "public"."inbox_key_lookup" to "authenticated";

grant references on table "public"."inbox_key_lookup" to "authenticated";

grant select on table "public"."inbox_key_lookup" to "authenticated";

grant trigger on table "public"."inbox_key_lookup" to "authenticated";

grant truncate on table "public"."inbox_key_lookup" to "authenticated";

grant update on table "public"."inbox_key_lookup" to "authenticated";

grant delete on table "public"."inbox_key_lookup" to "service_role";

grant insert on table "public"."inbox_key_lookup" to "service_role";

grant references on table "public"."inbox_key_lookup" to "service_role";

grant select on table "public"."inbox_key_lookup" to "service_role";

grant trigger on table "public"."inbox_key_lookup" to "service_role";

grant truncate on table "public"."inbox_key_lookup" to "service_role";

grant update on table "public"."inbox_key_lookup" to "service_role";

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

grant delete on table "public"."post_comments" to "anon";

grant insert on table "public"."post_comments" to "anon";

grant references on table "public"."post_comments" to "anon";

grant select on table "public"."post_comments" to "anon";

grant trigger on table "public"."post_comments" to "anon";

grant truncate on table "public"."post_comments" to "anon";

grant update on table "public"."post_comments" to "anon";

grant delete on table "public"."post_comments" to "authenticated";

grant insert on table "public"."post_comments" to "authenticated";

grant references on table "public"."post_comments" to "authenticated";

grant select on table "public"."post_comments" to "authenticated";

grant trigger on table "public"."post_comments" to "authenticated";

grant truncate on table "public"."post_comments" to "authenticated";

grant update on table "public"."post_comments" to "authenticated";

grant delete on table "public"."post_comments" to "service_role";

grant insert on table "public"."post_comments" to "service_role";

grant references on table "public"."post_comments" to "service_role";

grant select on table "public"."post_comments" to "service_role";

grant trigger on table "public"."post_comments" to "service_role";

grant truncate on table "public"."post_comments" to "service_role";

grant update on table "public"."post_comments" to "service_role";

grant delete on table "public"."post_reports" to "anon";

grant insert on table "public"."post_reports" to "anon";

grant references on table "public"."post_reports" to "anon";

grant select on table "public"."post_reports" to "anon";

grant trigger on table "public"."post_reports" to "anon";

grant truncate on table "public"."post_reports" to "anon";

grant update on table "public"."post_reports" to "anon";

grant delete on table "public"."post_reports" to "authenticated";

grant insert on table "public"."post_reports" to "authenticated";

grant references on table "public"."post_reports" to "authenticated";

grant select on table "public"."post_reports" to "authenticated";

grant trigger on table "public"."post_reports" to "authenticated";

grant truncate on table "public"."post_reports" to "authenticated";

grant update on table "public"."post_reports" to "authenticated";

grant delete on table "public"."post_reports" to "service_role";

grant insert on table "public"."post_reports" to "service_role";

grant references on table "public"."post_reports" to "service_role";

grant select on table "public"."post_reports" to "service_role";

grant trigger on table "public"."post_reports" to "service_role";

grant truncate on table "public"."post_reports" to "service_role";

grant update on table "public"."post_reports" to "service_role";

grant delete on table "public"."post_tags" to "anon";

grant insert on table "public"."post_tags" to "anon";

grant references on table "public"."post_tags" to "anon";

grant select on table "public"."post_tags" to "anon";

grant trigger on table "public"."post_tags" to "anon";

grant truncate on table "public"."post_tags" to "anon";

grant update on table "public"."post_tags" to "anon";

grant delete on table "public"."post_tags" to "authenticated";

grant insert on table "public"."post_tags" to "authenticated";

grant references on table "public"."post_tags" to "authenticated";

grant select on table "public"."post_tags" to "authenticated";

grant trigger on table "public"."post_tags" to "authenticated";

grant truncate on table "public"."post_tags" to "authenticated";

grant update on table "public"."post_tags" to "authenticated";

grant delete on table "public"."post_tags" to "service_role";

grant insert on table "public"."post_tags" to "service_role";

grant references on table "public"."post_tags" to "service_role";

grant select on table "public"."post_tags" to "service_role";

grant trigger on table "public"."post_tags" to "service_role";

grant truncate on table "public"."post_tags" to "service_role";

grant update on table "public"."post_tags" to "service_role";

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";

grant delete on table "public"."public_users" to "anon";

grant insert on table "public"."public_users" to "anon";

grant references on table "public"."public_users" to "anon";

grant select on table "public"."public_users" to "anon";

grant trigger on table "public"."public_users" to "anon";

grant truncate on table "public"."public_users" to "anon";

grant update on table "public"."public_users" to "anon";

grant delete on table "public"."public_users" to "authenticated";

grant insert on table "public"."public_users" to "authenticated";

grant references on table "public"."public_users" to "authenticated";

grant select on table "public"."public_users" to "authenticated";

grant trigger on table "public"."public_users" to "authenticated";

grant truncate on table "public"."public_users" to "authenticated";

grant update on table "public"."public_users" to "authenticated";

grant delete on table "public"."public_users" to "service_role";

grant insert on table "public"."public_users" to "service_role";

grant references on table "public"."public_users" to "service_role";

grant select on table "public"."public_users" to "service_role";

grant trigger on table "public"."public_users" to "service_role";

grant truncate on table "public"."public_users" to "service_role";

grant update on table "public"."public_users" to "service_role";

grant delete on table "public"."reactions" to "anon";

grant insert on table "public"."reactions" to "anon";

grant references on table "public"."reactions" to "anon";

grant select on table "public"."reactions" to "anon";

grant trigger on table "public"."reactions" to "anon";

grant truncate on table "public"."reactions" to "anon";

grant update on table "public"."reactions" to "anon";

grant delete on table "public"."reactions" to "authenticated";

grant insert on table "public"."reactions" to "authenticated";

grant references on table "public"."reactions" to "authenticated";

grant select on table "public"."reactions" to "authenticated";

grant trigger on table "public"."reactions" to "authenticated";

grant truncate on table "public"."reactions" to "authenticated";

grant update on table "public"."reactions" to "authenticated";

grant delete on table "public"."reactions" to "service_role";

grant insert on table "public"."reactions" to "service_role";

grant references on table "public"."reactions" to "service_role";

grant select on table "public"."reactions" to "service_role";

grant trigger on table "public"."reactions" to "service_role";

grant truncate on table "public"."reactions" to "service_role";

grant update on table "public"."reactions" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";

grant delete on table "public"."user_blocks" to "anon";

grant insert on table "public"."user_blocks" to "anon";

grant references on table "public"."user_blocks" to "anon";

grant select on table "public"."user_blocks" to "anon";

grant trigger on table "public"."user_blocks" to "anon";

grant truncate on table "public"."user_blocks" to "anon";

grant update on table "public"."user_blocks" to "anon";

grant delete on table "public"."user_blocks" to "authenticated";

grant insert on table "public"."user_blocks" to "authenticated";

grant references on table "public"."user_blocks" to "authenticated";

grant select on table "public"."user_blocks" to "authenticated";

grant trigger on table "public"."user_blocks" to "authenticated";

grant truncate on table "public"."user_blocks" to "authenticated";

grant update on table "public"."user_blocks" to "authenticated";

grant delete on table "public"."user_blocks" to "service_role";

grant insert on table "public"."user_blocks" to "service_role";

grant references on table "public"."user_blocks" to "service_role";

grant select on table "public"."user_blocks" to "service_role";

grant trigger on table "public"."user_blocks" to "service_role";

grant truncate on table "public"."user_blocks" to "service_role";

grant update on table "public"."user_blocks" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


  create policy "Users can create chats if not blocked"
  on "public"."chats"
  as permissive
  for insert
  to public
with check (((auth.uid() = sender_id) AND (NOT (EXISTS ( SELECT 1
   FROM public.user_blocks
  WHERE ((user_blocks.user_id = chats.receiver_id) AND (user_blocks.blocked_id = auth.uid())))))));



  create policy "Users can delete their own chats"
  on "public"."chats"
  as permissive
  for delete
  to public
using (((auth.uid() = sender_id) OR (auth.uid() = receiver_id)));



  create policy "Users can update their own chats"
  on "public"."chats"
  as permissive
  for update
  to public
using (((auth.uid() = sender_id) OR (auth.uid() = receiver_id)))
with check (((status <> 'accepted'::text) OR (auth.uid() = receiver_id)));



  create policy "Users can view their own chats"
  on "public"."chats"
  as permissive
  for select
  to public
using (((auth.uid() = sender_id) OR (auth.uid() = receiver_id)));



  create policy "Enable delete for users based on user_id"
  on "public"."inbox"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to view their own data only"
  on "public"."inbox"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "anyone can send message"
  on "public"."inbox"
  as permissive
  for insert
  to public
with check (true);



  create policy "update  their own data only"
  on "public"."inbox"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check (true);



  create policy "Enable read access for all users"
  on "public"."inbox_key_lookup"
  as permissive
  for select
  to public
using (true);



  create policy "Users can insert messages if not blocked"
  on "public"."messages"
  as permissive
  for insert
  to public
with check (((auth.uid() = "from") AND (EXISTS ( SELECT 1
   FROM public.chats c
  WHERE ((c.id = messages.chat_id) AND ((c.sender_id = auth.uid()) OR (c.receiver_id = auth.uid())) AND (NOT (EXISTS ( SELECT 1
           FROM public.user_blocks ub
          WHERE (((ub.user_id = c.sender_id) AND (ub.blocked_id = c.receiver_id)) OR ((ub.user_id = c.receiver_id) AND (ub.blocked_id = c.sender_id)))))))))));



  create policy "Users can update their own messages visibility"
  on "public"."messages"
  as permissive
  for update
  to public
using (((auth.uid() = "from") OR (EXISTS ( SELECT 1
   FROM public.chats
  WHERE ((chats.id = messages.chat_id) AND ((chats.sender_id = auth.uid()) OR (chats.receiver_id = auth.uid())))))));



  create policy "Users can view messages in their chats"
  on "public"."messages"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.chats
  WHERE ((chats.id = messages.chat_id) AND ((chats.sender_id = auth.uid()) OR (chats.receiver_id = auth.uid()))))));



  create policy "Authenticated users can create comments"
  on "public"."post_comments"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Authenticated users can view active comments"
  on "public"."post_comments"
  as permissive
  for select
  to authenticated
using ((status = 'active'::text));



  create policy "Authors can delete own comments"
  on "public"."post_comments"
  as permissive
  for delete
  to authenticated
using ((auth.uid() = user_id));



  create policy "Authors can update own comments"
  on "public"."post_comments"
  as permissive
  for update
  to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Authors can view own comments"
  on "public"."post_comments"
  as permissive
  for select
  to authenticated
using ((auth.uid() = user_id));



  create policy "Enable insert for authenticated users only"
  on "public"."post_reports"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."post_reports"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated users can view post tags"
  on "public"."post_tags"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Post authors can delete tags"
  on "public"."post_tags"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.posts
  WHERE ((posts.id = post_tags.post_id) AND (posts.user_id = auth.uid())))));



  create policy "Post authors can insert tags"
  on "public"."post_tags"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.posts
  WHERE ((posts.id = post_tags.post_id) AND (posts.user_id = auth.uid())))));



  create policy "Authenticated users can create posts"
  on "public"."posts"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Authenticated users can view published posts"
  on "public"."posts"
  as permissive
  for select
  to authenticated
using ((status = 'published'::text));



  create policy "Authors can update own posts"
  on "public"."posts"
  as permissive
  for update
  to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Authors can view own posts"
  on "public"."posts"
  as permissive
  for select
  to authenticated
using ((auth.uid() = user_id));



  create policy "Enable read access for all users"
  on "public"."public_users"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated users can create reactions"
  on "public"."reactions"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Authenticated users can view reactions"
  on "public"."reactions"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can delete own reactions"
  on "public"."reactions"
  as permissive
  for delete
  to authenticated
using ((auth.uid() = user_id));



  create policy "Users can update own reactions"
  on "public"."reactions"
  as permissive
  for update
  to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Authenticated users can view tags"
  on "public"."tags"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Enable delete for users based on user_id"
  on "public"."user_blocks"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for authenticated users only"
  on "public"."user_blocks"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Users can view their own block relationships"
  on "public"."user_blocks"
  as permissive
  for select
  to authenticated
using (((auth.uid() = user_id) OR (auth.uid() = blocked_id)));



  create policy "Enable users to update their own data only"
  on "public"."users"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can access peer public keys if in chat"
  on "public"."users"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.chats
  WHERE (((chats.sender_id = auth.uid()) AND (chats.receiver_id = users.id)) OR ((chats.receiver_id = auth.uid()) AND (chats.sender_id = users.id))))));


CREATE TRIGGER set_chats_updated_at BEFORE UPDATE ON public.chats FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_fill_inbox_user_id BEFORE INSERT ON public.inbox FOR EACH ROW EXECUTE FUNCTION public.fill_inbox_user_ids();

CREATE TRIGGER trg_fill_inbox_user_ids BEFORE INSERT ON public.inbox FOR EACH ROW EXECUTE FUNCTION public.fill_inbox_user_ids();

CREATE TRIGGER set_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_post_comment_count AFTER INSERT OR DELETE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION public.handle_post_comment_count();

CREATE TRIGGER trg_post_comments_updated_at BEFORE UPDATE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_post_reaction_count AFTER INSERT OR DELETE ON public.reactions FOR EACH ROW EXECUTE FUNCTION public.handle_post_reaction_count();

CREATE TRIGGER trg_reactions_updated_at BEFORE UPDATE ON public.reactions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_tags_updated_at BEFORE UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_sync_inbox_keys AFTER INSERT OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.sync_inbox_keys();

CREATE TRIGGER trg_user_metadata_sync AFTER INSERT OR DELETE OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_user_metadata_sync();

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


