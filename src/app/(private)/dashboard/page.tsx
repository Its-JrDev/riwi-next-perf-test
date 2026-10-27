"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ReservationsList } from "@/features/reservations";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("myPanel")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("panelDescription")}
          </p>
        </div>
        <Button asChild>
          <Link href="/catalogo">{t("bookNewSpace")}</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {t("myReservations")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("reservationHistory")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReservationsList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
