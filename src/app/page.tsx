import Link from "next/link";
import { Fraunces, Work_Sans } from "next/font/google";
import { TEMPLATE_LIST } from "@/lib/templates";
import { TIERS } from "@/lib/tiers";

// Editorial grid system, kept local to the marketing homepage (rather than
// the site-wide Tailwind `font-serif` token) so the app's own pages —
// templates, manage, invite — are unaffected.
const display = Fraunces({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"] });
const sans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

const BG = "#FAF6EE";
const INK = "#2E2A22";
const ACCENT = "#BE6A46";
const LINE = "#DED0B4";

const FAQS = [
  {
    q: "How does the guest list work?",
    a: "Upload a CSV or type names in manually — up to 500 guests per event. Each guest gets their own personalized invitation page and RSVP link automatically.",
  },
  {
    q: "What do my guests actually receive?",
    a: "Each guest gets a unique link to a live, personalized web invitation (with their name, event details, RSVP form) plus a downloadable image card they can save or share.",
  },
  {
    q: "How much does it cost?",
    a: "One flat, one-time price per event based on your guest count — no subscriptions, no per-guest fees. See the pricing tiers below.",
  },
  {
    q: "Can I see RSVPs come in?",
    a: "Yes — your delivery hub shows every guest's link and lets you track and manage the event from one place.",
  },
];

const Eyebrow = ({ children, color = INK }: { children: React.ReactNode; color?: string }) => (
  <p className="text-[11px] tracking-[3px] uppercase" style={{ color }}>
    {children}
  </p>
);

export default function Home() {
  return (
    <main className={sans.className} style={{ background: BG, color: INK }}>
      {/* ---------------------------------------------------------------- Hero */}
      <div className="md:h-[900px] md:flex" style={{ borderBottom: `1px solid ${LINE}` }}>
        {/* Nav column — flex: 0.7, padding: 48px 28px, border-left: none */}
        <div
          className="md:flex-[0.7] flex md:flex-col items-center md:items-stretch justify-between px-6 py-6 md:py-12 md:pl-7 md:pr-7"
          style={{ borderBottom: `1px solid ${LINE}` }}
        >
          <p className="text-xs tracking-[3px] uppercase">isiMemo</p>
          <nav className="hidden md:flex flex-col gap-[18px] text-[11px] tracking-[2px] uppercase opacity-70">
            <a href="#templates" className="hover:opacity-100 transition">
              Templates
            </a>
            <a href="#pricing" className="hover:opacity-100 transition">
              Pricing
            </a>
            <a href="#faq" className="hover:opacity-100 transition">
              FAQ
            </a>
          </nav>
          <Link
            href="/templates"
            className="md:hidden text-[11px] tracking-[2px] uppercase border-b pb-0.5"
            style={{ borderColor: INK }}
          >
            Start
          </Link>
        </div>

        {/* Headline column — flex: 2.2, padding: 48px, border-left: 1px */}
        <div
          className="md:flex-[2.2] flex flex-col justify-center px-6 py-14 md:p-12 md:border-l"
          style={{ borderBottom: `1px solid ${LINE}`, borderLeftColor: LINE }}
        >
          <p className="text-xs tracking-[3px] uppercase mb-5" style={{ color: ACCENT }}>
            The Invite — 01
          </p>
          <h1
            className={`${display.className} text-[44px] sm:text-[64px] md:text-[84px] leading-[1.05] tracking-[-1px]`}
          >
            Set out with care.
          </h1>
          <p className="mt-[30px] text-[15px] leading-[1.7] opacity-65 max-w-[460px]">
            A single, considered page — envelope, story, timeline, and RSVP — set out with the same care
            as your invitation.
          </p>
          <Link
            href="/templates"
            className="mt-9 w-fit pb-[5px] border-b cursor-pointer"
            style={{ borderColor: INK }}
          >
            <span className="text-[13px] tracking-[1.5px] uppercase">Start your invite</span>
          </Link>
        </div>

        {/* Stats column — flex: 1, padding: 48px 32px 48px 28px, border-left: 1px */}
        <div
          className="md:flex-[1] flex flex-col px-6 py-12 md:pt-12 md:pb-12 md:pl-7 md:pr-8 md:border-l"
          style={{ borderLeftColor: LINE }}
        >
          <div className="grid grid-cols-3 md:grid-cols-1 gap-6 md:gap-0">
            <div className="pt-[14px] md:mb-10" style={{ borderTop: `1px solid ${LINE}` }}>
              <div className={`${display.className} text-2xl md:text-[30px]`}>{TEMPLATE_LIST.length}</div>
              <div className="text-[11px] tracking-[1.5px] uppercase opacity-60 mt-1">Collections</div>
            </div>
            <div className="pt-[14px] md:mb-10" style={{ borderTop: `1px solid ${LINE}` }}>
              <div className={`${display.className} text-2xl md:text-[30px]`}>500</div>
              <div className="text-[11px] tracking-[1.5px] uppercase opacity-60 mt-1">Guests, one price</div>
            </div>
            <div className="pt-[14px]" style={{ borderTop: `1px solid ${LINE}` }}>
              <div className={`${display.className} text-2xl md:text-[30px]`}>10 min</div>
              <div className="text-[11px] tracking-[1.5px] uppercase opacity-60 mt-1">To publish</div>
            </div>
          </div>
          <div className="hidden md:block flex-grow" />
          <div
            className="hidden md:block text-[11px] tracking-[1.5px] uppercase opacity-50 pt-[14px] leading-[2]"
            style={{ borderTop: `1px solid ${LINE}` }}
          >
            {TEMPLATE_LIST.map((t) => t.name).join(" · ")}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ Templates */}
      <section id="templates" className="px-6 md:px-12 py-20 md:py-28 scroll-mt-16">
        <Eyebrow color={ACCENT}>The Invite — 02</Eyebrow>
        <h2 className={`${display.className} mt-4 text-3xl md:text-5xl tracking-[-0.5px] max-w-xl`}>
          Five collections, one price each.
        </h2>
        <div className="mt-14">
          {TEMPLATE_LIST.map((t, i) => (
            <Link
              key={t.slug}
              href="/templates"
              className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 py-7"
              style={{ borderTop: `1px solid ${LINE}` }}
            >
              <span className="text-[11px] tracking-[1.5px] uppercase opacity-40 sm:w-10 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="w-8 h-8 rounded-full shrink-0 hidden sm:block"
                style={{ background: t.swatch }}
              />
              <span className={`${display.className} text-2xl sm:text-3xl sm:w-64 shrink-0`}>{t.name}</span>
              <span className="text-sm opacity-60 sm:flex-1">{t.description}</span>
              <span
                className="text-[11px] tracking-[1.5px] uppercase shrink-0 opacity-0 group-hover:opacity-100 transition"
                style={{ color: ACCENT }}
              >
                Use this →
              </span>
            </Link>
          ))}
          <div style={{ borderTop: `1px solid ${LINE}` }} />
        </div>
      </section>

      {/* -------------------------------------------------------------- Pricing */}
      <section id="pricing" className="px-6 md:px-12 py-20 md:py-28 scroll-mt-16" style={{ background: "#F6F1E6" }}>
        <Eyebrow color={ACCENT}>The Invite — 03</Eyebrow>
        <h2 className={`${display.className} mt-4 text-3xl md:text-5xl tracking-[-0.5px] max-w-xl`}>
          One flat price, by guest count.
        </h2>
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-5 gap-x-6 gap-y-10">
          {TIERS.map((t) => (
            <div key={t.id} className="pt-3.5" style={{ borderTop: `1px solid ${LINE}` }}>
              <p className="text-[11px] tracking-[1.5px] uppercase opacity-50 mb-2">Up to {t.maxGuests}</p>
              <p className={`${display.className} text-3xl`}>R{t.priceZAR}</p>
              <p className="text-[11px] tracking-[1.5px] uppercase opacity-60 mt-2">{t.label}</p>
              <p className="text-xs opacity-50 mt-3 leading-relaxed">{t.blurb}</p>
            </div>
          ))}
        </div>
        <p className="text-xs opacity-45 mt-14">One-time payment per event. No subscriptions, no per-guest surprises.</p>
      </section>

      {/* ------------------------------------------------------------------ FAQ */}
      <section id="faq" className="px-6 md:px-12 py-20 md:py-28 scroll-mt-16">
        <Eyebrow color={ACCENT}>The Invite — 04</Eyebrow>
        <h2 className={`${display.className} mt-4 text-3xl md:text-5xl tracking-[-0.5px] max-w-xl`}>
          Questions, answered.
        </h2>
        <div className="mt-14 grid sm:grid-cols-2 gap-x-10">
          {FAQS.map((f) => (
            <div key={f.q} className="py-7" style={{ borderTop: `1px solid ${LINE}` }}>
              <h3 className="text-[13px] tracking-[0.5px] uppercase font-medium mb-2.5">{f.q}</h3>
              <p className="text-sm opacity-60 leading-relaxed">{f.a}</p>
            </div>
          ))}
          <div className="sm:col-span-2" style={{ borderTop: `1px solid ${LINE}` }} />
        </div>
      </section>

      {/* ------------------------------------------------------------------- CTA */}
      <section className="px-6 md:px-12 py-24 md:py-32 text-center" style={{ background: INK, color: BG }}>
        <p className="text-[11px] tracking-[3px] uppercase opacity-60">The Invite — 05</p>
        <h2 className={`${display.className} mt-5 text-4xl md:text-6xl tracking-[-1px]`}>
          Ready to send something memorable?
        </h2>
        <p className="mt-6 text-sm opacity-60 max-w-md mx-auto">
          Start free — you only pay once your guest list is ready to send.
        </p>
        <Link
          href="/templates"
          className="mt-10 inline-block pb-1.5 border-b text-[13px] tracking-[1.5px] uppercase"
          style={{ borderColor: BG }}
        >
          Start your invite
        </Link>
      </section>

      {/* --------------------------------------------------------------- Footer */}
      <footer className="px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs tracking-[3px] uppercase">isiMemo</span>
        <p className="text-[11px] tracking-[1px] uppercase opacity-45">A Digera product · © {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
