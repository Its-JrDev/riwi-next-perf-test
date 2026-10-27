"use client";

import { useTranslations } from "next-intl";
import { SpaceCard, SpaceFormDialog, useSpaces } from "@/features/spaces";

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const { spaces, loading, error, updateSpace } = useSpaces();

  const handleToggleActive = async (space: {
    id: string;
    isActive: boolean;
  }) => {
    try {
      await updateSpace(space.id, { isActive: !space.isActive });
    } catch {
      // Manejado en hook
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("spacesManagement")}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t("spacesManagementDescription")}
          </p>
        </div>
        <SpaceFormDialog />
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from(
            { length: 3 },
            (_, index) => `admin-space-card-${index + 1}`,
          ).map((key) => (
            <div key={key} className="h-80 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              isAdmin
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}
