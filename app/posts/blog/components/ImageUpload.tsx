"use client";

import { Button } from "@headlessui/react";
import { Image as ImageIcon } from "lucide-react";
import { Editor } from "@tiptap/react";
import { useRef } from "react";

interface ImageUploadProps {
  editor: Editor | null;
}

export default function ImageUpload({ editor }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    // Validar que el archivo sea una imagen
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen válido.");
      return;
    }

    // Validar tamaño máximo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es demasiado grande. El tamaño máximo es 5MB.");
      return;
    }

    // En una implementación real, aquí se enviaría la imagen a un servicio de almacenamiento
    // y se obtendría la URL para insertar en el editor
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      editor.chain().focus().setImage({ src: imageUrl }).run();
    };
    reader.readAsDataURL(file);

    // Limpiar el input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        title="Insertar imagen"
      >
        <ImageIcon className="size-4" />
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </>
  );
}