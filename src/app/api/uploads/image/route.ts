import { PutObjectCommand } from "@aws-sdk/client-s3";
import type { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthUser } from "@/lib/auth";
import { getPublicImageUrl, s3Client, s3Config } from "@/lib/s3";
import { randomUUID } from "node:crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) return errorResponse("No autorizado", 401);
    if (auth.role !== "ADMIN") return errorResponse("Acceso denegado", 403);

    if (!s3Config.bucket) {
      return errorResponse("El almacenamiento S3 no está configurado", 500);
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return errorResponse("Selecciona un archivo de imagen", 400);
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return errorResponse("Solo se permiten imágenes JPG, PNG o WEBP", 400);
    }
    if (file.size === 0) {
      return errorResponse("La imagen está vacía", 400);
    }
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse("La imagen no puede superar 5 MB", 400);
    }

    const extension = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
    const key = `spaces/${randomUUID()}.${extension}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
        Body: new Uint8Array(await file.arrayBuffer()),
        ContentType: file.type,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    return successResponse({ url: getPublicImageUrl(key) }, 201);
  } catch (error) {
    console.error("Error al subir imagen a S3:", error);
    return errorResponse("No se pudo subir la imagen", 500);
  }
}
