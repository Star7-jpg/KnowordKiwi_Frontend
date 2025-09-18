"use client";
import { useState, useEffect, useCallback } from "react";
import Tiptap from "../components/TipTap";
import BlogPreview from "../components/BlogPreview";
import { useRouter } from "next/navigation";
import { Input } from "@headlessui/react";
import CreateBlogHeader from "../components/CreateBlogHeader";
import { useDebounce } from "../hooks/useDebounce";

// Define el tipo para el borrador
interface BlogDraft {
  title: string;
  content: string;
  lastSaved: Date;
}

type SavingStatus = "idle" | "saving" | "saved";

export default function CreateBlogPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [savingStatus, setSavingStatus] = useState<SavingStatus>("idle");
  const router = useRouter();

  // Cargar borrador si existe
  useEffect(() => {
    const savedDraft = localStorage.getItem("blogDraft");
    if (savedDraft) {
      try {
        const draft: BlogDraft = JSON.parse(savedDraft);
        setTitle(draft.title);
        setContent(draft.content);
      } catch (e) {
        console.error("Error al cargar el borrador:", e);
      }
    }
  }, []);

  // Función para guardar el borrador
  const saveDraft = useCallback(() => {
    setSavingStatus("saving");
    const draft: BlogDraft = {
      title,
      content,
      lastSaved: new Date(),
    };
    localStorage.setItem("blogDraft", JSON.stringify(draft));

    setTimeout(() => {
      setSavingStatus("saved");
      setTimeout(() => {
        setSavingStatus("idle");
      }, 2000);
    }, 1000);
  }, [title, content]);

  // Crear versión debounce de la función de guardado
  const debouncedSaveDraft = useDebounce(saveDraft, 2000);

  // Efecto para guardar automáticamente cuando cambian título o contenido
  useEffect(() => {
    debouncedSaveDraft();
  }, [title, content, debouncedSaveDraft]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    saveDraft();
    alert("Borrador guardado");
  };

  const handleCancel = () => {
    router.push("/posts/blog");
  };

  const handleSubmit = async () => {
    // Limpiar el borrador guardado
    localStorage.removeItem("blogDraft");
    alert("Contenido publicado");
  };

  const handleTogglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const savingStatusText = {
    saving: "Guardando...",
    saved: "Guardado",
  };

  return (
    <div className="flex flex-col gap-8">
      <CreateBlogHeader
        onSubmit={handleSubmit}
        onSave={handleSave}
        onCancel={handleCancel}
        onTogglePreview={handleTogglePreview}
        isPreviewMode={isPreviewMode}
      />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center h-5">
          <label
            htmlFor="blog-title"
            className="text-sm font-medium text-gray-300"
          >
            Título del blog
          </label>
          {savingStatus !== "idle" && (
            <span className="text-xs text-gray-500">
              {savingStatusText[savingStatus]}
            </span>
          )}
        </div>
        <Input
          id="blog-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-3 bg-bg-gray border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Escribe el título de tu blog..."
        />
      </div>

      {isPreviewMode ? (
        <BlogPreview title={title} content={content} />
      ) : (
        <Tiptap content={content} onChange={handleContentChange} />
      )}
    </div>
  );
}
