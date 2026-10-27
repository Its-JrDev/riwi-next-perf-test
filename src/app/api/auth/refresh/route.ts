import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { errorResponse, successResponse } from "@/lib/api-response";
import { createAccessToken, verifyRefreshToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return errorResponse("No hay sesión activa", 401);
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return errorResponse("Token de refresco inválido o expirado", 401);
    }

    const userTokens = await db.refreshToken.findMany({
      where: { userId: payload.userId, revoked: false },
      include: { user: true },
    });

    let validTokenRecord = null;
    for (const record of userTokens) {
      if (await bcrypt.compare(refreshToken, record.hashedToken)) {
        validTokenRecord = record;
        break;
      }
    }

    if (!validTokenRecord || validTokenRecord.expiresAt < new Date()) {
      return errorResponse("Token de refresco revocado o expirado", 401);
    }

    const newAccessToken = await createAccessToken({
      userId: validTokenRecord.user.id,
      role: validTokenRecord.user.role,
    });

    cookieStore.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    cookieStore.set("user_role", validTokenRecord.user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return successResponse({ message: "Token renovado exitosamente" });
  } catch {
    return errorResponse("Error interno del servidor", 500);
  }
}
