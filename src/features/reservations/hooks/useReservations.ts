"use client";

import { useCallback, useEffect, useState } from "react";
import { reservationsService } from "../services/reservations.service";
import type { CreateReservationInput, Reservation } from "../types";

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reservationsService.getMyReservations();
      setReservations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reservationsService.getAllForAdmin();
      setAllReservations(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar reservas del sistema",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createReservation = useCallback(
    async (input: CreateReservationInput) => {
      setLoading(true);
      setError(null);
      try {
        const newReservation = await reservationsService.create(input);
        setReservations((prev) => [newReservation, ...prev]);
        return newReservation;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error al crear reserva";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const cancelReservation = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const cancelled = await reservationsService.cancel(id);
      setReservations((prev) => prev.map((r) => (r.id === id ? cancelled : r)));
      setAllReservations((prev) =>
        prev.map((r) => (r.id === id ? cancelled : r)),
      );
      return cancelled;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al cancelar reserva";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return {
    reservations,
    allReservations,
    loading,
    error,
    fetchReservations,
    fetchAllReservations,
    createReservation,
    cancelReservation,
  };
}
