'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Environment, Sparkles } from '@react-three/drei';
import { Heart, FloatingHearts, HeartTrail, ConfettiHearts, FallingPetals, FloatingImage, PlanetarySystem, ZodiacSigns } from './Heart';
import * as THREE from 'three';

function Rig({ children }: { children: React.ReactNode }) {
    const group = useRef<THREE.Group>(null!);
    useFrame((state) => {
        // Continuous base rotation + mouse parallax for ultra-smooth movement
        const baseRotation = state.clock.elapsedTime * 0.05;
        const mouseRotationX = (state.pointer.y * Math.PI) / 4; // Reduced range for more stability
        const mouseRotationY = state.pointer.x * Math.PI / 2;

        const targetRotationX = mouseRotationX;
        const targetRotationY = baseRotation + mouseRotationY;

        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.03);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.03);
    });
    return <group ref={group}>{children}</group>;
}

export default function Scene({ burst = 0 }: { burst?: number }) {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <color attach="background" args={['#0f050a']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                <Suspense fallback={null}>
                    <Rig>
                        {/* <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                            <Heart position={[0, -0.5, 0]} scale={0.8} />
                        </Float> */}

                        {/* <FloatingHearts /> */}

                        <HeartTrail />

                        <ConfettiHearts burst={burst} />

                        <FallingPetals />

                        <FloatingImage />
                        {/* <FloatingShapes /> */}
                        <PlanetarySystem />
                        <ZodiacSigns />

                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                        <Sparkles count={100} scale={10} size={2} speed={0.5} color="#ffb3c1" />
                    </Rig>

                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
}
