"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MessageCircle, Heart, User } from "lucide-react";
import { getBlogPostById } from "@/services/posts/blogs/blogsService"; // You'll need to implement this
import { BlogById } from "@/types/posts/blog";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState<BlogById | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    </article>
  );
}
