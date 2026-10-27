import type { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthUser } from "@/lib/auth";
import { hasTimeOverlap, isValidReservationWindow } from "@/lib/booking-rules";
import { db } from "@/lib/db";

// GET: Listar reservas propias del usuario autenticado[cite: 2, 5]
export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return errorResponse("No autorizado", 401);

    const bookings = await db.booking.findMany({
      where: { userId: auth.userId },
      include: { space: true },
      orderBy: { startTime: "desc" },
    });

    return successResponse(bookings);
  } catch {
    return errorResponse("Error interno del servidor", 500);
  }
}

// POST: Crear reserva validando todas las Reglas de Negocio[cite: 3, 5]
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) return errorResponse("No autorizado", 401);

    const { spaceId, startTime, endTime } = await request.json();

    if (!spaceId || !startTime || !endTime) {
      return errorResponse("Faltan datos obligatorios", 400);
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // Regla 3: No se puede reservar en el pasado[cite: 3]
    if (start < now) {
      return errorResponse("No se puede reservar en el pasado", 400);
    }

    // Regla 3: No más de 30 días de anticipación[cite: 3]
    const maxFutureDate = new Date();
    maxFutureDate.setDate(now.getDate() + 30);
    if (start > maxFutureDate) {
      return errorResponse(
        "No se puede reservar con más de 30 días de anticipación",
        400,
      );
    }

    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (!isValidReservationWindow(start, end)) {
      return errorResponse(
        "La reserva debe durar entre 1 y 4 horas en horario completo, de 7:00 a 21:00",
        400,
      );
    }

    // Regla 7: No se puede reservar un espacio desactivado[cite: 3]
    const space = await db.space.findUnique({ where: { id: spaceId } });
    if (!space || !space.isActive) {
      return errorResponse(
        "El espacio especificado no existe o está desactivado",
        400,
      );
    }

    // Regla 6: Máximo 3 reservas futuras confirmadas por usuario[cite: 3]
    const userFutureBookings = await db.booking.count({
      where: {
        userId: auth.userId,
        status: "CONFIRMED",
        startTime: { gte: now },
      },
    });

    if (userFutureBookings >= 3) {
      return errorResponse(
        "Has alcanzado el límite máximo de 3 reservas futuras confirmadas",
        409,
      );
    }

    // Regla 4: No solapamiento en el mismo espacio[cite: 3]
    const spaceOverlap = await db.booking.findFirst({
      where: {
        spaceId,
        status: "CONFIRMED",
        AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
      },
    });

    if (spaceOverlap) {
      return errorResponse(
        "El espacio ya tiene una reserva confirmada en ese rango horario",
        409,
      );
    }

    // Regla 5: No solapamiento para el mismo usuario en el tiempo[cite: 3]
    const userOverlap = await db.booking.findFirst({
      where: {
        userId: auth.userId,
        status: "CONFIRMED",
        AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
      },
    });

    if (userOverlap) {
      return errorResponse(
        "Ya tienes otra reserva confirmada que se solapa en ese horario",
        409,
      );
    }

    // Regla 8: Precio total calculado por el servidor (horas x precio por hora)[cite: 3]
    const totalPrice = Number(space.pricePerHour) * durationHours;

    // Crear la reserva
    const newBooking = await db.booking.create({
      data: {
        userId: auth.userId,
        spaceId,
        startTime: start,
        endTime: end,
        totalPrice,
        status: "CONFIRMED",
      },
      include: {
        space: true,
      },
    });

    return successResponse(newBooking, 201);
  } catch {
    return errorResponse("Error interno del servidor", 500);
  }
}
