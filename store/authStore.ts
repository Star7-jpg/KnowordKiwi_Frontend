import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AuthState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    isAuthenticated: false,
    accessToken: null,

    setAccessToken: (token: string | null) => {
      set({ accessToken: token, isAuthenticated: !!token });
    },

    clearAuth: () => {
      set({ accessToken: null, isAuthenticated: false });
    },
  })),
);
