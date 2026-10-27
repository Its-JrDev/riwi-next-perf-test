import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return errorResponse("No autorizado", 401);
    if (auth.role !== "ADMIN") return errorResponse("Acceso denegado", 403);

    const reservations = await db.booking.findMany({
      orderBy: { startTime: "desc" },
      include: {
        space: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return successResponse(reservations);
  } catch {
    return errorResponse("Error interno del servidor", 500);
  }
}
