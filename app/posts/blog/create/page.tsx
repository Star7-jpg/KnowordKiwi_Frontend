"use client";
import { useState } from "react";
import Tiptap from "../components/TipTap";
import { useRouter } from "next/navigation";
import { Button, Input } from "@headlessui/react";
import CreateBlogHeader from "../components/CreateBlogHeader";

export default function CreateBlogPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    // TODO: Implementar lógica para guardar borrador
    console.log("Guardando título:", title);
    console.log("Guardando contenido:", content);
    alert("Contenido guardado (simulación)");
  };

  const handleCancel = () => {
    router.push("/posts/blog");
  };

  const handleSubmit = async () => {
    alert("Contenido publicado (simulación)");
  };

  return (
    <div className="flex flex-col gap-8">
      <CreateBlogHeader
        onSubmit={handleSubmit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      <div className="flex flex-col gap-2">
        <label
          htmlFor="blog-title"
          className="text-sm font-medium text-gray-300"
        >
          Título del blog
        </label>
        <Input
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
