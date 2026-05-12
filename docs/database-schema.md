# Database Schema

AnstarNet uses a highly relational PostgreSQL schema on Supabase, heavily augmented with **Row Level Security (RLS)** and **Triggers** to maintain data integrity and anonymity.

## Tables Overview

### `users` (Private)
Stores the core cryptographic identity.
- `id`: Linked to `auth.users`.
- `username`: Unique animal-based handle (e.g., `fox_A1234`).
- `public_key`: The Base64 public key used for E2EE.
- `inbox_id`: A UUID used for the anonymous inbox.

### `public_users` (Sync)
A "mirror" table that stores only non-sensitive data, used for discovery and public profiles. Synced via triggers from `users`.

### `posts`
Stores confessions and vents.
- `post_type`: enum (`confession`, `vent`, `question`, `advice`).
- `status`: enum (`published`, `pending`, `flagged`, `deleted`).
- `reaction_count` / `comment_count`: Denormalized counts for performance.

### `chats`
Represents a connection between two users.
- `status`: enum (`pending`, `accepted`, `declined`).
- `unique_pair_idx`: A unique index on `LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)` to prevent duplicate chats.

### `messages`
- `encrypted_texts`: A JSONB column storing different ciphertexts for each participant.
- `from` / `to`: User IDs.

## Security (RLS Policies)

RLS is the backbone of our security. Examples:

- **Chats**: `auth.uid() = sender_id OR auth.uid() = receiver_id`.
- **Messages**: Only viewable if the user is a participant in the `chat_id` linked to the message.
- **Blocking**: The `chats` and `messages` tables have `INSERT` policies that check the `user_blocks` table. If Bob is blocked by Alice, Bob's `INSERT` request will be denied by the database itself.

## Key Triggers

1.  **`handle_user_metadata_sync`**: Whenever a user is created or updated in the `users` table, this trigger automatically updates `public_users` and `inbox_key_lookup`.
2.  **`handle_post_comment_count`**: Automatically increments/decrements the `comment_count` on a post when a row is added to `post_comments`.
3.  **`handle_post_reaction_count`**: Same as above but for reactions.
4.  **`fill_inbox_user_ids`**: Resolves an `inbox_id` to a `user_id` during anonymous message submission, allowing senders to remain anonymous while correctly routing the message.

## Views

- **`post_reaction_counts`**: Aggregates reactions per emoji for each post.
- **`inbox_key_lookup`**: Allows public lookup of an inbox's public key without exposing the owner's user ID.
