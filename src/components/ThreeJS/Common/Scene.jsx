'use client';

export default function Scene({ children })
{
    return (
        <>
            {/* Basic ambient lighting */}
            <ambientLight intensity={0.3} color="#ffffff" />

            {/* Simple directional light */}
            <directionalLight
                position={[5, 5, 5]}
                intensity={0.5}
                color="#ffffff"
            />

            {/* Render children components */}
            {children}
        </>
    );
}