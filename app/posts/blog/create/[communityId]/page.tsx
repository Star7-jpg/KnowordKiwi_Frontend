"use client";
import { useState, useEffect, useCallback } from "react";
import DOMPurify, { Config } from "isomorphic-dompurify";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BlogPreview from "../../components/BlogPreview";
import CreateBlogHeader from "../../components/CreateBlogHeader";
import Tiptap from "../../components/TipTap";
import { BlogDraft, BlogPost } from "@/types/posts/blog";
import Modal from "@/components/shared/BlogModal";
import { createBlogPost } from "@/services/posts/blogs/blogsService";
import {
  blogPostSchema,
  type BlogPostFormData,
} from "@/app/posts/blog/schemas";
import { useDebounce } from "../../hooks/useDebounce";

type SavingStatus = "idle" | "saving" | "saved";

const DOM_PURIFY_CONFIG: Config = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "ol",
    "ul",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "pre",
    "code",
    "hr",
    "div",
    "iframe",
    "a",
    "img",
  ],
  ALLOWED_ATTR: [
    "href",
    "src",
    "alt",
    "width",
    "height",
    "class",
    "rel",
    "target",
    "data-youtube-video",
  ],
  ADD_ATTR: ["allowfullscreen"],
  ALLOWED_IFRAME_HOSTNAMES: ["www.youtube.com", "youtube.com", "youtu.be"],
};

const sanitizeContent = (content: string) => {
  return DOMPurify.sanitize(content, DOM_PURIFY_CONFIG);
};

export default function CreateBlogPost() {
  const params = useParams();
  const communityId = Number(params.communityId);
  const router = useRouter();

  const {
    control,
    handleSubmit: handleSubmitForm,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [savingStatus, setSavingStatus] = useState<SavingStatus>("idle");
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Cargar borrador si existe
  useEffect(() => {
    const savedDraft = localStorage.getItem("blogDraft");
    if (savedDraft) {
      try {
        const draft: BlogDraft = JSON.parse(savedDraft);
        setValue("title", draft.title);
        const sanitizedContent = sanitizeContent(draft.content);
        setValue("content", sanitizedContent);
      } catch (e) {
        console.error("Error al cargar el borrador:", e);
        // Si hay un error, limpiar el borrador corrupto
        localStorage.removeItem("blogDraft");
      }
    }
  }, [setValue]);

  // Función para guardar el borrador
  const saveDraft = useCallback(() => {
    setSavingStatus("saving");
    const formData = getValues();
    const sanitizedContent = sanitizeContent(formData.content);
    const draft: BlogDraft = {
      title: formData.title,
      content: sanitizedContent,
      lastSaved: new Date(),
    };
    localStorage.setItem("blogDraft", JSON.stringify(draft));

    setTimeout(() => {
      setSavingStatus("saved");
      setTimeout(() => {
        setSavingStatus("idle");
      }, 2000);
    }, 1000);
  }, [getValues]);

  // Crear versión debounce de la función de guardado
  const debouncedSaveDraft = useDebounce(saveDraft, 1500);

  const watchedTitle = watch("title");
  const watchedContent = watch("content");

  // Efecto para guardar automáticamente cuando cambian título o contenido
  useEffect(() => {
    debouncedSaveDraft();
  }, [watchedTitle, watchedContent, debouncedSaveDraft]);

  const handleSave = async () => {
    saveDraft();
    setModal({
      isOpen: true,
      title: "Borrador guardado",
      message:
        "Tu borrador ha sido guardado exitosamente en el almacenamiento local.",
      onConfirm: () => setModal({ ...modal, isOpen: false }),
    });
  };

  const handleCancel = () => {
    // TODO: Preguntar si quiere guardar antes de salir
    router.back();
  };

  const onSubmit = async (data: BlogPostFormData) => {
    try {
      const sanitizedContent = sanitizeContent(data.content);
      const blogData: BlogPost = {
        title: data.title,
        content: sanitizedContent,
        communityId: communityId,
      };

      await createBlogPost(blogData);
      localStorage.removeItem("blogDraft");

      setModal({
        isOpen: true,
        title: "Contenido publicado",
        message: "Tu blog ha sido publicado exitosamente en la comunidad.",
        onConfirm: () => {
          setModal({ ...modal, isOpen: false });
          router.push(`/communities/community/${communityId}`); // Redirigir a la comunidad
        },
      });
    } catch (error) {
      console.error("Error al crear el blog:", error);
      setModal({
        isOpen: true,
        title: "¡Ups! Algo salió mal",
        message: "Tu blog no ha podido ser publicado en la comunidad.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
      });
    }
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
        onSubmit={handleSubmitForm(onSubmit)}
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
          {errors.title && (
            <span className="text-xs text-red-500 ml-2">
              {errors.title.message}
            </span>
          )}
        </div>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              id="blog-title"
              type="text"
              value={field.value}
              onChange={field.onChange}
              className={`px-4 py-3 bg-bg-gray border ${
                errors.title ? "border-red-500" : "border-gray-700"
              } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Escribe el título de tu blog..."
            />
          )}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      {isPreviewMode ? (
        <BlogPreview
          title={getValues("title")}
          content={getValues("content")}
        />
      ) : (
        <div className="relative">
          <Controller
            name="content"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Tiptap
                content={value}
                onChange={(newContent) => {
                  onChange(newContent);
                  // Actualizar el contenido en el formulario
                  setValue("content", newContent, { shouldValidate: true });
                }}
              />
            )}
          />
          {errors.content && (
            <p className="text-sm text-red-500 mt-1">
              {errors.content.message}
            </p>
          )}
        </div>
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        onConfirm={modal.onConfirm}
      >
        {modal.message}
      </Modal>
    </div>
  );
}
