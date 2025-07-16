"use client";
import { useState, Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Avatar } from "@/components/ui/userProfile/Avatar";
import { Pencil } from "lucide-react";
import { profileSchema } from "../../schemas";
import { useAuthStore } from "@/store/authStore";
import privateApiClient from "@/services/privateApiClient";

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileData extends ProfileFormData {
  avatar_url: string;
}

export default function ProfileEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const initialProfileData: ProfileData = {
    real_name: user?.real_name || "",
    email: user?.email || "",
    username: user?.username || "",
    bio: user?.bio || "",
    avatar_url: user?.avatar_url || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }, // isDirty para verificar si hay cambios en el formulario
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialProfileData,
    mode: "onTouched",
  });

  // Este efecto mantiene el formulario sincronizado con el estado global del usuario.
  // Se ejecutará cuando el componente se monte por primera vez y cada vez que el objeto 'user' en el store cambie.
  useEffect(() => {
    if (user) {
      reset({
        real_name: user.real_name || "",
        email: user.email || "",
        username: user.username || "",
        bio: user.bio || "",
      });
    }
  }, [user, reset]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleEditClick = () => {
    if (isEditing) {
      // Al hacer clic en "Cancelar", reseteamos
      // el formulario a los valores actuales del store.
      if (user) {
        reset({
          real_name: user.real_name || "",
          email: user.email || "",
          username: user.username || "",
          bio: user.bio || "",
        });
      }
    }
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const response = await privateApiClient.patch("/me/", data);
      console.log(response.data);
      // Actualizamos el estado global de Zustand con la respuesta del API
      setUser(data);
      setIsEditing(false); // Salir del modo edición
      openModal(); // Mostrar modal de éxito
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert(
        "Hubo un error al actualizar tu perfil. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-6 sm:p-8">
      <h1 className="text-2xl font-semibold mb-6">Editar Perfil</h1>

      {/* Seccion de foto de perfil */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-200 mb-6">
        <Avatar src="/default-avatar.jpeg" size="lg" editable />
        <div className="flex flex-col items-center justify-center sm:items-start ml-4">
          <button
            type="button"
            className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary-hover transition-colors duration-200"
          >
            Subir Nueva Foto
          </button>
          <p className="text-gray-400 text-xs mt-4 text-center sm:text-left">
            Recomendamos una imagen de al menos 800×800 pixeles. <br />
            Asegurate que el formato de la imagen sea JPG o PNG
          </p>
        </div>
      </div>

      {/* Seccion de informacion personal */}
      <form className="space-y-20" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Informacion Personal</h2>
          <button
            type="button" // Prevent form submission
            onClick={handleEditClick}
            className={`flex items-center  font-medium text-sm transition-colors duration-200 ${isEditing ? "text-error hover:text-error-hover" : "text-primary hover:text-primary-hover"}`}
          >
            <Pencil className="h-4 w-4 mr-1" />
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-8">
          <div>
            <label
              htmlFor="real_name"
              className="block text-gray-400 text-sm mb-2"
            >
              Nombre Completo
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  id="real_name"
                  {...register("real_name")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.real_name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.real_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.real_name.message}
                  </p>
                )}
              </>
            ) : (
              <p className="font-medium">{user?.real_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-400 text-sm mb-2">
              Correo Electronico
            </label>
            {isEditing ? (
              <>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </>
            ) : (
              <p className="font-medium">{user?.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-400 text-sm mb-2">
              Nombre de usuario
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  id="username"
                  {...register("username")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.username
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </>
            ) : (
              <p className="font-medium">{user?.username}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Biografia</h2>
        </div>
        <div>
          {isEditing ? (
            <>
              <textarea
                id="bio"
                {...register("bio")}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              />
            </>
          ) : (
            <p className="font-medium">{user?.bio}</p>
          )}
        </div>
        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit" // This button submits the form
              className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                !isDirty || isSubmitting || Object.keys(errors).length > 0
              } // Disable if no changes or validation errors
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        )}
      </form>

      {/* Headless UI Modal para confirmacion de edicion */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    Perfil Actualizado Con Exito 🎉
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">
                      Tu informacion de perfil se ha actualizado correctamente.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Entendido, gracias
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
