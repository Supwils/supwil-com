'use client'

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

export default function Camera({ position = [0, 20, 50], fov = 60 })
{
    const cameraRef = useRef();

    useFrame((state) =>
    {
        if (cameraRef.current)
        {
            // Optional: Add camera animations or behaviors here
            // For now, we'll let OrbitControls handle camera movement
        }
    });

    return (
        <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={position}
            fov={fov}
            near={0.1}
            far={1000}
        />
    )
}