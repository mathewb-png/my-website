"use client";

import { useEffect, useRef } from "react";

interface LiquidBackgroundProps {
  className?: string;
}

export default function LiquidBackground({ className = "" }: LiquidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let disposed = false;
    const canvas = canvasRef.current;

    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import LiquidBg from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js";

      const canvas = document.querySelector('[data-liquid-canvas]');
      if (canvas && !canvas.__liquidInit) {
        canvas.__liquidInit = true;
        const app = LiquidBg(canvas);
        canvas.__liquidApp = app;

        const texCanvas = document.createElement("canvas");
        texCanvas.width = 1024;
        texCanvas.height = 1024;
        const ctx = texCanvas.getContext("2d");
        const grad = ctx.createRadialGradient(512, 512, 0, 512, 512, 720);
        grad.addColorStop(0, "#bfdbfe");
        grad.addColorStop(0.3, "#60a5fa");
        grad.addColorStop(0.55, "#2563eb");
        grad.addColorStop(0.8, "#1e40af");
        grad.addColorStop(1, "#1e3a5f");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        app.loadImage(texCanvas.toDataURL("image/png"));
        app.liquidPlane.material.metalness = 0.75;
        app.liquidPlane.material.roughness = 0.25;
        app.liquidPlane.uniforms.displacementScale.value = 5;
        app.setRain(false);
      }
    `;
    document.body.appendChild(script);

    return () => {
      disposed = true;
      script.remove();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const app = (canvas as any).__liquidApp;
      if (app && typeof app.dispose === "function") {
        app.dispose();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-liquid-canvas=""
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ touchAction: "none" }}
    />
  );
}
