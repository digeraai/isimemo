"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Amiri, Cormorant_Garamond, Parisienne } from "next/font/google";
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
const arabic = Amiri({ subsets: ["arabic"], weight: "700" });

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
// used for the formal wording, gift preferences, RSVP lead-in, and the map.
// An optional backgroundUrl (e.g. an illustrated arch) sits behind the
// content; content stays on its own stacking layer so it's always legible.
function OrnateCard({
  children,
  className = "",
  backgroundUrl,
}: {
  children: React.ReactNode;
  className?: string;
  backgroundUrl?: string;
}) {
  return (
    <div className={`relative overflow-hidden border border-gold/40 rounded-[2rem] px-8 py-12 bg-white/30 ${className}`}>
      {backgroundUrl && <img src={backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      <CornerFlourish className="absolute top-2 left-2 w-8 h-8 text-gold/60" />
      <CornerFlourish className="absolute top-2 right-2 w-8 h-8 text-gold/60 -scale-x-100" />
      <CornerFlourish className="absolute bottom-2 left-2 w-8 h-8 text-gold/60 -scale-y-100" />
      <CornerFlourish className="absolute bottom-2 right-2 w-8 h-8 text-gold/60 -scale-x-100 -scale-y-100" />
      <div className="relative">{children}</div>
    </div>
  );
}

// The floating play/pause control shown once the invitation is open,
// mirroring the pause button on Instagram/Story-style auto-advancing cards.
function PlayPauseButton({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg focus:outline-none"
      style={{ background: "radial-gradient(circle at 35% 30%, #d4b06a, #a9853f)" }}
      aria-label={paused ? "Resume" : "Pause"}
    >
      {paused ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
          <path d="M3 2 L14 8 L3 14 Z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
          <rect x="3" y="2" width="3.5" height="12" rx="1" />
          <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
        </svg>
      )}
    </button>
  );
}

// ---------------------------------------------------------------- Live -----
// Interactive version shown at /invite/[token]. A tap-to-open envelope gates
// a full scrolling invitation: hero, scratch-to-reveal date, formal wording +
// optional quote, timeline, live countdown, location + map, dress code, gift
// preferences, and (appended by the page) the RSVP form. Once open, the page
// auto-advances section to section (a hands-off, Story-like read), pausing
// automatically at the scratch-to-reveal date so the guest can interact, and
// stopping for good once it reaches the RSVP lead-in. A floating button lets
// the guest pause/resume at any point.
export function Live({ data }: { data: InviteData }) {
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const { day, month, year } = dateParts(data.eventDateISO);
  const mapQuery = data.venueAddress || data.venueName;

  // Total number of top-level scroll "stops", computed directly from which
  // optional sections this event actually has data for — see the JSX below
  // for the exact order, which this must match.
  const totalSections =
    5 +
    (data.quote ? 1 : 0) +
    (data.timeline.length > 0 ? 1 : 0) +
    (data.venueName || data.venueAddress ? 1 : 0) +
    (data.dressCode ? 1 : 0) +
    (data.giftListUrl ? 1 : 0);

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const currentIndexRef = useRef(0);
  const autoPausedIndexRef = useRef<number | null>(null);
  let sectionCounter = 0;
  const sectionRef = (el: HTMLElement | null) => {
    sectionRefs.current[sectionCounter] = el;
    sectionCounter += 1;
  };

  useEffect(() => {
    if (!open || paused) return;
    const idx = currentIndexRef.current;
    if (idx >= totalSections - 1) return; // reached the RSVP lead-in — autoplay stops here

    const isScratchSection = idx === 1; // Date is always the second stop
    if (isScratchSection && autoPausedIndexRef.current !== idx) {
      autoPausedIndexRef.current = idx;
      setPaused(true);
      return;
    }

    const duration = idx === 0 ? 4500 : 3800;
    const timer = setTimeout(() => {
      const nextIdx = idx + 1;
      sectionRefs.current[nextIdx]?.scrollIntoView({ behavior: "smooth", block: "start" });
      currentIndexRef.current = nextIdx;
      setTick((t) => t + 1);
    }, duration);
    return () => clearTimeout(timer);
  }, [open, paused, tick, totalSections]);

  // Any real scroll/touch/keyboard input means the guest is taking control —
  // pause autoplay immediately rather than fighting their input.
  useEffect(() => {
    if (!open) return;
    // Ignore input that originates on an interactive control (the play/pause
    // button itself, links, form fields) — those manage playback state on
    // their own and shouldn't race with this.
    function onUserIntent(e: Event) {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, iframe")) return;
      setPaused(true);
    }
    window.addEventListener("wheel", onUserIntent, { passive: true });
    window.addEventListener("touchstart", onUserIntent, { passive: true });
    window.addEventListener("keydown", onUserIntent);
    return () => {
      window.removeEventListener("wheel", onUserIntent);
      window.removeEventListener("touchstart", onUserIntent);
      window.removeEventListener("keydown", onUserIntent);
    };
  }, [open]);

  // Finds whichever section is currently most in view and points autoplay's
  // internal position at it, so resuming continues from wherever the guest
  // actually scrolled to rather than snapping back to wherever autoplay had
  // last reached.
  function syncCurrentIndexToScroll() {
    let idx = 0;
    for (let i = 0; i < sectionRefs.current.length; i++) {
      const el = sectionRefs.current[i];
      if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) idx = i;
    }
    currentIndexRef.current = idx;
  }

  function togglePlayback() {
    setPaused((p) => {
      if (p) syncCurrentIndexToScroll(); // resuming — pick up from where the guest is
      return !p;
    });
  }

  function openEnvelope() {
    currentIndexRef.current = 0;
    autoPausedIndexRef.current = null;
    setTick(0);
    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPaused(reduceMotion);
    setOpen(true);
  }

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
                onClick={openEnvelope}
                className={`group relative block w-full rounded-2xl shadow-2xl overflow-hidden focus:outline-none ${
                  data.envelopeVideoUrl ? "aspect-[480/800]" : "aspect-[3/4]"
                }`}
                style={{
                  background: data.envelopeVideoUrl || data.envelopeImageUrl
                    ? undefined
                    : "linear-gradient(160deg, #fdf6f1 0%, #f3e6db 60%, #ecd9c9 100%)",
                }}
                aria-label="Tap to open your invitation"
              >
                {data.envelopeVideoUrl ? (
                  <video
                    src={data.envelopeVideoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : data.envelopeImageUrl ? (
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
                {data.envelopeVideoUrl ? (
                  // The video's own seal art is used as-is; only the monogram text
                  // baked into its center is patched over with this couple's real
                  // initials, in a color-matched scrim so the patch blends in.
                  <div
                    className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[38%] aspect-square rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(223,214,201,0.99) 0%, rgba(223,214,201,0.97) 78%, rgba(223,214,201,0) 100%)",
                    }}
                  >
                    <span className={`${script.className} text-[#a9853f] text-xl sm:text-2xl`}>{initials(data.hostNames)}</span>
                  </div>
                ) : (
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: "radial-gradient(circle at 35% 30%, #9c2c3a, #6c1420)" }}
                  >
                    <span className={`${script.className} text-blush text-3xl`}>{initials(data.hostNames)}</span>
                  </div>
                )}
                <div className="absolute bottom-6 inset-x-0 text-center text-[13px] tracking-widest uppercase text-maroon/70">
                  Tap to open
                </div>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="invitation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            {/* Hero */}
            {data.heroVideoUrl ? (
              <section ref={sectionRef} className="w-full flex flex-col items-center justify-center text-center px-6 py-16">
                <p className="uppercase tracking-[0.35em] text-xs text-maroon/60 mb-6">You&rsquo;re Invited</p>
                <div className="relative w-full max-w-sm mx-auto aspect-[448/864] rounded-[2rem] overflow-hidden shadow-2xl">
                  <video
                    src={data.heroVideoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Scrim patches over the video's own baked-in ceremony text so
                      this couple's real names show instead. */}
                  <div
                    className="absolute left-1/2 top-[3%] -translate-x-1/2 w-[80%] h-[49%] rounded-3xl"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(221,207,185,1) 0%, rgba(221,207,185,0.99) 86%, rgba(221,207,185,0) 100%)",
                    }}
                  />
                  <div className="absolute left-1/2 top-[3%] -translate-x-1/2 w-[80%] h-[49%] flex flex-col items-center justify-center gap-2 px-2">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-maroon/70">
                      Welcome to the wedding of
                    </p>
                    <h1 className={`${script.className} text-2xl sm:text-3xl text-maroon leading-tight`}>{data.hostNames}</h1>
                  </div>
                </div>
                <FlourishDivider />
              </section>
            ) : (
              <section ref={sectionRef} className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
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
            )}

            {/* The Date — scratch to reveal */}
            <section ref={sectionRef} className="px-6 py-20 text-center">
              <Reveal>
                <p className={`${script.className} text-3xl text-maroon mb-1`}>The Date</p>
                <p className="text-[11px] uppercase tracking-widest text-maroon/50 mb-8">✦ Scratch to reveal the date ✦</p>
                <div className="flex gap-3 max-w-xs mx-auto">
                  <ScratchCard label="Day" value={day} foilColor="#c9a35a" foilImageUrl={data.scratchFoilImageUrl} textColor="#7a1f2b" />
                  <ScratchCard label="Month" value={month} foilColor="#c9a35a" foilImageUrl={data.scratchFoilImageUrl} textColor="#7a1f2b" />
                  <ScratchCard label="Year" value={year} foilColor="#c9a35a" foilImageUrl={data.scratchFoilImageUrl} textColor="#7a1f2b" />
                </div>
              </Reveal>
            </section>

            {/* Formal invitation text */}
            <section ref={sectionRef} className="px-6 py-20 text-center bg-white/40">
              <Reveal className="max-w-md mx-auto">
                <OrnateCard backgroundUrl={data.frameBackgroundUrl}>
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
              <section ref={sectionRef} className="px-6 py-16 text-center">
                <Reveal className="max-w-sm mx-auto">
                  <FlourishDivider />
                  {data.quoteArabic && (
                    <p dir="rtl" className={`${arabic.className} text-3xl sm:text-4xl text-maroon mb-4 leading-relaxed`}>
                      {data.quoteArabic}
                    </p>
                  )}
                  <p className="text-xl italic text-maroon/90 leading-relaxed">&ldquo;{data.quote}&rdquo;</p>
                  {data.quoteAttribution && (
                    <p className="text-xs uppercase tracking-widest text-maroon/50 mt-4">{data.quoteAttribution}</p>
                  )}
                </Reveal>
              </section>
            )}

            {/* Timeline */}
            {data.timeline.length > 0 && (
              <section ref={sectionRef} className="px-6 py-20 text-center bg-white/40">
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
            <section ref={sectionRef} className="px-6 py-20 text-center">
              <Reveal>
                <p className={`${script.className} text-3xl text-maroon mb-8`}>The Celebration Begins</p>
                <Countdown targetISO={data.eventDateISO} textColor="#7a1f2b" />
              </Reveal>
            </section>

            {/* Location */}
            {(data.venueName || data.venueAddress) && (
              <section ref={sectionRef} className="px-6 py-20 text-center bg-white/40">
                <Reveal className="max-w-sm mx-auto">
                  <p className={`${script.className} text-3xl text-maroon mb-2`}>Location</p>
                  {data.venueName && <p className="text-lg text-maroon mb-1">{data.venueName}</p>}
                  {data.venueAddress && <p className="text-sm text-maroon/60 mb-6">{data.venueAddress}</p>}
                  {data.venuePhotoUrl && (
                    <img
                      src={data.venuePhotoUrl}
                      alt=""
                      className="w-full aspect-[4/3] object-cover rounded-2xl mb-4 shadow-md"
                    />
                  )}
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
              <section ref={sectionRef} className="px-6 py-20 text-center">
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
              <section ref={sectionRef} className="px-6 py-16 text-center bg-white/40">
                <Reveal className="max-w-sm mx-auto">
                  <OrnateCard>
                    <p className={`${script.className} text-3xl text-maroon mb-4`}>Gift Preferences</p>
                    <p className="text-sm text-maroon/70 mb-6">
                      Your love, prayers, and presence mean the world to us. If you wish to bless us with a gift, we
                      have created a list for your convenience.
                    </p>
                    <a
                      href={data.giftListUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-xs uppercase tracking-widest underline underline-offset-4 text-maroon"
                    >
                      View Gift List
                    </a>
                  </OrnateCard>
                </Reveal>
              </section>
            )}

            {/* RSVP lead-in — the form itself is appended by the page below */}
            <section ref={sectionRef} className="px-6 pt-20 text-center">
              <Reveal className="max-w-sm mx-auto">
                <OrnateCard>
                  <p className={`${script.className} text-3xl text-maroon mb-3`}>Confirm Your Attendance</p>
                  <p className="text-sm text-maroon/60">We can&rsquo;t wait to celebrate with you.</p>
                </OrnateCard>
              </Reveal>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
      {open && <PlayPauseButton paused={paused} onToggle={togglePlayback} />}
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
