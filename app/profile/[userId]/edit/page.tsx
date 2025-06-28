"use client";

import { useState } from "react";
import { MapPin, Briefcase, Sparkles } from "lucide-react";
import Image from "next/image";

export default function EditProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Alpha Edu");
  const [description, setDescription] = useState(
    "Somos un equipo de diseño y desarrolladores que buscan ayudarte en tus procesos de aprendizaje."
  );
  const [followers, setFollowers] = useState(1);
  const [following, setFollowing] = useState(1);

  const [image, setImage] = useState("/default-avatar.jpeg");
  const [preview, setPreview] = useState(image);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      // Aquí puedes guardar el archivo o enviarlo a tu backend
    }
  };

  const handleSave = () => {
    // Aquí podrías enviar datos al backend
    setImage(preview);
    setIsEditing(false);
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gray-900 px-4 py-10">
      <div className="w-full max-w-4xl bg-[#1f2937] text-white px-10 py-8 rounded-md shadow-md flex flex-col gap-y-6 items-center text-center">
        
        {/* Foto de perfil */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden border border-gray-600 shadow">
          <Image
            src={preview}
            alt="Foto de perfil"
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Cambiar imagen"
            />
          )}
        </div>

        {/* Nombre */}
        {isEditing ? (
          <input
            className="text-2xl sm:text-3xl font-bold text-center bg-transparent border-b border-gray-500 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <h1 className="text-3xl sm:text-4xl font-bold leading-snug">{name}</h1>
        )}

        {/* Seguidores / Siguiendo */}
        <div className="flex gap-10 text-center">
          <div>
            <p className="text-xl font-semibold">{followers}</p>
            <span className="text-sm text-gray-400">Seguidores</span>
          </div>
          <div>
            <p className="text-xl font-semibold">{following}</p>
            <span className="text-sm text-gray-400">Siguiendo</span>
          </div>
        </div>

        {/* Descripción */}
        {isEditing ? (
          <textarea
            className="text-base text-gray-300 bg-transparent border border-gray-600 rounded-md px-4 py-2 w-full max-w-2xl resize-none"
            value={description}
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
          />
        ) : (
          <p className="text-base text-gray-300 max-w-2xl">{description}</p>
        )}

        {/* Detalles con iconos */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
          <span className="flex items-center gap-1">
            <MapPin size={16} className="text-blue-500" /> Huamantla
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={16} className="text-blue-500" /> Desarrolladores
          </span>
          <span className="flex items-center gap-1">
            <Sparkles size={16} className="text-blue-500" /> Diseño + Código
          </span>
        </div>

        {/* Botón editar o guardar */}
        {isEditing ? (
          <button
            onClick={handleSave}
            className="mt-6 px-5 py-2 bg-green-600 hover:bg-green-700 transition-colors rounded-md text-sm font-medium"
          >
            Guardar Perfil
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-md text-sm font-medium"
          >
            Editar Perfil
          </button>
        )}
      </div>
    </section>
  );
}
