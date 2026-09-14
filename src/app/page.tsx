import Link from "next/link";
import { TEMPLATE_LIST } from "@/lib/templates";
import { TIERS } from "@/lib/tiers";

export default function Home() {
  return (
    <main>
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="uppercase tracking-[0.3em] text-xs text-maroon/60 mb-5">Digera presents</p>
        <h1 className="font-serif text-5xl md:text-6xl text-[#1c1c2e] mb-6">isiMemo</h1>
        <p className="text-lg text-[#1c1c2e]/70 max-w-2xl mx-auto mb-10">
          Pick a template, add your guest list, and isiMemo generates a personalized invitation and RSVP
          link for every single guest — automatically. One price per event, up to 500 guests.
        </p>
        <Link
          href="/templates"
          className="inline-block bg-[#1c1c2e] text-white px-8 py-4 rounded-full text-sm tracking-wide hover:opacity-90 transition"
        >
          Browse templates &amp; start your invitation
        </Link>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
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

      <section className="max-w-5xl mx-auto px-6 pb-16">
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

      <section className="max-w-5xl mx-auto px-6 pb-24">
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
    </main>
  );
}
