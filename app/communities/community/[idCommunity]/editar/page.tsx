"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCommunitySchema } from "@/app/communities/schemas";
import privateApiClient from "@/services/privateApiClient";
import debounce from "lodash/debounce";
import { Field, Fieldset, Input, Label, Legend } from "@headlessui/react";
import { ImageIcon } from "lucide-react";
import ErrorMessageScreen from "@/components/shared/ErrorMessageScreen";
import { uploadToCloudinary } from "@/services/cloudinaryService";

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
  avatar: string | null;
  banner: string | null;
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
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
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
        if (data.banner) {
          setBannerPreview(data.banner);
          setValue("banner", data.banner);
        }
        if (data.avatar) {
          setAvatarPreview(data.avatar);
          setValue("avatar", data.avatar);
        }
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
    setSubmissionError(null);
    const payload = {
      id: communityId,
      name: data.name,
      description: data.description,
      tags: selectedTags,
      avatar: data.avatar,
      banner: data.banner,
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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "avatar",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setPreview = type === "banner" ? setBannerPreview : setAvatarPreview;
    const setIsLoading =
      type === "banner" ? setIsUploadingBanner : setIsUploadingAvatar;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setIsLoading(true);
    setSubmissionError(null);
    try {
      const cloudinaryUrl = await uploadToCloudinary(file);
      setValue(type, cloudinaryUrl, { shouldValidate: true });
    } catch (error) {
      console.error(`Error al subir la imagen de ${type}:`, error);
      setSubmissionError(
        `No se pudo subir la imagen de ${type}. Inténtalo de nuevo.`,
      );
      setPreview(null);
      setValue(type, undefined, { shouldValidate: true });
    } finally {
      setIsLoading(false);
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
    return <ErrorMessageScreen error={error} />;
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

        {/* Imágenes */}
        <Fieldset className="bg-bg-gray rounded-lg shadow-md p-6 w-full">
          <Legend className="text-lg font-semibold text-white mb-1">
            Imágenes de la comunidad
          </Legend>
          <p className="text-sm text-gray-400 mb-6">
            Añade un banner y un avatar representativo para que tu comunidad se
            vea única.
          </p>

          <div className="space-y-6">
            {/* Banner */}
            <label className="block border border-dashed border-zinc-600 rounded-lg p-6 cursor-pointer hover:border-white transition text-center relative">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "banner")}
                disabled={isUploadingBanner}
              />
              {isUploadingBanner && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
              {bannerPreview ? (
                <Image
                  src={bannerPreview}
                  width={1840}
                  height={560}
                  alt="Previsualización de la cabecera"
                  className="w-full max-h-48 object-cover rounded-md"
                />
              ) : (
                !isUploadingBanner && (
                  <>
                    <strong className="block text-white mb-1">
                      Sube la cabecera
                    </strong>
                    <p className="text-sm text-zinc-400">
                      Pulsa aquí para elegir una imagen. Debe tener un tamaño de
                      1840 x 560 píxeles.
                    </p>
                  </>
                )
              )}
            </label>

            {/* Avatar */}
            <label className="flex items-center gap-4 cursor-pointer group transition">
              <div className="w-20 h-20 border border-dashed border-zinc-600 rounded-lg flex items-center justify-center bg-gray-800 relative">
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
                {avatarPreview && !isUploadingAvatar ? (
                  <Image
                    src={avatarPreview}
                    width={512}
                    height={512}
                    alt="Previsualización del avatar"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  !isUploadingAvatar && (
                    <ImageIcon className="text-zinc-400 w-6 h-6" />
                  )
                )}
              </div>

              <div className="flex flex-col">
                <strong className="text-sm text-white mb-1">
                  Sube un avatar
                </strong>
                <p className="text-sm text-zinc-400">
                  El formato ideal es cuadrado con un tamaño de 512 píxeles.
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "avatar")}
                disabled={isUploadingAvatar}
              />
            </label>
          </div>
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
