"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useReservations } from "../hooks/useReservations";

export function ReservationsList() {
  const t = useTranslations("dashboard");
  const { reservations, loading, error, cancelReservation } = useReservations();

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from(
          { length: 3 },
          (_, index) => `loading-slot-${index + 1}`,
        ).map((key) => (
          <div key={key} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  const errorMessage = error ?? "";
  const hasCancellationRuleError =
    errorMessage.includes("2 horas") || errorMessage.includes("anticipación");

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-base dark:bg-amber-900/50">
              !
            </div>
            <div className="space-y-1">
              <p className="font-semibold">
                {hasCancellationRuleError
                  ? t("cancelUnavailable")
                  : t("cannotCompleteAction")}
              </p>
              <p className="text-xs leading-5 text-amber-800 dark:text-amber-200">
                {hasCancellationRuleError ? t("cancelWarning") : errorMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
          {t("noReservations")}
        </div>
      ) : (
        reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border/60 bg-card gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {reservation.space?.name || t("reservedSpace")}
                </span>
                <Badge
                  variant={
                    reservation.status === "CONFIRMED" ? "default" : "secondary"
                  }
                >
                  {reservation.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(reservation.startTime).toLocaleString()} —{" "}
                {new Date(reservation.endTime).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-bold text-sm text-primary">
                ${Number(reservation.totalPrice).toLocaleString()}
              </span>
              {reservation.status !== "CANCELLED" && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    void cancelReservation(reservation.id);
                  }}
                >
                  {t("cancelReservation")}
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
