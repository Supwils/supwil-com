/** @type {import('next').NextConfig} */
const nextConfig = {
    // Performance optimizations for development
    experimental: {
        // Enable faster refresh
        optimizePackageImports: ['@iconify/react'],
    },
    transpilePackages: ['three'],

    turbopack: {},

    // Optimize images
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: '**.amazonaws.com',
            },
        ],
        unoptimized: process.env.NODE_ENV === 'development',
    },

};

export default nextConfig;
