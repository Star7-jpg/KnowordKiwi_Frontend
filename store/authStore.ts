// Este store será utilizado para manejar la autenticación de los usuarios
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import privateApiClient from "@/services/privateApiClient";

type AuthState = {
  accessToken: string | null;
  user: Record<string, string> | null;
  isAuthenticated: boolean;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: Record<string, string>) => void;
  clearTokens: () => void; // Para cerrar sesión y limpiar los tokens
  initializeAuth: () => Promise<void>; // Acción para la lógica de carga inicial/refresco
  loginUser: (accessToken: string) => void; // Acción para cuando el usuario inicia sesión por primera vez
  logoutUser: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    accessToken: null,
    user: null,
    isAuthenticated: false,

    /**
     * Establece el token de acceso en el store y actualiza el estado de autenticación.
     * @param accessToken El token de acceso.
     */
    setAccessToken: (accessToken) => {
      set({ accessToken, isAuthenticated: !!accessToken });
      if (accessToken) {
        sessionStorage.setItem("accessToken", accessToken);
      } else {
        sessionStorage.removeItem("accessToken");
      }
    },

    /**
     * Establece la información del usuario en el store.
     * @param user Un objeto con la información del usuario autenticado.
     */
    setUser: (user) => {
      set({ user });
    },

    /**
     * Limpia todos los tokens y la información del usuario en el store.
     * Esto se usa para cerrar sesión o cuando el token de refresco falla.
     */
    clearTokens: () => {
      set({ accessToken: null, user: null, isAuthenticated: false });
      sessionStorage.removeItem("accessToken");
      // El refresh_token se gestiona en una cookie HTTP-Only por el backend,
      // así que no lo borramos aquí directamente. El logout del backend se encargará.
    },

    /**
     * Acción para iniciar sesión del usuario después de obtener el accessToken del login.
     * @param accessToken El token de acceso recibido del endpoint de login.
     */
    loginUser: (accessToken: string) => {
      get().setAccessToken(accessToken);
    },

    /**
     * Acción para inicializar la autenticación al cargar la aplicación.
     * Intenta refrescar el token de acceso utilizando el refresh_token de la cookie.
     */
    initializeAuth: async () => {
      const { setAccessToken, clearTokens } = get();

      const tokenFromSession = sessionStorage.getItem("accessToken");
      if (tokenFromSession) {
        setAccessToken(tokenFromSession);
        return;
      }

      try {
        // Esta llamada usará automáticamente la cookie refresh_token si está presente y es válida
        // en el navegador para el dominio de tu API.
        const response = await privateApiClient.post(
          "http://localhost:8000/api/token/refresh/",
        );
        const newAccessToken = response.data.access;
        setAccessToken(newAccessToken);
        console.log("Sesión refrescada con éxito al inicio.");
      } catch (error: any) {
        if (error.response?.status || error.response?.status === 401) {
          console.log("Refresh token inválido o expirado");
        } else {
          console.error("Error inesperado al refrescar la sesión:", error);
        }
        clearTokens(); // Limpia los tokens si el refresh falla (refresh_token inválido/expirado)
      }
    },
    /**
     * Cierra la sesión del usuario, limpiando los tokens y redirigiendo si es necesario.
     */
    logoutUser: () => {
      get().clearTokens();
    },
  })),
);
