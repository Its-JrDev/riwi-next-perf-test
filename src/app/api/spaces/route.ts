import type { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";

// GET: Listar espacios públicos (solo activos)[cite: 3]
export async function GET() {
  try {
    const spaces = await db.space.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return successResponse(spaces);
  } catch {
    return errorResponse("Error interno del servidor", 500);
  }
}

// POST: Crear espacio (Solo ADMIN)[cite: 2]
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) return errorResponse("No autorizado", 401);
    if (auth.role !== "ADMIN") return errorResponse("Acceso denegado", 403);

    const { name, description, type, pricePerHour, imageUrl } =
      await request.json();

    if (!name || !description || !type || !pricePerHour || !imageUrl) {
      return errorResponse("Todos los campos son obligatorios", 400);
    }

    const space = await db.space.create({
      data: { name, description, type, pricePerHour, imageUrl },
    });

    return successResponse(space, 201);
  } catch {
    return errorResponse("Error interno del servidor", 500);
  }
}
