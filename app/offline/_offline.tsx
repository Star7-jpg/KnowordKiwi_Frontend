import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <div className="text-6xl mb-4" role="img" aria-label="Sin conexión">
          🚫
        </div>
        <h1 className="text-3xl font-bold mb-3 text-red-400">
          ¡Sin Conexión a Internet!
        </h1>
        <p className="text-gray-400 mb-6 max-w-sm">
          Parece que no estás conectado a la red. Esta aplicación sigue siendo una PWA, pero necesitas conexión para acceder a la mayoría de los datos.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 text-lg font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 shadow-md shadow-indigo-500/30"
        >
          Reintentar Inicio
        </Link>
      </div>
    </div>
  );
}