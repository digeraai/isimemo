"use client";

import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InviteData } from "./types";
import { ScratchCard } from "./components/ScratchCard";
import { Countdown } from "./components/Countdown";
import { MapEmbed } from "./components/MapEmbed";
import { Reveal } from "./components/Reveal";

// `meta` lives in ./wedding-wax-seal.meta.ts (a plain, non-client module) and
// is re-exported here for convenience — see that file for why.
export { meta } from "./wedding-wax-seal.meta";

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
    <div className="w-full bg-[#fbf3ee]">
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
                  background: "linear-gradient(160deg, #fdf6f1 0%, #f3e6db 60%, #ecd9c9 100%)",
                }}
                aria-label="Tap to open your invitation"
              >
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
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: "radial-gradient(circle at 35% 30%, #9c2c3a, #6c1420)" }}
                >
                  <span className="font-serif italic text-blush text-2xl">{initials(data.hostNames)}</span>
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
                <h1 className="font-serif italic text-4xl sm:text-5xl text-maroon mb-4">{data.hostNames}</h1>
                <div className="w-16 h-px bg-gold mx-auto" />
              </div>
            </section>

            {/* The Date — scratch to reveal */}
            <section className="px-6 py-20 text-center">
              <Reveal>
                <p className="font-serif italic text-2xl text-maroon mb-1">The Date</p>
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
                <div className="border border-gold/40 rounded-[2rem] px-8 py-12">
                  <p className="text-[11px] uppercase tracking-widest text-maroon/50 mb-6">You are invited to the wedding of</p>
                  <h2 className="font-serif italic text-3xl text-maroon mb-6">{data.hostNames}</h2>
                  {data.message && <p className="text-sm text-maroon/70 italic mb-8">&ldquo;{data.message}&rdquo;</p>}
                  <p className="font-serif text-lg text-maroon mb-1">Dear {data.guestName},</p>
                  <p className="text-sm text-maroon/70">we would be honoured by your presence.</p>
                </div>
              </Reveal>
            </section>

            {/* Quote */}
            {data.quote && (
              <section className="px-6 py-16 text-center">
                <Reveal className="max-w-sm mx-auto">
                  <p className="font-serif italic text-xl text-maroon/90 leading-relaxed">&ldquo;{data.quote}&rdquo;</p>
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
                  <p className="font-serif italic text-2xl text-maroon mb-10">Wedding Timeline</p>
                  <div className="max-w-xs mx-auto relative">
                    <div className="absolute left-1/2 top-2 bottom-2 w-px bg-gold/40 -translate-x-1/2" />
                    <div className="space-y-8">
                      {data.timeline.map((item, i) => (
                        <div key={i} className="relative flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-gold mb-2 relative z-10" />
                          <p className="font-serif text-maroon text-sm">{item.time}</p>
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
                <p className="font-serif italic text-2xl text-maroon mb-8">The Celebration Begins</p>
                <Countdown targetISO={data.eventDateISO} textColor="#7a1f2b" />
              </Reveal>
            </section>

            {/* Location */}
            {(data.venueName || data.venueAddress) && (
              <section className="px-6 py-20 text-center bg-white/40">
                <Reveal className="max-w-sm mx-auto">
                  <p className="font-serif italic text-2xl text-maroon mb-2">Location</p>
                  {data.venueName && <p className="font-serif text-lg text-maroon mb-1">{data.venueName}</p>}
                  {data.venueAddress && <p className="text-sm text-maroon/60 mb-6">{data.venueAddress}</p>}
                  {mapQuery && <MapEmbed query={mapQuery} textColor="#7a1f2b" />}
                </Reveal>
              </section>
            )}

            {/* Dress code */}
            {data.dressCode && (
              <section className="px-6 py-20 text-center">
                <Reveal className="max-w-sm mx-auto">
                  <p className="font-serif italic text-2xl text-maroon mb-6">Dress Code</p>
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
                  <p className="font-serif italic text-2xl text-maroon mb-4">Gift Preferences</p>
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
                <p className="font-serif italic text-2xl text-maroon mb-3">Confirm Your Attendance</p>
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
