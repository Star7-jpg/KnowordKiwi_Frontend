import publicApiClient from "../publicApiClient";
import { useAuthStore } from "@/store/authStore";
import { z } from "zod";
import { loginSchema } from "@/app/(auth)/schemas";

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Realiza la llamada a la API de login.
 * No maneja cambios de estado ni captura errores. Simplemente realiza la petición.
 * Si la petición es exitosa, la promesa se resuelve.
 * Si la petición falla, la promesa se rechaza, y el error debe ser capturado por quien llama a la función.
 */
export const login = async (credentials: LoginFormData) => {
  // El `await` se resolverá en caso de éxito o lanzará un error en caso de fallo.
  // Este error será capturado en el bloque catch del componente.
  await publicApiClient.post("/auth/login", credentials);
};

export const logout = async () => {
  try {
    // Podemos usar un cliente protegido aquí si lo tenemos, o el público está bien.
    await publicApiClient.post("/auth/logout");
  } catch (error) {
    // Registra el error pero no impidas el logout del lado del cliente.
    console.error("Logout API call failed:", error);
  } finally {
    // Limpia el estado de autenticación en Zustand.
    useAuthStore.getState().clearAuth();

    // Limpia las cookies estableciendo su fecha de expiración en el pasado.
    // Asegúrate de que la ruta sea '/' para que se limpien globalmente.
    document.cookie =
      "access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    document.cookie =
      "refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
  }
};

// Otros servicios de autenticación como register, forgotPassword, etc. irían aquí.
