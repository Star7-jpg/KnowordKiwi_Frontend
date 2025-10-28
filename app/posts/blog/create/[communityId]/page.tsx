"use client";
import { useState, useEffect, useCallback } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BlogPreview from "../../components/blog/BlogPreview";
import BlogHeader from "../../components/blog/CreateBlogHeader";
import Tiptap from "../../components/blog/TipTap";
import { BlogDraft, BlogPost } from "@/types/posts/blog";
import Modal from "@/components/shared/BlogModal";
import { createBlogPost } from "@/services/posts/blogs/blogsService";
import {
  blogPostSchema,
  type BlogPostFormData,
} from "@/app/posts/blog/schemas";
import { useDebounce } from "../../hooks/useDebounce";
import { DOM_PURIFY_CONFIG } from "../../config/dom-purify.config";
import CreateQuiz from "../../components/quiz/CreateQuiz";

type SavingStatus = "idle" | "saving" | "saved";

const sanitizeContent = (content: string) => {
  return DOMPurify.sanitize(content, DOM_PURIFY_CONFIG);
};

export default function CreateBlogPost() {
  const params = useParams();
  const communityId = Number(params.communityId);
  const router = useRouter();

  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

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
      subtitle: "",
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
        setValue("subtitle", draft.subtitle);
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
      subtitle: formData.subtitle,
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
  const watchedSubtitle = watch("subtitle");

  // Efecto para guardar automáticamente cuando cambian título o contenido
  useEffect(() => {
    debouncedSaveDraft();
  }, [watchedTitle, watchedContent, watchedSubtitle, debouncedSaveDraft]);

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
    // Preguntar al usuario si desea descartar cambios
    setModal({
      isOpen: true,
      title: "¿Estás seguro?",
      message: "Si sales ahora, perderás los cambios no guardados.",
      onConfirm: () => {
        setModal({ ...modal, isOpen: false });
        router.back();
      },
    });
  };

  const onSubmit = async (data: BlogPostFormData) => {
    try {
      const sanitizedContent = sanitizeContent(data.content);
      const blogData: BlogPost = {
        title: data.title,
        subtitle: data.subtitle,
        content: sanitizedContent,
        communityId: communityId,
        questions: quizQuestions, // Añadir las preguntas del quiz
      };

      const response = await createBlogPost(blogData);
      const blogTitle = response.title || "Tu blog";
      localStorage.removeItem("blogDraft");

      setModal({
        isOpen: true,
        title: "Contenido publicado",
        message: `${blogTitle} ha sido publicado exitosamente en la comunidad.`,
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
      <BlogHeader
        onSubmit={handleSubmitForm(onSubmit)}
        onSave={handleSave}
        onCancel={handleCancel}
        onTogglePreview={handleTogglePreview}
        isPreviewMode={isPreviewMode}
        isEditing={false}
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

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center h-5">
          <label
            htmlFor="blog-subtitle"
            className="text-sm font-medium text-gray-300"
          >
            Subtítulo del blog
          </label>
        </div>
        <Controller
          name="subtitle"
          control={control}
          render={({ field }) => (
            <Input
              id="blog-subtitle"
              type="text"
              value={field.value}
              onChange={field.onChange}
              className={`px-4 py-3 bg-bg-gray border ${
                errors.subtitle ? "border-red-500" : "border-gray-700"
              } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Escribe el subtítulo atractivo para tu blog..."
            />
          )}
        />
        {errors.subtitle && (
          <p className="text-sm text-red-500 mt-1">{errors.subtitle.message}</p>
        )}
      </div>

      {isPreviewMode ? (
        <BlogPreview
          title={getValues("title")}
          content={getValues("content")}
        />
      ) : (
        <>
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
          <div>
            <CreateQuiz
              onQuestionsChange={(questions) => setQuizQuestions(questions)}
            />
          </div>
        </>
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
