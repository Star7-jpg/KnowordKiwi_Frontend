// Este store será utilizado para manejar la autenticación de los usuarios
import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  user: Record<string, string> | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string) => void;
  clearTokens: () => void; // Para cerrar sesión y limpiar los tokens
  refreshAccessToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setTokens: (accessToken) => {
    set({ accessToken, isAuthenticated: true });
  },

  clearTokens: () => {
    set({ accessToken: null, user: null, isAuthenticated: false });
  },

  refreshAccessToken: async () => {
    // Aquí puedes implementar la lógica para refrescar el token de acceso
    // Por ejemplo, haciendo una llamada a tu API para obtener un nuevo token
    // y luego actualizando el estado con el nuevo token.
  },
}));
