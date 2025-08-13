"use client";

import { useEffect, useState, useCallback, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { setPrivateApiClientLogoutCallback } from "@/services/privateApiClient";

// --- Definición de Rutas ---

// Rutas que requieren que el usuario esté autenticado.
const protectedRoutes = ["/profile", "/settings"];
// Rutas a las que un usuario autenticado no debería acceder (será redirigido).
const publicOnlyRoutes = [
  "/login",
  "/register",
  "/reset-password",
  "/verify-account",
];
// Ruta a la que redirigir si un usuario autenticado visita una publicOnlyRoute.
const defaultRedirect = "/profile/me/";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  // Obtenemos el estado y las acciones del store de Zustand.
  const { isAuthenticated, initializeAuth, clearSession } = useAuthStore();
  // Estado para saber si la verificación inicial de la sesión ha terminado.
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  // --- Callback de Logout Global ---
  // Esta función se llamará desde `privateApiClient` si el refresh token falla.
  const handleLogoutAndRedirect = useCallback(() => {
    console.log("Sesión inválida. Redirigiendo al login...");
    clearSession();
    // Solo redirige si no estamos ya en una página pública para evitar bucles.
    if (!publicOnlyRoutes.includes(pathname)) {
      router.replace("/login");
    }
  }, [clearSession, router, pathname]);

  // --- Configuración del API Client ---
  // Conecta el callback de logout con el interceptor de Axios en el primer render.
  useEffect(() => {
    setPrivateApiClientLogoutCallback(handleLogoutAndRedirect);
    return () => {
      setPrivateApiClientLogoutCallback(() => {}); // Limpieza al desmontar.
    };
  }, [handleLogoutAndRedirect]);

  // --- Verificación Inicial de Sesión ---
  // Se ejecuta solo una vez al cargar la app para restaurar la sesión.
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Intenta inicializar la sesión (usando la cookie de refresh).
        await initializeAuth();
      } catch (error) {
        console.error("Fallo en la inicialización de la autenticación", error);
      } finally {
        // Una vez verificado (con éxito o no), dejamos de mostrar el estado de carga.
        setLoading(false);
      }
    };
    checkAuth();
  }, [initializeAuth]); // El array vacío asegura que se ejecute solo una vez.

  // --- Lógica de Redirección ---
  // Este es el núcleo de la protección. Se ejecuta cuando cambia la ruta o el estado de auth.
  useEffect(() => {
    // No hacemos nada mientras se verifica la sesión.
    if (loading) return;

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route),
    );
    const isPublicOnlyRoute = publicOnlyRoutes.includes(pathname);

    // Caso 1: Usuario NO autenticado intenta acceder a una ruta protegida.
    if (!isAuthenticated && isProtectedRoute) {
      router.replace("/login");
    }

    // Caso 2 (Nuevo): Usuario SÍ autenticado intenta acceder a una ruta solo para públicos.
    if (isAuthenticated && isPublicOnlyRoute) {
      router.replace(defaultRedirect);
    }
  }, [loading, isAuthenticated, pathname, router]);

  // --- UI de Carga ---
  // Muestra un loader en rutas protegidas mientras se verifica la sesión.
  // Esto evita el "parpadeo" del contenido protegido antes de la redirección.
  if (loading && protectedRoutes.includes(pathname)) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Verificando sesión...</p>
      </div>
    );
  }

  // Si no hay redirección pendiente y la carga ha finalizado, muestra el contenido.
  return children;
};

export default AuthProvider;
