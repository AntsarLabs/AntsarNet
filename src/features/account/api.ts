import { supabase } from "@/lib/supabase";
import { AuthUser } from "@/features/auth/types";

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
};
