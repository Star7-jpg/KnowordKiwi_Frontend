"use client";
import { useRef, useState } from "react";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Textarea,
  Transition,
} from "@headlessui/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { registerSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const email = watch("email");
  const password = watch("password");
  const username = watch("username");
  const realName = watch("realName");
  const bio = watch("bio");

  // Validar solo los campos del paso actual
  const stepFields: Record<number, (keyof RegisterFormData)[]> = {
    1: ["email", "password"],
    2: ["username", "realName"],
    3: ["bio"], // avatar es opcional y no está en el schema
  };

  // Avanzar de paso solo si los campos del paso actual son válidos
  const handleNextStep = async () => {
    const fields = stepFields[step];
    const valid = await trigger(fields);
    if (valid) setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => setStep((prev) => prev - 1);

  // En el último paso, enviar todo el formulario
  const onSubmit = (data: RegisterFormData) => {
    console.log({ ...data, avatar });
    // Aquí puedes hacer el registro final
  };

  return (
    <form
      onSubmit={step === 3 ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
    >
      <Fieldset className="max-w-lg mx-auto space-y-8 rounded-lg shadow-lg p-8 bg-gray-900">
        <Legend className="text-3xl font-bold mb-6 text-center">
          {step === 1 && "¡Bienvenido! Empecemos creando tu cuenta"}
          {step === 2 && "¿Cómo te gustaría que te conozcan?"}
          {step === 3 && "Haz que tu perfil cuente"}
        </Legend>

        {/* Paso 1 */}
        <Transition
          show={step === 1}
          enter="transition-opacity duration-400"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-400"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="space-y-4">
            <h3 className="font-light text-center mb-8 text-gray-300">
              Solo necesitamos tu correo y una contraseña segura.
            </h3>
            <Field>
              <Label htmlFor="email" className="block text-sm font-medium">
                Correo electrónico
              </Label>
              <Input
                type="email"
                id="email"
                autoComplete="email"
                value={email}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 font-light text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </Field>
            <Field>
              <Label htmlFor="password" className="block text-sm font-medium">
                Contraseña
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 font-light text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </Field>
            <div className="flex justify-end pt-4">
              <button
                type="button"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover disabled:opacity-50"
                disabled={!email || !password}
                onClick={handleNextStep}
              >
                Continuar
              </button>
            </div>
          </div>
        </Transition>

        {/* Paso 2 */}
        <Transition show={step === 2}>
          <div className="space-y-4">
            <h3 className="font-light text-center mb-8 text-gray-300">
              Tu nombre de usuario será visible para otros. El nombre real es
              opcional, pero puede ayudar a conectar mejor.
            </h3>
            <Field>
              <Label htmlFor="username" className="block text-sm font-medium">
                Nombre de usuario
              </Label>
              <Input
                type="text"
                id="username"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                value={username}
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 font-light text-sm mt-2">
                  {errors.username.message}
                </p>
              )}
            </Field>
            <Field>
              <Label htmlFor="realName" className="block text-sm font-medium">
                Nombre real (opcional)
              </Label>
              <Input
                type="text"
                id="realName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                value={realName}
                {...register("realName")}
              />
              {errors.realName && (
                <p className="text-red-500 font-light text-sm mt-2">
                  {errors.realName.message}
                </p>
              )}
            </Field>
            <div className="flex justify-between pt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={handlePrevStep}
              >
                Atrás
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover disabled:opacity-50"
                disabled={!username}
                onClick={handleNextStep}
              >
                Siguiente
              </button>
            </div>
          </div>
        </Transition>

        {/* Paso 3 */}
        <Transition show={step === 3}>
          <div className="space-y-4">
            <h3 className="font-light text-center mb-8 text-gray-300">
              Agrega una imagen y una pequeña descripción para mostrar tu
              personalidad desde el primer día.
            </h3>
            <Field>
              <Label htmlFor="avatar" className="block text-sm font-medium">
                Imagen de perfil (Opcional)
              </Label>

              <input
                type="file"
                name="avatar"
                id="avatar"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setAvatar(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                ref={fileInputRef}
              />

              <Button
                type="button"
                className="px-4 py-2 mt-4 bg-accent text-white rounded hover:bg-accent-hover transition duration-150 ease-in-out"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                {avatar ? "Cambiar foto" : "Subir foto"}
              </Button>
              {avatar && (
                <div className="w-full flex justify-center">
                  <img
                    src={avatar}
                    alt="Avatar preview"
                    className="mt-2 w-16 h-16 rounded-full object-cover inline-block "
                  />
                </div>
              )}
            </Field>
            <Field>
              <Label htmlFor="bio" className="block text-sm font-medium">
                Descripción (también opcional pero recomendado 🥸)
              </Label>
              <Textarea
                id="bio"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                rows={3}
                value={bio}
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-red-500 font-light text-sm mt-2">
                  {errors.bio.message}
                </p>
              )}
            </Field>
            <div className="flex justify-between pt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={handlePrevStep}
              >
                Atrás
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
              >
                Finalizar registro
              </button>
            </div>
          </div>
        </Transition>

        {/* Indicador de progreso */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Paso {step} de 3
        </div>
      </Fieldset>
    </form>
  );
}
