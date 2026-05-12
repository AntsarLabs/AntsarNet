import crypto from "node:crypto";
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js";
import { E2EE } from "./e2ee.ts";
import { emojis } from "./emojis.ts";

export class AuthService {
    constructor(
        private supabase: SupabaseClient,
        private systemPrivateKey: string,
        private systemPublicKey: string,
        private supabaseUrl: string,
        private supabaseServiceKey: string
    ) { }

    generateAuthMessage() {
        const expTime = Date.now() + 60 * 60 * 1000; // 1 hour
        const message = crypto.randomUUID();
        const hash = crypto.createHash("sha256").update(message + this.systemPrivateKey + expTime).digest("base64");
        return {
            key: this.systemPublicKey,
            message,
            hash,
            exp_time: expTime
        };
    }

    validatePayload(hash: string, message: string, exp_time: number, signature: string, public_key: string, nonce: string) {
        const calculatedHash = crypto.createHash("sha256").update(message + this.systemPrivateKey + exp_time).digest("base64");
        if (hash !== calculatedHash) {
            throw new Error("Invalid hash");
        };

        try {
            const sharedKey = E2EE.generateSharedKey(E2EE.toUint8Array(public_key), E2EE.toUint8Array(this.systemPrivateKey));

            const decryptedSignature = E2EE.decryptMsg(E2EE.toUint8Array(signature), sharedKey, E2EE.toUint8Array(nonce));
            if (decryptedSignature !== message) {
                console.log("Decrypted signature:", decryptedSignature);
                console.log("Message:", message);
                throw new Error("Invalid signature");
            }
        } catch (error) {
            throw new Error("Failed to validate signature", { cause: error });
        }
    }

    async getRandomUsername(tries: number = 0): Promise<{ username: string, emoji: string }> {
        const maxTries = 10;
        const emojisList = Object.keys(emojis);
        const randomEmoji = emojisList[Math.floor(Math.random() * emojisList.length)];
        const animalName = emojis[randomEmoji];

        const allowedLetters = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Excludes 'O' as it looks like '0'
        const randomLetter = allowedLetters[Math.floor(Math.random() * allowedLetters.length)];

        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const randomUsername = `${animalName}_${randomLetter}${randomNumber}`;
        //try to fetch the username from the database and if it exists, generate a new one
        const { data: existingUser, error } = await this.supabase
            .from("users")
            .select("*")
            .eq("username", randomUsername)
            .maybeSingle();

        if (error) throw error;

        if (!existingUser) {
            return { username: randomUsername, emoji: randomEmoji };
        }

        if (tries < maxTries) {
            return this.getRandomUsername(tries + 1);
        }

        throw new Error("Could not generate a unique username");
    }


    async getOrCreateUserProfile(public_key: string) {
        let { data: user, error: fetchError } = await this.supabase
            .from("users")
            .select("*")
            .eq("public_key", public_key)
            .maybeSingle();

        if (fetchError) throw fetchError;

        if (!user) {
            const { username, emoji } = await this.getRandomUsername();
            const { email, password } = this.generateCredentials(public_key);
            let authUserId;
            try {
                // 1. Create the Auth User
                const { data: authUser, error: authError } = await this.supabase.auth.admin.createUser({
                    email,
                    password,
                    email_confirm: true
                });

                if (authError) throw authError;

                authUserId = authUser.user.id;

                // 2. Try to insert the Profile, if it fails, ROLLBACK (delete) the auth user
                const { data: newUser, error: insertError } = await this.supabase
                    .from("users")
                    .insert({
                        id: authUserId,
                        public_key,
                        username,
                        emoji
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;
                user = newUser;
            } catch (error) {
                if (authUserId) {
                    await this.supabase.auth.admin.deleteUser(authUserId); // Rollback: Delete the auth user because the profile creation failed and to prevent latter on email already exists error
                }
                console.error("Profile creation failed, rolled back auth user:", error);
                throw error;
            }
        }

        return user;
    }

    generateCredentials(publicKey: string) {
        const email = `${publicKey}@addisnet.et`;
        const password = crypto.createHash("sha256").update(email + this.systemPrivateKey).digest("base64");
        return { email, password };
    }

    async generateSession(publicKey: string) {
        const { email, password } = this.generateCredentials(publicKey);

        // Use a fresh, isolated client so signInWithPassword never pollutes
        // the shared admin client's in-memory auth state across requests.
        const sessionClient = createClient(this.supabaseUrl, this.supabaseServiceKey, {
            auth: { persistSession: false }
        });

        const { data, error } = await sessionClient
            .auth.signInWithPassword({
                email,
                password
            });

        if (error) throw error;

        return data;
    }

    async updateUserProfile(userId: string, updates: { bio?: string, city_code?: string, username?: string, emoji?: string }) {
        // 1. Validation
        if (updates.bio !== undefined && updates.bio.length > 120) {
            throw new Error("Bio must be 120 characters or less");
        }

        if (updates.emoji !== undefined && !emojis[updates.emoji]) {
            throw new Error("Invalid emoji selection");
        }

        if (updates.username !== undefined) {
            // Basic format check
            if (!/^[a-z0-9_]+_[A-Z][0-9]{4}$/.test(updates.username)) {
                throw new Error("Username must follow the format: animal_A0001");
            }

            // Check uniqueness
            const { data: existingUser, error: checkError } = await this.supabase
                .from("users")
                .select("id")
                .eq("username", updates.username)
                .neq("id", userId)
                .maybeSingle();

            if (checkError) throw checkError;
            if (existingUser) {
                throw new Error("Username is already taken");
            }
        }

        // 2. Filter out undefined values
        const cleanUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, v]) => v !== undefined)
        );

        if (Object.keys(cleanUpdates).length === 0) {
            throw new Error("No updates provided");
        }

        const { data, error } = await this.supabase
            .from("users")
            .update(cleanUpdates)
            .eq("id", userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}
