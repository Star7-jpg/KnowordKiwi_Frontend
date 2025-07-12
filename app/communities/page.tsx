const categories = [
  {
    title: "Programacion",
    communities: [
      "Programacion con Python",
      "Puro Java",
      "Programacion con C",
      "C++",
    ],
  },
  {
    title: "Arte",
    communities: ["Título de la comunidad", "Título", "Título", "Título"],
  },
  {
    title: "Programacion",
    communities: [
      "Programacion con Python",
      "Puro Java",
      "Programacion con C",
      "C++",
    ],
  },
  {
    title: "Arte",
    communities: ["Título de la comunidad", "Título", "Título", "Título"],
  },
];

export default function ExplorePage() {
  return (
    <main className="min-h-screen text-white p-6 border-l border-gray-900">
      <h1 className="text-xl font-bold mb-6">Explorar Comunidades</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-[#1A1A1A] rounded-lg shadow-md p-4 flex flex-col justify-between"
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              {category.communities.map((community, idx) => (
                <div
                  key={idx}
                  className="bg-[#121212] rounded-md h-24 flex items-center justify-center text-sm text-center p-2"
                >
                  {community}
                </div>
              ))}
            </div>
            <span className="text-sm font-semibold">{category.title}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
