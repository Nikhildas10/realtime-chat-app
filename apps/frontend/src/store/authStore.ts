import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  setAccessToken: (token: string | null) => void;
  setUserId: (id: string | null) => void;
  logout: () => void;
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userId: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setUserId: (id) => set({ userId: id }),
      logout: () => set({ accessToken: null, userId: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);