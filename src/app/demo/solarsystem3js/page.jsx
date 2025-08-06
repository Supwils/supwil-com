'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Dynamically import to avoid SSR issues with Three.js
const SolarSystemDemo = dynamic(() => import('@/components/ThreeJS/SolarSystem/SolarSystem'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-screen bg-black">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white text-xl">Initializing Solar System...</p>
            </div>
        </div>
    )
});

export default function SolarSystem3js()
{
    const router = useRouter();
    const [hasError, setHasError] = useState(false);

    useEffect(() =>
    {
        // Hide the header and make the page full-screen
        const header = document.querySelector('header');
        const main = document.querySelector('main');
        const body = document.body;

        if (header) header.style.display = 'none';
        if (main)
        {
            main.style.padding = '0';
            main.style.margin = '0';
        }
        if (body)
        {
            body.style.overflow = 'hidden';
        }

        // Cleanup function to restore normal layout when leaving
        return () =>
        {
            if (header) header.style.display = '';
            if (main)
            {
                main.style.padding = '';
                main.style.margin = '';
            }
            if (body)
            {
                body.style.overflow = '';
            }
        };
    }, []);

    const handleExit = () =>
    {
        router.push('/');
    };

    const handleError = () =>
    {
        setHasError(true);
    };

    if (hasError)
    {
        return (
            <div className="fixed inset-0 w-full h-full overflow-hidden z-50 bg-black flex items-center justify-center">
                <div className="text-center text-white">
                    <h2 className="text-2xl mb-4">Unable to load 3D Scene</h2>
                    <p className="mb-6 opacity-80">There was an issue loading the solar system demo.</p>
                    <div className="space-x-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                        <button
                            onClick={handleExit}
                            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden z-50">
            {/* Exit Button */}
            <button
                onClick={handleExit}
                className="absolute top-8 left-4 z-50 cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg"
            >
                Exit
            </button>

            <SolarSystemDemo />
        </div>
    );
}