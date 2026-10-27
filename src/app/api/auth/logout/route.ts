import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { errorResponse, successResponse } from "@/lib/api-response";
import { verifyRefreshToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (refreshToken) {
      const payload = await verifyRefreshToken(refreshToken);
      if (payload) {
        const userTokens = await db.refreshToken.findMany({
          where: { userId: payload.userId, revoked: false },
        });

        for (const record of userTokens) {
          if (await bcrypt.compare(refreshToken, record.hashedToken)) {
            await db.refreshToken.update({
              where: { id: record.id },
              data: { revoked: true },
            });
            break;
          }
        }
      }
    }

    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("user_role");

    return successResponse({ message: "Sesión cerrada exitosamente" });
  } catch {
    return errorResponse("Error interno del servidor", 500);
  }
}
