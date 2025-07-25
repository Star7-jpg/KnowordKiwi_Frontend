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
  avatar_url: string | null;
  banner_url: string | null;
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
      <main className="min-h-screen text-white p-6 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
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
