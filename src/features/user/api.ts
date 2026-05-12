import { supabase } from "@/lib/supabase";
import { User } from "./types";

export const userApi = {
    /**
     * Retrieves a paginated list of users from the public_users view/table.
     * Supports filtering by username and online status.
     */
    async getUsers(
        options: {
            page?: number;
            limit?: number;
            username?: string;
        } = {}
    ): Promise<User[]> {

        const { page = 0, limit = 100, username } = options;

        const from = page * limit;
        const to = from + limit - 1;

        const currentUserId = (
            await supabase.auth.getUser()
        ).data.user?.id;

        let query = supabase
            .from('public_users')
            .select(`
      id,
      username,
      emoji,
      bio,
      is_online,
      created_at,
      updated_at,

      sent_chats:chats!sender_id(
        id,
        receiver_id,
        status
      ),

      received_chats:chats!receiver_id(
        id,
        sender_id,
        status
      )
    `)
            .neq('id', currentUserId)
            .order('updated_at', { ascending: false })
            .range(from, to);

        if (username) {
            query = query.ilike('username', `%${username}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error(error);
            throw new Error(error.message);
        }

        return data || [];
    },

    /**
     * Retrieves a specific user from the public_users view by their username.
     */
    async getUserByUsername(username?: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('public_users')
            .select('*')
            .eq('username', username)
            .single();

        if (error) {
            console.error(`Error fetching user ${username}:`, error);
            throw new Error(error.message);
        }

        return data;
    },

    /**
     * Retrieves the total number of online users from the public_users view.
     */
    async getTotalOnlineUsers(): Promise<number> {
        const { count, error } = await supabase
            .from('public_users')
            .select('*', { count: 'exact', head: true })
            .eq('is_online', true);

        if (error) {
            console.error('Error fetching total online users:', error);
            throw new Error(error.message);
        }

        return count || 0;
    }
};
