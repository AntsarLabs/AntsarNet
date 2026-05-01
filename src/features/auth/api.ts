import { supabase } from "@/lib/supabase";
import { E2EE } from "@/utils/e2ee";
import { AuthMessageResponse, AuthResponse } from "./types";

export const authApi = {
  async getAuthMessage(): Promise<AuthMessageResponse> {
    const { data, error } = await supabase.functions.invoke('auth/message', {
      method: 'GET',
    });

    if (error) throw new Error(error.message || "Failed to get auth message");
    return data;
  },

  async authenticate(passCard: string): Promise<AuthResponse> {
    const { publicKey, privateKey } = await E2EE.getKeyPairs(passCard);
    const { key: systemPublicKey, message, hash, exp_time } = await this.getAuthMessage();

    const sharedKey = E2EE.generateSharedKey(E2EE.toUint8Array(systemPublicKey), privateKey);
    const nonce = E2EE.generateNonce();
    const encryptedSignature = E2EE.encryptMsg(message, sharedKey, nonce);

    const { data, error } = await supabase.functions.invoke('auth', {
      method: 'POST',
      body: {
        hash,
        message,
        exp_time,
        signature: E2EE.toBase64(encryptedSignature.message),
        key: E2EE.toBase64(publicKey),
        nonce: E2EE.toBase64(nonce),
      },
    });

    if (error) {
      throw new Error(error.message || "Authentication failed");
    }

    return data;
  },
};
