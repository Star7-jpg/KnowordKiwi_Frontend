"use client";
import ErrorMessageScreen from "@/components/shared/ErrorMessageScreen";
import privateApiClient from "@/services/client/privateApiClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Community } from "@/types/community/community";

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
    return <ErrorMessageScreen error={error} />;
  }

  return (
    <main className="min-h-screen text-white p-6 md:p-12 lg:p-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Explorar Comunidades 🌍
      </h1>
      <div className="space-y-12">
        {categoriesData.map((category, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-semibold capitalize">
                {category.tag.charAt(0).toUpperCase() + category.tag.slice(1)}
              </h2>
              <Link
                href={`/communities/${category.tag.toLowerCase()}`}
                className="text-sm text-gray-400 hover:text-terciary transition-colors duration-200"
              >
                Ver todo →
              </Link>
            </div>
            <div className="flex overflow-x-auto gap-4 p-2 -m-2 custom-scrollbar">
              {category.communities.map((community, idx) => (
                <Link
                  href={`/communities/community/${community.id}`}
                  key={idx}
                  className="flex-none w-64 h-40 rounded-lg relative overflow-hidden group transition-transform transform hover:scale-105 duration-300"
                >
                  {community.banner ? (
                    <Image
                      src={community.banner}
                      alt={`Banner de la comunidad ${community.name}`}
                      layout="fill"
                      objectFit="cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      priority={idx < 4}
                    />
                  ) : (
                    <div className="bg-[#121212] w-full h-full"></div>
                  )}
                  <div className="absolute inset-0  bg-opacity-40 flex items-end p-4 group-hover:bg-opacity-60 transition-colors duration-200">
                    <span className="text-white text-lg font-medium leading-tight">
                      {community.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d2d2d;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #555;
          border-radius: 4px;
        }
      `}</style>
    </main>
  );
}
