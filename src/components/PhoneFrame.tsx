"use client";

import type { ReactNode } from "react";

// A realistic iPhone-style device frame: content scrolls inside the screen
// area (clipped to the frame) rather than the page itself scrolling — used
// to preview a template the way a product-marketing shot would, on any
// screen size, without needing an actual phone.
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto ${className}`} style={{ width: 300, aspectRatio: "300 / 610" }}>
      {/* Bezel */}
      <div className="absolute inset-0 rounded-[2.75rem] bg-[#1a1a1a] shadow-2xl" />
      {/* Side buttons */}
      <div className="absolute -left-[2px] top-[100px] w-[3px] h-6 bg-[#2b2b2b] rounded-l" />
      <div className="absolute -left-[2px] top-[135px] w-[3px] h-10 bg-[#2b2b2b] rounded-l" />
      <div className="absolute -left-[2px] top-[180px] w-[3px] h-10 bg-[#2b2b2b] rounded-l" />
      <div className="absolute -right-[2px] top-[140px] w-[3px] h-14 bg-[#2b2b2b] rounded-r" />

      {/* Screen. `transform` on this (non-scrolling) wrapper — not the
          scrollable div inside it — makes it the containing block for any
          `position: fixed` descendant (e.g. a template's floating pause/play
          button): pinned to the phone's screen and immune to the inner
          div's scroll offset, instead of escaping to the real browser
          viewport. Templates themselves need no changes for this to work;
          it's invisible outside a frame. */}
      <div className="absolute inset-[10px] rounded-[2.25rem] overflow-hidden bg-white" style={{ transform: "translateZ(0)" }}>
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
        {/* Dynamic island */}
        <div className="pointer-events-none absolute top-[10px] left-1/2 -translate-x-1/2 w-[84px] h-[22px] rounded-full bg-[#1a1a1a] z-10" />
      </div>
    </div>
  );
}
