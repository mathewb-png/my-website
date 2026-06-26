"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Areas", href: "#service-area" },
  { label: "Process", href: "#process" },
  { label: "Surfaces", href: "#surfaces" },
  { label: "Pricing", href: "#pricing" },
  { label: "Get Quote", href: "#estimator" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,box-shadow,border-color] duration-300 ${
          scrolled
            ? "bg-gray-950/95 shadow-lg shadow-black/20 border-b border-white/5"
            : "bg-gradient-to-b from-gray-950/80 to-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-18 md:h-22">
            {/* Logo — isolated so backdrop-blur never dims it */}
            <a href="#" className="relative z-10 min-w-0 flex-shrink isolate">
              <Image
                src="/logo-nav-white.png"
                alt="New Day Power Wash"
                width={260}
                height={80}
                className="logo-img h-10 w-auto max-w-[8.75rem] sm:h-12 sm:max-w-[10.5rem] md:h-14 md:max-w-none"
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

            {/* Right side: CTA + hamburger */}
            <div className="flex items-center gap-3">
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
