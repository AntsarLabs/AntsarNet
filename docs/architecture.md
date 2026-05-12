# Architecture Overview

AnstarNet is built as a **Decentralized Identity + Centralized Backend** hybrid. While Supabase manages the data storage and real-time signaling, the "Source of Truth" for identity remains with the user.

## System Flow

### 1. Identity & Authentication
AnstarNet does not use traditional email/password login.
- **Client-Side**: Generates a 12-word mnemonic (BIP39). This mnemonic derives a private key.
- **Handshake**: The client signs a unique server-generated message using its private key.
- **Server-Side**: An Edge Function verifies the signature using the client's public key.
- **Session**: If verified, the server returns a standard Supabase JWT (using a hidden internal email/password mapped to the public key) to allow the client to interact with the database via RLS.

### 2. Message Encryption (E2EE)
Messaging uses **Curve25519 (Diffie-Hellman)** for shared secret derivation.
- **Sender**: Fetches the recipient's public key from the `users` table.
- **Derivation**: Computes a shared secret using `nacl.box.before(recipientPublicKey, senderPrivateKey)`.
- **Storage**: The message is encrypted twice (once for the sender, once for the recipient) and stored as a JSON object in the `messages` table.
- **JSON Structure**:
  ```json
  {
    "sender_id": { "ciphertext": "...", "nonce": "..." },
    "recipient_id": { "ciphertext": "...", "nonce": "..." }
  }
  ```

### 3. Real-time Status (Heartbeat)
Online status is maintained via a persistent WebSocket connection to a Supabase Edge Function (`live`).
- **Connection**: When the app mounts, it opens a WS connection.
- **Lifecycle**:
    - `onOpen`: Edge function sets `is_online = true` in the DB.
    - `onClose/onError`: Edge function sets `is_online = false`.
- **Sync**: Other clients listen to `public_users` table updates via Supabase Realtime to show live indicators.

### 4. Modular Frontend
The frontend is organized by **Features**:
- `features/auth`: Cryptographic identity generation and session management.
- `features/chat`: E2EE logic, message fetching, and chat lists.
- `features/post`: Feed logic, tag filtering, and anonymous interactions.
- `features/inbox`: Sharable anonymous message receiving logic.
- `features/user`: Discovery and random matching.

## Data Privacy
- Real identities (IPs, emails) are never stored in public tables.
- All sensitive communication is encrypted before reaching the database.
- RLS policies ensure users can only see chats they belong to.
