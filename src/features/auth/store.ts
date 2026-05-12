import { create } from "zustand";
import { persist } from "zustand/middleware";
import { E2EE } from "@/utils/e2ee";
import { supabase } from "@/lib/supabase";
import { AuthState, AuthUser } from "./types";
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
        set({
          user: null,
          session: null,
          publicKey: null,
          privateKey: null,
          isAuthenticated: false,
        });
        await supabase.auth.signOut();
      },

      clearError: () => set({ error: null }),

      updateUser: (updates: Partial<AuthUser>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: "Anstarnet-auth-storage",
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
          }).then(({ error }) => {
            if (error) {
              console.error("Rehydration session error:", error);
              if (error.message.includes("Already Used") || error.message.includes("not found")) {
                useAuthStore.getState().logout();
              }
            }
          });
        }

        // Listen for auth state changes to keep the store in sync
        supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_OUT' || (event === 'USER_UPDATED' && !session)) {
            if (useAuthStore.getState().isAuthenticated) {
              useAuthStore.setState({
                user: null,
                session: null,
                publicKey: null,
                privateKey: null,
                isAuthenticated: false,
              });
            }
          } else if (session) {
            useAuthStore.setState({
              session: {
                access_token: session.access_token,
                refresh_token: session.refresh_token,
                expires_at: session.expires_at || 0,
                token_type: session.token_type,
              },
              isAuthenticated: true,
            });
            console.log("Auth state change event:", event);
          }
        });
      },
    }
  )
);
