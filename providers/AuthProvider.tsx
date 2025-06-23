"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { setPrivateApiClientLogoutCallback } from "@/services/privateApiClient";

interface AuthProviderProps {
  children: React.ReactNode;
}

const protectedRoutes = ["/profile", "/settings"];
const publicOnlyRoutes = [
  "/login",
  "/register",
  "/reset-password",
  "/verify-account",
];

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const clearTokens = useAuthStore((state) => state.clearTokens);

  // Esto previene mostrar páginas protegidas antes de saber si el usuario está autenticado o no.
  const [loadingAuth, setLoadingAuth] = useState(true);

  /**
   * Estos dos hooks ayudan a:
   * - saber en qué ruta estás (pathname),
   * - redirigir a otra ruta (router.replace("/login")).
   */
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Esto se ejecuta si:
   * - El token expiró o falló la autenticación.
   * - Limpia los tokens del store.
   * - Redirige a /login, solo si no estás ya en una ruta pública.
   */
  const redirectToLogin = useCallback(() => {
    console.log("Redirigiendo a /login debido a falla de autenticación.");
    clearTokens();
    if (!publicOnlyRoutes.includes(pathname)) {
      router.replace("/login"); // Usa replace para no guardar la página protegida en el historial
    }
  }, [clearTokens, router, pathname]);

  /**
   * Este efecto hace que si cualquier parte del código detecta un error de autenticación
   * (por ejemplo, un 401 Unauthorized), ejecute redirectToLogin.
   * También incluye una función de limpieza para evitar fugas de memoria.
   */
  useEffect(() => {
    setPrivateApiClientLogoutCallback(redirectToLogin);
    return () => {
      setPrivateApiClientLogoutCallback(() => {});
    };
  }, [redirectToLogin]); // Se ejecuta solo si redirectToLogin cambia (que no debería si es useCallback)

  /**
   * Este efecto se ejecuta una sola vez cuando cargas la app.
   * Si el usuario no está autenticado, intenta leer los tokens del almacenamiento y validar sesión (initializeAuth).
   * Cuando termina, pone loadingAuth en false.
   */
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!isAuthenticated && loadingAuth) {
        if (!publicOnlyRoutes.includes(pathname)) {
          await initializeAuth();
        }
      }
      setLoadingAuth(false);
    };

    checkAuthStatus();
  }, [isAuthenticated, initializeAuth, loadingAuth, pathname]);

  /**
   * Este efecto reacciona cuando cambia la ruta o el estado de autenticación.
    Si: 
    Ya terminó la carga de la sesión (!loadingAuth)
    El usuario no está autenticado (!isAuthenticated)
    La ruta actual es protegida (protectedRoutes.includes(pathname))
    Y no es una pública (!publicOnlyRoutes.includes(pathname))
    👉 Entonces redirige al login.
   */
  useEffect(() => {
    if (
      !loadingAuth &&
      !isAuthenticated &&
      protectedRoutes.includes(pathname)
    ) {
      redirectToLogin();
    }
  }, [isAuthenticated, loadingAuth, pathname, redirectToLogin]);

  // Esto previene que el usuario vea por un segundo una página protegida antes de ser redirigido.
  if (loadingAuth && protectedRoutes.includes(pathname)) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f0f0f0",
        }}
      >
        <p style={{ fontSize: "1.2rem", color: "#333" }}>Cargando sesión...</p>
      </div>
    );
  }

  // Renderiza los hijos si la autenticación ha terminado o si la ruta no es protegida
  return <>{children}</>;
};

export default AuthProvider;
