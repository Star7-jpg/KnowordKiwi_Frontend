"use client";
import { useState } from "react";
import Tiptap from "../components/TipTap";
import { useRouter } from "next/navigation";
import { Button } from "@headlessui/react";

export default function CreateBlogPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    // TODO: Implementar lógica para guardar, por ejemplo, enviar a una API
    console.log("Guardando título:", title);
    console.log("Guardando contenido:", content);
    alert("Contenido guardado (simulación)");
  };

  const handleCancel = () => {
    router.push("/posts/blog");
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Crear nuevo blog</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors font-semibold"
          >
            Guardar
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="blog-title"
          className="text-sm font-medium text-gray-300"
        >
          Título del blog
        </label>
        <input
          id="blog-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-3 bg-bg-gray border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Escribe el título de tu blog..."
        />
      </div>

      <Tiptap content={content} onChange={handleContentChange} />
    </div>
  );
}
