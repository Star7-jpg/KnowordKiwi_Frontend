import Link from "next/link";

export default function page() {
  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      {/* Navbar de Acceso Rápido */}
      <header className="absolute top-0 right-0 p-6 z-10">
        <Link 
          href="/login"
          className="px-4 py-2 text-sm font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 shadow-md shadow-indigo-500/50 hover:shadow-lg hover:scale-[1.02] transform"
        >
          Iniciar Sesión
        </Link>
      </header>

      {/* Contenido Principal */}
      <main className="flex flex-col items-center text-center max-w-2xl px-4 mt-[-80px]">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          Proyeto Knoword Kiwi <span className="text-indigo-400">PWA</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10">
          Desarrollada con la potencia de Next.js para el frontend y NestJS para un backend robusto. Accede a tu entorno de trabajo desde cualquier dispositivo.
        </p>

        {/* Botones de Acción (Llamada principal) */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full justify-center">
          <Link 
            href="/register"
            className="w-full sm:w-auto px-8 py-4 text-xl font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 shadow-xl shadow-indigo-500/50"
          >
            Comenzar Ahora
          </Link>
          <Link 
            href="/about"
            className="w-full sm:w-auto px-8 py-4 text-xl font-bold rounded-xl text-gray-300 border border-gray-600 hover:border-indigo-500 hover:text-indigo-400 transition duration-300"
          >
            Saber Más
          </Link>
        </div>
      </main>
    </div>

  );
}
