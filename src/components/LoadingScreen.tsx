'use client';

import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export function LoadingScreen() {
    const { progress, active } = useProgress();
    const [isFinished, setIsFinished] = useState(false);
    const [canEnter, setCanEnter] = useState(false);

    useEffect(() => {
        if (progress === 100 && !active) {
            const timer = setTimeout(() => setCanEnter(true), 800);
            return () => clearTimeout(timer);
        }
    }, [progress, active]);

    return (
        <AnimatePresence>
            {!isFinished && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[100] bg-[#050204] flex items-center justify-center p-6 touch-none overflow-hidden"
                >
                    {/* Breathing Cosmic Aura */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,77,109,0.15)_0%,transparent_70%)]"
                    />

                    <div className="relative flex flex-col items-center">
                        {/* Central Power Source */}
                        <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
                            {/* Radial Progress Ring */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="48%"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.03)"
                                    strokeWidth="1"
                                />
                                <motion.circle
                                    cx="50%"
                                    cy="50%"
                                    r="48%"
                                    fill="none"
                                    stroke="url(#loadingGradient)"
                                    strokeWidth="2"
                                    strokeDasharray="100 100"
                                    initial={{ strokeDashoffset: 100 }}
                                    animate={{ strokeDashoffset: 100 - progress }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#ff4d6d" />
                                        <stop offset="100%" stopColor="#ffb3c1" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Core Heart */}
                            <motion.div
                                animate={canEnter ? {
                                    scale: [1, 1.05, 1],
                                } : {
                                    scale: [0.9, 1, 0.9],
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                <Heart
                                    className={`w-12 h-12 md:w-16 md:h-16 transition-all duration-1000 ${canEnter
                                            ? 'text-white fill-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]'
                                            : 'text-primary/40 fill-primary/20'
                                        }`}
                                />
                            </motion.div>
                        </div>

                        {/* Text Information */}
                        <div className="mt-12 text-center">
                            <AnimatePresence mode="wait">
                                {!canEnter ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <h2 className="text-white font-black text-sm md:text-base tracking-[0.6em] uppercase">
                                            Compose Our Story
                                        </h2>
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="h-[1px] w-8 bg-white/10" />
                                            <span className="text-primary font-black text-[10px] tabular-nums tracking-widest">
                                                {Math.round(progress)}%
                                            </span>
                                            <div className="h-[1px] w-8 bg-white/10" />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="ready"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center gap-8"
                                    >
                                        <h2 className="text-white font-black text-sm md:text-base tracking-[0.6em] uppercase">
                                            The Melody is Ready
                                        </h2>
                                        <motion.button
                                            whileHover={{ scale: 1.05, letterSpacing: "0.5em" }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsFinished(true)}
                                            className="px-12 py-4 border border-white/20 hover:border-white text-white font-bold rounded-full transition-all duration-500 uppercase tracking-[0.4em] text-[10px] bg-white/5 backdrop-blur-md"
                                        >
                                            Enter Cosmos
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Minimal Branding */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20">
                        <span className="text-[7px] text-white tracking-[0.8em] uppercase font-black">Heavenly Alignment</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
