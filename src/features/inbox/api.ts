import { supabase } from "@/lib/supabase";

export const inboxApi = {
  async generateNewInboxId(userId: string): Promise<string> {
    const newInboxId = crypto.randomUUID();

    const { data, error } = await supabase
      .from('users')
      .update({ inbox_id: newInboxId })
      .eq('id', userId)
      .select('inbox_id')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data.inbox_id;
  }
};