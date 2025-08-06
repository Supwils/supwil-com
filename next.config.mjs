/** @type {import('next').NextConfig} */
const nextConfig = {
    // Performance optimizations for development
    experimental: {
        // Enable faster refresh
        optimizePackageImports: ['@iconify/react'],
    },
    transpilePackages: ['three'],

    // Faster builds
    swcMinify: true,

    // Optimize images
    images: {
        domains: ['localhost'],
        unoptimized: process.env.NODE_ENV === 'development',
    },

    // Development optimizations
    ...(process.env.NODE_ENV === 'development' && {
        // Faster compilation in development
        webpack: (config, { dev, isServer }) =>
        {
            if (dev && !isServer)
            {
                // Optimize for faster rebuilds
                config.watchOptions = {
                    poll: 1000,
                    aggregateTimeout: 300,
                };
            }
            return config;
        },
    }),
};

export default nextConfig;
