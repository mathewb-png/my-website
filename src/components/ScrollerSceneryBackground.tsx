"use client";

import { initSceneryScroll } from "@/lib/initSceneryScroll";
import { useEffect, useRef } from "react";

export default function ScrollerSceneryBackground() {
  const svgHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = svgHostRef.current;
    if (!host) return;

    let cleanup = () => {};

    fetch("/scenery.svg")
      .then((res) => res.text())
      .then((svg) => {
        host.innerHTML = svg;
        cleanup = initSceneryScroll();
      })
      .catch(() => {});

    return () => {
      cleanup();
    };
  }, []);

  return (
    <>
      <div className="scenery-scroll-element" aria-hidden="true" />
      <div className="scenery-layer" aria-hidden="true">
        <div ref={svgHostRef} className="scenery-svg-host" />
        <div className="scenery-veil" />
      </div>
    </>
  );
}
