'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, XCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function LoveQuiz({ onClose }: { onClose: () => void }) {
    const [showResult, setShowResult] = useState(false);
    const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleYesClick = () => {
        setShowResult(true);
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff4d6d', '#ffb3c1', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff4d6d', '#ffb3c1', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    };

    const moveNoButton = () => {
        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const padding = 20;
            const btnWidth = 150;
            const btnHeight = 50;

            // Constrain movement within the container
            const maxX = containerRect.width / 2 - btnWidth / 2 - padding;
            const maxY = containerRect.height / 2 - btnHeight / 2 - padding;

            const x = (Math.random() - 0.5) * 2 * maxX;
            const y = (Math.random() - 0.5) * 2 * maxY;

            setNoBtnPosition({ x, y });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-[#0f050a]/90 border border-primary/20 rounded-3xl p-6 md:p-14 shadow-[0_0_50px_rgba(255,77,109,0.2)] relative overflow-hidden text-center"
            >
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-20"
                >
                    <XCircle className="w-6 h-6" />
                </button>

                {!showResult ? (
                    <div className="relative z-10 flex flex-col items-center min-h-[400px] justify-center" ref={containerRef}>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full"
                        >
                            <Heart className="w-20 h-20 text-primary fill-primary animate-pulse mx-auto mb-6 filter drop-shadow-[0_0_15px_rgba(255,77,109,0.5)]" />
                            <h3 className="text-3xl md:text-5xl font-black text-white mb-12 leading-tight tracking-tight">
                                Will you be my<br /><span className="text-primary bg-clip-text">Valentine?</span> 🌹
                            </h3>

                            <div className="flex flex-col md:flex-row gap-6 items-center justify-center relative w-full h-20">
                                <button
                                    onClick={handleYesClick}
                                    className="px-10 py-4 bg-primary text-white font-bold text-xl rounded-full shadow-[0_0_20px_rgba(255,77,109,0.4)] hover:shadow-[0_0_40px_rgba(255,77,109,0.6)] hover:scale-110 transition-all z-10"
                                >
                                    YES! 💖
                                </button>

                                <motion.button
                                    animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                    onHoverStart={moveNoButton}
                                    onClick={moveNoButton}
                                    className="px-10 py-4 bg-gray-600 text-white/50 font-bold text-xl rounded-full cursor-not-allowed absolute md:relative w-[150px]"
                                    style={{ position: noBtnPosition.x !== 0 ? 'absolute' : 'relative' }}
                                >
                                    No 😢
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="text-center py-8 relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ duration: 1, type: "spring", stiffness: 100 }}
                            className="inline-block mb-6"
                        >
                            <div className="relative">
                                <Heart className="w-32 h-32 text-primary fill-primary filter drop-shadow-[0_0_30px_rgba(255,77,109,0.8)]" />
                                <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-accent animate-spin-slow" />
                            </div>
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
                            YAYYY! 🎉
                        </h2>

                        <p className="text-xl md:text-2xl text-white/80 font-light italic mb-8">
                            "You just made me the happiest person in the universe!"
                        </p>

                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all"
                        >
                            Close
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
