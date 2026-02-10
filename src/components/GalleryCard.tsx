'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GalleryCardProps {
    imageSrc: string; // The filename of the image
    index: number;
}

export const GalleryCard = ({ imageSrc, index }: GalleryCardProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const xPct = (e.clientX - rect.left - width / 2) / width;
        const yPct = (e.clientY - rect.top - height / 2) / height;
        x.set(xPct);
        y.set(yPct);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    return (
        <motion.div
            ref={ref}
            className="relative h-[300px] md:h-[500px] w-auto rounded-2xl cursor-pointer snap-center group/card shrink-0 perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            style={{
                perspective: 1000
            }}
        >
            <motion.div
                className="relative h-full w-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Live Shimmer Effect */}
                <div
                    className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover/card:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none"
                    style={{ transform: "translateZ(20px)" }}
                />

                {/* Live Badge */}
                <div
                    className="absolute top-4 left-4 z-40 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10"
                    style={{ transform: "translateZ(50px)" }}
                >
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(255,77,109,1)]"></div>
                    <span className="text-[10px] text-white font-black tracking-[0.2em] uppercase">Live Memory</span>
                </div>

                <img
                    src={`/${imageSrc}`}
                    alt={`Memory ${index + 1}`}
                    className="h-full w-auto object-cover transition-transform duration-[3s] group-hover/card:scale-110"
                    style={{ transform: "translateZ(0px)" }}
                />

                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"
                    style={{ transform: "translateZ(30px)" }}
                />

                <div
                    className="absolute bottom-5 left-6 z-40 text-left"
                    style={{ transform: "translateZ(60px)" }}
                >
                    <div className="text-white/40 text-[8px] md:text-[10px] uppercase tracking-widest md:tracking-[0.3em] font-bold mb-1 ml-0.5">Capture {index + 1}</div>
                    <div className="text-white font-black text-lg md:text-xl tracking-tighter">Eternal Moment.</div>
                </div>
            </motion.div>
        </motion.div>
    );
};
