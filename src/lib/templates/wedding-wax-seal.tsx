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

// `meta` lives in ./wedding-wax-seal.meta.ts (a plain, non-client module) and
// is re-exported here for convenience — see that file for why.
export { meta } from "./wedding-wax-seal.meta";

// Elegant script for names/headings + a refined serif for body text — kept
// local to this template (rather than the site-wide `font-serif` Tailwind
// token) so other templates aren't affected.
const script = Parisienne({ subsets: ["latin"], weight: "400" });
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });

function initials(hostNames: string) {
  const parts = hostNames.split(/&| and /i).map((p) => p.trim()).filter(Boolean);
  const letters = parts.map((p) => p.charAt(0).toUpperCase());
  return letters.slice(0, 2).join("&") || "R&Z";
}

function dateParts(iso: string) {
  const d = new Date(iso);
  return {
    day: String(d.getDate()),
    month: d.toLocaleString("en-ZA", { month: "long" }),
    year: String(d.getFullYear()),
  };
}

// A small gold sparkle used to punctuate dividers, mirroring the flourish
// motifs in ornate wedding stationery.
function FlourishDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-5" aria-hidden>
      <span className="h-px w-10 bg-gold/50" />
      <svg width="12" height="12" viewBox="0 0 24 24" className="text-gold">
        <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill="currentColor" />
      </svg>
      <span className="h-px w-10 bg-gold/50" />
    </div>
  );
}

// One rotated corner sprig; four copies (mirrored via CSS scale) trace the
// corners of an ornate card, standing in for a full illustrated corner asset.
function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M3 3 C 24 3, 32 3, 32 22 M3 3 C 3 24, 3 32, 22 32" strokeLinecap="round" />
      <circle cx="32" cy="10" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="10" cy="32" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="24" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="6" cy="24" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Gold-bordered card with corner flourishes — the recurring "framed" look
// used for the formal wording and the map.
function OrnateCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative border border-gold/40 rounded-[2rem] px-8 py-12 bg-white/30 ${className}`}>
      <CornerFlourish className="absolute top-2 left-2 w-8 h-8 text-gold/60" />
      <CornerFlourish className="absolute top-2 right-2 w-8 h-8 text-gold/60 -scale-x-100" />
      <CornerFlourish className="absolute bottom-2 left-2 w-8 h-8 text-gold/60 -scale-y-100" />
      <CornerFlourish className="absolute bottom-2 right-2 w-8 h-8 text-gold/60 -scale-x-100 -scale-y-100" />
      {children}
    </div>
  );
}

// ---------------------------------------------------------------- Live -----
// Interactive version shown at /invite/[token]. A tap-to-open envelope gates
// a full scrolling invitation: hero, scratch-to-reveal date, formal wording +
// optional quote, timeline, live countdown, location + map, dress code, gift
// preferences, and (appended by the page) the RSVP form.
export function Live({ data }: { data: InviteData }) {
  const [open, setOpen] = useState(false);
  const { day, month, year } = dateParts(data.eventDateISO);
  const mapQuery = data.venueAddress || data.venueName;

  return (
    <div className={`w-full bg-[#fbf3ee] ${serif.className}`}>
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="min-h-screen w-full flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md">
              <button
                onClick={() => setOpen(true)}
                className="group relative block w-full aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden focus:outline-none"
                style={{
                  background: data.envelopeImageUrl
                    ? undefined
                    : "linear-gradient(160deg, #fdf6f1 0%, #f3e6db 60%, #ecd9c9 100%)",
                }}
                aria-label="Tap to open your invitation"
              >
                {data.envelopeImageUrl ? (
                  <img src={data.envelopeImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <div
                      className="absolute inset-0 opacity-[0.15]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(122,31,43,0.4) 40px, rgba(122,31,43,0.4) 41px)",
                      }}
                    />
                    <div className="absolute inset-x-0 top-0 h-1/2 origin-top transition-transform duration-700 group-hover:-translate-y-1">
                      <div
                        className="w-full h-full"
                        style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", background: "linear-gradient(200deg,#f6e9dd,#e8d2bd)" }}
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-1/2">
                      <div
                        className="w-full h-full"
                        style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 0)", background: "linear-gradient(340deg,#f6e9dd,#e8d2bd)" }}
                      />
                    </div>
                  </>
                )}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: "radial-gradient(circle at 35% 30%, #9c2c3a, #6c1420)" }}
                >
                  <span className={`${script.className} text-blush text-3xl`}>{initials(data.hostNames)}</span>
                </div>
                <div className="absolute bottom-6 inset-x-0 text-center text-[13px] tracking-widest uppercase text-maroon/70">
                  Tap to open
                </div>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="invitation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            {/* Hero */}
            <section className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
              {data.heroImageUrl && (
                <img
                  src={data.heroImageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background: data.heroImageUrl
                    ? "linear-gradient(180deg, rgba(122,31,43,0.15) 0%, rgba(251,243,238,0.9) 85%)"
                    : "linear-gradient(160deg, #fdf6f1 0%, #f3e6db 100%)",
                }}
              />
              <div className="relative">
                <p className="uppercase tracking-[0.35em] text-xs text-maroon/60 mb-5">You&rsquo;re Invited</p>
                <h1 className={`${script.className} text-5xl sm:text-6xl text-maroon mb-4`}>{data.hostNames}</h1>
                <FlourishDivider />
              </div>
            </section>

            {/* The Date — scratch to reveal */}
            <section className="px-6 py-20 text-center">
              <Reveal>
                <p className={`${script.className} text-3xl text-maroon mb-1`}>The Date</p>
                <p className="text-[11px] uppercase tracking-widest text-maroon/50 mb-8">✦ Scratch to reveal the date ✦</p>
                <div className="flex gap-3 max-w-xs mx-auto">
                  <ScratchCard label="Day" value={day} foilColor="#c9a35a" textColor="#7a1f2b" />
                  <ScratchCard label="Month" value={month} foilColor="#c9a35a" textColor="#7a1f2b" />
                  <ScratchCard label="Year" value={year} foilColor="#c9a35a" textColor="#7a1f2b" />
                </div>
              </Reveal>
            </section>

            {/* Formal invitation text */}
            <section className="px-6 py-20 text-center bg-white/40">
              <Reveal className="max-w-md mx-auto">
                <OrnateCard>
                  <p className="text-[11px] uppercase tracking-widest text-maroon/50 mb-6">You are invited to the wedding of</p>
                  <h2 className={`${script.className} text-4xl text-maroon mb-6`}>{data.hostNames}</h2>
                  {data.message && <p className="text-base text-maroon/70 italic mb-8">&ldquo;{data.message}&rdquo;</p>}
                  <p className="text-lg text-maroon mb-1">Dear {data.guestName},</p>
                  <p className="text-sm text-maroon/70">we would be honoured by your presence.</p>
                </OrnateCard>
              </Reveal>
            </section>

            {/* Quote */}
            {data.quote && (
              <section className="px-6 py-16 text-center">
                <Reveal className="max-w-sm mx-auto">
                  <p className="text-xl italic text-maroon/90 leading-relaxed">&ldquo;{data.quote}&rdquo;</p>
                  {data.quoteAttribution && (
                    <p className="text-xs uppercase tracking-widest text-maroon/50 mt-4">{data.quoteAttribution}</p>
                  )}
                </Reveal>
              </section>
            )}

            {/* Timeline */}
            {data.timeline.length > 0 && (
              <section className="px-6 py-20 text-center bg-white/40">
                <Reveal>
                  <p className={`${script.className} text-3xl text-maroon mb-10`}>Wedding Timeline</p>
                  <div className="max-w-xs mx-auto relative">
                    <div className="absolute left-1/2 top-2 bottom-2 w-px bg-gold/40 -translate-x-1/2" />
                    <div className="space-y-8">
                      {data.timeline.map((item, i) => (
                        <div key={i} className="relative flex flex-col items-center">
                          {item.iconUrl ? (
                            <img
                              src={item.iconUrl}
                              alt=""
                              className="w-12 h-12 object-contain mb-2 relative z-10"
                            />
                          ) : (
                            <div className="w-2.5 h-2.5 rotate-45 bg-gold mb-2 relative z-10" />
                          )}
                          <p className="text-maroon text-base italic">{item.time}</p>
                          <p className="text-xs text-maroon/60">{item.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </section>
            )}

            {/* Countdown */}
            <section className="px-6 py-20 text-center">
              <Reveal>
                <p className={`${script.className} text-3xl text-maroon mb-8`}>The Celebration Begins</p>
                <Countdown targetISO={data.eventDateISO} textColor="#7a1f2b" />
              </Reveal>
            </section>

            {/* Location */}
            {(data.venueName || data.venueAddress) && (
              <section className="px-6 py-20 text-center bg-white/40">
                <Reveal className="max-w-sm mx-auto">
                  <p className={`${script.className} text-3xl text-maroon mb-2`}>Location</p>
                  {data.venueName && <p className="text-lg text-maroon mb-1">{data.venueName}</p>}
                  {data.venueAddress && <p className="text-sm text-maroon/60 mb-6">{data.venueAddress}</p>}
                  {mapQuery && (
                    <div className="relative border border-gold/40 rounded-2xl p-2">
                      <CornerFlourish className="absolute top-1 left-1 w-6 h-6 text-gold/60 z-10" />
                      <CornerFlourish className="absolute top-1 right-1 w-6 h-6 text-gold/60 -scale-x-100 z-10" />
                      <MapEmbed query={mapQuery} textColor="#7a1f2b" />
                    </div>
                  )}
                </Reveal>
              </section>
            )}

            {/* Dress code */}
            {data.dressCode && (
              <section className="px-6 py-20 text-center">
                <Reveal className="max-w-sm mx-auto">
                  <p className={`${script.className} text-3xl text-maroon mb-6`}>Dress Code</p>
                  {data.dressCodeImageUrl && (
                    <img src={data.dressCodeImageUrl} alt="" className="max-w-xs w-full mx-auto mb-6 object-contain" />
                  )}
                  <p className="text-sm text-maroon/70 mb-6">{data.dressCode}</p>
                  {data.dressCodeColors.length > 0 && (
                    <div className="flex justify-center gap-3 mb-6">
                      {data.dressCodeColors.map((c, i) => (
                        <div key={i} className="w-8 h-8 rounded-full shadow-inner border border-black/10" style={{ background: c }} />
                      ))}
                    </div>
                  )}
                  {data.dressCodeNote && <p className="text-xs text-maroon/50 italic">{data.dressCodeNote}</p>}
                </Reveal>
              </section>
            )}

            {/* Gift preferences */}
            {data.giftListUrl && (
              <section className="px-6 py-16 text-center bg-white/40">
                <Reveal className="max-w-sm mx-auto">
                  <p className={`${script.className} text-3xl text-maroon mb-4`}>Gift Preferences</p>
                  <p className="text-sm text-maroon/70 mb-6">
                    Your love, prayers, and presence mean the world to us. If you wish to bless us with a gift, we have
                    created a list for your convenience.
                  </p>
                  <a
                    href={data.giftListUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs uppercase tracking-widest underline underline-offset-4 text-maroon"
                  >
                    View Gift List
                  </a>
                </Reveal>
              </section>
            )}

            {/* RSVP lead-in — the form itself is appended by the page below */}
            <section className="px-6 pt-20 text-center">
              <Reveal>
                <p className={`${script.className} text-3xl text-maroon mb-3`}>Confirm Your Attendance</p>
                <p className="text-sm text-maroon/60">We can&rsquo;t wait to celebrate with you.</p>
              </Reveal>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ------------------------------------------------------------- Static ------
// Plain-styled tree for satori (PNG export). No Tailwind, no client
// interactivity — a single-card teaser summary, since the full scrolling
// experience above only makes sense live in a browser.
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
        background: "linear-gradient(160deg, #fffaf6 0%, #f2ddd0 100%)",
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
          background: "#7a1f2b",
          color: "#fbe9e2",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
          fontFamily: "Italiana",
          marginBottom: 28,
        }}
      >
        {initials(data.hostNames)}
      </div>
      <div style={{ display: "flex", fontSize: 16, letterSpacing: 6, color: "#7a1f2ba0", marginBottom: 18 }}>
        YOU'RE INVITED
      </div>
      <div style={{ display: "flex", fontSize: 46, color: "#7a1f2b", fontFamily: "Italiana", marginBottom: 14 }}>
        {data.hostNames}
      </div>
      <div style={{ display: "flex", width: 70, height: 2, background: "#b98a3d", marginBottom: 18 }} />
      <div style={{ display: "flex", fontSize: 20, color: "#7a1f2bcc", marginBottom: 4 }}>{data.eventDateLabel}</div>
      {data.eventTimeLabel ? (
        <div style={{ display: "flex", fontSize: 20, color: "#7a1f2bcc", marginBottom: 4 }}>{data.eventTimeLabel}</div>
      ) : null}
      {data.venueName ? (
        <div style={{ display: "flex", fontSize: 20, color: "#7a1f2bcc", marginBottom: 30 }}>{data.venueName}</div>
      ) : null}
      <div style={{ display: "flex", fontSize: 24, color: "#7a1f2b", fontFamily: "Italiana", marginBottom: 6 }}>
        Dear {data.guestName},
      </div>
      <div style={{ display: "flex", fontSize: 17, color: "#7a1f2b99" }}>we would be honored by your presence.</div>
    </div>
  );
}
