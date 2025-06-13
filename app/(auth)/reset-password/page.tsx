"use client";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
} from "@headlessui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../schemas"; // Asumimos que tendrás este schema

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log(data);
        // lógica para enviar la solicitud de recuperación
      })}
    >
      <Fieldset className="space-y-8 bg-gray-900 rounded-lg shadow-lg max-w-lg p-8 mx-auto my-12">
        <Legend className="text-3xl font-bold text-center">
          Restablece tu contraseña
        </Legend>
        <Field>
          <h3 className="font-light text-center mb-4 text-gray-300">
            Ingresa tu correo electrónico para recibir un enlace de
            recuperación.
          </h3>
          <Label className="block text-sm font-medium">
            Correo Electrónico
          </Label>
          <Input
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 font-light text-sm mt-2">
              {errors.email.message}
            </p>
          )}
        </Field>
        <Button
          type="submit"
          className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-hover mt-6 transition duration-300"
        >
          Enviar enlace de recuperación
        </Button>
        <div className="text-center mt-4">
          <Link
            href="/login"
            className="text-primary hover:text-primary-hover transition duration-150 ease-in-out text-sm"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </Fieldset>
    </form>
  );
}
