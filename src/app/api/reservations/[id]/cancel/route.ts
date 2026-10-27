import type { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthUser } from "@/lib/auth";
import { canCancelBooking } from "@/lib/booking-rules";
import { db } from "@/lib/db";

type Params = Promise<{ id: string }>;

async function cancelReservation(
  _request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const auth = await getAuthUser();
    if (!auth) return errorResponse("No autorizado", 401);

    const { id } = await params;
    const booking = await db.booking.findUnique({ where: { id } });

    if (!booking) {
      return errorResponse("Reserva no encontrada", 404);
    }

    if (booking.status === "CANCELLED") {
      return errorResponse("Esta reserva ya ha sido cancelada", 400);
    }

    if (booking.userId !== auth.userId && auth.role !== "ADMIN") {
      return errorResponse(
        "No tienes permisos para cancelar esta reserva",
        403,
      );
    }

    if (
      auth.role !== "ADMIN" &&
      !canCancelBooking(booking.startTime, new Date())
    ) {
      return errorResponse(
        "Solo puedes cancelar una reserva con al menos 2 horas de anticipación",
        400,
      );
    }

    const updatedBooking = await db.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: { space: true },
    });

    return successResponse(updatedBooking);
  } catch {
    return errorResponse("Error interno del servidor", 500);
  }
}

export async function PATCH(request: NextRequest, context: { params: Params }) {
  return cancelReservation(request, context);
}

export async function POST(request: NextRequest, context: { params: Params }) {
  return cancelReservation(request, context);
}
