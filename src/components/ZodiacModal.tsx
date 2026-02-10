'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Star, Moon } from 'lucide-react';

interface ZodiacModalProps {
    onClose: () => void;
}

export const ZodiacModal = ({ onClose }: ZodiacModalProps) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-2xl w-full bg-[#0f050a]/90 border border-primary/20 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(255,77,109,0.15)]"
            >
                {/* Animated Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none animate-pulse" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-20"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-primary/20 rounded-2xl">
                            <Star className="w-8 h-8 text-primary fill-primary" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">Zodiac Alignment</h2>
                            <p className="text-accent text-sm font-bold tracking-[0.3em] uppercase opacity-70">Written in the Stars</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        {/* Pisces Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="glass-card p-6 border-blue-400/20 bg-blue-400/5"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-4xl">♓</span>
                                <h3 className="text-xl font-bold text-blue-300">Pisces</h3>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed italic">
                                "The Dreamer. Sensitive, intuitive, and boundlessly creative. You bring the magic of the unseen worlds into our reality."
                            </p>
                            <div className="mt-4 flex gap-2">
                                <span className="px-2 py-1 rounded-md bg-blue-400/10 text-[10px] text-blue-300 font-bold uppercase tracking-widest">Water Sign</span>
                                <span className="px-2 py-1 rounded-md bg-blue-400/10 text-[10px] text-blue-300 font-bold uppercase tracking-widest">Intuition</span>
                            </div>
                        </motion.div>

                        {/* Virgo Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="glass-card p-6 border-purple-400/20 bg-purple-400/5"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-4xl">♍</span>
                                <h3 className="text-xl font-bold text-purple-300">Virgo</h3>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed italic">
                                "The Healer. Meticulous, grounded, and deeply devoted. You provide the stable orbit for my chaotic heart to thrive in."
                            </p>
                            <div className="mt-4 flex gap-2">
                                <span className="px-2 py-1 rounded-md bg-purple-400/10 text-[10px] text-purple-300 font-bold uppercase tracking-widest">Earth Sign</span>
                                <span className="px-2 py-1 rounded-md bg-purple-400/10 text-[10px] text-purple-300 font-bold uppercase tracking-widest">Devotion</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="space-y-6 text-white/80 font-light leading-relaxed border-t border-white/10 pt-8">
                        <p className="text-center text-lg italic">
                            "They say when a Water sign meets an Earth sign, a beautiful garden grows.
                            Our alignment is a cosmic rarity—a perfect balance of dreams and reality."
                        </p>

                        <div className="flex justify-center gap-6 py-4">
                            <div className="flex flex-col items-center gap-2">
                                <Moon className="w-6 h-6 text-primary fill-primary animate-pulse" />
                                <span className="text-[10px] text-accent uppercase tracking-widest font-bold">Moon Phase</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Sparkles className="w-6 h-6 text-accent animate-spin-slow" />
                                <span className="text-[10px] text-accent uppercase tracking-widest font-bold">Destiny Factor</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Star className="w-6 h-6 text-white fill-white animate-bounce" />
                                <span className="text-[10px] text-accent uppercase tracking-widest font-bold">Eternal Bond</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
