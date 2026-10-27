import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return errorResponse("Todos los campos son obligatorios", 400);
    }

    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      return errorResponse("El correo electrónico ya está registrado", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { email, password: hashedPassword, name, role: "USER" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return successResponse(user, 201);
  } catch {
    return errorResponse("Error interno del servidor", 500);
  }
}
