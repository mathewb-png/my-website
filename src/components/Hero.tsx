"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const videoSources = [
  "/videos/splash.mp4",
  "/videos/slowmo.mp4",
  "/videos/cleaning.mp4",
  "/videos/nozzle.mp4",
  "/videos/boat-cleaning.mp4",
  "/videos/slowmo-wash.mp4",
];

const ROTATION_INTERVAL = 8000;
const CROSSFADE_MS = 1000;

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const activeRef = useRef(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const playVideo = useCallback((el: HTMLVideoElement | null) => {
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  }, []);

  const pauseVideo = useCallback((el: HTMLVideoElement | null) => {
    if (!el) return;
    el.pause();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const current = activeRef.current;
      const next = (current + 1) % videoSources.length;

      playVideo(videoRefs.current[next]);
      setNextIndex(next);

      setTimeout(() => {
        pauseVideo(videoRefs.current[current]);
        activeRef.current = next;
        setActiveIndex(next);
        setNextIndex(null);
      }, CROSSFADE_MS);
    }, ROTATION_INTERVAL);

    return () => clearInterval(timer);
  }, [playVideo, pauseVideo]);

  useEffect(() => {
    playVideo(videoRefs.current[0]);
  }, [playVideo]);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Video backgrounds — only active + next are visible */}
      {videoSources.map((src, i) => {
        const isActive = i === activeIndex;
        const isNext = i === nextIndex;
        const visible = isActive || isNext;

        return (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={src}
            muted
            loop
            playsInline
            preload={i <= 1 ? "auto" : "metadata"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              visible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{ zIndex: isNext ? 2 : isActive ? 1 : 0 }}
          />
        );
      })}

      {/* Dark overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/40" />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h1 id="hero-title" className="mb-6">
          <span className="block text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Bay Area Power Washing
          </span>
          <span className="mt-1 block text-2xl font-bold leading-snug text-[var(--primary)] sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="whitespace-nowrap">Tri-Valley</span> Residential Experts
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-base font-normal leading-relaxed text-gray-400 sm:text-lg md:text-xl">
          Professional power washing for homes across Livermore, Dublin, Pleasanton, San Ramon, and Danville.
        </p>

        {/* Liquid button (CodePen fliseno1k/WNboLBy) */}
        <a href="#estimator" className="liquid-btn liquid-btn--hero">
          <span className="liquid-btn-text">Get Estimate</span>
          <div className="liquid"></div>
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <a
          href="#services"
          aria-label="Scroll down"
          className="flex flex-col items-center gap-1 text-gray-400 transition-colors hover:text-white"
        >
          <span className="text-xs font-medium uppercase tracking-widest">
            Scroll
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 animate-bounce"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
      </div>
    </section>
  );
}
