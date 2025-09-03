import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AuthState = {
  isAuthenticated: boolean;
  accessToken: string;
  setAccessToken: (token: string) => void;
};

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    isAuthenticated: false,

    setAccessToken: (token: string) => {
      set({ accessToken: token, isAuthenticated: true });
    },
  })),
);
