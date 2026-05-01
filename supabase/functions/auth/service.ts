import crypto from "node:crypto";
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js";
import { E2EE } from "./e2ee.ts";
import { animalEmojis } from "./emojis.ts";

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
        const emojisList = Object.keys(animalEmojis);
        const randomEmoji = emojisList[Math.floor(Math.random() * emojisList.length)];
        const animalName = animalEmojis[randomEmoji];

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

            // first create user on auth by admin role
            const { data: authUser, error: authError } = await this.supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true
            });

            if (authError) throw authError;

            // now update the user metadata with the public key
            const { data: newUser, error: insertError } = await this.supabase
                .from("users")
                .insert({
                    id: authUser.user.id,
                    public_key,
                    username,
                    emoji
                })
                .select()
                .single();

            if (insertError) {
                console.error("Database Insert Error:", {
                    message: insertError.message,
                    details: insertError.details,
                    hint: insertError.hint,
                    code: insertError.code
                });
                throw insertError;
            }
            user = newUser;
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
}
