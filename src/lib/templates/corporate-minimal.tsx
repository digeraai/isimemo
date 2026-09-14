"use client";

import React from "react";
import type { InviteData } from "./types";

// `meta` lives in ./corporate-minimal.meta.ts (a plain, non-client module)
// and is re-exported here for convenience — see wedding-wax-seal.meta.ts for why.
export { meta } from "./corporate-minimal.meta";

export function Live({ data }: { data: InviteData }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f4f6] p-6">
      <div className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden bg-white border border-black/5">
        <div className="h-2 w-full bg-[#1c1c2e]" />
        <div className="p-10">
          <p className="uppercase tracking-[0.3em] text-[11px] text-[#1c1c2e]/50 mb-4">You're invited</p>
          <h1 className="font-sans font-semibold text-2xl text-[#1c1c2e] mb-3">{data.title}</h1>
          <div className="w-10 h-[3px] bg-[#1c1c2e] mb-5" />
          <p className="text-sm text-[#1c1c2e]/70 mb-1">{data.eventDateLabel}</p>
          {data.eventTimeLabel && <p className="text-sm text-[#1c1c2e]/70 mb-1">{data.eventTimeLabel}</p>}
          {data.venueName && <p className="text-sm text-[#1c1c2e]/70 mb-1">{data.venueName}</p>}
          {data.venueAddress && <p className="text-xs text-[#1c1c2e]/40 mb-4">{data.venueAddress}</p>}
          {data.message && <p className="text-sm text-[#1c1c2e]/70 mb-4">{data.message}</p>}
          <p className="mt-6 text-sm text-[#1c1c2e]">Dear {data.guestName},</p>
          <p className="text-sm text-[#1c1c2e]/60 mb-6">we'd be glad to have you with us.</p>
          <a
            href={data.rsvpUrl}
            className="inline-block bg-[#1c1c2e] text-white text-sm tracking-wide px-7 py-3 rounded-md hover:opacity-90 transition"
          >
            Confirm attendance
          </a>
        </div>
      </div>
    </div>
  );
}

export function Static({ data }: { data: InviteData }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#ffffff",
        fontFamily: "WorkSans",
        position: "relative",
      }}
    >
      {/* Large soft accent circle, right side — fills the negative space with
          a deliberate geometric shape instead of leaving it blank. */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: -180,
          right: -220,
          width: 620,
          height: 620,
          borderRadius: 620,
          background: "#1c1c2e0d",
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: -260,
          right: -160,
          width: 520,
          height: 520,
          borderRadius: 520,
          background: "#1c1c2e08",
        }}
      />

      <div style={{ display: "flex", height: 14, width: "100%", background: "#1c1c2e" }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          padding: "0 90px",
        }}
      >
        <div style={{ display: "flex", fontSize: 15, letterSpacing: 6, color: "#1c1c2e88", marginBottom: 22 }}>
          YOU'RE INVITED
        </div>
        <div style={{ display: "flex", fontSize: 46, fontWeight: 700, color: "#1c1c2e", marginBottom: 24, maxWidth: 700 }}>
          {data.title}
        </div>
        <div style={{ display: "flex", width: 60, height: 4, background: "#1c1c2e", marginBottom: 28 }} />
        <div style={{ display: "flex", fontSize: 22, color: "#1c1c2eb3", marginBottom: 6 }}>{data.eventDateLabel}</div>
        {data.eventTimeLabel ? (
          <div style={{ display: "flex", fontSize: 22, color: "#1c1c2eb3", marginBottom: 6 }}>{data.eventTimeLabel}</div>
        ) : null}
        {data.venueName ? (
          <div style={{ display: "flex", fontSize: 22, color: "#1c1c2eb3", marginBottom: 46 }}>{data.venueName}</div>
        ) : null}
        <div style={{ display: "flex", fontSize: 26, color: "#1c1c2e", marginBottom: 4 }}>Dear {data.guestName},</div>
        <div style={{ display: "flex", fontSize: 20, color: "#1c1c2e99" }}>we'd be glad to have you with us.</div>
      </div>
      <div style={{ display: "flex", height: 14, width: "100%", background: "#1c1c2e" }} />
    </div>
  );
}
