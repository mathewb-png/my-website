"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "AI Estimator", href: "#estimator" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = useCallback(() => {
    const curtain = document.getElementById("theme-curtain");
    if (!curtain) return;

    const goingLight = isDark;
    curtain.style.background = goingLight ? "#ffffff" : "#0a0a0a";

    curtain.classList.remove("slide-out");
    curtain.classList.add("slide-in");

    setTimeout(() => {
      document.documentElement.classList.toggle("dark", !goingLight);
      setIsDark(!goingLight);

      setTimeout(() => {
        curtain.classList.remove("slide-in");
        curtain.classList.add("slide-out");
      }, 150);
    }, 350);
  }, [isDark]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Theme curtain overlay */}
      <div id="theme-curtain" className="theme-curtain" />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-gray-950/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-lg shadow-black/10"
            : "bg-transparent backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo */}
            <a href="#" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="New Day Power Wash"
                width={160}
                height={40}
                style={{ width: "auto", height: "40px" }}
                className="h-10 w-auto"
                priority
              />
            </a>

            {/* Desktop nav */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right side: toggle + CTA + hamburger */}
            <div className="flex items-center gap-3">
              {/* Dark/Light toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                {isDark ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              {/* CTA button (desktop) */}
              <a
                href="#estimator"
                className="hidden rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/30 md:inline-flex"
              >
                Get Free Estimate
              </a>

              {/* Hamburger (mobile) */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className={`hamburger relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden ${
                  mobileOpen ? "active" : ""
                }`}
                aria-label="Toggle menu"
              >
                <span className="hamburger-line" />
                <span className="hamburger-line" />
                <span className="hamburger-line" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-gray-950/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className="text-2xl font-semibold text-gray-200 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#estimator"
            onClick={closeMobile}
            className="mt-4 rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500"
          >
            Get Free Estimate
          </a>
        </div>
      </div>
    </>
  );
}
