'use client';

import dynamic from 'next/dynamic';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Heart as HeartIcon, Sparkles, Music, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { GalleryCard } from '@/components/GalleryCard';
import { CursorTrace } from '@/components/CursorTrace';
import { LoveQuiz } from '@/components/LoveQuiz';
import { ZodiacModal } from '@/components/ZodiacModal';
import { LoadingScreen } from '@/components/LoadingScreen';

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => null // Handled by Global LoadingScreen
});

export default function Home() {
  const [burst, setBurst] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showZodiac, setShowZodiac] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const playerRef = React.useRef<any>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: '2Vv-BfVoq4g', // Ed Sheeran - Perfect
        playerVars: {
          autoplay: 0,
          controls: 0,
          showinfo: 0,
          rel: 0,
          loop: 1,
          playlist: '2Vv-BfVoq4g'
        },
        events: {
          onReady: (event: any) => {
            console.log("YouTube Player Ready");
          }
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const calculateTimeLeft = () => {
      const valentine = new Date('2026-02-14T00:00:00');
      const now = new Date();
      const diff = valentine.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timer);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (playerRef.current && playerRef.current.playVideo) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Global Loading State */}
      <LoadingScreen />

      {/* Hidden YouTube Player */}
      <div id="youtube-player" className="absolute -left-[1000px] pointer-events-none opacity-0"></div>

      {/* Dynamic Cursor Shadow/Glow (Simulated 3D cast) */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-15 opacity-40"
      >
        <motion.div
          className="absolute w-[400px] h-[400px] bg-black/40 rounded-full blur-[80px]"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: '-40%',
            translateY: '-40%',
          }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: '-50%',
            translateY: '-50%',
          }}
        />
      </motion.div>

      {/* 2D Heart Trace Overlay */}
      <CursorTrace />

      {/* 3D Background */}
      <Scene burst={burst} />

      {/* Top Left: Logo/Header */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20 flex items-center gap-2 pointer-events-none">
        <HeartIcon className="text-primary w-5 h-5 md:w-6 md:h-6" />
        <span className="text-white font-bold tracking-tighter text-sm md:text-lg">VALENTINE'26</span>
      </div>

      {/* Countdown UI */}
      <div className="absolute top-16 md:top-10 inset-x-0 z-20 flex justify-center px-4 pointer-events-none">
        <div className="glass-card px-3 md:px-8 py-2 md:py-3 flex gap-3 md:gap-8 items-center border-white/5 bg-black/20 backdrop-blur-md rounded-full">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-white font-bold text-base md:text-xl leading-none">{String(value).padStart(2, '0')}</span>
              <span className="text-[8px] md:text-[10px] text-accent uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* UI Overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4 text-center mt-10 md:mt-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4 md:mb-6"
          >
            <div className="relative">
              <HeartIcon className="w-16 h-16 md:w-20 md:h-20 text-primary fill-primary filter drop-shadow-[0_0_20px_rgba(255,77,109,0.8)]" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 text-accent animate-pulse" />
            </div>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-9xl font-black mb-4 md:mb-6 bg-gradient-to-br from-white via-primary to-accent bg-clip-text text-transparent tracking-tighter leading-tight px-2">
            Infinite<br className="md:hidden" /> Desire
          </h1>

          <p className="text-sm md:text-2xl text-accent/80 max-w-xl mx-auto font-light leading-relaxed mb-8 md:mb-12 px-6 italic">
            "In every version of the multiverse, my heart beats only for the rhythm of your soul."
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-8 items-center w-full max-w-md md:max-w-none mx-auto pointer-events-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setBurst(Date.now())}
              className="w-full md:w-auto group relative px-6 md:px-10 py-3 md:py-5 bg-primary text-white font-black rounded-full shadow-[0_0_30px_rgba(255,77,109,0.4)] hover:shadow-[0_0_60px_rgba(255,77,109,0.8)] transition-all duration-300 cursor-pointer overflow-hidden uppercase tracking-tighter text-sm md:text-base"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Launch Love <Sparkles className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-full md:w-auto px-6 md:px-10 py-3 md:py-5 glass-card text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer text-sm md:text-base ${isPlaying ? 'border-primary shadow-[0_0_20px_rgba(255,77,109,0.2)]' : ''}`}
            >
              <Music className={`w-4 h-4 md:w-6 md:h-6 ${isPlaying ? 'animate-spin' : ''}`} />
              {isPlaying ? "Our Song Playing..." : "Play Our Song"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLetter(true)}
              className="w-full md:w-auto px-6 md:px-10 py-3 md:py-5 glass-card text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border-accent/20 text-sm md:text-base"
            >
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-accent" />
              Read My Letter
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuiz(true)}
              className="w-full md:w-auto px-6 md:px-10 py-3 md:py-5 glass-card text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border-accent/20 text-sm md:text-base border-t-2 border-l-2 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              <HeartIcon className="w-4 h-4 md:w-6 md:h-6 text-accent fill-accent" />
              Love Quiz
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowZodiac(true)}
              className="w-full md:w-auto px-6 md:px-10 py-3 md:py-5 glass-card text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border-blue-400/20 text-sm md:text-base border-t-2 border-l-2 border-white/20 shadow-[0_0_15px_rgba(30,58,138,0.2)] bg-blue-900/10"
            >
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-blue-300" />
              Zodiac Destiny
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Love Letter Modal */}
      {showLetter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-default pt-20 md:pt-4"
          onClick={() => setShowLetter(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-xl w-full max-h-[85vh] md:max-h-[90vh] overflow-y-auto p-6 md:p-12 border-primary/20 custom-scrollbar bg-black/40 rounded-3xl border border-white/10"
          >
            {/* Close Button Mobile */}
            <button
              onClick={() => setShowLetter(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full md:hidden"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-black mb-6 md:mb-8 text-primary">To My Eternal Valentine,</h2>

              {/* Multiple Live Images Gallery */}
              <div className="mb-8 relative group px-1 md:px-2">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-50"></div>

                <div className="relative flex gap-3 md:gap-5 overflow-x-auto pb-6 custom-scrollbar snap-x scroll-smooth">
                  {['2026-02-09 19.40.02.jpg', '2026-02-09 19.40.06.jpg', '2026-02-09 19.40.09.jpg', '2026-02-10 14.19.29.jpg'].map((img, index) => (
                    <GalleryCard key={img} imageSrc={img} index={index} />
                  ))
                  }
                </div>

                {/* <div className="flex justify-center gap-3 mt-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary/40"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </div> */}
              </div>

              <div className="space-y-4 md:space-y-6 text-sm md:text-xl text-white/80 leading-relaxed font-light italic text-left">
                <p>
                  "In the vastness of this digital universe, among trillions of nodes and lines of code,
                  you are the only sequence that truly matters."
                </p>
                <p>
                  "I wanted to build something as multidimensional as the way I feel about you.
                  Every heart floating here represents a moment where I felt grateful for our dimension."
                </p>
                <p>
                  "May our love always be responsive, never timeout, and continue to scale
                  beyond the limits of time and space."
                </p>
                <p>
                  "Look closely at the stars—Pisces and Virgo have aligned in this corner of the cosmos, just as we were always meant to."
                </p>
              </div>
              <div className="mt-8 md:mt-12 flex items-center justify-between border-t border-white/5 pt-6 md:pt-8">
                <div>
                  <p className="text-xs md:text-sm text-accent tracking-widest uppercase mb-1">Yours Forever,</p>
                  <p className="text-xl md:text-2xl font-black text-white">I Love You ❤️</p>
                </div>
                <div className="flex gap-2 text-primary">
                  <HeartIcon className="fill-primary w-5 h-5 md:w-6 md:h-6 animate-bounce" />
                  <HeartIcon className="fill-primary w-5 h-5 md:w-6 md:h-6 animate-bounce [animation-delay:0.2s]" />
                  <HeartIcon className="fill-primary w-5 h-5 md:w-6 md:h-6 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Love Quiz Modal */}
      {showQuiz && <LoveQuiz onClose={() => setShowQuiz(false)} />}

      {/* Zodiac Modal */}
      {showZodiac && <ZodiacModal onClose={() => setShowZodiac(false)} />}

      {/* Music Visualizer Placeholder Line */}
      <div className="absolute bottom-16 md:bottom-20 inset-x-0 z-20 flex justify-center gap-1">
        {isPlaying && Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [5, Math.random() * 20 + 10, 5] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
            className="w-1 bg-primary/40 rounded-full"
          />
        ))}
      </div>

      {/* Floating Elements (Bottom) - Hidden on small mobile to prevent clutter */}
      <div className="hidden md:flex absolute bottom-10 left-10 z-20 items-center gap-6 text-accent/60 text-xs tracking-[0.4em] uppercase font-bold">
        <div className="w-20 h-[1px] bg-accent/40" />
        V.XIV.MMXXVI
      </div>

      <div className="hidden md:block absolute bottom-10 right-10 z-20 text-accent/60 text-xs tracking-[0.4em] uppercase font-bold text-right">
        MADE WITH ❤️ FOR YOU
      </div>

      {/* Vignette effect */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,5,10,0.8)_100%)] z-30" />
    </main>
  );
}
