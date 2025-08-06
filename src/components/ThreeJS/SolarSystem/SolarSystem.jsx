'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';

// Simple Sun component with basic material
function Sun()
{
    const sunRef = useRef();

    useFrame((state) =>
    {
        if (sunRef.current)
        {
            sunRef.current.rotation.y += 0.005;
        }
    });

    return (
        <mesh ref={sunRef} position={[0, 0, 0]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial
                color="#ffaa00"
            />
        </mesh>
    );
}

export default function SolarSystem()
{
    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Three.js Canvas */}
            <Canvas
                camera={{ position: [0, 5, 10], fov: 60 }}
                style={{
                    background: 'linear-gradient(to bottom, #000011, #000033)',
                    width: '100%',
                    height: '100%'
                }}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: "high-performance"
                }}
            >
                <Suspense fallback={null}>
                    <Sun />
                </Suspense>
            </Canvas>
        </div>
    );
}