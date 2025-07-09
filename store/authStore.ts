// Este store será utilizado para manejar la autenticación de los usuarios
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import privateApiClient from "@/services/privateApiClient";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: Partial<User> | null) => void;
  clearTokens: () => void; // Para cerrar sesión y limpiar los tokens
  initializeAuth: () => Promise<void>; // Acción para la lógica de carga inicial/refresco
  loginUser: (accessToken: string) => void; // Acción para cuando el usuario inicia sesión por primera vez
  logoutUser: () => void;
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
     * Si se pasa un objeto parcial, se fusionará con el usuario existente.
     * Si se pasa null, se borrará el usuario.
     * @param user Un objeto parcial o completo con la información del usuario.
     */
    setUser: (user) =>
      set((state) => {
        const newUser = user ? { ...state.user, ...user } : null;
        if (newUser) {
          sessionStorage.setItem("user", JSON.stringify(newUser));
        } else {
          sessionStorage.removeItem("user");
        }
        return { user: newUser as User | null };
      }),

    /**
     * Limpia todos los tokens y la información del usuario en el store.
     * Esto se usa para cerrar sesión o cuando el token de refresco falla.
     */
    clearTokens: () => {
      set({ accessToken: null, user: null, isAuthenticated: false });
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
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
      const { setAccessToken, clearTokens, setUser } = get();

      const tokenFromSession = sessionStorage.getItem("accessToken");
      const userFromSession = sessionStorage.getItem("user");
      if (tokenFromSession) {
        setAccessToken(tokenFromSession);
        if (userFromSession) {
          try {
            setUser(JSON.parse(userFromSession));
          } catch (error: unknown) {
            console.log("Error al parsear el usuario de la sesión:", error);
            sessionStorage.removeItem("user");
          }
        }
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
