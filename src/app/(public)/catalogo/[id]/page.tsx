import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReservationDialog } from "@/features/reservations";
import type { Space } from "@/features/spaces";
import { db } from "@/lib/db";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

const TYPE_LABELS: Record<Space["type"], string> = {
  DESK: "Escritorio individual",
  MEETING_ROOM: "Sala de Juntas",
  PRIVATE_OFFICE: "Oficina Privada",
  BOOTH: "Cabina privada",
};

interface SpaceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SpaceDetailPage({
  params,
}: SpaceDetailPageProps) {
  const t = await getTranslations("catalog");
  const { id } = await params;
  const spaceData = await db.space.findUnique({
    where: { id },
  });

  if (!spaceData) {
    notFound();
  }

  const space: Space = {
    ...spaceData,
    pricePerHour: Number(spaceData.pricePerHour),
    createdAt: spaceData.createdAt.toISOString(),
    updatedAt: spaceData.updatedAt.toISOString(),
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8">
      <Link
        href="/catalogo"
        className="mb-6 inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        ← {t("back")}
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="relative h-72 w-full overflow-hidden rounded-xl border border-border/60 sm:h-96">
          <Image
            src={space.imageUrl}
            alt={space.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {TYPE_LABELS[space.type] || space.type}
              </Badge>
              <Badge variant={space.isActive ? "default" : "secondary"}>
                {space.isActive ? t("available") : t("inactive")}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">{space.name}</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {space.description}
            </p>
          </div>

          <div className="space-y-4 border-t border-border/60 pt-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">
                ${Number(space.pricePerHour).toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">{t("perHour")}</span>
            </div>

            {space.isActive ? (
              <ReservationDialog space={space} />
            ) : (
              <Button disabled className="w-full">
                {t("unavailableForBooking")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
