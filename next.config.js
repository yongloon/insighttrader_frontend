/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Recommended for catching potential problems in React
    swcMinify: true,       // Use SWC for faster minification (default in newer Next.js versions)
    // If you plan to use environment variables on the client-side,
    // you might expose them here via `env` or `publicRuntimeConfig`.
    // For the MVP, NEXT_PUBLIC_API_URL is handled by process.env directly if prefixed with NEXT_PUBLIC_
    // env: {
    //   NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    // },
  
    // Example for image optimization from external domains if needed later:
    // images: {
    //   domains: ['example.com'],
    // },
  };
  
  module.exports = nextConfig;