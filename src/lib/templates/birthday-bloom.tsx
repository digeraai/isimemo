"use client";

import React from "react";
import type { InviteData } from "./types";

// `meta` lives in ./birthday-bloom.meta.ts (a plain, non-client module) and
// is re-exported here for convenience — see wedding-wax-seal.meta.ts for why.
export { meta } from "./birthday-bloom.meta";

export function Live({ data }: { data: InviteData }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{ background: "linear-gradient(160deg,#fff4ea,#ffe4d6)" }}
    >
      <div className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden bg-white">
        <div
          className="h-28 flex items-center justify-center text-5xl"
          style={{ background: "linear-gradient(120deg,#ff9466,#ff5f7e)" }}
        >
          🎈🎉🎈
        </div>
        <div className="p-8 text-center">
          <p className="uppercase tracking-[0.25em] text-xs text-orange-500/70 mb-3">You're invited to</p>
          <h1 className="font-sans font-extrabold text-3xl text-[#e0663c] mb-2">{data.title}</h1>
          <p className="text-sm text-gray-500 mb-1">{data.eventDateLabel}</p>
          {data.eventTimeLabel && <p className="text-sm text-gray-500 mb-1">{data.eventTimeLabel}</p>}
          {data.venueName && <p className="text-sm text-gray-500 mb-4">{data.venueName}</p>}
          {data.message && <p className="text-sm text-gray-600 italic mb-4">{data.message}</p>}
          <p className="mt-4 text-lg font-semibold text-[#e0663c]">Hey {data.guestName}! 🎂</p>
          <p className="text-sm text-gray-500 mb-6">come celebrate with us!</p>
          <a
            href={data.rsvpUrl}
            className="inline-block bg-[#e0663c] text-white text-sm font-semibold tracking-wide px-8 py-3 rounded-full hover:opacity-90 transition"
          >
            I'll be there 🙌
          </a>
        </div>
      </div>
    </div>
  );
}

const CONFETTI = [
  { top: 40, left: 60, size: 22, color: "#ff9466", radius: 22 },
  { top: 90, left: 900, size: 16, color: "#ff5f7e", radius: 16 },
  { top: 220, left: 140, size: 12, color: "#ffd166", radius: 12 },
  { top: 260, left: 960, size: 26, color: "#ff9466", radius: 4 },
  { top: 1080, left: 80, size: 18, color: "#ff5f7e", radius: 18 },
  { top: 1160, left: 940, size: 22, color: "#ffd166", radius: 5 },
  { top: 1240, left: 160, size: 14, color: "#ff9466", radius: 14 },
  { top: 1200, left: 700, size: 16, color: "#ff5f7e", radius: 16 },
];

export function Static({ data }: { data: InviteData }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "linear-gradient(160deg,#fff4ea,#ffe4d6)",
        fontFamily: "Outfit",
        position: "relative",
      }}
    >
      {CONFETTI.map((c, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            position: "absolute",
            top: c.top,
            left: c.left,
            width: c.size,
            height: c.size,
            borderRadius: c.radius,
            background: c.color,
          }}
        />
      ))}

      <div
        style={{
          display: "flex",
          height: 130,
          width: "100%",
          background: "linear-gradient(120deg,#ff9466,#ff5f7e)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          flex: 1,
          justifyContent: "center",
          padding: "0 70px",
        }}
      >
        <div style={{ display: "flex", fontSize: 18, letterSpacing: 5, color: "#e0663cb0", marginBottom: 18 }}>
          YOU'RE INVITED TO
        </div>
        <div style={{ display: "flex", fontSize: 52, fontWeight: 800, color: "#e0663c", marginBottom: 24, textAlign: "center" }}>
          {data.title}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#7a6a63", marginBottom: 6 }}>{data.eventDateLabel}</div>
        {data.venueName ? (
          <div style={{ display: "flex", fontSize: 24, color: "#7a6a63", marginBottom: 50 }}>{data.venueName}</div>
        ) : null}
        <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#e0663c", marginBottom: 6 }}>
          Hey {data.guestName}!
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#7a6a63" }}>come celebrate with us!</div>
      </div>

      <div
        style={{
          display: "flex",
          height: 130,
          width: "100%",
          background: "linear-gradient(120deg,#ff5f7e,#ff9466)",
        }}
      />
    </div>
  );
}
