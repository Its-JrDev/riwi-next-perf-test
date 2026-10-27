import { getTranslations } from "next-intl/server";
import type { Space } from "@/features/spaces";
import { SpaceCard } from "@/features/spaces";
import { db } from "@/lib/db";

export default async function CatalogoPage() {
  const t = await getTranslations("catalog");
  const spaces: Space[] = (
    await db.space.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    })
  ).map((space) => ({
    ...space,
    pricePerHour: Number(space.pricePerHour),
    createdAt: space.createdAt.toISOString(),
    updatedAt: space.updatedAt.toISOString(),
  }));

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("pageTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("pageDescription")}</p>
      </div>

      {spaces.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </div>
  );
}
