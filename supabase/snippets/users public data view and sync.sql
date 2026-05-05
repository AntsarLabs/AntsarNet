CREATE TABLE public_users (
    id UUID PRIMARY KEY,

    username TEXT,
    emoji TEXT,
    bio TEXT,

    pve_rxn_count INT DEFAULT 0,
    nve_rxn_count INT DEFAULT 0,
    confession_count INT DEFAULT 0,

    is_online BOOLEAN DEFAULT false,
    status TEXT,

    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

CREATE TABLE inbox_key_lookup (
    inbox_id TEXT PRIMARY KEY,
    public_key TEXT NOT NULL
);


