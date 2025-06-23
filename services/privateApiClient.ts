// src/services/privateApiClient.ts
import axios from "axios";
import { useAuthStore } from "@/store/authStore"; // Asegúrate de que la ruta sea correcta

const privateApiClient = axios.create({
  baseURL: "http://localhost:8000/api", // Ajusta a la URL de tu API
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Permite enviar cookies con las solicitudes (fundamental para el refresh_token HTTP-Only)
});

/*
  Interceptor de solicitudes para que, antes de cada envío,
  lea el accessToken de tu store de Zustand y lo añada al encabezado Authorization: Bearer <access_token>
*/
privateApiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Variables para gestionar la cola de solicitudes y evitar múltiples refrescos
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Una función de callback para cuando la autenticación falle completamente.
// Esto permite que un componente React (como el AuthProvider) maneje la redirección.
let logoutCallback: (() => void) | null = null;

/**
 * Función para establecer el callback de logout/redirección.
 * Se llamará desde el AuthProvider.
 * @param callback La función a ejecutar para redirigir al usuario al login.
 */
export const setPrivateApiClientLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

// Función para procesar la cola de solicitudes pendientes
const processQueue = (error: unknown | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error); // Rechaza las promesas pendientes con el error
    } else {
      prom.resolve(); // Resuelve las promesas pendientes sin error
    }
  });
  failedQueue = []; // Limpia la cola
};

/**
 * Interceptor de respuesta para manejar el refresco del token de acceso.
 * Si la solicitud falla con un 401 (Unauthorized), intenta refrescar el token.
 */
privateApiClient.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, simplemente la retorna
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();

    // Condición para intentar refrescar:
    // 1. La respuesta tiene un error y su estado es 401 (Unauthorized)
    // 2. La solicitud original no ha sido marcada como reintentada
    // 3. La URL de la solicitud original no es la de refresh token (para evitar un bucle infinito)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/token/refresh" // Usar originalRequest.url directamente
    ) {
      // Marca la solicitud original como reintentada
      originalRequest._retry = true;

      // Si ya estamos refrescando el token, añadimos la solicitud a la cola
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => privateApiClient(originalRequest)) // Una vez refrescado, reintenta la solicitud original
          .catch((err) => Promise.reject(err));
      }
      isRefreshing = true; // Marca que estamos en proceso de refresco

      try {
        // Intenta refrescar el token
        // El refresh_token se envía automáticamente como una HTTP-Only cookie gracias a `withCredentials: true`
        const refreshResponse = await privateApiClient.post("/token/refresh");
        const newAccessToken = refreshResponse.data.access;

        // Actualiza el token en el store de autenticación
        authStore.setTokens(newAccessToken);

        // Actualiza el encabezado Authorization por defecto para futuras solicitudes inmediatas
        privateApiClient.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        processQueue(null); // Procesa la cola de solicitudes pendientes (las reintenta)
        return privateApiClient(originalRequest); // Reintenta la solicitud original que falló
      } catch (refreshError) {
        console.error(
          "Error al refrescar el token, redirigiendo al login:",
          refreshError,
        );
        authStore.clearTokens(); // Limpia los tokens en caso de error de refresco
        processQueue(refreshError); // Procesa la cola de solicitudes pendientes con el error
        // Llama al callback de logout para que el componente React pueda redirigir
        if (logoutCallback) {
          logoutCallback();
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; // Marca que ya no estamos en proceso de refresco
      }
    }
    // Si no es un 401 de expiración o ya se manejó, simplemente propaga el error
    return Promise.reject(error);
  },
);

export default privateApiClient;
