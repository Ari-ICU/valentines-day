'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export const CursorTrace = () => {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Number of elements in the trail
    const trailLength = 20;

    // Timer ref to clear timeout safely
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        // Disable on touch devices
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch) return;

        setMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            setIsVisible(true);

            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
                setIsVisible(false);
            }, 100);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [mouseX, mouseY]);

    if (!mounted) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
            <AnimatePresence>
                {isVisible && (
                    <>
                        {/* Main Leader - The "Head" */}
                        <FollowerElement
                            index={0}
                            mouseX={mouseX}
                            mouseY={mouseY}
                            type="leader"
                        />

                        {/* The Trail */}
                        {Array.from({ length: trailLength }).map((_, index) => (
                            <FollowerElement
                                key={index + 1}
                                mouseX={mouseX}
                                mouseY={mouseY}
                                index={index + 1}
                                total={trailLength}
                                type="trail"
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

interface FollowerProps {
    mouseX: any;
    mouseY: any;
    index: number;
    total?: number;
    type: 'leader' | 'trail';
}

const FollowerElement = ({ mouseX, mouseY, index, total = 20, type }: FollowerProps) => {
    // Leader is tight and responsive. Trail is loose and wavy.
    const isLeader = type === 'leader';

    // Physics Configuration
    // Leader: High stiffness, high damping (snappy but stable)
    // Trail: Decreasing stiffness (looser), increasing damping (drag)
    const springConfig = isLeader ? {
        stiffness: 500,
        damping: 28,
        mass: 0.5
    } : {
        stiffness: Math.max(50, 400 - (index * 15)),
        damping: 20 + (index * 0.5),
        mass: 0.5 + (index * 0.05)
    };

    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    // Visual calculations
    // Scale: Leader is big (1.2), Trail shrinks from 0.8 to 0
    const scale = isLeader ? 1 : (1 - (index / total)) * 0.8;

    // Opacity: Leader 1, Trail fades
    const opacity = isLeader ? 1 : (1 - (index / total)) * 0.6;

    // Color Gradient Logic
    const colors = ['#ff0000', '#ff4d6d', '#ff8fa3', '#ffc2d1', '#ffffff'];
    const colorIndex = Math.floor((index / total) * colors.length);
    const color = colors[Math.min(colorIndex, colors.length - 1)];

    return (
        <motion.div
            style={{
                x,
                y,
                translateX: '-50%',
                translateY: '-50%',
                scale,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity, scale }}
            exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
            className="absolute top-0 left-0 flex items-center justify-center mixing-blend-screen"
        >
            {isLeader ? (
                // Leader Element: Glowing Orb + Heart
                <div className="relative">
                    <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-50 animate-pulse"></div>
                    <Heart className="w-8 h-8 text-primary fill-primary drop-shadow-[0_0_15px_rgba(255,77,109,1)]" />
                </div>
            ) : (
                // Trail Elements: Alternating Hearts and Sparkles
                index % 3 === 0 ? (
                    <Sparkles
                        className="w-6 h-6 animate-spin [animation-duration:3s]"
                        style={{ color: color, filter: `drop-shadow(0 0 5px ${color})` }}
                    />
                ) : (
                    <Heart
                        className="w-6 h-6 fill-current"
                        style={{
                            color: color,
                            filter: `drop-shadow(0 0 8px ${color})`,
                            transform: `rotate(${index * 10}deg)`
                        }}
                    />
                )
            )}
        </motion.div>
    );
};
