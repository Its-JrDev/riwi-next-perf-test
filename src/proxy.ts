import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

/**
 * Proxy / Route Guard Middleware - CoSpace
 *
 * Control de acceso basado en roles y verificación de sesión con cookies HTTP-Only:
 * - Solicitudes no autenticadas a rutas privadas o admin redirigen a /login
 * - Usuarios autenticados sin rol "ADMIN" no pueden acceder a /admin
 * - Usuarios con sesión activa intentando entrar a /login o /register redirigen a /dashboard
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;
  const fallbackUserRole = request.cookies.get("user_role")?.value || "USER";
  const decodedToken = accessToken
    ? await verifyAccessToken(accessToken)
    : null;
  const userRole = decodedToken?.role || fallbackUserRole;
  const hasValidSession = Boolean(accessToken && decodedToken);

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isPrivateRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/reservations");
  const isAdminRoute = pathname.startsWith("/admin");
  const isPublicCatalogRoute =
    pathname === "/catalogo" || pathname.startsWith("/catalogo/");

  if ((isPrivateRoute || isAdminRoute) && !hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAuthRoute && hasValidSession) {
    const destination = userRole === "ADMIN" ? "/admin" : "/dashboard";
    if (pathname !== destination) {
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  if (isPublicCatalogRoute && userRole === "ADMIN") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Alias para compatibilidad con Next.js middleware runtime
export const middleware = proxy;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/reservations/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
