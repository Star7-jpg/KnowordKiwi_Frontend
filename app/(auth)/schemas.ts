import { z } from "zod";

// Este esquema define las reglas de validación para el formulario de inicio de sesión
export const loginSchema = z.object({
  email: z
    .string()
    .email("El correo no es válido. Verifica que esté bien escrito."),
  password: z
    .string()
    .min(8, "Tu contraseña debe tener al menos 8 caracteres."),
});

//Este esquema define las reglas de validación para el formulario de registro
export const registerSchema = z.object({
  email: z
    .string()
    .email("El correo no es válido. Verifica que esté bien escrito."),
  password: z
    .string()
    .min(8, "Tu contraseña debe tener al menos 8 caracteres."),
  username: z
    .string()
    .min(3, "Tu nombre de usuario debe tener al menos 3 caracteres.")
    .max(20, "Tu nombre de usuario no puede tener más de 20 caracteres."),
  realName: z.string().optional(),
  bio: z
    .string()
    .max(160, "Tu biografía no puede tener más de 160 caracteres."),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email("El correo no es válido. Verifica que esté bien escrito."),
});
