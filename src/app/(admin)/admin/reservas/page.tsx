"use client";

import {
  CalendarClock,
  CircleDollarSign,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useReservations } from "@/features/reservations";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function AdminReservationsPage() {
  const t = useTranslations("admin");
  const {
    allReservations,
    loading,
    error,
    fetchAllReservations,
    cancelReservation,
  } = useReservations();

  useEffect(() => {
    void fetchAllReservations();
  }, [fetchAllReservations]);

  const summary = useMemo(() => {
    const total = allReservations.length;
    const active = allReservations.filter(
      (reservation) => reservation.status === "CONFIRMED",
    ).length;
    const cancelled = allReservations.filter(
      (reservation) => reservation.status === "CANCELLED",
    ).length;
    const revenue = allReservations
      .filter((reservation) => reservation.status === "CONFIRMED")
      .reduce(
        (sum, reservation) => sum + Number(reservation.totalPrice || 0),
        0,
      );

    return { total, active, cancelled, revenue };
  }, [allReservations]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));

  return (
    <div className="container mx-auto space-y-8 px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("systemReservations")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("systemReservationsDescription")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("total")}</CardDescription>
            <CardTitle className="text-2xl">{summary.total}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            {t("registeredReservations")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("confirmed")}</CardDescription>
            <CardTitle className="text-2xl">{summary.active}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarClock className="h-4 w-4 text-primary" />
            {t("activeInProgress")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("cancelled")}</CardDescription>
            <CardTitle className="text-2xl">{summary.cancelled}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldAlert className="h-4 w-4 text-primary" />
            {t("cancelledHistory")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("income")}</CardDescription>
            <CardTitle className="text-2xl text-primary">
              {formatCurrency(summary.revenue)}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
            <CircleDollarSign className="h-4 w-4 text-primary" />
            {t("confirmed")}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("completeList")}</CardTitle>
          <CardDescription>{t("completeListDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid gap-3">
              {Array.from(
                { length: 4 },
                (_, index) => `reservation-skeleton-${index + 1}`,
              ).map((key) => (
                <div
                  key={key}
                  className="h-16 animate-pulse rounded-md bg-muted"
                />
              ))}
            </div>
          ) : allReservations.length === 0 ? (
            <div className="rounded border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {t("noReservationsYet")}
            </div>
          ) : (
            <div className="space-y-3">
              {allReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">
                        {reservation.user?.name ?? t("user")}
                      </p>
                      <Badge
                        variant={
                          reservation.status === "CONFIRMED"
                            ? "default"
                            : reservation.status === "CANCELLED"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {reservation.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reservation.user?.email ?? t("withoutEmail")} ·{" "}
                      {reservation.space?.name ?? t("space")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(reservation.startTime)} →{" "}
                      {formatDate(reservation.endTime)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {t("totalLabel")}
                      </p>
                      <p className="font-semibold text-foreground">
                        {formatCurrency(Number(reservation.totalPrice || 0))}
                      </p>
                    </div>

                    {reservation.status !== "CANCELLED" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => void cancelReservation(reservation.id)}
                      >
                        {t("cancel")}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
