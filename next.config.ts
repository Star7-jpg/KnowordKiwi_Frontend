import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  dest: 'public',  // Directorio donde se generan los archivos PWA

    /**
   * Define la página que el Service Worker debe servir
   * cuando no hay conexión a Internet.
   * La ruta debe ser el nombre de la página que creaste.
   */
  runtimeCaching: [

    {
      urlPattern: ({ url }) => url.pathname.startsWith('/'),
      handler: 'NetworkFirst', // Intenta la red primero, luego el caché.
      options: {
        cacheName: 'html-cache',
        expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        },
      },
    },
  ],
  
  // Define la ruta fallback para cualquier tipo de recurso
  fallbacks: {
    // 1. Fallback principal para cualquier ruta de navegación (HTML)
    document: '/offline',
    image: '',
    audio: '',
    video: '',
    font: ''
  },
  
});

const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default pwaConfig(nextConfig);