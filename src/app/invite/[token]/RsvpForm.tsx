"use client";

import { useState } from "react";

export function RsvpForm({ guestToken, initialStatus }: { guestToken: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [partySize, setPartySize] = useState(1);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(initialStatus !== "PENDING");

  async function submit(answer: "ATTENDING" | "DECLINED") {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/rsvp/${guestToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: answer, partySize, note }),
      });
      if (res.ok) {
        setStatus(answer);
        setDone(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mt-8 text-center">
        <p className="font-medium">
          {status === "ATTENDING" ? "🎉 You're confirmed as attending." : "Thanks for letting us know."}
        </p>
        <button onClick={() => setDone(false)} className="text-xs underline mt-2 opacity-60">
          Change my response
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 max-w-xs mx-auto text-left bg-white/70 rounded-xl p-5">
      <label className="block text-xs uppercase tracking-wide opacity-60 mb-1">Party size</label>
      <input
        type="number"
        min={1}
        max={20}
        value={partySize}
        onChange={(e) => setPartySize(Number(e.target.value))}
        className="w-full border rounded-md px-3 py-2 text-sm mb-3"
      />
      <label className="block text-xs uppercase tracking-wide opacity-60 mb-1">Note (optional)</label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        className="w-full border rounded-md px-3 py-2 text-sm mb-4"
        placeholder="Dietary requirements, message, etc."
      />
      <div className="flex gap-2">
        <button
          disabled={submitting}
          onClick={() => submit("ATTENDING")}
          className="flex-1 bg-black text-white text-sm py-2 rounded-full disabled:opacity-50"
        >
          Attending
        </button>
        <button
          disabled={submitting}
          onClick={() => submit("DECLINED")}
          className="flex-1 border text-sm py-2 rounded-full disabled:opacity-50"
        >
          Can't make it
        </button>
      </div>
    </div>
  );
}
