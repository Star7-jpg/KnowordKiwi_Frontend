import { notFound } from "next/navigation";

const categoryData: Record<string, string[]> = {
  programacion: [
    "Programacion con Python",
    "Puro Java",
    "Programacion con C",
    "C++",
  ],
  arte: [
    "Dibujo digital",
    "Pintura tradicional",
    "Fotografía",
    "Diseño gráfico",
  ],
};

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category.toLowerCase();
  const communities = categoryData[category];

  if (!communities) {
    notFound();
  }

  return (
    <main className="min-h-screen text-white p-6">
      <h1 className="text-xl font-bold mb-6 capitalize">
        Comunidades de {category}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {communities.map((community, index) => (
          <div
            key={index}
            className="bg-[#121212] rounded-md h-24 flex items-center justify-center text-sm text-center p-4 hover:bg-[#1f1f1f] transition"
          >
            {community}
          </div>
        ))}
      </div>
    </main>
  );
}
