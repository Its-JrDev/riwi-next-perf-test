import { PrismaClient, Role, SpaceType } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando la siembra de la base de datos...");

  // 1. Limpiar datos previos (opcional para desarrollo)
  await prisma.booking.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.space.deleteMany();
  await prisma.user.deleteMany();

  // 2. Crear usuario Administrador
  const adminPassword = await bcrypt.hash("Admin123456!", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@cospace.com",
      password: adminPassword,
      name: "Admin CoSpace",
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Administrador creado: ${admin.email}`);

  // 3. Crear espacios de prueba iniciales
  const spaces = [
    {
      name: "Escritorio Flexible A1",
      description:
        "Espacio individual de trabajo silencioso con conexión de alta velocidad.",
      type: SpaceType.DESK,
      pricePerHour: 15000,
      imageUrl:
        "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800",
      isActive: true,
    },
    {
      name: "Sala de Juntas Innovación",
      description:
        "Sala equipada con pantalla 4K, video conferencia y capacidad para 8 personas.",
      type: SpaceType.MEETING_ROOM,
      pricePerHour: 50000,
      imageUrl:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      isActive: true,
    },
    {
      name: "Cabina Insonorizada B",
      description:
        "Cabina individual ideal para llamadas privadas o concentrarse al máximo.",
      type: SpaceType.BOOTH,
      pricePerHour: 20000,
      imageUrl:
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800",
      isActive: true,
    },
  ];

  for (const space of spaces) {
    await prisma.space.create({ data: space });
  }

  console.log(`✅ ${spaces.length} espacios creados con éxito.`);
}

main()
  .catch((e) => {
    console.error("❌ Error durante la ejecución del seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
