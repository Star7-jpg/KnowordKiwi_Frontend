"use client";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
} from "@headlessui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas";
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null); // Nuevo estado para errores del backend
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  watch("email"); // Para activar la validación en tiempo real
  watch("password"); // Para activar la validación en tiempo real

  const { handleAxiosError } = useAxiosErrorHandler();
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setBackendError(null); // Limpiar errores previos del backend
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        data,
      );
      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setBackendError(error.response.data.non_field_errors);
        setError("email", {
          type: "manual",
        });
        setError("password", {
          type: "manual",
        });
      } else {
        handleAxiosError(error);
      }
      console.error("Error al iniciar sesión:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out ${errors.password ? "border-red-500" : ""}`}
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
            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out ${errors.password ? "border-red-500" : ""}`}
            required
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 font-light text-sm mt-2">
              {errors.password.message}
            </p>
          )}
        </Field>
        {backendError && ( // Mostrar el error del backend si existe
          <p className="text-text-error font-light text-sm text-center mt-2">
            {backendError}
          </p>
        )}
        <span>¿Olvidaste tu contraseña? </span>
        <Link
          href="/reset-password"
          className="text-primary hover:text-primary-hover transition duration-150 ease-in-out"
        >
          Recupérala en segundos.
        </Link>
        <Button
          type="submit"
          className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-hover mt-6 transition duration-300"
          disabled={isSubmitting} // Deshabilitar el botón mientras se envía
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </Fieldset>
    </form>
  );
}
