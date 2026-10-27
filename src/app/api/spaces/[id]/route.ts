import type { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = Promise<{ id: string }>;

// PATCH: Editar o Desactivar espacio (Solo ADMIN)[cite: 2, 3]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const auth = await getAuthUser();
    if (!auth) return errorResponse("No autorizado", 401);
    if (auth.role !== "ADMIN") return errorResponse("Acceso denegado", 403);

    const { id } = await params;
    const body = await request.json();

    const existingSpace = await db.space.findUnique({ where: { id } });
    if (!existingSpace) return errorResponse("Espacio no encontrado", 404);

    // Regla de negocio 13: No desactivar si tiene reservas futuras confirmadas[cite: 3]
    if (body.isActive === false) {
      const futureBookings = await db.booking.count({
        where: {
          spaceId: id,
          status: "CONFIRMED",
          startTime: { gte: new Date() },
        },
      });

      if (futureBookings > 0) {
        return errorResponse(
          "No se puede desactivar un espacio con reservas futuras confirmadas",
          409,
        );
      }
    }

    const updatedSpace = await db.space.update({
      where: { id },
      data: body,
    });

    return successResponse(updatedSpace);
  } catch {
    return errorResponse("Error interno del servidor", 500);
  }
}
