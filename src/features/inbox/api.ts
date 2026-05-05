import { supabase } from "@/lib/supabase";
import { E2EE } from "@/utils/e2ee";

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
  },

  async sendMessageToInbox(title: string, message: string, inboxId: string): Promise<boolean> {
    const { data: userData, error: userError } = await supabase
      .from('inbox_key_lookup')
      .select('public_key')
      .eq('inbox_id', inboxId)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    // create shared key between inbox owner pub key and the sender's temp pub key
    const publicKey = E2EE.toUint8Array(userData?.public_key);
    const tempoPassCard = await E2EE.generatePassCard();
    const tempoKeyPairs = await E2EE.getKeyPairs(tempoPassCard);
    const sharedKey = E2EE.generateSharedKey(publicKey, tempoKeyPairs.privateKey);

    // encrypt the message and title with the shared key use same nonce for both
    const nonce = E2EE.generateNonce()
    const messageEncypted = E2EE.encryptMsg(message, sharedKey, nonce);
    const titleEncrypted = E2EE.encryptMsg(title, sharedKey, nonce);

    const { error } = await supabase
      .from('inbox')
      .insert({
        inbox_id: inboxId,
        public_key: E2EE.toBase64(tempoKeyPairs.publicKey),
        title: E2EE.toBase64(titleEncrypted.message),
        message: E2EE.toBase64(messageEncypted.message),
        nonce: E2EE.toBase64(nonce)
      });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  },

  //fetch by pagination order by desc
  async fetchInboxMessages(
    userId: string,
    privateKey: string,
    page: number = 0,
    limit: number = 10
  ): Promise<{
    data: Array<{ id: string; title: string; message: string; public_key: string; is_read: boolean; created_at: string }>;
    error: Error | null;
  }> {
    const offset = page * limit;

    const { data, error } = await supabase
      .from('inbox')
      .select('id, title, message, nonce, is_read, public_key, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const results = data?.map((msg) => {
      const sharedKey = E2EE.generateSharedKey(E2EE.toUint8Array(msg.public_key), E2EE.toUint8Array(privateKey));
      const title = E2EE.decryptMsg(E2EE.toUint8Array(msg.title), sharedKey, E2EE.toUint8Array(msg.nonce));
      const message = E2EE.decryptMsg(E2EE.toUint8Array(msg.message), sharedKey, E2EE.toUint8Array(msg.nonce));
      return {
        id: msg.id,
        title,
        message,
        is_read: msg.is_read,
        created_at: msg.created_at,
      };
    });

    if (error) {
      return { data: [], error };
    }

    return { data: results as Array<{ id: string; title: string; message: string; public_key: string; is_read: boolean; created_at: string }>, error: null };
  },

  async markMessageAsRead(messageId: string): Promise<boolean> {
    const { error } = await supabase
      .from('inbox')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  },



  async deleteInboxMessage(messageId: string): Promise<boolean> {
    const { error } = await supabase
      .from('inbox')
      .delete()
      .eq('id', messageId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  },
};