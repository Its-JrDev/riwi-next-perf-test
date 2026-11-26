import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const prisma = new PrismaClient();
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const SOURCE_HOST = "images.unsplash.com";
const contentTypeToExtension: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function main() {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION ?? "us-east-2";
  const publicBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL?.replace(/\/$/, "");
  const shouldApply = process.argv.includes("--apply");

  if (!bucket) {
    throw new Error("Falta configurar AWS_S3_BUCKET en .env.local o .env");
  }

  const spaces = await prisma.space.findMany({
    select: { id: true, name: true, imageUrl: true },
    orderBy: { name: "asc" },
  });
  const spacesToMigrate = spaces.filter((space) => {
    try {
      const imageUrl = new URL(space.imageUrl);
      return (
        imageUrl.protocol === "https:" && imageUrl.hostname === SOURCE_HOST
      );
    } catch {
      return false;
    }
  });

  if (spacesToMigrate.length === 0) {
    console.log("No hay imágenes de Unsplash pendientes de migración.");
    return;
  }

  console.log(
    `${shouldApply ? "Migrando" : "Simulación: se migrarían"} ${spacesToMigrate.length} imagen(es):`,
  );
  for (const space of spacesToMigrate) {
    console.log(`- ${space.name}: ${space.imageUrl}`);
  }

  if (!shouldApply) {
    console.log(
      "No se modificó nada. Ejecuta el comando con --apply para migrar.",
    );
    return;
  }

  const s3Client = new S3Client({ region });
  let failures = 0;

  for (const space of spacesToMigrate) {
    try {
      const response = await fetch(space.imageUrl, { redirect: "error" });
      if (!response.ok) {
        throw new Error(`Descarga fallida: HTTP ${response.status}`);
      }

      const contentType = response.headers
        .get("content-type")
        ?.split(";")[0]
        .trim();
      const extension = contentType
        ? contentTypeToExtension[contentType]
        : undefined;
      if (!contentType || !extension) {
        throw new Error(
          `Tipo de imagen no permitido: ${contentType ?? "vacío"}`,
        );
      }

      const image = new Uint8Array(await response.arrayBuffer());
      if (image.byteLength === 0 || image.byteLength > MAX_FILE_SIZE) {
        throw new Error("La imagen está vacía o supera el límite de 5 MB");
      }

      const key = `spaces/${randomUUID()}.${extension}`;
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: image,
          ContentType: contentType,
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );

      const imageUrl = publicBaseUrl
        ? `${publicBaseUrl}/${key}`
        : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
      await prisma.space.update({
        where: { id: space.id },
        data: { imageUrl },
      });
      console.log(`Migrada: ${space.name} -> ${imageUrl}`);
    } catch (error) {
      failures += 1;
      console.error(
        `Error migrando ${space.name}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  if (failures > 0) {
    throw new Error(`${failures} imagen(es) no se pudieron migrar`);
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
