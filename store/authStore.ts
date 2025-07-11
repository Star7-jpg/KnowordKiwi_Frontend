import { create } from "zustand";
import { devtools } from "zustand/middleware";
import privateApiClient from "@/services/privateApiClient";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: Partial<User> | null) => void;
  clearSession: () => void;
  initializeAuth: () => Promise<void>;
  loginUser: (user: User) => void;
  logoutUser: () => Promise<void>;
};

type User = {
  id: string;
  email: string;
  username: string;
  real_name: string;
  avatar_url: string;
  bio: string;
  is_active: boolean;
  groups: string[];
};

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    isAuthenticated: false,

    /**
     * Establece la información del usuario y la guarda en sessionStorage.
     */
    setUser: (user) =>
      set((state) => {
        const newUser = user ? { ...state.user, ...user } : null;
        if (newUser) {
          sessionStorage.setItem("user", JSON.stringify(newUser));
        } else {
          sessionStorage.removeItem("user");
        }
        return {
          user: newUser as User | null,
          isAuthenticated: !!newUser,
        };
      }),

    /**
     * Limpia el estado de autenticación y sessionStorage.
     */
    clearSession: () => {
      sessionStorage.removeItem("user");
      set({ user: null, isAuthenticated: false });
    },

    /**
     * Inicializa la sesión al cargar la app:
     * - Intenta refrescar el access token mediante cookie.
     * - Restaura el usuario desde sessionStorage si está disponible.
     */
    initializeAuth: async () => {
      const userFromSession = sessionStorage.getItem("user");

      if (userFromSession) {
        try {
          const user = JSON.parse(userFromSession);
          set({ user, isAuthenticated: true });
          return;
        } catch (error) {
          console.warn("No se pudo parsear el usuario guardado:", error);
          sessionStorage.removeItem("user");
        }
      }

      try {
        await privateApiClient.post(
          "http://localhost:8000/api/token/refresh/",
          {},
        );
        console.log("Sesión restaurada con token refresh.");
        // Nota: aquí podrías volver a setear el usuario si fuera necesario.
      } catch (error) {
        console.warn("Error al refrescar sesión con cookie:", error);
        sessionStorage.removeItem("user");
        set({ user: null, isAuthenticated: false });
      }
    },

    /**
     * Guarda el usuario tras iniciar sesión (ya viene en la respuesta del backend).
     */
    loginUser: (user: User) => {
      sessionStorage.setItem("user", JSON.stringify(user));
      set({ user, isAuthenticated: true });
    },

    /**
     * Cierra la sesión llamando al backend y limpiando el estado.
     */
    logoutUser: async () => {
      try {
        await privateApiClient.post(
          "http://localhost:8000/api/logout/",
          {},
          { withCredentials: true },
        );
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
      sessionStorage.removeItem("user");
      set({ user: null, isAuthenticated: false });
    },
  })),
);
