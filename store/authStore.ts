import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AuthState = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  getAuthStatus: () => boolean;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    isAuthenticated: false,
    //Setear en localStorage un flag para marcar isAutenticated como true
    setIsAuthenticated: (isAuthenticated: boolean) => {
      sessionStorage.setItem(
        "isAuthenticated",
        JSON.stringify(isAuthenticated),
      );
      set({ isAuthenticated });
    },

    getAuthStatus: () => {
      const isAuthenticated = sessionStorage.getItem("isAuthenticated");
      return isAuthenticated ? JSON.parse(isAuthenticated) : false;
    },
  })),
);
