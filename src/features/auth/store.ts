import { create } from "zustand";
import { persist } from "zustand/middleware";
import { E2EE } from "@/utils/e2ee";
import { supabase } from "@/lib/supabase";
import { AuthState } from "./types";
import { authApi } from "./api";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      publicKey: null,
      privateKey: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (passCard: string) => {
        set({ isLoading: true, error: null });
        try {
          const { publicKey, privateKey } = await E2EE.getKeyPairs(passCard);
          const data = await authApi.authenticate(passCard);

          // Update Supabase client session
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });

          if (sessionError) throw sessionError;

          set({
            user: data.user,
            session: data.session,
            publicKey: E2EE.toBase64(publicKey),
            privateKey: E2EE.toBase64(privateKey),
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({
            error: err.message || "Failed to login",
            isLoading: false,
            isAuthenticated: false,
          });
          throw err;
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          session: null,
          publicKey: null,
          privateKey: null,
          isAuthenticated: false,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "addisnet-auth-storage",
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        publicKey: state.publicKey,
        privateKey: state.privateKey,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.session) {
          supabase.auth.setSession({
            access_token: state.session.access_token,
            refresh_token: state.session.refresh_token,
          });
        }
      },
    }
  )
);
