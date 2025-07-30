"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCommunitySchema } from "@/app/communities/schemas";
import privateApiClient from "@/services/privateApiClient";

type ReadTag = {
  id: string;
  name: string;
};

type Community = {
  id: string;
  name: string;
  description: string;
  avatar_url: string | null;
  banner_url: string | null;
  is_private: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  read_tags: ReadTag[];
};

type FormData = z.infer<typeof createCommunitySchema>;

export default function CommunityEditForm() {
  const params = useParams();
  const router = useRouter();
  const communityId = params.idCommunity as string;

  const [community, setCommunity] = useState<Community | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags] = useState<string[]>([
    "C++",
    "Programación",
    "Desarrollo",
    "Algoritmos",
    "Estructuras de datos",
    "c++ en espanol",
  ]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // === React Hook Form ===
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createCommunitySchema),
    mode: "onBlur", // Valida al salir del campo
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await privateApiClient.get<Community>(
          `communities/${communityId}/`,
        );
        const data = response.data;
        setCommunity(data);

        // Establecer valores en el formulario
        setValue("name", data.name);
        setValue("description", data.description);

        // Establecer tags
        setSelectedTags(data.read_tags.map((tag) => tag.name));
      } catch (err) {
        setError("No se pudo cargar la comunidad.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (communityId) fetchCommunity();
  }, [communityId, setValue]);

  // Manejar envío del formulario
  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError(null);

    const payload = {
      id: communityId,
      name: data.name,
      description: data.description,
      tags: selectedTags,
    };

    try {
      await privateApiClient.patch(`/communities/${communityId}/`, payload);
      router.push(`/communities/community/${communityId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar los cambios.");
      console.error("Error updating community:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Manejar adición de tag
  const handleAddTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleNewTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value.trim();
    if (e.key === "Enter" && value) {
      handleAddTag(value);
      (e.target as HTMLInputElement).value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-bg-default rounded-xl border border-terciary shadow-lg p-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-red-100 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-200">
            ¡Ups! Algo salió mal
          </h2>
          <p className="text-gray-400">
            No pudimos conectar con el servidor. ¡Pero no te preocupes! Estamos
            trabajando para solucionarlo.
          </p>
          <p className="text-sm text-error font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition"
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-bg-gray rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Editar Comunidad
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Nombre de la comunidad
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.name ? "border-text-error" : "border-gray-300"
            }`}
            placeholder="Ej. Comunidad C++"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-text-error">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Descripción
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.description
                ? "border-text-error"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="Describe de qué trata la comunidad..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-text-error">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Etiquetas */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Etiquetas
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Presiona Enter para añadir una nueva etiqueta.
          </p>
          <div className="flex gap-2 justify-between items-center mb-4">
            <input
              type="text"
              id="tags"
              ref={tagInputRef}
              onKeyPress={handleNewTag}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
              placeholder="Ej. c++ en espanol"
            />
            <button
              type="button"
              onClick={() => {
                const value = tagInputRef.current?.value.trim() || "";
                if (value) {
                  handleAddTag(value);
                  tagInputRef.current!.value = "";
                }
              }}
              className="text-md px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-hover transition"
            >
              Agregar
            </button>
          </div>

          {/* Sugerencias */}
          <div className="flex flex-wrap gap-2 mb-4">
            {availableTags
              .filter((tag) => !selectedTags.includes(tag))
              .slice(0, 5)
              .map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleAddTag(tag)}
                  className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  + {tag}
                </button>
              ))}
          </div>

          {/* Etiquetas seleccionadas */}
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
