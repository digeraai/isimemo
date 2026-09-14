"use client";

import { useEffect, useState, useCallback } from "react";
import { TIERS, tierFor } from "@/lib/tiers";

interface Guest {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  rsvpStatus: string;
  rsvpGuests: number;
  imageUrl?: string | null;
  token: string;
}

interface TimelineItem {
  time: string;
  title: string;
}

interface EventData {
  id: string;
  manageToken: string;
  templateSlug: string;
  status: string;
  tier?: string | null;
  title: string;
  hostNames: string;
  eventDate: string;
  venueName?: string | null;
  venueAddress?: string | null;
  message?: string | null;
  quote?: string | null;
  quoteAttribution?: string | null;
  timeline: string; // JSON string, [{ time, title }]
  dressCode?: string | null;
  dressCodeColors: string; // JSON string, hex[]
  dressCodeNote?: string | null;
  giftListUrl?: string | null;
  guests: Guest[];
}

function parseJsonArray<T>(raw: string | undefined | null): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ManageEventPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const [event, setEvent] = useState<EventData | null>(null);
  const [saving, setSaving] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [siteOrigin, setSiteOrigin] = useState("");
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [dressColors, setDressColors] = useState<string[]>([]);

  const load = useCallback(async () => {
    const res = await fetch(`/api/events/${token}`, { cache: "no-store" });
    if (res.ok) {
      const data: EventData = await res.json();
      setEvent(data);
      setTimeline(parseJsonArray<TimelineItem>(data.timeline));
      setDressColors(parseJsonArray<string>(data.dressCodeColors));
    }
  }, [token]);

  useEffect(() => {
    load();
    setSiteOrigin(window.location.origin);
  }, [load]);

  // Poll while generation is in progress.
  useEffect(() => {
    if (event?.status !== "GENERATING") return;
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, [event?.status, load]);

  if (!event) {
    return <main className="max-w-2xl mx-auto px-6 py-24 text-center text-[#1c1c2e]/50">Loading…</main>;
  }

  const guestCount = event.guests.length;
  const tier = tierFor(guestCount) ?? TIERS[TIERS.length - 1];
  const generatedCount = event.guests.filter((g) => g.imageUrl).length;
  const isPaid = event.status === "PAID" || event.status === "GENERATING" || event.status === "READY";

  async function saveDetails(form: FormData) {
    setSaving(true);
    setNotice(null);
    const payload: Record<string, unknown> = Object.fromEntries(form.entries());
    payload.timeline = JSON.stringify(timeline.filter((t) => t.time.trim() || t.title.trim()));
    payload.dressCodeColors = JSON.stringify(dressColors.filter((c) => c.trim()));
    const res = await fetch(`/api/events/${token}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setNotice("Saved.");
      load();
    } else {
      setNotice("Could not save — check the fields and try again.");
    }
  }

  async function addManualGuest() {
    if (!manualName.trim()) return;
    const res = await fetch(`/api/events/${token}/guests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: manualName, email: manualEmail || undefined }),
    });
    if (res.ok) {
      setManualName("");
      setManualEmail("");
      load();
    } else {
      const { error } = await res.json().catch(() => ({ error: "Failed to add guest." }));
      setNotice(error);
    }
  }

  async function importCsv() {
    if (!csvText.trim()) return;
    const res = await fetch(`/api/events/${token}/guests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv: csvText }),
    });
    const data = await res.json();
    if (res.ok) {
      setCsvText("");
      setNotice(
        `Imported ${data.created} guest(s).` + (data.errors?.length ? ` ${data.errors.join(" ")}` : "")
      );
      load();
    } else {
      setNotice(data.error || "Import failed.");
    }
  }

  async function removeGuest(guestId: string) {
    await fetch(`/api/events/${token}/guests/${guestId}`, { method: "DELETE" });
    load();
  }

  async function checkout() {
    setNotice(null);
    const res = await fetch(`/api/events/${token}/checkout`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setNotice(data.error || "Checkout failed.");
      return;
    }
    if (data.devMode) {
      setNotice("Dev mode: no Stripe key set, so this event was marked paid automatically.");
      load();
    } else if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    }
  }

  async function generate() {
    const res = await fetch(`/api/events/${token}/generate`, { method: "POST" });
    if (res.ok) load();
    else {
      const data = await res.json().catch(() => ({}));
      setNotice(data.error || "Could not start generation.");
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl">{event.title}</h1>
        <span className="text-xs uppercase tracking-wide px-3 py-1 rounded-full bg-black/5">{event.status}</span>
      </div>

      {notice && <div className="mb-6 text-sm bg-amber-50 border border-amber-200 rounded-lg p-3">{notice}</div>}

      {/* Event details */}
      <section className="bg-white rounded-2xl border border-black/5 p-6 mb-8">
        <h2 className="font-semibold mb-4">Event details</h2>
        <form
          action={(fd) => saveDetails(fd)}
          className="grid sm:grid-cols-2 gap-4"
        >
          <Field label="Event title" name="title" defaultValue={event.title} />
          <Field label="Host name(s)" name="hostNames" defaultValue={event.hostNames} />
          <Field
            label="Date &amp; time"
            name="eventDate"
            type="datetime-local"
            defaultValue={toLocalInput(event.eventDate)}
          />
          <Field label="Venue name" name="venueName" defaultValue={event.venueName ?? ""} />
          <Field label="Venue address" name="venueAddress" defaultValue={event.venueAddress ?? ""} />
          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wide opacity-60 mb-1">Message to guests</label>
            <textarea
              name="message"
              defaultValue={event.message ?? ""}
              rows={2}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wide opacity-60 mb-1">
              Quote / verse (optional — shown after the formal invite text)
            </label>
            <textarea
              name="quote"
              defaultValue={event.quote ?? ""}
              rows={2}
              placeholder={'e.g. "And We created you in pairs."'}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <Field label="Quote attribution (optional)" name="quoteAttribution" defaultValue={event.quoteAttribution ?? ""} />
          <div />

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wide opacity-60 mb-2">
              Timeline (optional — shown as a vertical schedule)
            </label>
            <div className="space-y-2 mb-2">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={item.time}
                    onChange={(e) => {
                      const next = [...timeline];
                      next[i] = { ...next[i], time: e.target.value };
                      setTimeline(next);
                    }}
                    placeholder="6:00 pm"
                    className="w-28 border rounded-md px-3 py-2 text-sm"
                  />
                  <input
                    value={item.title}
                    onChange={(e) => {
                      const next = [...timeline];
                      next[i] = { ...next[i], title: e.target.value };
                      setTimeline(next);
                    }}
                    placeholder="Guest Arrival and Welcome Drinks"
                    className="flex-1 border rounded-md px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setTimeline(timeline.filter((_, j) => j !== i))}
                    className="text-xs text-red-500/70 hover:text-red-600 px-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTimeline([...timeline, { time: "", title: "" }])}
              className="text-xs border rounded-full px-4 py-1.5"
            >
              + Add timeline item
            </button>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wide opacity-60 mb-1">Dress code (optional)</label>
            <textarea
              name="dressCode"
              defaultValue={event.dressCode ?? ""}
              rows={2}
              placeholder="We kindly invite our guests to dress in traditional attire in soft pastel shades."
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wide opacity-60 mb-2">Recommended colours (optional)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {dressColors.map((c, i) => (
                <div key={i} className="flex items-center gap-1">
                  <input
                    type="color"
                    value={/^#[0-9a-f]{6}$/i.test(c) ? c : "#c9a35a"}
                    onChange={(e) => {
                      const next = [...dressColors];
                      next[i] = e.target.value;
                      setDressColors(next);
                    }}
                    className="w-8 h-8 rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => setDressColors(dressColors.filter((_, j) => j !== i))}
                    className="text-xs text-red-500/70 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setDressColors([...dressColors, "#c9a35a"])}
                className="text-xs border rounded-full px-3 py-1.5 h-8"
              >
                + Add colour
              </button>
            </div>
          </div>
          <Field label="Dress code note (optional)" name="dressCodeNote" defaultValue={event.dressCodeNote ?? ""} />
          <Field label="Gift list URL (optional)" name="giftListUrl" defaultValue={event.giftListUrl ?? ""} />

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#1c1c2e] text-white text-sm px-6 py-2 rounded-full disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save details"}
            </button>
          </div>
        </form>
      </section>

      {/* Guests */}
      <section className="bg-white rounded-2xl border border-black/5 p-6 mb-8">
        <h2 className="font-semibold mb-1">Guest list</h2>
        <p className="text-xs text-[#1c1c2e]/50 mb-4">
          {guestCount} guest{guestCount === 1 ? "" : "s"} — tier: {tier.label} (up to {tier.maxGuests}, R
          {tier.priceZAR})
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-60 mb-2">Add one guest</p>
            <div className="flex gap-2 mb-2">
              <input
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Name"
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <input
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                placeholder="Email (optional)"
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
              <button onClick={addManualGuest} className="border px-4 py-2 rounded-md text-sm">
                Add
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide opacity-60 mb-2">
              Or paste a CSV (columns: name, email, phone)
            </p>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={3}
              placeholder={"name,email\nThandi Nkosi,thandi@example.com"}
              className="w-full border rounded-md px-3 py-2 text-sm mb-2"
            />
            <button onClick={importCsv} className="border px-4 py-2 rounded-md text-sm">
              Import CSV
            </button>
          </div>
        </div>

        {guestCount > 0 && (
          <div className="max-h-64 overflow-y-auto border rounded-lg divide-y">
            {event.guests.map((g) => (
              <div key={g.id} className="flex items-center justify-between px-3 py-2 text-sm">
                <span>{g.name}</span>
                <button onClick={() => removeGuest(g.id)} className="text-xs text-red-500/70 hover:text-red-600">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Payment */}
      {!isPaid && (
        <section className="bg-white rounded-2xl border border-black/5 p-6 mb-8">
          <h2 className="font-semibold mb-2">Checkout</h2>
          <p className="text-sm text-[#1c1c2e]/60 mb-4">
            {tier.label} tier — up to {tier.maxGuests} guests — <strong>R{tier.priceZAR}</strong> once-off.
          </p>
          <button
            onClick={checkout}
            disabled={guestCount === 0}
            className="bg-[#1c1c2e] text-white text-sm px-6 py-2.5 rounded-full disabled:opacity-40"
          >
            Pay &amp; unlock generation
          </button>
        </section>
      )}

      {/* Share — each guest's link is a full live, animated invitation page;
          it works as soon as the event is paid, no separate render step needed. */}
      {isPaid && (
        <section className="bg-white rounded-2xl border border-black/5 p-6 mb-8">
          <h2 className="font-semibold mb-1">Share your invitations</h2>
          <p className="text-sm text-[#1c1c2e]/60 mb-4">
            Each guest gets their own link to the full animated invitation, with their name on it and their own RSVP.
            Send it directly or via WhatsApp.
          </p>
          {guestCount > 0 && (
            <div className="max-h-80 overflow-y-auto border rounded-lg divide-y">
              {event.guests.map((g) => {
                const link = `${siteOrigin}/invite/${g.token}`;
                return (
                  <div key={g.id} className="flex items-center justify-between px-3 py-2 text-sm gap-3">
                    <div className="min-w-0">
                      <p className="truncate">{g.name}</p>
                      <p className="text-xs text-[#1c1c2e]/40 truncate">{link}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <a href={link} target="_blank" className="text-xs border rounded-full px-3 py-1">
                        Preview
                      </a>
                      <button
                        onClick={() => navigator.clipboard.writeText(link)}
                        className="text-xs border rounded-full px-3 py-1"
                      >
                        Copy link
                      </button>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`You're invited! ${link}`)}`}
                        target="_blank"
                        className="text-xs border rounded-full px-3 py-1"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Downloadable images — optional fallback for guests/platforms where a
          shareable image works better than a link (e.g. as a WhatsApp status). */}
      {isPaid && (
        <section className="bg-white rounded-2xl border border-black/5 p-6 mb-8">
          <h2 className="font-semibold mb-1">Downloadable images (optional)</h2>
          <p className="text-sm text-[#1c1c2e]/60 mb-4">
            A static image version of each invitation, for guests or platforms that work better with an image than a
            link. Not required — the links above already work on their own.
            {" "}
            {generatedCount} / {guestCount} generated
            {event.status === "GENERATING" ? " — rendering now…" : ""}
          </p>
          <div className="flex gap-3 mb-6">
            <button
              onClick={generate}
              disabled={event.status === "GENERATING" || generatedCount === guestCount}
              className="border text-sm px-6 py-2.5 rounded-full disabled:opacity-40"
            >
              {generatedCount === 0 ? "Generate images" : "Generate remaining"}
            </button>
            {generatedCount > 0 && (
              <a
                href={`/api/events/${token}/zip`}
                className="border text-sm px-6 py-2.5 rounded-full inline-flex items-center"
              >
                Download all (.zip)
              </a>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide opacity-60 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="w-full border rounded-md px-3 py-2 text-sm"
      />
    </div>
  );
}

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}
