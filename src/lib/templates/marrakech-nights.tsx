"use client";

import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cormorant_Garamond, Marcellus } from "next/font/google";
import type { InviteData } from "./types";
import { ScratchCard } from "./components/ScratchCard";
import { Countdown } from "./components/Countdown";
import { MapEmbed } from "./components/MapEmbed";
import { Reveal } from "./components/Reveal";

// `meta` lives in ./marrakech-nights.meta.ts (a plain, non-client module)
// and is re-exported here for convenience — see wedding-wax-seal.meta.ts.
export { meta } from "./marrakech-nights.meta";

// An elegant display face for names/headings + a refined serif for body
// text — kept local to this template, same pattern as wedding-wax-seal.
const display = Marcellus({ subsets: ["latin"], weight: "400" });
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });

function initials(hostNames: string) {
  const parts = hostNames.split(/&| and /i).map((p) => p.trim()).filter(Boolean);
  const letters = parts.map((p) => p.charAt(0).toUpperCase());
  return letters.slice(0, 2).join("&") || "Y&K";
}

// An 8-point geometric star (two overlapping squares) — the zellige-tile
// motif this template repeats for the timeline markers, in place of
// wedding-wax-seal's wax-seal circle.
function Star({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className}>
      <rect x="3" y="3" width="14" height="14" fill="currentColor" />
      <rect x="3" y="3" width="14" height="14" fill="currentColor" transform="rotate(45 10 10)" />
    </svg>
  );
}

// The pointed arch with a mosaic border, a hanging chandelier, and
// silhouetted palm fronds at the base — this template's signature
// illustration, built entirely from inline SVG so it needs no image asset.
function PalaceArch() {
  return (
    <svg width="330" height="560" viewBox="0 0 330 560" className="max-w-full h-auto">
      {/* scattered stars */}
      <g fill="#f0d9a0" opacity="0.55">
        <circle cx="30" cy="40" r="1.4" /><circle cx="80" cy="90" r="1.1" /><circle cx="300" cy="35" r="1.4" />
        <circle cx="300" cy="150" r="1.2" /><circle cx="30" cy="150" r="1.1" />
      </g>
      {/* chandelier */}
      <g transform="translate(105,0)">
        <line x1="60" y1="0" x2="60" y2="30" stroke="#c9a24b" strokeWidth="1.5" />
        <circle cx="60" cy="35" r="5" fill="none" stroke="#c9a24b" strokeWidth="1.5" />
        <path d="M20,40 C20,70 40,85 60,85 C80,85 100,70 100,40" fill="none" stroke="#c9a24b" strokeWidth="1.5" />
        <path d="M35,42 C35,62 46,72 60,72 C74,72 85,62 85,42" fill="none" stroke="#c9a24b" strokeWidth="1.2" />
        <g fill="#f0d9a0">
          <circle cx="20" cy="42" r="3" /><circle cx="100" cy="42" r="3" /><circle cx="35" cy="63" r="2.6" /><circle cx="85" cy="63" r="2.6" /><circle cx="60" cy="90" r="3.4" />
        </g>
      </g>
      {/* arch */}
      <g transform="translate(0,140)">
        <path d="M20,420 L20,220 C20,110 80,40 160,40 C240,40 300,110 300,220 L300,420" fill="none" stroke="#c9a24b" strokeWidth="4" />
        <path d="M40,420 L40,225 C40,125 92,62 160,62 C228,62 280,125 280,225 L280,420" fill="none" stroke="#c9a24b" strokeWidth="1.2" opacity="0.6" />
        <g fill="#c9a24b">
          <rect x="14" y="340" width="10" height="10" transform="rotate(45 19 345)" />
          <rect x="14" y="260" width="10" height="10" transform="rotate(45 19 265)" />
          <rect x="296" y="340" width="10" height="10" transform="rotate(45 301 345)" />
          <rect x="296" y="260" width="10" height="10" transform="rotate(45 301 265)" />
          <rect x="80" y="60" width="9" height="9" transform="rotate(45 84.5 64.5)" />
          <rect x="155" y="34" width="9" height="9" transform="rotate(45 159.5 38.5)" />
          <rect x="228" y="60" width="9" height="9" transform="rotate(45 232.5 64.5)" />
        </g>
        <g fill="#1c130b" opacity="0.85">
          <path d="M20,420 C10,380 -10,370 -30,360 C-5,350 15,360 25,385 Z" />
          <path d="M20,420 C5,370 5,350 -10,330 C15,335 30,355 30,390 Z" />
          <path d="M300,420 C310,380 330,370 350,360 C325,350 305,360 295,385 Z" />
          <path d="M300,420 C315,370 315,350 330,330 C305,335 290,355 290,390 Z" />
        </g>
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------- Live -----
// Interactive version shown at /invite/[token]. Same beats as
// wedding-wax-seal (tap-to-open envelope, then a scrolling invitation) in a
// deep espresso-and-gold evening palette.
export function Live({ data }: { data: InviteData }) {
  const [open, setOpen] = useState(false);
  const mapQuery = data.venueAddress || data.venueName;
  const dp = (() => {
    const d = new Date(data.eventDateISO);
    return { day: String(d.getDate()), month: d.toLocaleString("en-ZA", { month: "long" }), year: String(d.getFullYear()) };
  })();

  return (
    <div className={`w-full bg-[#241812] text-[#f3e6d3] ${serif.className}`}>
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden"
            style={{ background: "linear-gradient(160deg,#3a2717 0%,#2a1c10 60%,#1c130b 100%)" }}
          >
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 26px, rgba(201,162,75,0.06) 26px, rgba(201,162,75,0.06) 27px)",
              }}
            />
            <div className="w-full max-w-md">
              <button
                onClick={() => setOpen(true)}
                className="group relative block w-full aspect-[3/4] rounded-md shadow-2xl overflow-hidden focus:outline-none bg-[#2e2013]"
                aria-label="Tap to open your invitation"
              >
                {data.envelopeImageUrl ? (
                  <img src={data.envelopeImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <svg viewBox="0 0 280 380" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <path d="M0,0 L140,140 L280,0" fill="none" stroke="#c9a24b" strokeWidth="1" opacity="0.5" />
                    <path d="M0,380 L140,220 L280,380" fill="none" stroke="#c9a24b" strokeWidth="1" opacity="0.3" />
                    <rect x="0.5" y="0.5" width="279" height="379" fill="none" stroke="#c9a24b" strokeWidth="1" opacity="0.45" />
                  </svg>
                )}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
                  <svg width="78" height="78" viewBox="0 0 78 78">
                    <circle cx="39" cy="39" r="37" fill="none" stroke="#c9a24b" strokeWidth="1" />
                    <g fill="#c9a24b" opacity="0.9">
                      <rect x="20" y="20" width="38" height="38" />
                      <rect x="20" y="20" width="38" height="38" transform="rotate(45 39 39)" />
                    </g>
                    <rect x="27" y="27" width="24" height="24" fill="#2e2013" />
                    <text x="39" y="43" textAnchor="middle" fontSize="9" letterSpacing="1" fill="#f0d9a0" fontFamily="serif">
                      {initials(data.hostNames)}
                    </text>
                  </svg>
                  <div className="text-[11px] uppercase tracking-[0.32em] text-[#c9a24b]">Tap to open</div>
                </div>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="invitation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            {/* Hero — pointed arch, chandelier, names */}
            <section
              className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 py-16 relative overflow-hidden"
              style={{ background: "linear-gradient(180deg,#241812 0%,#2e1e12 55%,#3a2717 100%)" }}
            >
              {data.heroImageUrl ? (
                <img src={data.heroImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              ) : null}
              <div className="relative z-10 -mb-16 sm:-mb-24"><PalaceArch /></div>
              <div className="relative z-10">
                <p className="uppercase tracking-[0.34em] text-xs text-[#d8b768] mb-2">Wedding Day &middot; {data.eventDateLabel}</p>
                <h1 className={`${display.className} text-4xl sm:text-5xl leading-snug text-[#f3e6d3]`}>{data.hostNames}</h1>
                <div className="mt-4 flex items-center gap-2 justify-center text-[#c9a24b]">
                  <span className="w-6 h-px bg-[#c9a24b]" />
                  <span className="text-[11px] uppercase tracking-[0.3em]">scroll to begin</span>
                  <span className="w-6 h-px bg-[#c9a24b]" />
                </div>
              </div>
            </section>

            {/* The Date — scratch to reveal */}
            <section className="px-6 py-20 text-center bg-[#241812]">
              <Reveal>
                <p className={`${display.className} text-2xl text-[#f0d9a0] mb-1`}>The Date</p>
                <p className="text-[11px] uppercase tracking-widest text-[#8a7a5a] mb-8">scratch to reveal</p>
                <div className="flex gap-3 max-w-xs mx-auto justify-center">
                  <ScratchCard label="Day" value={dp.day} foilColor="#c9a24b" textColor="#f0d9a0" />
                  <ScratchCard label="Month" value={dp.month} foilColor="#c9a24b" textColor="#f0d9a0" />
                  <ScratchCard label="Year" value={dp.year} foilColor="#c9a24b" textColor="#f0d9a0" />
                </div>
              </Reveal>
            </section>

            {/* Formal invitation text + optional quote, in a pointed-arch card */}
            <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(180deg,#241812,#1c130b)" }}>
              <Reveal className="max-w-md mx-auto">
                <div
                  className="px-7 pt-12 pb-9 border border-[#c9a24b]"
                  style={{
                    background: "linear-gradient(180deg,#2e1e12,#241812)",
                    clipPath: "polygon(0% 8%, 50% 0%, 100% 8%, 100% 100%, 0% 100%)",
                  }}
                >
                  <p className="text-[11px] uppercase tracking-widest text-[#8a7a5a] mb-6">You are invited to the wedding of</p>
                  <h2 className={`${display.className} text-3xl text-[#f0d9a0] mb-6`}>{data.hostNames}</h2>
                  {data.message && <p className="text-base text-[#e8dcc4]/90 italic mb-8">&ldquo;{data.message}&rdquo;</p>}
                  <p className="text-lg text-[#f3e6d3] mb-1">Dear {data.guestName},</p>
                  <p className="text-sm text-[#e8dcc4]/70">we would be honoured by your presence.</p>
                </div>
              </Reveal>
            </section>

            {data.quote && (
              <section className="px-6 py-16 text-center bg-[#241812]">
                <Reveal className="max-w-sm mx-auto">
                  <p className={`${display.className} text-xl text-[#f0d9a0]`}>&ldquo;{data.quote}&rdquo;</p>
                  {data.quoteAttribution && (
                    <p className="text-[10px] uppercase tracking-widest text-[#8a7a5a] mt-4">{data.quoteAttribution}</p>
                  )}
                </Reveal>
              </section>
            )}

            {/* Timeline */}
            {data.timeline.length > 0 && (
              <section className="px-6 py-20" style={{ background: "linear-gradient(180deg,#1c130b,#241812)" }}>
                <Reveal>
                  <p className={`${display.className} text-2xl text-[#f0d9a0] mb-10 text-center`}>Order of Events</p>
                  <div className="max-w-xs mx-auto relative pl-8">
                    <div className="absolute left-2 top-1.5 bottom-1.5 w-px bg-[#6b5a34]" />
                    <div className="space-y-9">
                      {data.timeline.map((item, i) => (
                        <div key={i} className="relative">
                          <span className="absolute -left-8 top-1 text-[#c9a24b]">
                            {item.iconUrl ? (
                              <img src={item.iconUrl} alt="" className="w-5 h-5 object-contain" />
                            ) : (
                              <Star size={14} />
                            )}
                          </span>
                          <p className="text-[11px] uppercase tracking-widest text-[#d8b768]">{item.time}</p>
                          <p className="text-lg text-[#f3e6d3] mt-0.5">{item.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </section>
            )}

            {/* Countdown */}
            <section className="px-6 py-20 text-center bg-[#241812]">
              <Reveal>
                <p className={`${display.className} text-2xl text-[#f0d9a0] mb-8`}>The Celebration Begins In</p>
                <Countdown targetISO={data.eventDateISO} textColor="#f0d9a0" />
              </Reveal>
            </section>

            {/* Location */}
            {(data.venueName || data.venueAddress) && (
              <section className="px-6 py-20 text-center" style={{ background: "linear-gradient(180deg,#241812,#2e1e12)" }}>
                <Reveal className="max-w-sm mx-auto">
                  <p className={`${display.className} text-2xl text-[#f0d9a0] mb-2`}>Venue</p>
                  {data.venueName && <p className="text-lg text-[#f3e6d3] mb-1">{data.venueName}</p>}
                  {data.venueAddress && <p className="text-sm text-[#8a7a5a] mb-6">{data.venueAddress}</p>}
                  <svg width="100%" height="120" viewBox="0 0 330 160" className="mb-6">
                    <rect x="90" y="70" width="18" height="70" fill="#c9a24b" /><path d="M90,70 C90,55 108,55 108,70 Z" fill="#c9a24b" />
                    <rect x="222" y="70" width="18" height="70" fill="#c9a24b" /><path d="M222,70 C222,55 240,55 240,70 Z" fill="#c9a24b" />
                    <rect x="130" y="90" width="70" height="50" fill="#c9a24b" />
                    <path d="M130,90 C130,60 200,60 200,90 Z" fill="#c9a24b" />
                    <circle cx="165" cy="55" r="6" fill="#c9a24b" />
                    <line x1="20" y1="140" x2="310" y2="140" stroke="#c9a24b" strokeWidth="1.5" />
                  </svg>
                  {mapQuery && (
                    <div className="rounded-lg border border-[#6b5a34] p-2 bg-[#2e1e12]">
                      <MapEmbed query={mapQuery} textColor="#f0d9a0" />
                    </div>
                  )}
                </Reveal>
              </section>
            )}

            {/* Dress code */}
            {data.dressCode && (
              <section className="px-6 py-20 text-center bg-[#241812]">
                <Reveal className="max-w-sm mx-auto">
                  <p className={`${display.className} text-2xl text-[#f0d9a0] mb-6`}>Dress Code</p>
                  {data.dressCodeImageUrl && (
                    <img src={data.dressCodeImageUrl} alt="" className="max-w-xs w-full mx-auto mb-6 object-contain" />
                  )}
                  <p className="text-sm text-[#e8dcc4]/85 mb-6">{data.dressCode}</p>
                  {data.dressCodeColors.length > 0 && (
                    <div className="flex justify-center gap-3 mb-6">
                      {data.dressCodeColors.map((c, i) => (
                        <div key={i} className="w-8 h-8 rounded-full shadow-inner border border-black/20" style={{ background: c }} />
                      ))}
                    </div>
                  )}
                  {data.dressCodeNote && <p className="text-xs text-[#8a7a5a] italic">{data.dressCodeNote}</p>}
                </Reveal>
              </section>
            )}

            {/* Gift preferences */}
            {data.giftListUrl && (
              <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(180deg,#2e1e12,#241812)" }}>
                <Reveal className="max-w-sm mx-auto">
                  <p className={`${display.className} text-2xl text-[#f0d9a0] mb-4`}>Gift Preferences</p>
                  <p className="text-sm text-[#e8dcc4]/80 mb-6">
                    Your presence and prayers mean the most to us. If you&rsquo;d still like to give a gift, here&rsquo;s a list.
                  </p>
                  <a
                    href={data.giftListUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs uppercase tracking-widest underline underline-offset-4 text-[#f0d9a0]"
                  >
                    View Gift List
                  </a>
                </Reveal>
              </section>
            )}

            {/* RSVP lead-in — the form itself is appended by the page below */}
            <section className="px-6 pt-20 text-center bg-[#241812]">
              <Reveal>
                <p className={`${display.className} text-2xl text-[#f0d9a0] mb-3`}>Confirm Your Attendance</p>
                <p className="text-sm text-[#8a7a5a]">We can&rsquo;t wait to celebrate with you.</p>
              </Reveal>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ------------------------------------------------------------- Static ------
// Plain-styled tree for satori (PNG export) — same registered fonts and
// single-card summary approach as wedding-wax-seal's Static, in the
// espresso-and-gold evening palette.
export function Static({ data }: { data: InviteData }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "linear-gradient(160deg, #3a2717 0%, #1c130b 100%)",
        padding: "70px 60px",
        textAlign: "center",
        fontFamily: "Lora",
      }}
    >
      <div
        style={{
          display: "flex",
          width: 90,
          height: 90,
          borderRadius: 90,
          background: "#c9a24b",
          color: "#241812",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
          fontFamily: "Italiana",
          marginBottom: 28,
        }}
      >
        {initials(data.hostNames)}
      </div>
      <div style={{ display: "flex", fontSize: 16, letterSpacing: 6, color: "#c9a24ba0", marginBottom: 18 }}>
        YOU'RE INVITED
      </div>
      <div style={{ display: "flex", fontSize: 46, color: "#f0d9a0", fontFamily: "Italiana", marginBottom: 14 }}>
        {data.hostNames}
      </div>
      <div style={{ display: "flex", width: 70, height: 2, background: "#c9a24b", marginBottom: 18 }} />
      <div style={{ display: "flex", fontSize: 20, color: "#f3e6d3cc", marginBottom: 4 }}>{data.eventDateLabel}</div>
      {data.eventTimeLabel ? (
        <div style={{ display: "flex", fontSize: 20, color: "#f3e6d3cc", marginBottom: 4 }}>{data.eventTimeLabel}</div>
      ) : null}
      {data.venueName ? (
        <div style={{ display: "flex", fontSize: 20, color: "#f3e6d3cc", marginBottom: 30 }}>{data.venueName}</div>
      ) : null}
      <div style={{ display: "flex", fontSize: 24, color: "#f0d9a0", fontFamily: "Italiana", marginBottom: 6 }}>
        Dear {data.guestName},
      </div>
      <div style={{ display: "flex", fontSize: 17, color: "#e8dcc499" }}>we would be honoured by your presence.</div>
    </div>
  );
}
