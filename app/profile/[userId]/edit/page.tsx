"use client";
import { useState, Fragment } from "react";
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

// 1. Define Zod Schema for validation
const profileSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full Name must be at least 3 characters")
    .max(50, "Full Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^\+?[0-9\s()-]*$/, "Invalid phone number format"), // Allows numbers, spaces, parentheses, hyphens, and optional leading +
});

// Infer the TypeScript type from the Zod schema
type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileData extends ProfileFormData {
  profileImageUrl: string;
}

const initialProfileData: ProfileData = {
  fullName: "Ronald Richards",
  email: "RonaldRich@example.com",
  phone: "(219) 555-0114",
  profileImageUrl: "/images/ronald-richards.png", // Ensure this image exists or use a fallback
};

export default function ProfileEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for the confirmation dialog

  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }, // isDirty to check if form has been changed
    reset, // Use reset to update form values when editing starts/stops
    getValues, // To get current values without re-rendering
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialProfileData, // Set initial values from the data
    mode: "onBlur", // Validate on blur
  });

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleEditClick = () => {
    if (isEditing) {
      // If exiting edit mode without saving, revert to original data
      reset(initialProfileData);
    } else {
      // When entering edit mode, ensure form values match current data
      reset(getValues()); // Or reset(formData) if formData was managed separately from initialProfileData
    }
    setIsEditing(!isEditing);
  };

  const onSubmit = (data: ProfileFormData) => {
    // This function will only be called if validation passes
    console.log("Validated and submitting profile data:", data);
    // In a real application, you would send `data` to your backend here
    // e.g., api.updateProfile(data).then(...)

    // For this example, open a confirmation dialog
    openModal();
    // After successful save (and confirmation), update initial data and exit edit mode
    // Note: In a real app, initialProfileData would likely come from an API call or context
    // For now, let's assume the save is successful and update local state for display
    // For a real app, you would dispatch an action or refetch data
    // For demonstration, let's update initialProfileData (though usually you don't mutate props/initial state directly)
    // Here, we simulate updating the 'source of truth' for the profile data
    Object.assign(initialProfileData, data); // This is a simplistic way for demo, be careful with direct mutation
    setIsEditing(false); // Exit edit mode
    reset(initialProfileData); // Re-initialize form with new "saved" data
  };

  return (
    <div className="min-h-screen w-full p-6 sm:p-8">
      {/* Header Section */}
      <h1 className="text-2xl font-semibold mb-6">Editar Perfil</h1>

      {/* Profile Picture Section */}
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
              htmlFor="fullName"
              className="block text-gray-400 text-sm mb-2"
            >
              Nombre Completo
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  id="fullName"
                  {...register("fullName")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.fullName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } text-gray-800`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </>
            ) : (
              <p className="font-medium">{initialProfileData.fullName}</p>
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
                  } text-gray-800`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </>
            ) : (
              <p className="font-medium">{initialProfileData.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-400 text-sm mb-2">
              Telefono
            </label>
            {isEditing ? (
              <>
                <input
                  type="tel"
                  id="phone"
                  {...register("phone")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } text-gray-800`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </>
            ) : (
              <p className="font-medium">{initialProfileData.phone}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit" // This button submits the form
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isDirty || Object.keys(errors).length > 0} // Disable if no changes or validation errors
            >
              Guardar Cambios
            </button>
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Biografia ✏️</h2>
          <button
            type="button" // Prevent form submission
            onClick={handleEditClick}
            className={`flex items-center  font-medium text-sm transition-colors duration-200 ${isEditing ? "text-error hover:text-error-hover" : "text-primary hover:text-primary-hover"}`}
          >
            <Pencil className="h-4 w-4 mr-1" />
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>
        <div>
          {isEditing ? (
            <>
              <textarea
                id="bio"
                {...register("fullName")}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } text-gray-800`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </>
          ) : (
            <p className="font-medium">{initialProfileData.fullName}</p>
          )}
        </div>
      </form>

      {/* Headless UI Dialog for Save Confirmation */}
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
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Perfil Actualizado Con Exito 🎉
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Tu informacion de perfil se ha actualizado correctamente.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
