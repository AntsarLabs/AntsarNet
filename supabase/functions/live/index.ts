import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

async function toggleUserOnlineStatus(userId: string, isOnline: boolean) {
  const { data, error } = await supabase
    .from("users")
    .update({ is_online: isOnline })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error(`Error setting user online status to ${isOnline}:`, error);
    throw error;
  }
  return data;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  let token = url.searchParams.get("token");
  
  if (!token) {
    const tokenHeader = req.headers.get("Authorization");
    token = tokenHeader?.split(" ")[1] || null;
  }

  if (!token) {
    return new Response("Missing token", { status: 401 });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return new Response("Invalid token", { status: 401 });
  }

  // Upgrade the HTTP request to a native WebSocket connection
  const { socket, response } = Deno.upgradeWebSocket(req);

  // Set user online when socket connects
  socket.onopen = async () => {
    console.log(`User ${user.id} connected`);
    try {
      await toggleUserOnlineStatus(user.id, true);
    } catch (err) {
      console.error("Failed to set user online:", err);
    }
  };

  // Set user offline when socket disconnects
  socket.onclose = async () => {
    console.log(`User ${user.id} disconnected`);
    try {
      await toggleUserOnlineStatus(user.id, false);
    } catch (err) {
      console.error("Failed to set user offline:", err);
    }
  };

  socket.onerror = async (e: any) => {
    console.error(`WebSocket error for user ${user.id}:`, e);
    // set it offline
    console.log(`User ${user.id} disconnected`);
    try {
      await toggleUserOnlineStatus(user.id, false);
    } catch (err) {
      console.error("Failed to set user offline:", err);
    }
  };

  return response;
});
