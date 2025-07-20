"use client";
import { useState } from "react";
import { Field, Fieldset, Input, Label, Legend } from "@headlessui/react";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createCommunitySchema } from "../schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type CreateCommunityPageData = z.infer<typeof createCommunitySchema>;

export default function CreateCommunityPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [headerPreview, setHeaderPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const maxTags = 5;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateCommunityPageData>({
    resolver: zodResolver(createCommunitySchema),
    mode: "onTouched",
  });

  watch("title");
  watch("description");

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      if (tags.includes(newTag)) {
        alert("Esta etiqueta ya ha sido agregada.");
        return;
      }
      if (tags.length >= maxTags) return;
      setTags((prev) => [...prev, newTag]);
      setInputValue("");
    }
  }

  function handleTagRemove(tagToRemove: string) {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  }

  function submitCreateCommunityForm(data: CreateCommunityPageData) {
    // Aquí iría la lógica para enviar los datos al backend
    console.log("Datos de la comunidad:", data);
    console.log("Etiquetas:", tags);
    console.log("Cabecera:", headerPreview);
    console.log("Avatar:", avatarPreview);

    // Redirigir a la página de comunidades después de crear
    // router.push("/communities");
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Crear Comunidad</h1>
      <form
        className="space-y-6"
        onSubmit={handleSubmit(submitCreateCommunityForm)}
      >
        {/* Información de la comunidad */}
        <Fieldset className="bg-bg-gray rounded-lg shadow-md p-6 w-5/6 mx-auto">
          <Legend className="text-lg font-semibold text-white mb-1">
            Información de la comunidad
          </Legend>
          <p className="text-sm text-gray-400 mb-6">
            Estamos emocionados de ver tu comunidad cobrar vida. Cuéntanos un
            poco de lo que tienes en mente.
          </p>

          <Field className="mb-6">
            <Label className="block text-sm font-medium mb-1 text-white">
              Título de la comunidad
            </Label>
            <Input
              type="text"
              placeholder="Ej. Matemáticas y física"
              className={`w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 ${errors.title ? "border-text-error focus:border-text-error focus:ring-red-500" : "border-gray-300 focus:ring-secondary focus:border-secondary"}`}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-error text-sm mt-1">{errors.title.message}</p>
            )}
          </Field>

          <Field>
            <Label className="block text-sm font-medium mb-1 text-white">
              Descripción de la comunidad
            </Label>
            <Input
              type="text"
              placeholder="Ej. Un lugar para discutir y aprender sobre matemáticas y física."
              className={`w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 ${errors.description ? "border-text-error focus:border-text-error focus:ring-red-500" : "border-gray-300 focus:ring-secondary focus:border-secondary"}`}
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
        <Fieldset className="bg-bg-gray rounded-lg shadow-md p-6 w-5/6 mx-auto">
          <Legend className="text-lg font-semibold text-white mb-1">
            Temas de la comunidad
          </Legend>
          <p className="text-sm text-gray-400 mb-4">
            Añade al menos 3 etiquetas para que los demás puedan encontrar tu
            comunidad fácilmente.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-800 text-white px-3 py-1 rounded-full flex items-center text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-2 text-red-400 hover:text-red-600"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          {tags.length < maxTags && (
            <Input
              type="text"
              placeholder="Ej. programación"
              className="w-50 border border-gray-600 rounded px-3 py-2 text-sm bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          )}

          {tags.length >= maxTags && (
            <p className="text-sm text-gray-400 mt-2">
              Has agregado el máximo de {maxTags} etiquetas.
            </p>
          )}
        </Fieldset>

        {/* Imágenes */}
        <Fieldset className="bg-bg-gray rounded-lg shadow-md p-6 w-5/6 mx-auto">
          <Legend className="text-lg font-semibold text-white mb-1">
            Imágenes de la comunidad
          </Legend>
          <p className="text-sm text-gray-400 mb-6">
            Añade un banner y un avatar representativo para que tu comunidad se
            vea única.
          </p>

          <div className="space-y-6">
            {/* Banner */}
            <label className="block border border-dashed border-zinc-600 rounded-lg p-6 cursor-pointer hover:border-white transition text-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, setHeaderPreview)}
              />
              {headerPreview ? (
                <img
                  src={headerPreview}
                  alt="Cabecera"
                  className="w-full max-h-48 object-cover rounded-md"
                />
              ) : (
                <>
                  <strong className="block text-white mb-1">
                    Sube la cabecera
                  </strong>
                  <p className="text-sm text-zinc-400">
                    Pulsa aquí para elegir una imagen. Debe tener un tamaño de
                    1840 x 560 píxeles.
                  </p>
                </>
              )}
            </label>

            {/* Avatar */}
            <label className="flex items-center gap-4 cursor-pointer group transition">
              <div className="w-20 h-20 border border-dashed border-zinc-600 rounded-lg flex items-center justify-center bg-gray-800">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <ImageIcon className="text-zinc-400 w-6 h-6" />
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
                onChange={(e) => handleImageChange(e, setAvatarPreview)}
              />
            </label>
          </div>
        </Fieldset>
        {/* Botón de creación */}
        <div className="flex mt-6 justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-color-text font-bold rounded hover:bg-primary-hover transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid || tags.length < 3}
          >
            Crear comunidad
          </button>
          <button
            type="button"
            onClick={() => router.push("/communities")}
            className="px-4 py-2 bg-gray-600 text-color-text font-bold rounded hover:bg-gray-700 transition duration-300 ml-4"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
