import type {
  CreateReservationInput,
  Reservation,
  ReservationsResponse,
} from "../types";

const BASE_URL = "/api/reservations";

export const reservationsService = {
  /**
   * Obtiene la lista de reservas del usuario autenticado
   */
  async getMyReservations(): Promise<Reservation[]> {
    const response = await fetch(BASE_URL, { cache: "no-store" });
    const result: ReservationsResponse<Reservation[]> = await response.json();

    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.error || "Error al obtener tus reservas");
    }
    return result.data;
  },

  /**
   * Obtiene todas las reservas para el panel de administración
   */
  async getAllForAdmin(): Promise<Reservation[]> {
    const response = await fetch(`${BASE_URL}/admin`, { cache: "no-store" });
    const result: ReservationsResponse<Reservation[]> = await response.json();

    if (!response.ok || !result.success || !result.data) {
      throw new Error(
        result.error || "Error al obtener las reservas del sistema",
      );
    }
    return result.data;
  },

  /**
   * Crea una nueva reserva para un espacio de coworking
   */
  async create(input: CreateReservationInput): Promise<Reservation> {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const result: ReservationsResponse<Reservation> = await response.json();

    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.error || "Error al procesar la reserva");
    }
    return result.data;
  },

  /**
   * Cancela una reserva activa
   */
  async cancel(id: string): Promise<Reservation> {
    const response = await fetch(`${BASE_URL}/${id}/cancel`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    let result: ReservationsResponse<Reservation> | null = null;

    try {
      const text = await response.text();
      result = text
        ? (JSON.parse(text) as ReservationsResponse<Reservation>)
        : null;
    } catch {
      result = null;
    }

    if (!response.ok || !result?.success || !result.data) {
      throw new Error(result?.error || "Error al cancelar la reserva");
    }

    return result.data;
  },
};
