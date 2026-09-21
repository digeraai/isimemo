"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATE_LIST, getTemplate } from "@/lib/templates";
import { SAMPLE_INVITE_DATA } from "@/lib/templates/sampleData";
import { PhoneFrame } from "@/components/PhoneFrame";

export default function TemplatesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);

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

  const previewTpl = previewSlug ? getTemplate(previewSlug) : undefined;

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl text-center mb-2">Choose a template</h1>
      <p className="text-center text-[#1c1c2e]/60 mb-10">You can change event details and guests after.</p>
      {error && <p className="text-center text-red-600 text-sm mb-6">{error}</p>}
      <div className="grid sm:grid-cols-3 gap-6">
        {TEMPLATE_LIST.map((t) => (
          <div key={t.slug} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-black/5">
            <button
              onClick={() => setPreviewSlug(t.slug)}
              className="h-32 w-full block"
              style={{ background: t.swatch }}
              aria-label={`Preview ${t.name}`}
            />
            <div className="p-5">
              <p className="text-xs uppercase tracking-wide text-[#1c1c2e]/40 mb-1">{t.category}</p>
              <h3 className="font-semibold mb-1">{t.name}</h3>
              <p className="text-sm text-[#1c1c2e]/60 mb-4">{t.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewSlug(t.slug)}
                  className="flex-1 border border-black/10 text-[#1c1c2e] text-sm py-2.5 rounded-full hover:bg-black/5 transition"
                >
                  Preview
                </button>
                <button
                  onClick={() => useTemplate(t.slug)}
                  disabled={loading !== null}
                  className="flex-1 bg-[#1c1c2e] text-white text-sm py-2.5 rounded-full hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading === t.slug ? "Creating…" : "Use this"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewTpl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
          onClick={() => setPreviewSlug(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewSlug(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm uppercase tracking-wide"
            >
              Close ✕
            </button>
            <PhoneFrame>
              <previewTpl.Live data={SAMPLE_INVITE_DATA} />
            </PhoneFrame>
            <button
              onClick={() => {
                setPreviewSlug(null);
                useTemplate(previewSlug!);
              }}
              disabled={loading !== null}
              className="mt-6 w-full bg-white text-[#1c1c2e] text-sm py-2.5 rounded-full hover:opacity-90 transition disabled:opacity-50"
            >
              Use this template
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
