import { cookies } from "next/headers";
import { errorResponse, successResponse } from "@/lib/api-response";
import { verifyAccessToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return errorResponse("No autenticado", 401);
    }

    const payload = await verifyAccessToken(accessToken);

    if (!payload?.userId) {
      return errorResponse("Sesión inválida o expirada", 401);
    }

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return errorResponse("Usuario no encontrado", 401);
    }

    return successResponse(user, 200);
  } catch {
    return errorResponse("Error interno del servidor", 500);
  }
}
