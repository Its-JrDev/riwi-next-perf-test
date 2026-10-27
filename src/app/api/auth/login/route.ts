import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { createAccessToken, createRefreshToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse("Email y contraseña requeridos", 400);
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return errorResponse("Credenciales inválidas", 401);
    }

    const accessToken = await createAccessToken({
      userId: user.id,
      role: user.role,
    });
    const refreshToken = await createRefreshToken({ userId: user.id });

    // Hashear el refresh token para la base de datos
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.refreshToken.create({
      data: {
        userId: user.id,
        hashedToken: hashedRefreshToken,
        expiresAt,
      },
    });

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    cookieStore.set("user_role", user.role, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return successResponse({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch {
    return errorResponse("Error interno del servidor", 500);
  }
}
