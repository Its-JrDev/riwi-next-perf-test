import type { AuthResponse, LoginInput, RegisterInput, User } from "../types";

const BASE_URL = "/api/auth";

export const authService = {
  /**
   * Inicia sesión con credenciales y guarda las cookies HTTP-Only de sesión.
   */
  async login(credentials: LoginInput): Promise<User> {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const result: AuthResponse<User> = await response.json();
    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.error || "Error al iniciar sesión");
    }
    return result.data;
  },

  /**
   * Registra un nuevo usuario público.
   */
  async register(data: RegisterInput): Promise<User> {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result: AuthResponse<User> = await response.json();
    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.error || "Error al registrar usuario");
    }
    return result.data;
  },

  /**
   * Obtiene el usuario autenticado actual desde la sesión guardada en cookies.
   */
  async me(): Promise<User | null> {
    const response = await fetch(`${BASE_URL}/me`, {
      method: "GET",
      cache: "no-store",
    });

    if (response.status === 401) {
      return null;
    }

    const result: AuthResponse<User> = await response.json();
    if (!response.ok || !result.success || !result.data) {
      return null;
    }

    return result.data;
  },

  /**
   * Cierra la sesión activa y revoca el token de refresco.
   */
  async logout(): Promise<void> {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
    });

    const result: AuthResponse = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Error al cerrar sesión");
    }
  },

  /**
   * Renueva el access_token usando la cookie del refresh_token.
   */
  async refresh(): Promise<void> {
    const response = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
    });

    const result: AuthResponse = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Error al renovar la sesión");
    }
  },
};
