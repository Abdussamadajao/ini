import { zustandStorage } from "@/lib/store-manager";
import { User } from "@/types/index";
import { Session } from "better-auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { authClient } from "./../lib/auth-client";

const STORAGE_KEY = "trust_market_auth" as const;

export interface AuthState {
  user: User | null;
  session: Session | null;
  hasSession: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isHydrating: boolean;
  unverifiedEmail: string | null;
  resetPasswordEmail: string | null;
}

export interface AuthActions {
  hydrate: () => Promise<void>;
  setUser: (payload: { user: Partial<User>; session: Session }) => void;
  setUnverifiedEmail: (email: string | null) => void;
  setResetPasswordEmail: (email: string | null) => void;
  patchUser: (fields: Partial<User>) => Promise<boolean>;
  logout: () => Promise<void>;
}

function deriveFlags(user: User | null, session: Session | null) {
  return {
    hasSession: Boolean(session),
    isAuthenticated: Boolean(session && user?.emailVerified),
  };
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      hasSession: false,
      isAuthenticated: false,
      isHydrated: false,
      isHydrating: false,
      unverifiedEmail: null,
      resetPasswordEmail: null,

      hydrate: async () => {
        set({ isHydrating: true, isHydrated: false });
        try {
          let data, error;
          for (let attempt = 0; attempt < 3; attempt++) {
            ({ data, error } = await authClient.getSession());
            if (data?.session) break;
            await new Promise((r) => setTimeout(r, 200));
          }
          if (error) throw error;
          if (data?.user && data?.session) {
            const mergedUser = { ...get().user, ...data.user } as User;
            set({
              user: mergedUser,
              session: data.session,
              unverifiedEmail: null,
              ...deriveFlags(mergedUser, data.session),
            });
          } else {
            set({
              user: null,
              session: null,
              hasSession: false,
              isAuthenticated: false,
            });
          }
        } catch {
          set({
            user: null,
            session: null,
            hasSession: false,
            isAuthenticated: false,
          });
        } finally {
          set({ isHydrating: false, isHydrated: true });
        }
      },

      setUser: ({ user, session }) =>
        set({
          user: { ...get().user, ...user } as User,
          session: session ?? get().session,
          unverifiedEmail: null,
          ...deriveFlags(
            { ...get().user, ...user } as User,
            session ?? get().session,
          ),
        }),

      setUnverifiedEmail: (email) => set({ unverifiedEmail: email }),

      setResetPasswordEmail: (email) => set({ resetPasswordEmail: email }),

      patchUser: async (fields) => {
        const { session, user } = get();
        if (!session) return false;
        const { error } = await authClient.updateUser(fields);
        if (error) return false;
        // updateUser only reports { status }, it doesn't return the
        // updated user, so merge the patched fields into local state.
        const mergedUser = { ...user, ...fields } as User;
        set({ user: mergedUser, ...deriveFlags(mergedUser, session) });
        return true;
      },

      logout: async () => {
        set({
          user: null,
          session: null,
          hasSession: false,
          isAuthenticated: false,
          unverifiedEmail: null,
          resetPasswordEmail: null,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        hasSession: state.hasSession,
        isAuthenticated: state.isAuthenticated,
        unverifiedEmail: state.unverifiedEmail,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          zustandStorage.removeItem(STORAGE_KEY);
          useAuthStore.setState({
            user: null,
            session: null,
            hasSession: false,
            isAuthenticated: false,
            isHydrating: false,
          });
        } else {
          const { user, session } = useAuthStore.getState();
          useAuthStore.setState(deriveFlags(user, session));
        }
      },
    },
  ),
);

export const useUser = () => useAuthStore((s) => s.user);
export const useSession = () => useAuthStore((s) => s.session);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useHasSession = () => useAuthStore((s) => s.hasSession);
export const useIsHydrated = () => useAuthStore((s) => s.isHydrated);
export const useUnverifiedEmail = () => useAuthStore((s) => s.unverifiedEmail);

export { authClient };
