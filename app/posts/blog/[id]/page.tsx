"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageCircle, Heart, User, Edit3, Trash2 } from "lucide-react";
import {
  getBlogPostById,
  deleteBlogPost,
} from "@/services/posts/blogs/blogsService";
import { BlogById } from "@/types/posts/blog/blogById";
import Modal from "@/components/shared/BlogModal";

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blogPost, setBlogPost] = useState<BlogById | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogPostById(Number(id));
        setBlogPost(data);
        console.log(data);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("No se pudo cargar el contenido del blog.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Blog no encontrado.</p>
      </div>
    );
  }

  // Para esta implementación, asumiremos que el usuario actual es el autor
  // En una implementación real, esto se verificaría con el ID del usuario actual
  const currentUserIsAuthor = true; // TODO: Implementar verificación real de autoría

  const handleEdit = () => {
    router.push(`/posts/blog/edit/${id}`);
  };

  const confirmDelete = () => {
    setModal({
      isOpen: true,
      title: "Eliminar blog",
      message: `¿Estás seguro de que deseas eliminar "${blogPost.title}"? Esta acción no se puede deshacer.`,
      onConfirm: handleDelete,
    });
  };

  const handleDelete = async () => {
    try {
      await deleteBlogPost(Number(id));
      setModal({
        ...modal,
        isOpen: false,
      });
      router.push("/profile/me");
    } catch (error) {
      console.error("Error deleting blog post:", error);
      setModal({
        ...modal,
        isOpen: false,
      });
      // Mostrar un mensaje de error si falla la eliminación
      setModal({
        isOpen: true,
        title: "Error",
        message: "No se pudo eliminar el blog. Por favor, inténtalo de nuevo.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
      });
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
            <User className="text-gray-300 w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {blogPost.author.user.username}
            </h3>
            <p className="text-sm text-gray-400">Hace 5 días</p>{" "}
            {/* You may want to implement a proper time
   ago function */}
          </div>

          {currentUserIsAuthor && (
            <>
              <button
                onClick={handleEdit}
                className="ml-auto flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
              >
                <Edit3 size={16} />
                Editar
              </button>
              <button
                onClick={confirmDelete}
                className="ml-2 flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </>
          )}
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">{blogPost.title}</h1>

        <p className="text-xl text-gray-300 mb-6">
          {blogPost.blogContent.subtitle}
        </p>

        <div className="flex items-center text-gray-400 text-sm">
          <span className="mr-4">Compartir</span>
          <div className="flex items-center mr-4">
            <Heart size={18} className="mr-1" />
            {/* <span>{blogPost.reactions || 0}</span> */}
          </div>
          <div className="flex items-center">
            <MessageCircle size={18} className="mr-1" />
            {/* <span>{blogPost.comments || 0}</span> */}
          </div>
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        <div
          dangerouslySetInnerHTML={{ __html: blogPost.blogContent.content }}
        />
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        onConfirm={modal.onConfirm}
      >
        {modal.message}
      </Modal>
    </article>
  );
}
