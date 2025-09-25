"use client";
import { useState, useEffect, useCallback } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@headlessui/react";
import BlogPreview from "../../components/BlogPreview";
import CreateBlogHeader from "../../components/CreateBlogHeader";
import Tiptap from "../../components/TipTap";
import { useDebounce } from "../../hooks/useDebounce";
import { BlogDraft } from "@/types/posts/blog";
import Modal from "@/components/Modal";

type SavingStatus = "idle" | "saving" | "saved";

export default function CreateBlogPost() {
  const params = useParams();
  const communityId = params.communityId;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [savingStatus, setSavingStatus] = useState<SavingStatus>("idle");
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
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
    const sanitizedContent = DOMPurify.sanitize(newContent);
    setContent(sanitizedContent);
  };

  const handleSave = async () => {
    saveDraft();
    setModal({
      isOpen: true,
      title: "Borrador guardado",
      message:
        "Tu borrador ha sido guardado exitosamente en el almacenamiento local.",
      onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const handleCancel = () => {
    router.push("/posts/blog");
  };

  const handleSubmit = async () => {
    // Limpiar el borrador guardado
    localStorage.removeItem("blogDraft");
    console.log("Publicando blog con título:", title);
    console.log("Contenido:", content);
    console.log("Comunidad ID:", communityId);
    setModal({
      isOpen: true,
      title: "Contenido publicado",
      message: "Tu blog ha sido publicado exitosamente en la comunidad.",
      onConfirm: () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
        // router.push(`/posts/blog/${communityId}`);
      },
    });
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

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        title={modal.title}
        onConfirm={modal.onConfirm}
      >
        {modal.message}
      </Modal>
    </div>
  );
}
