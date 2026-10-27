"use client";

import { useState } from "react";
import type { Space } from "@/features/spaces";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useReservations } from "../hooks/useReservations";

interface ReservationDialogProps {
  space: Space;
  trigger?: React.ReactNode;
}

export function ReservationDialog({ space, trigger }: ReservationDialogProps) {
  const [open, setOpen] = useState(false);
  const { createReservation, loading, error } = useReservations();

  // Valores por defecto alineados a horas exactas (ej. 10:00 a 12:00)
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startTime || !endTime) return;

    // Normalizar a horas exactas e ISO String
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Asegurar minutos en 0 si el input datetime-local no los forzó
    start.setMinutes(0, 0, 0);
    end.setMinutes(0, 0, 0);

    try {
      await createReservation({
        spaceId: space.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
      setOpen(false);
    } catch {
      // Manejado en useReservations
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button className="w-full">Reservar Espacio</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reservar {space.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="rounded bg-destructive/15 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="startTime">Fecha y hora de inicio</Label>
            <Input
              id="startTime"
              type="datetime-local"
              step="3600" // Forzar saltos de 1 hora
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="endTime">Fecha y hora de fin</Label>
            <Input
              id="endTime"
              type="datetime-local"
              step="3600" // Forzar saltos de 1 hora
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div className="rounded-lg bg-muted p-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span>Precio por hora:</span>
              <span className="font-semibold">
                ${Number(space.pricePerHour).toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground pt-1">
              * Las reservas deben ser de entre 1 y 4 horas completas (ej: 10:00
              a 12:00).
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Confirmando..." : "Confirmar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
