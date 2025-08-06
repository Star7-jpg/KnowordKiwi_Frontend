"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCommunitySchema } from "@/app/communities/schemas";
import privateApiClient from "@/services/privateApiClient";
import debounce from "lodash/debounce";
import {
  Dialog,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
} from "@headlessui/react";
import { ImageIcon } from "lucide-react";

type ReadTag = {
  id: string;
  name: string;
};
type TagsResponse = {
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
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const maxTags = 5;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(createCommunitySchema),
    mode: "onBlur",
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
        setValue("name", data.name);
        setValue("description", data.description);
        setSelectedTags(data.read_tags.map((tag) => tag.name.toLowerCase()));
      } catch (err) {
        setError("No se pudo cargar la comunidad.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (communityId) fetchCommunity();
  }, [communityId, setValue]);

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

  const handleAddTag = (tag: string) => {
    const newTag = tag.trim().toLowerCase();
    if (!newTag) return;
    if (selectedTags.includes(newTag)) {
      alert("Esta etiqueta ya ha sido agregada.");
      return;
    }
    if (selectedTags.length >= maxTags) {
      alert(`Solo puedes agregar hasta ${maxTags} etiquetas.`);
      return;
    }
    setSelectedTags((prev) => [...prev, newTag]);
    setInputValue("");
    setSuggestions([]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleNewTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  const fetchTagSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await privateApiClient.get<TagsResponse[]>(
          `/communities/tags/suggestions?q=${query}`,
        );
        const newSuggestions = response.data
          .filter((s) => !selectedTags.includes(s.name.toLowerCase()))
          .map((s) => s.name);
        setSuggestions(newSuggestions);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [selectedTags],
  );

  useEffect(() => {
    fetchTagSuggestions(inputValue);
    return () => {
      fetchTagSuggestions.cancel();
    };
  }, [inputValue, fetchTagSuggestions]);

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
        <div className="max-w-md w-full bg-gray-800 rounded-xl border border-gray-600 shadow-lg p-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-red-900 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-400"
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
          <h2 className="text-2xl font-bold text-white">
            ¡Ups! Algo salió mal
          </h2>
          <p className="text-gray-400">
            No pudimos conectar con el servidor. Estamos trabajando para
            solucionarlo.
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
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Editar Comunidad</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-3xl mx-auto"
      >
        {/* Información de la comunidad */}
        <Fieldset className="bg-bg-gray rounded-lg shadow-md p-6">
          <Legend className="text-lg font-semibold text-white mb-1">
            Información de la comunidad
          </Legend>
          <p className="text-sm text-gray-400 mb-6">
            Actualiza el nombre y descripción de tu comunidad.
          </p>

          <Field className="mb-6">
            <Label className="block text-sm font-medium mb-1 text-white">
              Título de la comunidad
            </Label>
            <Input
              type="text"
              placeholder="Ej. Matemáticas y física"
              className={`w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary ${
                errors.name
                  ? "focus:ring-red-500 border border-red-500"
                  : "focus:ring-primary"
              }`}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </Field>

          <Field>
            <Label className="block text-sm font-medium mb-1 text-white">
              Descripción de la comunidad
            </Label>
            <Input
              type="text"
              placeholder="Ej. Un lugar para discutir y aprender sobre matemáticas y física."
              className={`w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary ${
                errors.description
                  ? "focus:ring-red-500 border border-red-500"
                  : "focus:ring-primary"
              }`}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-error text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </Field>
        </Fieldset>

        {/* Etiquetas */}
        <Fieldset className="bg-bg-gray rounded-lg shadow-md p-6">
          <Legend className="text-lg font-semibold text-white mb-1">
            Temas de la comunidad
          </Legend>
          <p className="text-sm text-gray-400 mb-4">
            Añade o edita etiquetas para mejorar la visibilidad de tu comunidad.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="animate-rainbow-bg text-white px-6 py-3 rounded-md flex items-center text-lg font-semibold shadow-lg transition-transform duration-200 hover:scale-105"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-3 text-red-300 hover:text-red-100 text-2xl font-bold focus:outline-none"
                  aria-label={`Remove ${tag}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          {selectedTags.length < maxTags && (
            <div>
              <Input
                type="text"
                placeholder="Ej. programación"
                className="w-full border border-gray-600 rounded px-3 py-2 text-sm bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleNewTag}
              />
              {isSearching && (
                <p className="text-sm text-gray-400 italic flex items-center gap-2 mt-2">
                  <span className="animate-pulse">🔍</span> Buscando...
                </p>
              )}
              {suggestions.length > 0 && !isSearching && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestions.slice(0, 5).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleAddTag(suggestion)}
                      className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-100 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTags.length >= maxTags && (
            <p className="text-sm text-gray-400 mt-2">
              Has alcanzado el máximo de {maxTags} etiquetas.
            </p>
          )}
        </Fieldset>

        {/* Acciones */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed transition"
          >
            {submitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
