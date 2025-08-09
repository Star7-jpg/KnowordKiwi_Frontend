import privateApiClient from "@/services/privateApiClient";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Community } from "@/types/community/community";

type CommunityWithMemberCount = Community & {
  member_count: number;
};

async function getCommunitiesByCategory(
  category: string,
): Promise<CommunityWithMemberCount[]> {
  try {
    const response = await privateApiClient(`communities/tag/${category}/`);
    console.log(response.data);
    return await response.data;
  } catch (error) {
    console.error("Error fetching communities:", error);
    // Podrías retornar un array vacío o manejar el error de otra forma
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const categoryForApi = params.category;
  const communities = await getCommunitiesByCategory(categoryForApi);
  const displayCategory = decodeURIComponent(params.category);

  // Si no hay comunidades para esta categoría, mostramos notFound
  if (communities.length === 0) {
    notFound();
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        Comunidades de {displayCategory}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
        {communities.map((community) => (
          <div
            key={community.id}
            className="bg-[#121212] rounded-xl overflow-hidden hover:bg-[#1f1f1f] hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
          >
            {/* Banner de la comunidad */}
            <div className="h-24 relative">
              {community.banner ? (
                <Image
                  src={community.banner}
                  fill
                  alt={`Banner de ${community.name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
              )}

              {/* Avatar de la comunidad */}
              <div className="absolute -bottom-6 left-4">
                {community.avatar ? (
                  <Image
                    src={community.avatar}
                    alt={community.name}
                    className="w-12 h-12 rounded-full border-2 border-[#121212] object-cover"
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-[#121212] bg-gray-700 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {community.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Indicador de privacidad */}
              {community.is_private && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                  Privada
                </div>
              )}
            </div>

            {/* Contenido de la tarjeta */}
            <div className="pt-8 pb-4 px-4">
              <h2 className="text-lg font-bold text-white mb-1 truncate">
                {community.name}
              </h2>

              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {community.description}
              </p>

              {/* Etiquetas */}
              <div className="flex flex-wrap gap-1 mb-3">
                {community.read_tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
                  >
                    {tag.name}
                  </span>
                ))}
                {community.read_tags.length > 2 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                    +{community.read_tags.length - 2}
                  </span>
                )}
              </div>

              {/* Información adicional */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Creada: {formatDate(community.created_at)}</span>
                <span className="inline-flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                  {community.member_count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
