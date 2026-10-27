import { z } from "zod";

export const spaceSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  type: z.enum(["DESK", "MEETING_ROOM", "PRIVATE_OFFICE", "BOOTH"], {
    required_error: "Selecciona un tipo de espacio",
  }),
  pricePerHour: z.coerce
    .number()
    .min(1, "El precio por hora debe ser mayor a 0"),
  imageUrl: z
    .string()
    .min(1, "La URL de la imagen es obligatoria")
    .url("Ingresa una URL válida"),
});

export type SpaceFormValues = z.infer<typeof spaceSchema>;
