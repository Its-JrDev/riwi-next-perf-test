import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre completo es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingresa un correo electrónico válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
