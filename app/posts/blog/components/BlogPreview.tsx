"use client";

import { useState, useEffect } from "react";

interface BlogPreviewProps {
  title: string;
  content: string;
}

export default function BlogPreview({ title, content }: BlogPreviewProps) {
  const [sanitizedContent, setSanitizedContent] = useState(
    "<p>Cargando vista previa...</p>",
  );

  useEffect(() => {
    // Importar DOMPurify dinámicamente solo en el lado del cliente
    import("isomorphic-dompurify").then((DOMPurify) => {
      setSanitizedContent(
        DOMPurify.sanitize(
          content || "<p>El contenido del blog aparecerá aqui...</p>",
          {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code', 'hr', 'div', 'iframe', 'a', 'img'],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'width', 'height', 'class', 'rel', 'target', 'data-youtube-video'],
            ADD_ATTR: ['allowfullscreen'],
            ALLOWED_IFRAME_HOSTNAMES: ['www.youtube.com', 'youtube.com', 'youtu.be'],
          }
        ),
      );
    });
  }, [content]);

  return (
    <div className="bg-bg-gray border border-gray-700 rounded-md p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          {title || "Título del blog"}
        </h1>
        <div className="flex items-center text-gray-400 text-sm">
          <span>Por Autor del Blog</span>
          <span className="mx-2">•</span>
        </div>
      </header>

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{
          __html: sanitizedContent,
        }}
      />
    </div>
  );
}
