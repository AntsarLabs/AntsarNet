# Detailed Setup Guide

Follow this guide to get AnstarNet running in your own environment.

## 1. Supabase Cloud Setup (Recommended)

1.  Create a new project at [database.new](https://database.new).
2.  Go to **Project Settings -> API** and grab your `URL` and `anon` key.
3.  Go to **Database -> Migrations** (or use the CLI) to apply the schema.
4.  **Edge Functions**:
    -   Generate a system keypair (you can use the `E2EE` class in the project or any NaCl tool).
    -   Set secrets in Supabase:
        ```bash
        supabase secrets set SYSTEM_PRIVATE_KEY=your_key
        supabase secrets set SYSTEM_PUBLIC_KEY=your_key
        ```
    -   Deploy functions:
        ```bash
        supabase functions deploy auth
        supabase secrets set --project-ref your-ref auth
        supabase functions deploy live
        ```

## 2. Local Development (Supabase CLI)

1.  **Install CLI**: `npm install -g supabase`
2.  **Start Services**: `supabase start`
3.  **Apply Migrations**: The CLI will automatically apply everything in `supabase/migrations`.
4.  **Local Secrets**: Create a `.env` file inside `supabase/functions/` (see `.env.example`).
5.  **Seed Data**: Run `supabase db reset` to clear and apply `supabase/seed.sql`.

## 3. Frontend Configuration

1.  Create a `.env` file in the root directory:
    ```bash
    VITE_SUPABASE_URL=http://127.0.0.1:54321
    VITE_SUPABASE_ANON_KEY=your_local_anon_key
    VITE_FRONTEND_URL=http://localhost:5173
    ```
2.  **Install Dependencies**: `npm install`
3.  **Run Development Server**: `npm run dev`

## 4. Common Issues

### "Decryption failed"
-   This usually happens if the `SYSTEM_PRIVATE_KEY` in your Edge Functions doesn't match the one used when the messages were encrypted, or if the user's PassCard is invalid.
-   Ensure your `.env` keys are consistent across your local and remote environments.

### WebSocket Connection Refused
-   The `live` function must be deployed and the `VITE_SUPABASE_URL` must be correct.
-   If running locally, ensure Docker is running and the `live` function is accessible at `http://127.0.0.1:54321/functions/v1/live`.

### RLS Denying Access
-   If you can't see posts or chats, check the `status` column. Most `SELECT` policies filter for `status = 'published'` or `status = 'accepted'`.
-   Use the `seed.sql` to populate your local DB with valid test data.
