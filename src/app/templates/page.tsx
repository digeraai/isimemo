"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATE_LIST } from "@/lib/templates";

export default function TemplatesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function useTemplate(slug: string) {
    setLoading(slug);
    setError(null);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateSlug: slug }),
      });
      if (!res.ok) throw new Error("Could not create your event. Please try again.");
      const { manageToken } = await res.json();
      router.push(`/manage/${manageToken}`);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.");
      setLoading(null);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl text-center mb-2">Choose a template</h1>
      <p className="text-center text-[#1c1c2e]/60 mb-10">You can change event details and guests after.</p>
      {error && <p className="text-center text-red-600 text-sm mb-6">{error}</p>}
      <div className="grid sm:grid-cols-3 gap-6">
        {TEMPLATE_LIST.map((t) => (
          <div key={t.slug} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-black/5">
            <div className="h-32" style={{ background: t.swatch }} />
            <div className="p-5">
              <p className="text-xs uppercase tracking-wide text-[#1c1c2e]/40 mb-1">{t.category}</p>
              <h3 className="font-semibold mb-1">{t.name}</h3>
              <p className="text-sm text-[#1c1c2e]/60 mb-4">{t.description}</p>
              <button
                onClick={() => useTemplate(t.slug)}
                disabled={loading !== null}
                className="w-full bg-[#1c1c2e] text-white text-sm py-2.5 rounded-full hover:opacity-90 transition disabled:opacity-50"
              >
                {loading === t.slug ? "Creating…" : "Use this template"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
