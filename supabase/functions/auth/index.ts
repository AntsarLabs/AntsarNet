import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import express, { Request, Response } from "npm:express@4.18.2";
import { createClient } from "npm:@supabase/supabase-js";
import { AuthService } from "./service.ts";

const app = express();
app.use(express.json());

// Environment variables
const systemPrivateKey = Deno.env.get("SYSTEM_PRIVATE_KEY")!;
const systemPublicKey = Deno.env.get("SYSTEM_PUBLIC_KEY")!;
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Initialize Supabase Client with best practices for Edge Functions
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// Initialize Auth Service
const authService = new AuthService(
  supabase,
  systemPrivateKey,
  systemPublicKey,
  supabaseUrl,
  supabaseServiceKey
);

// Helper for CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS",
};

/**
 * auth user by validating the signature (message that sent from us and signed by the client public key)
 */
app.post("/auth", async (req: Request, res: Response) => {
  // Handle CORS for Express
  res.set(corsHeaders);

  const { hash, message, exp_time, signature, key, nonce } = req.body;

  // 1. Validation
  if (!hash || !message || !exp_time || !signature || !key || !nonce) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (exp_time < Date.now()) {
    return res.status(400).json({ error: "Expired" });
  }

  try {
    // 2. Verify Payload
    authService.validatePayload(hash, message, exp_time, signature, key, nonce);

    // 4. Get or Create Public User Profile
    const user = await authService.getOrCreateUserProfile(key);

    // 5. Generate Custom JWT
    const { session: userSession, error: sessionError } = await authService.generateSession(key);

    if (sessionError) throw sessionError;

    return res.status(200).json({
      user: user,
      session: {
        access_token: userSession?.access_token,
        refresh_token: userSession?.refresh_token,
        expires_at: userSession?.expires_at,
        token_type: userSession?.token_type,
      },
    });
  } catch (err: any) {
    console.error("Auth error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message || err,
      code: err.code || null
    });
  }
});

/**
 * generate message to be signed by client to prove ownership of the public key
 */
app.get("/auth/message", (req: Request, res: Response) => {
  res.set(corsHeaders);
  const message = authService.generateAuthMessage();
  return res.status(200).json(message);
});

/**
 * update user profile
 */
app.put("/auth/me", async (req: Request, res: Response) => {
  res.set(corsHeaders);

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing authorization header" });

  try {
    const token = authHeader.replace("Bearer ", "");
    // Use the service client to verify the token and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { bio, location, username, emoji } = req.body;

    // In our DB schema, 'location' maps to 'city_code'
    const updatedUser = await authService.updateUserProfile(user.id, {
      bio,
      city_code: location,
      username,
      emoji
    });

    return res.status(200).json(updatedUser);
  } catch (err: any) {
    console.error("Update profile error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message || err,
      code: err.code || null
    });
  }
});

// Handle preflight requests
app.options("*", (req, res) => {
  res.set(corsHeaders);
  res.sendStatus(204);
});

app.listen(8000);