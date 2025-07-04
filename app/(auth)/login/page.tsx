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
import { useAuthStore } from "@/store/authStore";
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import ErrorModal from "@/components/shared/ErrorModal";
import publicApiClient from "@/services/publicApiClient";
import { useRouter } from "next/navigation";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const router = useRouter();

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
    getValues, //añadir getValues para reintentar el inicio de sesión con los datos actuales (dentro del modal de error)
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  watch("email");
  watch("password");

  const { handleAxiosError } = useAxiosErrorHandler();

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setBackendError(null); // Limipiar errores previos del backend
    setSubmissionError(null); // Limpiar errores de envío previos
    setShowErrorModal(false); // Cerrar modal de error si estaba abierto

    try {
      const response = await publicApiClient.post(
        "http://localhost:8000/api/login/",
        data
      );

      const { access, user } = response.data;

      setAccessToken(access);
      setUser(user);
      //Redirige al perfil dinámico (por ID o username)
      router.push(`/profile/${user.id}`);// usar user.username si queremos 
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setBackendError(error.response.data.non_field_errors);
        //Errores manuales para indicar error en las credenciales
        setError("email", { type: "manual" });
        setError("password", { type: "manual" });
      } else {
        handleAxiosError(error);
        setSubmissionError(
          "Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde."
        );
        setShowErrorModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setSubmissionError(null);
  };

  const handleRetryConnection = () => {
    setShowErrorModal(false);
    onSubmit(getValues());// Reintentar el envio del formulario con los valores actuales
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
          <Label className="block text-sm font-medium">Correo Electrónico</Label>
          <Input
            type="email"
            autoComplete="email"
            required
            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition duration-150 ease-in-out ${errors.email ? "border-red-500" : "border-gray-300"
              }`}
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
            required
            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition duration-150 ease-in-out ${errors.password ? "border-red-500" : "border-gray-300"
              }`}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 font-light text-sm mt-2">
              {errors.password.message}
            </p>
          )}
        </Field>
        {backendError && ( //Mostrar error del backend si existe
          <p className="text-text-error font-medium text-sm text-center mt-2">
            {backendError}
          </p>
        )}
        <span>¿Olvidaste tu contraseña? </span>
        <Link
          href="/forgot-password"
          className="text-primary hover:text-primary-hover transition duration-150 ease-in-out"
        >
          Recupérala en segundos.
        </Link>
        <Button
          type="submit"
          className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-hover mt-6 transition duration-300"
          disabled={isSubmitting}//Deshabilitar el botón mientras se envía
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </Fieldset>
      {showErrorModal && submissionError && (
        <ErrorModal
          message={submissionError}
          onClose={handleCloseErrorModal}
          onRetry={handleRetryConnection}
        />
      )}
    </form>
  );
}