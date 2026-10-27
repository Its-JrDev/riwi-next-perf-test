"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { authService } from "../services/auth.service";
import type { LoginInput, RegisterInput, User } from "../types";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = await authService.me();
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (credentials: LoginInput) => {
      setLoading(true);
      setError(null);
      try {
        const loggedUser = await authService.login(credentials);
        setUser(loggedUser);

        if (loggedUser.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
        return loggedUser;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al iniciar sesión";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const register = useCallback(
    async (data: RegisterInput) => {
      setLoading(true);
      setError(null);
      try {
        await authService.register(data);
        const loggedUser = await authService.login({
          email: data.email,
          password: data.password,
        });

        setUser(loggedUser);

        if (loggedUser.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();

        return loggedUser;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al registrarse";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cerrar sesión";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser,
  };
}
