export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Reservation {
  id: string;
  userId: string;
  spaceId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: ReservationStatus;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  space?: {
    id: string;
    name: string;
    type: string;
    pricePerHour: number;
  };
}

export interface CreateReservationInput {
  spaceId: string;
  startTime: string;
  endTime: string;
}

export interface ReservationsResponse<T = Reservation[]> {
  success: boolean;
  data?: T;
  error?: string;
}
