import Link from "next/link";
import { TEMPLATE_LIST } from "@/lib/templates";
import { TIERS } from "@/lib/tiers";

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

export default function Home() {
  return (
    <main>
      <header className="sticky top-0 z-10 bg-[#f8f6f3]/90 backdrop-blur border-b border-black/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-serif text-lg text-[#1c1c2e]">isiMemo</span>
          <nav className="hidden sm:flex items-center gap-8 text-sm text-[#1c1c2e]/70">
            <a href="#how-it-works" className="hover:text-[#1c1c2e] transition">
              How it works
            </a>
            <a href="#templates" className="hover:text-[#1c1c2e] transition">
              Templates
            </a>
            <a href="#pricing" className="hover:text-[#1c1c2e] transition">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#1c1c2e] transition">
              FAQ
            </a>
          </nav>
          <Link
            href="/templates"
            className="bg-[#1c1c2e] text-white px-5 py-2.5 rounded-full text-sm tracking-wide hover:opacity-90 transition"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="uppercase tracking-[0.3em] text-xs text-maroon/60 mb-5">Digera presents</p>
        <h1 className="font-serif text-5xl md:text-6xl text-[#1c1c2e] mb-6">
          One invitation, personalized for every guest
        </h1>
        <p className="text-lg text-[#1c1c2e]/70 max-w-2xl mx-auto mb-10">
          Pick a template, add your guest list, and isiMemo generates a personalized invitation and RSVP
          link for every single guest — automatically. One price per event, up to 500 guests.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/templates"
            className="inline-block bg-[#1c1c2e] text-white px-8 py-4 rounded-full text-sm tracking-wide hover:opacity-90 transition"
          >
            Browse templates &amp; start your invitation
          </Link>
          <a
            href="#how-it-works"
            className="inline-block text-sm text-[#1c1c2e]/60 hover:text-[#1c1c2e] transition"
          >
            See how it works ↓
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16 text-center">
          <div>
            <p className="font-serif text-2xl text-[#1c1c2e]">500</p>
            <p className="text-xs text-[#1c1c2e]/50 mt-1">guests per event</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-[#1c1c2e]">1</p>
            <p className="text-xs text-[#1c1c2e]/50 mt-1">flat price, no subscription</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-[#1c1c2e]">3</p>
            <p className="text-xs text-[#1c1c2e]/50 mt-1">designer templates</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="max-w-5xl mx-auto px-6 pb-16 scroll-mt-16">
        <h2 className="font-serif text-2xl text-center mb-8">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Choose a template", body: "Pick a design that fits your event." },
            { step: "2", title: "Add your guest list", body: "Upload a CSV or type names in — up to 500." },
            {
              step: "3",
              title: "Get personalized invites",
              body: "Every guest gets their own link, QR code, and downloadable card.",
            },
          ].map((s) => (
            <div key={s.step} className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
              <div className="w-9 h-9 rounded-full bg-[#1c1c2e] text-white flex items-center justify-center text-sm mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-[#1c1c2e]/60">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="templates" className="max-w-5xl mx-auto px-6 pb-16 scroll-mt-16">
        <h2 className="font-serif text-2xl text-center mb-8">Templates</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {TEMPLATE_LIST.map((t) => (
            <Link
              key={t.slug}
              href={`/templates`}
              className="rounded-2xl overflow-hidden bg-white shadow-sm border border-black/5 hover:shadow-md transition"
            >
              <div className="h-28" style={{ background: t.swatch }} />
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-[#1c1c2e]/40 mb-1">{t.category}</p>
                <h3 className="font-semibold mb-1">{t.name}</h3>
                <p className="text-sm text-[#1c1c2e]/60">{t.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="pricing" className="max-w-5xl mx-auto px-6 pb-24 scroll-mt-16">
        <h2 className="font-serif text-2xl text-center mb-8">Pricing</h2>
        <div className="grid sm:grid-cols-5 gap-4">
          {TIERS.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-5 border border-black/5 text-center">
              <p className="text-sm text-[#1c1c2e]/50 mb-1">Up to {t.maxGuests}</p>
              <p className="font-semibold mb-1">{t.label}</p>
              <p className="text-2xl font-serif mb-2">R{t.priceZAR}</p>
              <p className="text-xs text-[#1c1c2e]/50">{t.blurb}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-[#1c1c2e]/40 mt-6">
          One-time payment per event. No subscriptions, no per-guest surprises.
        </p>
      </section>

      <section id="faq" className="max-w-3xl mx-auto px-6 pb-24 scroll-mt-16">
        <h2 className="font-serif text-2xl text-center mb-8">Frequently asked questions</h2>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="bg-white rounded-2xl p-6 border border-black/5">
              <h3 className="font-semibold mb-2">{f.q}</h3>
              <p className="text-sm text-[#1c1c2e]/60">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <h2 className="font-serif text-3xl mb-4">Ready to send something memorable?</h2>
        <p className="text-[#1c1c2e]/60 mb-8">
          Start free — you only pay once your guest list is ready to send.
        </p>
        <Link
          href="/templates"
          className="inline-block bg-[#1c1c2e] text-white px-8 py-4 rounded-full text-sm tracking-wide hover:opacity-90 transition"
        >
          Browse templates &amp; start your invitation
        </Link>
      </section>

      <footer className="border-t border-black/5 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif text-[#1c1c2e]">isiMemo</span>
          <p className="text-xs text-[#1c1c2e]/40">A Digera product · © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  );
}
