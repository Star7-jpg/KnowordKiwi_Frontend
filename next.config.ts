import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  dest: 'public'  // Directorio donde se generan los archivos PWA
});

const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default pwaConfig(nextConfig);