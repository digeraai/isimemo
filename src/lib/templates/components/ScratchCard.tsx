"use client";

import { useEffect, useRef, useState } from "react";

// A single scratch-to-reveal tile: drag/swipe (mouse or touch) wipes away the
// foil coating via canvas destination-out compositing, revealing the value
// underneath. Once enough of the tile is cleared it snaps to fully revealed.
export function ScratchCard({
  label,
  value,
  foilColor = "#c9a35a",
  textColor = "#4a2c1a",
  revealThreshold = 0.4,
}: {
  label: string;
  value: string;
  foilColor?: string;
  textColor?: string;
  revealThreshold?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const scratching = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Foil coating with a subtle diagonal shimmer.
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, foilColor);
    grad.addColorStop(0.5, "#e9cf8f");
    grad.addColorStop(1, foilColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "600 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("scratch", rect.width / 2, rect.height / 2);

    function pos(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function scratchAt(x: number, y: number) {
      ctx!.globalCompositeOperation = "destination-out";
      ctx!.beginPath();
      ctx!.arc(x, y, 20, 0, Math.PI * 2);
      ctx!.fill();
    }

    function checkRevealPercent() {
      const w = canvas!.width;
      const h = canvas!.height;
      const data = ctx!.getImageData(0, 0, w, h).data;
      let cleared = 0;
      const total = w * h;
      for (let i = 3; i < data.length; i += 4 * 37) {
        // sample every 37th pixel's alpha channel for speed
        if (data[i] === 0) cleared++;
      }
      const sampled = Math.ceil(total / 37);
      return cleared / sampled;
    }

    function onDown(e: PointerEvent) {
      scratching.current = true;
      const p = pos(e);
      scratchAt(p.x, p.y);
    }
    function onMove(e: PointerEvent) {
      if (!scratching.current) return;
      const p = pos(e);
      scratchAt(p.x, p.y);
      if (checkRevealPercent() > revealThreshold) {
        setRevealed(true);
      }
    }
    function onUp() {
      scratching.current = false;
    }

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [foilColor, revealThreshold]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-md select-none touch-none"
      style={{ background: "#fff" }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1"
          style={{ color: textColor }}
        >
          {label}
        </span>
        <span className="text-xl font-serif" style={{ color: textColor }}>
          {value}
        </span>
      </div>
      {!revealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-pointer"
          aria-label={`Scratch to reveal ${label.toLowerCase()}`}
        />
      )}
    </div>
  );
}
