import { supabase } from "@/lib/supabase";
import { AuthUser } from "@/features/auth/types";
import { AccountUser } from "./types";

export const accountApi = {
  async updateProfile(updates: { bio?: string; username?: string; emoji?: string }): Promise<AuthUser> {
    const { data, error } = await supabase.functions.invoke('auth/me', {
      method: 'PUT',
      body: updates,
    });

    if (error) {
      let message = error.message;
      try {
        const errorData = await error.context.json();
        message = errorData.details || errorData.error || errorData.message || message;
      } catch (e) {
        // Fallback to default error message if parsing fails
      }
      throw new Error(message);
    }

    return data;
  },

  async getBlockedUsers(userId: string, page: number = 0, limit: number = 10): Promise<Pick<AccountUser, 'id' | 'username' | 'emoji'>[]> {
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('user_blocks')
      .select(`
        blocked_id,
        users!blocked_id (
          id,
          username,
          emoji
        )
      `)
      .eq('user_id', userId)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blocked users:', error);
      throw error;
    }

    return (data || []).map((row: any) => ({
      id: row.blocked_id,
      username: row.users?.username || row.blocked_id.substring(0, 8),
      emoji: row.users?.emoji || '👤'
    }));
  },

  async toggleBlocking(userId: string, blockedId: string) {
    const { data, error } = await supabase
      .from('user_blocks')
      .select('*')
      .eq('user_id', userId)
      .eq('blocked_id', blockedId)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      await supabase
        .from('user_blocks')
        .delete()
        .eq('user_id', userId)
        .eq('blocked_id', blockedId);
    } else {
      await supabase
        .from('user_blocks')
        .insert({ user_id: userId, blocked_id: blockedId });
    }
  }
};
