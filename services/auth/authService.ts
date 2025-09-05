import publicApiClient from "../client/publicApiClient";
import { useAuthStore } from "@/store/authStore";
import { z } from "zod";
import { loginSchema } from "@/app/(auth)/schemas";
import privateApiClient from "../client/privateApiClient";

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
    // Logout es una acción autenticada. Usamos privateApiClient para asegurar que
    // las cookies correctas se envíen y el backend sepa qué sesión invalidar.
    // El backend se encargará de limpiar las cookies HttpOnly.
    await privateApiClient.post("/auth/logout");
  } catch (error) {
    // Incluso si la llamada a la API falla (ej. error de red), debemos
    // asegurarnos de que el usuario se desloguee en el lado del cliente.
    console.error(
      "Backend logout failed, proceeding with client-side logout:",
      error,
    );
  } finally {
    // Este bloque se ejecuta independientemente de si el try tuvo éxito o falló.
    // Limpia el estado de autenticación en Zustand.
    useAuthStore.getState().clearAuth();

    // Limpiamos manualmente la cookie de access-token del cliente.
    // Esto es una buena práctica para una limpieza completa.
    document.cookie =
      "access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
  }
};

// Otros servicios de autenticación como register, forgotPassword, etc. irían aquí.
