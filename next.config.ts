import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '://githubusercontent.com', // Laboratorio
      },
      {
        protocol: 'https',
        hostname: 'rickandmortyapi.com', // Tarea
      },
    ],
  },
};

export default nextConfig;
