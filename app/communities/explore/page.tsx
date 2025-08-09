"use client";
import privateApiClient from "@/services/privateApiClient";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Tag {
  id: string;
  name: string;
}

interface Community {
  id: string;
  read_tags: Tag[];
  name: string;
  description: string;
  avatar: string | null;
  banner: string | null;
  is_private: boolean;
  created_by: string;
}

interface CategoryData {
  tag: string;
  communities: Community[];
}

export default function ExploreCommunitiesPage() {
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await privateApiClient("explore/");
        const data: CategoryData[] = response.data;
        setCategoriesData(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(
          "Hubo un error al cargar las comunidades. Intenta de nuevo más tarde.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen text-white p-6 flex items-center justify-center">
        <p>Cargando comunidades...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-bg-default rounded-xl border border-terciary shadow-lg p-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-red-100 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-200">
            ¡Ups! Algo salió mal
          </h2>
          <p className="text-gray-400">
            No pudimos conectar con el servidor. ¡Pero no te preocupes! Estamos
            trabajando para solucionarlo.
          </p>
          <p className="text-sm text-error font-medium">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition"
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Explorar Comunidades</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoriesData.map((category, index) => (
          <div
            key={index}
            className="bg-bg-gray rounded-lg shadow-md p-4 flex flex-col justify-between"
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Renderiza solo las primeras 4 comunidades */}
              {category.communities.slice(0, 4).map((community, idx) => (
                <div
                  key={idx}
                  className="bg-[#121212] rounded-md h-24 flex items-center justify-center text-sm text-center p-2"
                >
                  {community.name}
                </div>
              ))}
            </div>
            <Link
              href={`/communities/${category.tag.toLowerCase()}`}
              className="text-sm font-semibold hover:underline"
            >
              {category.tag.charAt(0).toUpperCase() + category.tag.slice(1)}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
