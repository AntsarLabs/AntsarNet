# AnstarNet 🦊✨

AnstarNet is an open-source, privacy-first social platform designed for honest, authentic communication without revealing your identity. Built with a zero-knowledge architecture, it features end-to-end encrypted messaging, anonymous posting, and a unique cryptographic identity system.

![AnstarNet Landing](https://cdn.magicpatterns.com/uploads/buFFB14RxN7rp2dVxCiLRi/64b6005b9b1c73650c503c0f921982ab.2-1-super.1.jpg)

## 🚀 Key Features

- **Zero-Knowledge Identity**: No passwords, no emails. Your identity is a cryptographic footprint (PassCard) stored only on your device.
- **End-to-End Encrypted Chats**: Private one-on-one conversations that only you and the recipient can read.
- **Anonymous Posts**: Share confessions, vents, questions, or advice with community-driven reactions and threaded comments.
- **Anonymous Inbox**: A sharable link (Better-S.M.A) to receive honest feedback or stories privately.
- **Real-time Presence**: See when users are online via a lightweight WebSocket heartbeat system.
- **Privacy by Design**: Minimized data collection and robust RLS (Row Level Security) policies.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion.
- **State Management**: Zustand, TanStack Query (React Query).
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions, Real-time).
- **Cryptography**: TweetNaCl, BIP39 (Mnemonic seeds), SHA-256.

## 📦 Project Structure

```text
├── src/
│   ├── features/          # Modular feature-based logic (Auth, Chat, Inbox, Post, User)
│   ├── components/        # Shared UI components
│   ├── lib/              # Library initializations (Supabase, QueryClient)
│   └── utils/             # Cryptography and date helpers
├── supabase/
│   ├── functions/         # Edge Functions (Auth, Live Status)
│   ├── migrations/        # Database schema and RLS policies
│   └── seed.sql           # Initial development data
└── docs/                  # Detailed technical documentation
```

## ⚙️ Quick Start

### Prerequisites
- Node.js (v18+)
- Supabase CLI
- Docker (for local Supabase development)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/anstarnet.git
cd anstarnet
```

### 2. Setup Supabase
```bash
# Initialize Supabase locally
supabase start

# Link to your project (if using remote)
# supabase link --project-ref your-project-id
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FRONTEND_URL=http://localhost:5173
```

### 4. Install & Run
```bash
npm install
npm run dev
```

## 📖 Documentation

For deeper dives into how AnstarNet works, check out our detailed guides:

- [**Architecture Overview**](./docs/architecture.md) - How the frontend and backend interact.
- [**Security & E2EE**](./docs/security.md) - Deep dive into our zero-knowledge system.
- [**Database Schema**](./docs/database-schema.md) - Tables, Triggers, and RLS policies.
- [**Edge Functions**](./docs/edge-functions.md) - Logic for custom auth and real-time status.
- [**Detailed Setup Guide**](./docs/setup-guide.md) - Step-by-step installation.

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines before submitting a PR.

## 📜 License

This project is licensed under the MIT License.

---
Developed by [Kassdag](https://t.me/thekassdag) under [AntsarLabs](https://antsar.et).
