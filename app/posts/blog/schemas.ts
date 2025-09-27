import { z } from "zod";

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, "El título es obligatorio")
    .max(200, "El título no debe exceder los 200 caracteres"),
  content: z
    .string()
    .min(1, "El contenido es obligatorio")
    .max(50000, "El contenido no debe exceder los 50,000 caracteres"),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;