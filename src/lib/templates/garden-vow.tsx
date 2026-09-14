"use client";

import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cormorant_Garamond, Parisienne } from "next/font/google";
import type { InviteData } from "./types";
import { ScratchCard } from "./components/ScratchCard";
import { Countdown } from "./components/Countdown";
import { MapEmbed } from "./components/MapEmbed";
import { Reveal } from "./components/Reveal";

// `meta` lives in ./garden-vow.meta.ts (a plain, non-client module) and is
// re-exported here for convenience — see wedding-wax-seal.meta.ts for why.
export { meta } from "./garden-vow.meta";

// A soft romantic script for names + a refined serif for body text — kept
// local to this template, same pattern as wedding-wax-seal.
const script = Parisienne({ subsets: ["latin"], weight: "400" });
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });

function initials(hostNames: string) {
  const parts = hostNames.split(/&| and /i).map((p) => p.trim()).filter(Boolean);
  const letters = parts.map((p) => p.charAt(0).toUpperCase());
  return letters.slice(0, 2).join("&") || "L&S";
}

function dateParts(iso: string) {
  const d = new Date(iso);
  return {
    day: String(d.getDate()),
    month: d.toLocaleString("en-ZA", { month: "long" }),
    year: String(d.getFullYear()),
  };
}

// A single rose bloom, built from layered circles — the same "simple shapes,
// hand-placed" language birthday-bloom's confetti uses, dressed up for a
// garden-wedding mood.
function Rose({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className}>
      <circle cx="20" cy="20" r="9" fill="#c98a80" />
      <circle cx="14" cy="14" r="6" fill="#d9a49b" />
      <circle cx="26" cy="14" r="6" fill="#d9a49b" />
      <circle cx="14" cy="26" r="6" fill="#d9a49b" />
      <circle cx="26" cy="26" r="6" fill="#d9a49b" />
      <circle cx="20" cy="20" r="4" fill="#a85c32" />
    </svg>
  );
}

// Four copies (mirrored via CSS transform) trace an ivy-vine corner on the
// formal wording card — this template's answer to wedding-wax-seal's
// CornerFlourish, in a garden idiom instead of gold filigree.
function VineCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 34" className={className} fill="none">
      <path d="M3,3 C20,3 26,3 26,20 M3,3 C3,20 3,26 20,26" stroke="#8fa477" strokeWidth="1.2" />
      <circle cx="26" cy="10" r="2" fill="#c98a80" />
      <circle cx="10" cy="26" r="2" fill="#c98a80" />
    </svg>
  );
}

// The vine-covered arch with a pair of mirrored swans, used once behind the
// hero names — this template's signature illustration, built entirely from
// inline SVG so it needs no image asset.
function GardenArch() {
  return (
    <svg width="330" height="420" viewBox="0 0 330 420" className="max-w-full h-auto">
      <path d="M20,420 L20,180 C20,80 80,20 165,20 C250,20 310,80 310,180 L310,420" fill="none" stroke="#5b6b4f" strokeWidth="5" strokeLinecap="round" />
      <g fill="#6f8259">
        <ellipse cx="20" cy="150" rx="9" ry="5" transform="rotate(-30 20 150)" />
        <ellipse cx="26" cy="105" rx="9" ry="5" transform="rotate(20 26 105)" />
        <ellipse cx="45" cy="65" rx="9" ry="5" transform="rotate(60 45 65)" />
        <ellipse cx="85" cy="32" rx="9" ry="5" transform="rotate(95 85 32)" />
        <ellipse cx="135" cy="18" rx="9" ry="5" transform="rotate(120 135 18)" />
        <ellipse cx="195" cy="18" rx="9" ry="5" transform="rotate(60 195 18)" />
        <ellipse cx="245" cy="32" rx="9" ry="5" transform="rotate(85 245 32)" />
        <ellipse cx="285" cy="65" rx="9" ry="5" transform="rotate(120 285 65)" />
        <ellipse cx="304" cy="105" rx="9" ry="5" transform="rotate(160 304 105)" />
        <ellipse cx="310" cy="150" rx="9" ry="5" transform="rotate(210 310 150)" />
      </g>
      <g transform="translate(6,392)">
        <circle cx="10" cy="10" r="7" fill="#c98a80" /><circle cx="4" cy="4" r="4.5" fill="#dba79e" /><circle cx="16" cy="4" r="4.5" fill="#dba79e" /><circle cx="10" cy="10" r="3" fill="#a85c32" />
      </g>
      <g transform="translate(296,392)">
        <circle cx="10" cy="10" r="7" fill="#c98a80" /><circle cx="4" cy="4" r="4.5" fill="#dba79e" /><circle cx="16" cy="4" r="4.5" fill="#dba79e" /><circle cx="10" cy="10" r="3" fill="#a85c32" />
      </g>
      <line x1="60" y1="300" x2="270" y2="300" stroke="#cdbb95" strokeWidth="1" />
      <g transform="translate(95,250)">
        <path d="M0,50 C0,25 16,8 36,10 C32,3 40,-4 50,0 C44,3 43,10 47,15 C58,17 65,30 60,42 C52,52 32,56 16,53 C7,51 0,52 0,50 Z" fill="#fbf7ee" stroke="#b98a3d" strokeWidth="1.2" />
        <circle cx="48" cy="4" r="1.6" fill="#5b6b4f" />
      </g>
      <g transform="translate(235,250) scale(-1,1)">
        <path d="M0,50 C0,25 16,8 36,10 C32,3 40,-4 50,0 C44,3 43,10 47,15 C58,17 65,30 60,42 C52,52 32,56 16,53 C7,51 0,52 0,50 Z" fill="#fbf7ee" stroke="#b98a3d" strokeWidth="1.2" />
        <circle cx="48" cy="4" r="1.6" fill="#5b6b4f" />
      </g>
      <g transform="translate(95,300) scale(1,-0.55)" opacity="0.18">
        <path d="M0,50 C0,25 16,8 36,10 C32,3 40,-4 50,0 C44,3 43,10 47,15 C58,17 65,30 60,42 C52,52 32,56 16,53 C7,51 0,52 0,50 Z" fill="#fbf7ee" />
      </g>
      <g transform="translate(235,300) scale(-1,-0.55)" opacity="0.18">
        <path d="M0,50 C0,25 16,8 36,10 C32,3 40,-4 50,0 C44,3 43,10 47,15 C58,17 65,30 60,42 C52,52 32,56 16,53 C7,51 0,52 0,50 Z" fill="#fbf7ee" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------- Live -----
// Interactive version shown at /invite/[token]. Same beats as
// wedding-wax-seal (tap-to-open envelope, then a scrolling invitation) in a
// lighter, ivory-and-sage garden palette.
export function Live({ data }: { data: InviteData }) {
  const [open, setOpen] = useState(false);
  const { day, month, year } = dateParts(data.eventDateISO);
  const mapQuery = data.venueAddress || data.venueName;

  return (
    <div className={`w-full bg-[#faf3ea] ${serif.className}`}>
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden"
            style={{ background: "linear-gradient(160deg,#fdf9f2 0%,#f6ecdd 55%,#efe0c8 100%)" }}
          >
            <div
              className="absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 26px, rgba(185,138,61,0.10) 26px, rgba(185,138,61,0.10) 27px)",
              }}
            />
            <div className="w-full max-w-md">
              <button
                onClick={() => setOpen(true)}
                className="group relative block w-full aspect-[3/4] rounded-md shadow-2xl overflow-hidden focus:outline-none bg-[#fbf3e6]"
                aria-label="Tap to open your invitation"
              >
                {data.envelopeImageUrl ? (
                  <img src={data.envelopeImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <svg viewBox="0 0 280 380" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <path d="M0,0 L140,140 L280,0" fill="none" stroke="#b98a3d" strokeWidth="1" opacity="0.55" />
                    <path d="M0,380 L140,220 L280,380" fill="none" stroke="#b98a3d" strokeWidth="1" opacity="0.35" />
                    <rect x="0.5" y="0.5" width="279" height="379" fill="none" stroke="#b98a3d" strokeWidth="1" opacity="0.4" />
                  </svg>
                )}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                  <div
                    className="w-[74px] h-[74px] rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: "radial-gradient(circle at 35% 30%, #6b7c58, #4a5a3c 70%)" }}
                  >
                    <span className={`${script.className} text-[#f3e9cf] text-2xl`}>{initials(data.hostNames)}</span>
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.3em] text-[#8a6a2f]">Tap to open</div>
                </div>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="invitation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            {/* Hero — vine arch, mirrored swans, names */}
            <section
              className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 py-16 relative overflow-hidden"
              style={{ background: "linear-gradient(180deg,#f7e9d6 0%,#f3ddc4 45%,#e9c9a6 100%)" }}
            >
              {data.heroImageUrl ? (
                <img src={data.heroImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
              ) : null}
              <div
                className="absolute inset-0"
                style={{
                  background: data.heroImageUrl
                    ? "linear-gradient(180deg, rgba(74,90,60,0.15) 0%, rgba(250,243,234,0.9) 85%)"
                    : undefined,
                }}
              />
              <div
                className="absolute top-[70px] left-1/2 -translate-x-1/2 w-[220px] h-[220px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(255,241,214,0.9), rgba(255,241,214,0) 70%)" }}
              />
              <div className="relative z-10"><GardenArch /></div>
              <div className="relative z-10 -mt-16 sm:-mt-24">
                <p className="uppercase tracking-[0.32em] text-xs text-[#7a6a4a] mb-2">Wedding Day &middot; {data.eventDateLabel}</p>
                <h1 className={`${script.className} text-5xl sm:text-6xl leading-tight text-[#4a5a3c]`}>{data.hostNames}</h1>
                <div className="mt-4 flex items-center gap-2 justify-center text-[#8a6a2f]">
                  <span className="w-6 h-px bg-[#b98a3d]" />
                  <span className="text-[11px] uppercase tracking-[0.3em]">scroll to open your invitation</span>
                  <span className="w-6 h-px bg-[#b98a3d]" />
                </div>
              </div>
            </section>

            {/* The Date — scratch to reveal */}
            <section className="px-6 py-20 text-center bg-[#faf3ea]">
              <Reveal>
                <p className={`${script.className} text-3xl text-[#4a5a3c] mb-1`}>The Date</p>
                <p className="text-[11px] uppercase tracking-widest text-[#8a6a2f]/60 mb-8">&#10022; scratch to reveal &#10022;</p>
                <div className="flex gap-3 max-w-xs mx-auto justify-center">
                  <ScratchCard label="Day" value={day} foilColor="#8fa477" textColor="#4a5a3c" />
                  <ScratchCard label="Month" value={month} foilColor="#8fa477" textColor="#4a5a3c" />
                  <ScratchCard label="Year" value={year} foilColor="#8fa477" textColor="#4a5a3c" />
                </div>
              </Reveal>
            </section>

            {/* Formal invitation text + optional quote */}
            <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(180deg,#f7e9d6,#f3ead9)" }}>
              <Reveal className="max-w-md mx-auto">
                <div className="relative px-8 py-11 bg-[#fffdf8] rounded-sm" style={{ boxShadow: "0 18px 40px rgba(90,74,45,0.10)" }}>
                  <VineCorner className="absolute top-3 left-3 w-8 h-8" />
                  <VineCorner className="absolute top-3 right-3 w-8 h-8 -scale-x-100" />
                  <VineCorner className="absolute bottom-3 left-3 w-8 h-8 -scale-y-100" />
                  <VineCorner className="absolute bottom-3 right-3 w-8 h-8 scale-[-1]" />

                  <p className="text-[11px] uppercase tracking-widest text-[#8a6a2f]/60 mb-6">You are invited to the wedding of</p>
                  <h2 className={`${script.className} text-4xl text-[#4a5a3c] mb-6`}>{data.hostNames}</h2>
                  {data.message && <p className="text-base text-[#4a4030]/80 italic mb-8">&ldquo;{data.message}&rdquo;</p>}
                  <p className="text-lg text-[#4a4030] mb-1">Dear {data.guestName},</p>
                  <p className="text-sm text-[#4a4030]/70">we would love for you to join us.</p>
                </div>
              </Reveal>
            </section>

            {data.quote && (
              <section className="px-6 py-16 text-center bg-[#faf3ea]">
                <Reveal className="max-w-sm mx-auto">
                  <p className={`${script.className} text-2xl text-[#8a6a2f]`}>&ldquo;{data.quote}&rdquo;</p>
                  {data.quoteAttribution && (
                    <p className="text-[10px] uppercase tracking-widest text-[#a99a78] mt-4">{data.quoteAttribution}</p>
                  )}
                </Reveal>
              </section>
            )}

            {/* Timeline */}
            {data.timeline.length > 0 && (
              <section className="px-6 py-20" style={{ background: "linear-gradient(180deg,#f3ead9,#efe2c9)" }}>
                <Reveal>
                  <p className={`${script.className} text-3xl text-[#4a5a3c] mb-10 text-center`}>Schedule of the Day</p>
                  <div className="max-w-xs mx-auto relative pl-8">
                    <div className="absolute left-2 top-1.5 bottom-1.5 w-px bg-[#c9a35a]" />
                    <div className="space-y-9">
                      {data.timeline.map((item, i) => (
                        <div key={i} className="relative">
                          <span className="absolute -left-8 top-0.5">
                            {item.iconUrl ? (
                              <img src={item.iconUrl} alt="" className="w-5 h-5 object-contain" />
                            ) : (
                              <Rose size={18} />
                            )}
                          </span>
                          <p className="text-[11px] uppercase tracking-widest text-[#8a6a2f]">{item.time}</p>
                          <p className="text-lg text-[#4a4030] mt-0.5">{item.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </section>
            )}

            {/* Countdown */}
            <section className="px-6 py-20 text-center bg-[#faf3ea]">
              <Reveal>
                <p className={`${script.className} text-3xl text-[#4a5a3c] mb-8`}>The Celebration Begins In</p>
                <Countdown targetISO={data.eventDateISO} textColor="#4a5a3c" />
              </Reveal>
            </section>

            {/* Location */}
            {(data.venueName || data.venueAddress) && (
              <section className="px-6 py-20 text-center" style={{ background: "linear-gradient(180deg,#efe2c9,#f3ead9)" }}>
                <Reveal className="max-w-sm mx-auto">
                  <p className={`${script.className} text-3xl text-[#4a5a3c] mb-2`}>Location</p>
                  {data.venueName && <p className="text-lg text-[#4a4030] mb-1">{data.venueName}</p>}
                  {data.venueAddress && <p className="text-sm text-[#4a4030]/60 mb-6">{data.venueAddress}</p>}
                  {mapQuery && (
                    <div className="rounded-lg border border-[#dcc79a] p-2 bg-[#f1e9d6]">
                      <MapEmbed query={mapQuery} textColor="#4a5a3c" />
                    </div>
                  )}
                </Reveal>
              </section>
            )}

            {/* Dress code */}
            {data.dressCode && (
              <section className="px-6 py-20 text-center bg-[#faf3ea]">
                <Reveal className="max-w-sm mx-auto">
                  <p className={`${script.className} text-3xl text-[#4a5a3c] mb-6`}>Dress Code</p>
                  {data.dressCodeImageUrl && (
                    <img src={data.dressCodeImageUrl} alt="" className="max-w-xs w-full mx-auto mb-6 object-contain" />
                  )}
                  <p className="text-sm text-[#4a4030]/80 mb-6">{data.dressCode}</p>
                  {data.dressCodeColors.length > 0 && (
                    <div className="flex justify-center gap-3 mb-6">
                      {data.dressCodeColors.map((c, i) => (
                        <div key={i} className="w-8 h-8 rounded-full shadow-inner border border-black/10" style={{ background: c }} />
                      ))}
                    </div>
                  )}
                  {data.dressCodeNote && <p className="text-xs text-[#4a4030]/50 italic">{data.dressCodeNote}</p>}
                </Reveal>
              </section>
            )}

            {/* Gift preferences */}
            {data.giftListUrl && (
              <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(180deg,#f3ead9,#efe2c9)" }}>
                <Reveal className="max-w-sm mx-auto">
                  <p className={`${script.className} text-3xl text-[#4a5a3c] mb-4`}>Gift Preferences</p>
                  <p className="text-sm text-[#4a4030]/70 mb-6">
                    Your presence is the greatest gift. If you&rsquo;d still like to give one, we&rsquo;ve put together a list.
                  </p>
                  <a
                    href={data.giftListUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs uppercase tracking-widest underline underline-offset-4 text-[#4a5a3c]"
                  >
                    View Gift List
                  </a>
                </Reveal>
              </section>
            )}

            {/* RSVP lead-in — the form itself is appended by the page below */}
            <section className="px-6 pt-20 text-center bg-[#faf3ea]">
              <Reveal>
                <p className={`${script.className} text-3xl text-[#4a5a3c] mb-3`}>Confirm Your Attendance</p>
                <p className="text-sm text-[#4a4030]/60">We can&rsquo;t wait to celebrate with you.</p>
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
// single-card summary approach as wedding-wax-seal's Static, in the garden
// palette.
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
        background: "linear-gradient(160deg, #fdf9f2 0%, #e9c9a6 100%)",
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
          background: "#4a5a3c",
          color: "#f3e9cf",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
          fontFamily: "Italiana",
          marginBottom: 28,
        }}
      >
        {initials(data.hostNames)}
      </div>
      <div style={{ display: "flex", fontSize: 16, letterSpacing: 6, color: "#8a6a2fa0", marginBottom: 18 }}>
        YOU'RE INVITED
      </div>
      <div style={{ display: "flex", fontSize: 46, color: "#4a5a3c", fontFamily: "Italiana", marginBottom: 14 }}>
        {data.hostNames}
      </div>
      <div style={{ display: "flex", width: 70, height: 2, background: "#b98a3d", marginBottom: 18 }} />
      <div style={{ display: "flex", fontSize: 20, color: "#4a4030cc", marginBottom: 4 }}>{data.eventDateLabel}</div>
      {data.eventTimeLabel ? (
        <div style={{ display: "flex", fontSize: 20, color: "#4a4030cc", marginBottom: 4 }}>{data.eventTimeLabel}</div>
      ) : null}
      {data.venueName ? (
        <div style={{ display: "flex", fontSize: 20, color: "#4a4030cc", marginBottom: 30 }}>{data.venueName}</div>
      ) : null}
      <div style={{ display: "flex", fontSize: 24, color: "#4a5a3c", fontFamily: "Italiana", marginBottom: 6 }}>
        Dear {data.guestName},
      </div>
      <div style={{ display: "flex", fontSize: 17, color: "#4a403099" }}>we would love for you to join us.</div>
    </div>
  );
}
