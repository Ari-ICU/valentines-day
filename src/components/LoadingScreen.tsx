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
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[100] bg-[#0f050a] flex flex-col items-center justify-center p-6 touch-none"
                >
                    {/* Cosmic Background Glow */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px]" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
                        {/* Animated Heart */}
                        <motion.div
                            animate={canEnter ? {
                                scale: [1, 1.1, 1],
                            } : {
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: canEnter ? 4 : 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative mb-12"
                        >
                            <Heart className={`w-20 h-20 transition-all duration-1000 ${canEnter ? 'text-accent fill-accent drop-shadow-[0_0_40px_rgba(255,179,193,0.8)]' : 'text-primary fill-primary drop-shadow-[0_0_20px_rgba(255,77,109,0.8)]'}`} />
                            <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-accent animate-pulse" />
                        </motion.div>

                        {/* Loading Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-[0.2em] uppercase mb-4 h-8">
                                {canEnter ? "Ready for Magic" : "Preparing Magic"}
                            </h2>
                            <p className="text-accent/60 text-[10px] tracking-[0.4em] uppercase font-bold">
                                {canEnter ? "The Universe has Aligned" : "Aligning the Stars for You"}
                            </p>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {!canEnter ? (
                                <motion.div
                                    key="loader"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full"
                                >
                                    {/* Progress Container */}
                                    <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden relative mb-4">
                                        <motion.div
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-accent to-primary"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                        />
                                    </div>

                                    {/* Percentage Text */}
                                    <div className="flex justify-between w-full px-1">
                                        <span className="text-[9px] text-white/30 tracking-[0.3em] font-bold uppercase">Loading Cosmos</span>
                                        <span className="text-[9px] text-primary tracking-[0.1em] font-black">{Math.round(progress)}%</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="enter-button"
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsFinished(true)}
                                    className="group relative px-12 py-4 bg-primary text-white font-black rounded-full shadow-[0_0_30px_rgba(255,77,109,0.4)] hover:shadow-[0_0_60px_rgba(255,77,109,0.8)] transition-all duration-500 cursor-pointer overflow-hidden uppercase tracking-[0.3em] text-sm"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Enter <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Branding */}
                    <motion.div
                        animate={canEnter ? { opacity: [0.2, 0.5, 0.2] } : {}}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute bottom-12 flex flex-col items-center gap-4"
                    >
                        <div className="w-12 h-[1px] bg-white/10" />
                        <span className="text-[9px] text-white/20 tracking-[0.5em] uppercase font-bold">Valentine'26</span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
