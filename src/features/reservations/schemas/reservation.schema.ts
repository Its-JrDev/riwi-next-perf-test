import { z } from "zod";

export const createReservationSchema = z
  .object({
    spaceId: z.string().min(1, "El espacio es obligatorio"),
    startTime: z.string().min(1, "La fecha de inicio es obligatoria"),
    endTime: z.string().min(1, "La fecha de fin es obligatoria"),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["endTime"],
  });

export type CreateReservationFormValues = z.infer<
  typeof createReservationSchema
>;
