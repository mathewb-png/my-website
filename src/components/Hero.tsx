"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const videoSources = [
  "/videos/splash.mp4",
  "/videos/slowmo.mp4",
  "/videos/cleaning.mp4",
  "/videos/pressure-wash.mp4",
];

const ROTATION_INTERVAL = 8000;

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const cycleVideo = useCallback(() => {
    setNextIndex((prev) => {
      const next = ((prev ?? activeIndex) + 1) % videoSources.length;
      return next;
    });

    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % videoSources.length);
      setNextIndex(null);
    }, 1000);
  }, [activeIndex]);

  useEffect(() => {
    const timer = setInterval(cycleVideo, ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, [cycleVideo]);

  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (v) {
        v.play().catch(() => {});
      }
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Video backgrounds */}
      {videoSources.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          src={src}
          muted
          autoPlay
          loop
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === activeIndex
              ? "opacity-100"
              : i === nextIndex
                ? "opacity-100"
                : "opacity-0"
          }`}
          style={{ zIndex: i === nextIndex ? 2 : i === activeIndex ? 1 : 0 }}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/40" />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
          Professional Power Washing
          <span className="mt-2 block text-blue-400">
            That Makes Everything Look New Again
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300 md:text-xl">
          Serving HOAs, commercial properties, leasing offices, and residential
          homes. Get a free AI-powered estimate in seconds.
        </p>

        {/* Liquid button */}
        <a href="#estimator" className="liquid-btn">
          <span className="liquid-btn-text">Get Free Estimate</span>
          <div className="liquid" />
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
