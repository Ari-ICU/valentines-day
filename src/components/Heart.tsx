'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function Heart(props: any) {
    const mesh = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);

    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.4);
    heartShape.bezierCurveTo(0.4, 0.4, 0.8, 1, 0.8, 1.4);
    heartShape.bezierCurveTo(0.8, 1.8, 0.5, 2.1, 0, 1.5);
    heartShape.bezierCurveTo(-0.5, 2.1, -0.8, 1.8, -0.8, 1.4);
    heartShape.bezierCurveTo(-0.8, 1, -0.4, 0.4, 0, 0.4);

    const extrudeSettings = {
        depth: 0.3,
        bevelEnabled: true,
        bevelSegments: 20,
        steps: 2,
        bevelSize: 0.15,
        bevelThickness: 0.15,
    };

    useFrame((state) => {
        // Rotation logic
        mesh.current.rotation.y = state.clock.elapsedTime * 0.8 + (state.pointer.x * 0.5);
        mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2 + (state.pointer.y * -0.2);

        // Position logic - subtle following
        mesh.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 - 0.5 + (state.pointer.y * 0.2);
        mesh.current.position.x = state.pointer.x * 0.2;

        // Hover effect scale
        const targetScale = hovered ? 0.75 : 0.6;
        mesh.current.scale.x = THREE.MathUtils.lerp(mesh.current.scale.x, targetScale, 0.1);
        mesh.current.scale.y = THREE.MathUtils.lerp(mesh.current.scale.y, targetScale, 0.1);
        mesh.current.scale.z = THREE.MathUtils.lerp(mesh.current.scale.z, targetScale, 0.1);
    });

    return (
        <mesh
            {...props}
            ref={mesh}
            rotation={[0, 0, 0]}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <extrudeGeometry args={[heartShape, extrudeSettings]} />
            <meshStandardMaterial
                color={hovered ? "#ff758f" : "#ff4d6d"}
                roughness={0.1}
                metalness={1}
                emissive={hovered ? "#ffb3c1" : "#ff0000"}
                emissiveIntensity={hovered ? 0.8 : 0.2}
            />
        </mesh>
    );
}

export function FloatingHearts() {
    const count = 100;
    const hearts = Array.from({ length: count }, (_, i) => ({
        position: [
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 15,
        ] as [number, number, number],
        scale: Math.random() * 0.2 + 0.1,
        speed: Math.random() * 0.5 + 0.2,
        followFactor: Math.random() * 0.8 + 0.2, // Random follow intensity
        randomOffset: Math.random() * 100, // Random phase for sine waves
    }));

    return (
        <>
            {hearts.map((h, i) => (
                <IndividualHeart key={i} {...h} />
            ))}
        </>
    );
}

function IndividualHeart({ position, scale, speed, followFactor, randomOffset }: any) {
    const mesh = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const initialPos = position;

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Create more complex, random-looking organic movement
        const noiseX = Math.sin(time * speed + randomOffset) * 0.5;
        const noiseY = Math.cos(time * speed * 0.8 + randomOffset) * 0.5;
        const noiseZ = Math.sin(time * speed * 0.5 + randomOffset) * 0.2;

        // Target position combines:
        // 1. Initial position
        // 2. Mouse tracking (randomized by followFactor) -- INCREASED SENSITIVITY
        // 3. Organic floating noise
        const targetX = initialPos[0] + (state.pointer.x * 50 * followFactor) + noiseX;
        const targetY = initialPos[1] + (state.pointer.y * 30 * followFactor) + noiseY;
        const targetZ = initialPos[2] + (state.pointer.y * 15 * followFactor) + noiseZ;

        // Smoothly interpolate to new position with variable lerp speed based on distance/randomness
        // Increased base speed for more responsiveness (was 0.02)
        const lerpSpeed = 0.08 + (followFactor * 0.05);

        mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, targetX, lerpSpeed);
        mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, lerpSpeed);
        mesh.current.position.z = THREE.MathUtils.lerp(mesh.current.position.z, targetZ, lerpSpeed);

        // Random rotation based on movement
        mesh.current.rotation.y += (hovered ? 0.05 : 0.01) + (state.pointer.x * 0.01 * followFactor);
        mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, state.pointer.x * 0.2, 0.05);

        // Scale on hover
        const s = hovered ? scale * 1.5 : scale;
        mesh.current.scale.setScalar(THREE.MathUtils.lerp(mesh.current.scale.x, s, 0.1));
    });

    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
    heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0.4, 1);
    heartShape.bezierCurveTo(0.8, 0.6, 1.4, 0.3, 1.4, 0);
    heartShape.bezierCurveTo(1.4, -0.3, 0.8, -0.3, 0.8, 0);
    heartShape.bezierCurveTo(0.8, 0, 0, 0, 0, 0);

    return (
        <mesh
            ref={mesh}
            position={position}
            scale={scale}
            rotation={[Math.PI, 0, 0]}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHover(true);
            }}
            onPointerOut={() => setHover(false)}
        >
            <extrudeGeometry args={[heartShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 }]} />
            <meshStandardMaterial
                color={hovered ? "#ffb3c1" : "#ff758f"}
                transparent
                opacity={hovered ? 0.8 : 0.4}
                emissive={hovered ? "#ffb3c1" : "#000000"}
                emissiveIntensity={hovered ? 0.5 : 0}
            />
        </mesh>
    );
}

export function HeartTrail() {
    const count = 10;
    const hearts = Array.from({ length: count });

    return (
        <>
            {hearts.map((_, i) => (
                <TrailInstance key={i} index={i} total={count} />
            ))}
        </>
    );
}

function TrailInstance({ index, total }: { index: number; total: number }) {
    const mesh = useRef<THREE.Mesh>(null!);
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
    heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0.4, 1);
    heartShape.bezierCurveTo(0.8, 0.6, 1.4, 0.3, 1.4, 0);
    heartShape.bezierCurveTo(1.4, -0.3, 0.8, -0.3, 0.8, 0);
    heartShape.bezierCurveTo(0.8, 0, 0, 0, 0, 0);

    const scale = (1 - index / total) * 0.2;

    useFrame((state) => {
        // Staggered following logic
        const factor = 0.15 / (index + 1);
        const targetX = state.pointer.x * 6;
        const targetY = state.pointer.y * 3;

        mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, targetX, factor);
        mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, factor);
        mesh.current.position.z = 3 - (index * 0.3);

        mesh.current.rotation.y += 0.05 + index * 0.01;
        mesh.current.rotation.x = Math.PI; // Correct orientation
    });

    return (
        <mesh ref={mesh} scale={scale}>
            <extrudeGeometry args={[heartShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 }]} />
            <meshStandardMaterial
                color="#ff4d6d"
                transparent
                opacity={1 - index / total}
                emissive="#ff0000"
                emissiveIntensity={0.5}
            />
        </mesh>
    );
}

export function ConfettiHearts({ burst }: { burst: number }) {
    const [items, setItems] = useState<{ id: number; velocity: [number, number, number] }[]>([]);

    useEffect(() => {
        if (burst > 0) {
            const newItems = Array.from({ length: 30 }, (_, i) => ({
                id: burst + i,
                velocity: [
                    (Math.random() - 0.5) * 0.4,
                    (Math.random() - 0.5) * 0.4,
                    (Math.random() - 0.5) * 0.4
                ] as [number, number, number],
            }));
            setItems(prev => [...prev, ...newItems]);
        }
    }, [burst]);

    return (
        <>
            {items.map((item) => (
                <ConfettiInstance key={item.id} velocity={item.velocity} />
            ))}
        </>
    );
}

function ConfettiInstance({ velocity }: { velocity: [number, number, number] }) {
    const mesh = useRef<THREE.Mesh>(null!);
    const [visible, setVisible] = useState(true);
    const vel = useRef(new THREE.Vector3(...velocity));
    const pos = useRef(new THREE.Vector3(0, 0, 0));

    useFrame((state, delta) => {
        if (!visible) return;
        pos.current.add(vel.current);
        vel.current.y -= 0.005; // Gravity
        mesh.current.position.copy(pos.current);
        mesh.current.rotation.x += 0.1;
        mesh.current.rotation.y += 0.1;
        mesh.current.scale.multiplyScalar(0.96);

        if (mesh.current.scale.x < 0.01) setVisible(false);
    });

    if (!visible) return null;

    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
    heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0.4, 1);
    heartShape.bezierCurveTo(0.8, 0.6, 1.4, 0.3, 1.4, 0);
    heartShape.bezierCurveTo(1.4, -0.3, 0.8, -0.3, 0.8, 0);
    heartShape.bezierCurveTo(0.8, 0, 0, 0, 0, 0);

    return (
        <mesh ref={mesh} scale={0.15}>
            <extrudeGeometry args={[heartShape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }]} />
            <meshStandardMaterial color="#ff4d6d" emissive="#ff0000" emissiveIntensity={1} />
        </mesh>
    );
}

export function FallingPetals() {
    const count = 40;
    const petals = Array.from({ length: count }, (_, i) => ({
        id: i,
        position: [
            (Math.random() - 0.5) * 20,
            10 + Math.random() * 10,
            (Math.random() - 0.5) * 20,
        ] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
        scale: Math.random() * 0.1 + 0.05,
        speed: Math.random() * 0.02 + 0.01,
    }));

    return (
        <>
            {petals.map((p) => (
                <PetalInstance key={p.id} {...p} />
            ))}
        </>
    );
}

function PetalInstance({ position, rotation, scale, speed }: any) {
    const mesh = useRef<THREE.Mesh>(null!);
    const initialPos = useRef(new THREE.Vector3(...position));
    const currentPos = useRef(new THREE.Vector3(...position));

    useFrame((state) => {
        currentPos.current.y -= speed;
        currentPos.current.x += Math.sin(state.clock.elapsedTime + initialPos.current.x) * 0.01;

        if (currentPos.current.y < -10) {
            currentPos.current.y = 10;
        }

        mesh.current.position.copy(currentPos.current);
        mesh.current.rotation.x += 0.01;
        mesh.current.rotation.z += 0.01;
    });

    // Simple petal shape
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(0.5, 0.5, 1, 0, 0, -1);
    petalShape.bezierCurveTo(-1, 0, -0.5, 0.5, 0, 0);

    return (
        <mesh ref={mesh} scale={scale} rotation={rotation}>
            <shapeGeometry args={[petalShape]} />
            <meshStandardMaterial color="#ff4d6d" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
    );
}

export function FloatingImage() {
    const { viewport } = useThree();
    const isMobile = viewport.width < 7;
    const mesh = useRef<THREE.Mesh>(null!);
    const [dragging, setDragging] = useState(false);
    const [hovered, setHover] = useState(false);

    // Load textures - updated to 6 images
    const [img1, img2, img3, img4, img5, img6] = useLoader(THREE.TextureLoader, [
        '/2026-02-10 14.19.29.jpg',
        '/2026-02-09 19.40.02.jpg',
        '/2026-02-09 19.40.06.jpg',
        '/2026-02-09 19.40.09.jpg',
        '/2026-02-10 15.49.52.jpg',
        '/2026-02-10 15.49.57.jpg'
    ]);

    // Spring-like physics for smooth movement
    const position = useRef(isMobile ? new THREE.Vector3(0, 2, 0) : new THREE.Vector3(3.5, 0, 0));

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Target position calculation
        let targetX = position.current.x;
        let targetY = position.current.y;

        if (dragging) {
            targetX = (state.pointer.x * viewport.width) / 2;
            targetY = (state.pointer.y * viewport.height) / 2;

            position.current.x = THREE.MathUtils.lerp(position.current.x, targetX, 0.2);
            position.current.y = THREE.MathUtils.lerp(position.current.y, targetY, 0.2);
        } else {
            // Subtle parallax following when NOT dragging
            const parallaxX = state.pointer.x * 3; // Increased from 2
            const parallaxY = state.pointer.y * 2; // Increased from 1.5

            targetX = position.current.x + parallaxX;
            targetY = position.current.y + parallaxY + Math.sin(time * 0.5) * 0.2;
        }

        // Apply smooth interpolation
        mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, targetX, 0.1);
        mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, 0.1);

        // Continuous full 360 degree rotation
        mesh.current.rotation.y += dragging ? 0.05 : (hovered ? 0.02 : 0.01);
        mesh.current.rotation.x = Math.sin(time * 0.5) * 0.2 + (dragging ? (state.pointer.y * 0.5) : 0);
        mesh.current.rotation.z = Math.cos(time * 0.3) * 0.1 + (hovered ? Math.sin(time) * 0.05 : 0);

        // Hover scale effect
        const targetScale = (isMobile ? 0.5 : 0.8) * (hovered ? 1.1 : 1.0);
        mesh.current.scale.setScalar(THREE.MathUtils.lerp(mesh.current.scale.x, targetScale, 0.1));
    });

    const scale = isMobile ? 0.5 : 0.8;

    return (
        <mesh
            ref={mesh}
            scale={scale}
            onPointerOver={() => (document.body.style.cursor = 'grab')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
            onPointerDown={(e) => {
                e.stopPropagation();
                // @ts-ignore
                e.target.setPointerCapture(e.pointerId);
                setDragging(true);
                document.body.style.cursor = 'grabbing';
            }}
            onPointerUp={(e) => {
                e.stopPropagation();
                // @ts-ignore
                e.target.releasePointerCapture(e.pointerId);
                setDragging(false);
                document.body.style.cursor = 'grab';
            }}
        >
            <boxGeometry args={[3, 4, 3]} />
            <meshStandardMaterial attach="material-0" map={img2} />
            <meshStandardMaterial attach="material-1" map={img4} />
            <meshStandardMaterial attach="material-2" map={img5} />
            <meshStandardMaterial attach="material-3" map={img6} />
            <meshStandardMaterial attach="material-4" map={img1} />
            <meshStandardMaterial attach="material-5" map={img3} />
        </mesh>
    );
}

export function FloatingShapes() {
    const count = 40; // Number of floating shapes
    const shapes = Array.from({ length: count }, (_, i) => ({
        type: Math.floor(Math.random() * 4), // 0: Torus, 1: Icosahedron, 2: Dodecahedron, 3: Sphere
        position: [
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10 - 5,
        ] as [number, number, number],
        scale: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.5 + 0.2,
        rotationSpeed: [
            Math.random() * 0.02,
            Math.random() * 0.02,
            Math.random() * 0.02
        ] as [number, number, number],
        color: ['#ffcdb2', '#ffb4a2', '#e5989b', '#b5838d', '#6d6875'][Math.floor(Math.random() * 5)]
    }));

    return (
        <>
            {shapes.map((s, i) => (
                <ShapeInstance key={i} {...s} />
            ))}
        </>
    );
}

import { MeshDistortMaterial } from '@react-three/drei';

function ShapeInstance({ type, position, scale, speed, rotationSpeed, color }: any) {
    const mesh = useRef<THREE.Mesh>(null!);
    const initialPos = useRef(new THREE.Vector3(...position));

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Float animation + Cursor parallax
        const targetX = initialPos.current.x + Math.cos(time * speed * 0.5) * 0.5 + (state.pointer.x * 5);
        const targetY = initialPos.current.y + Math.sin(time * speed) * 1 + (state.pointer.y * 3);

        mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, targetX, 0.05);
        mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, 0.05);

        // Rotate
        mesh.current.rotation.x += rotationSpeed[0];
        mesh.current.rotation.y += rotationSpeed[1];
        mesh.current.rotation.z += rotationSpeed[2];
    });

    // Pick a geometry based on type
    const geometries = [
        <torusGeometry key="torus" args={[0.5, 0.2, 16, 32]} />,
        <icosahedronGeometry key="ico" args={[0.7, 0]} />,
        <dodecahedronGeometry key="dodeca" args={[0.6, 0]} />,
        <sphereGeometry key="sphere" args={[0.5, 32, 32]} />,
    ];

    return (
        <mesh ref={mesh} position={position} scale={scale}>
            {geometries[type]}
            <MeshDistortMaterial
                color={color}
                speed={speed * 2}
                distort={0.4}
                radius={1}
                transparent
                opacity={0.7}
                metalness={0.8}
                roughness={0.2}
            />
        </mesh>
    );
}
