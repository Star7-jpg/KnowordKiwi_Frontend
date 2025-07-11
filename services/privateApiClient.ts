// src/services/privateApiClient.ts
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const privateApiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Fundamental para que se envíen cookies en cada request
});

// Variables para controlar refresh y cola de solicitudes
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

let logoutCallback: (() => void) | null = null;
export const setPrivateApiClientLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

const processQueue = (error: unknown | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

// Interceptor de respuesta
privateApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/token/refresh"
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => privateApiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        await privateApiClient.post(
          "/token/refresh",
          {},
          { withCredentials: true },
        );
        processQueue(null);
        return privateApiClient(originalRequest); // Reintenta la solicitud original
      } catch (refreshError) {
        console.error("Refresh token falló:", refreshError);
        authStore.clearSession?.(); // Limpia usuario si está disponible
        processQueue(refreshError);
        if (logoutCallback) logoutCallback();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default privateApiClient;
