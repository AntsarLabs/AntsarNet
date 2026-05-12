# Security & E2EE

Security is the core pillar of AnstarNet. We implement a **Zero-Knowledge Architecture**, meaning the platform owners cannot read your messages or know who you are.

## 1. Zero-Knowledge Identity (The PassCard)

Unlike traditional platforms, AnstarNet doesn't use passwords. Your "account" is a **PassCard**, which is a Base64-encoded string containing:
`random_salt | public_key | private_key`

### How it's generated:
1.  **Mnemonic**: A 12-word BIP39 mnemonic is generated.
2.  **Seed**: The mnemonic is converted into a 512-bit seed.
3.  **Keypair**: A NaCl (Networking and Cryptography library) box keypair is derived from the SHA-256 hash of that seed.
4.  **Storage**: This PassCard is downloaded as a `.txt` file. **If you lose this file, you lose your account forever.**

## 2. End-to-End Encryption (E2EE)

All private messages and inbox submissions are encrypted using **Curve25519, XSalsa20, and Poly1305**.

### Chat Encryption Process:
1.  **Public Key Retrieval**: To message Bob, Alice fetches Bob's `public_key` from the database.
2.  **Shared Secret**: Alice computes a shared secret using her `private_key` and Bob's `public_key`.
3.  **Encryption**: Alice encrypts the message with this shared secret and a random `nonce`.
4.  **Double Encryption**: To allow Alice to see her own sent messages later, she also encrypts the message for herself using her own keys.
5.  **Submission**: Both encrypted versions are sent to the database.

### Why this is secure:
-   **No Cleartext**: The database only sees "ciphertext".
-   **Forward Secrecy**: (Future implementation) We plan to implement rotating keys for even stronger protection.
-   **Authenticated Encryption**: Poly1305 ensures that the message hasn't been tampered with in transit.

## 3. Anonymous Inbox (Better-S.M.A)

The anonymous inbox allows non-registered users (or registered ones) to send messages to you without any account link.

1.  **Inbox ID**: A unique UUID unrelated to your User ID.
2.  **Lookup**: The sender fetches your public key via an `inbox_key_lookup` view.
3.  **Temporary Keys**: The sender generates a **temporary one-time keypair**.
4.  **Encryption**: The message is encrypted using the sender's temporary private key and your permanent public key.
5.  **Delivery**: The sender stores their temporary public key along with the message so you can derive the shared secret to decrypt it.

## 4. Platform Moderation

Anonymity can sometimes lead to abuse. We balance privacy with safety via:
-   **Blocking**: Cryptographic blocking enforced via RLS. If Alice blocks Bob, the database rejects any `insert` to `messages` or `chats` from Bob to Alice.
-   **Reporting**: Users can flag content. Flagged content is reviewed by moderators (who see the content but not the identity).
-   **Self-Governance**: Users have full control over deleting their own data.
