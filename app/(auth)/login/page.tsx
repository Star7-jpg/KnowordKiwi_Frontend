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
import { loginSchema } from "../schemas";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log(data);
      })}
    >
      <Fieldset className="space-y-8 bg-gray-900 rounded-lg shadow-lg max-w-lg p-8">
        <Legend className="text-3xl font-bold text-center">
          Inicia sesión en tu cuenta
        </Legend>
        <Field>
          <h3 className="font-light text-center mb-4 text-gray-300">
            Aprende, comparte y crece junto a una comunidad que ama el
            conocimiento.
          </h3>
          <Label className="block text-sm font-medium">
            Correo Electrónico
          </Label>
          <Input
            type="email"
            autoComplete="email"
            required
            className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 font-light text-sm mt-2">
              {errors.email.message}
            </p>
          )}
        </Field>
        <Field>
          <Label className="block text-sm font-medium">Contraseña</Label>
          <Input
            type="password"
            autoComplete="current-password"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
            required
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 font-light text-sm mt-2">
              {errors.password.message}
            </p>
          )}
        </Field>
        <span>¿Olvidaste tu contraseña? </span>
        <Link
          href="/reset-password"
          className="text-primary hover:text-primary-hover transition duration-150 ease-in-out"
        >
          Recupérala en segundos.
        </Link>
        <Button
          type="submit"
          className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-hover mt-6 transition duration-300"
        >
          Iniciar sesión
        </Button>
      </Fieldset>
    </form>
  );
}
