"use client";

import { MapPin, Briefcase, Sparkles } from "lucide-react";
import Image from "next/image";

export function Banner() {
  return (
    <section className="w-full max-w-5xl mx-auto bg-[#1f2937] text-white px-8 py-12 rounded-md shadow-md flex flex-col gap-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        {/* Avatar + seguidores */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-600 shadow">
            <Image
              src="/default-avatar.jpeg"
              alt="Foto de perfil"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex gap-8 text-center">
            <div>
              <p className="text-xl font-semibold">1</p>
              <span className="text-sm text-gray-400">Seguidores</span>
            </div>
            <div>
              <p className="text-xl font-semibold">1</p>
              <span className="text-sm text-gray-400">Siguiendo</span>
            </div>
          </div>
        </div>

        {/* Información del equipo */}
        <div className="space-y-4 max-w-2xl text-center md:text-left">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold leading-snug">AlphaEdu</h1>
            <p className="text-base text-gray-300">Team KnowordKiwi</p>
          </div>

          <div className="text-sm text-gray-400 leading-relaxed space-y-2">
            <p>
              Somos un equipo de diseño y desarrolladores que buscan ayudarte en tus procesos de aprendizaje.
              Con nosotros podrás crear cursos, unirte a comunidades, compartir tus conocimientos y mucho más.
              Además, podrás tener tu propio perfil donde compartir tus habilidades.
              ¡Es tu momento de unirte a nuestra plataforma y comenzar a aprender y enseñar!
            </p>

            <ul className="list-disc pl-6 text-sm text-gray-300">
              <li>@Eric</li>
              <li>@Mike</li>
              <li>@Marcos</li>
              <li>@Abraham</li>
            </ul>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-300 pt-2">
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
        </div>
      </div>
    </section>
  );
}