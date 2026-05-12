# Edge Functions

AnstarNet uses Supabase Edge Functions (Deno) to handle logic that requires elevated privileges (Service Role) or custom authentication flows.

## 1. `auth` Function

This function handles our custom "PassCard" handshake.

### Endpoints:
-   **`GET /auth/message`**:
    -   Generates a random UUID (message).
    -   Signs it with a system-level secret and expiration time.
    -   Returns the `message`, `hash`, and `system_public_key`.
-   **`POST /auth`**:
    -   Receives the signature from the client.
    -   Verifies that the client actually owns the private key corresponding to their public key.
    -   **Magic Step**: Internally logs the user in using a deterministic email/password derived from their public key.
    -   Returns a Supabase Session JWT.
-   **`PUT /auth/me`**:
    -   Used for profile updates (username, emoji, bio).
    -   Validates username formats (e.g., `animal_A0001`).

## 2. `live` Function

A lightweight WebSocket server for tracking online status.

### Workflow:
1.  The client connects to `wss://.../functions/v1/live?token=JWT`.
2.  The function verifies the JWT.
3.  **Connection Open**: It updates `users.is_online = true`.
4.  **Heartbeat**: The connection is kept open.
5.  **Connection Close**: When the WebSocket disconnects (tab closed, internet lost), it updates `users.is_online = false`.

### Why Edge Functions?
We use Edge Functions for `is_online` instead of Supabase Realtime Presence because it's more reliable for "Last Seen" timestamps. Realtime Presence is great for ephemeral data, but DB-level `is_online` allows us to query "who was online in the last hour" easily.

## Environment Variables Needed:
-   `SYSTEM_PRIVATE_KEY`: A 32-byte Base64 key for signing auth messages.
-   `SYSTEM_PUBLIC_KEY`: The corresponding public key.
-   `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`: For administrative DB access.
