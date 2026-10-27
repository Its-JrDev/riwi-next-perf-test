"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type { Space } from "../types";
import { SpaceFormDialog } from "./space-form-dialog";

interface SpaceCardProps {
  space: Space;
  isAdmin?: boolean;
  onToggleActive?: (space: Space) => void;
}

const TYPE_LABELS: Record<Space["type"], string> = {
  DESK: "Escritorio",
  MEETING_ROOM: "Sala de Juntas",
  PRIVATE_OFFICE: "Oficina Privada",
  BOOTH: "Cabina Privada",
};

export function SpaceCard({
  space,
  isAdmin = false,
  onToggleActive,
}: SpaceCardProps) {
  const t = useTranslations("catalog");

  return (
    <Card className="flex flex-col overflow-hidden border-border/60 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full bg-muted">
        <Image
          src={space.imageUrl}
          alt={space.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!space.isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-semibold text-white">
            {t("inactive")}
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-bold tracking-tight line-clamp-1">
            {space.name}
          </CardTitle>
          <Badge variant="outline" className="shrink-0">
            {TYPE_LABELS[space.type] || space.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {space.description}
        </p>
        <div className="text-lg font-bold text-primary">
          ${Number(space.pricePerHour).toLocaleString()} {" "}
          <span className="text-xs font-normal text-muted-foreground">
            {t("perHour")}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {isAdmin ? (
          <div className="flex w-full gap-2">
            <SpaceFormDialog
              space={space}
              trigger={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  {t("edit")}
                </Button>
              }
            />
            <Button
              variant={space.isActive ? "destructive" : "default"}
              size="sm"
              className="flex-1"
              onClick={() => onToggleActive?.(space)}
            >
              {space.isActive ? t("disable") : t("enable")}
            </Button>
          </div>
        ) : (
          <Button
            asChild
            size="sm"
            className="w-full"
            disabled={!space.isActive}
          >
            <Link
              href={
                isAdmin
                  ? `/admin/catalogo/${space.id}`
                  : `/catalogo/${space.id}`
              }
            >
              {space.isActive ? t("viewDetails") : t("notAvailable")}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
