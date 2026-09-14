"use client";

// No-API-key Google Maps embed (the `output=embed` form works without a
// billing-enabled Maps API key — fine for a "here's roughly where it is" MVP
// embed) plus a deep link that opens the guest's own Maps app for directions.
export function MapEmbed({ query, textColor = "#4a2c1a" }: { query: string; textColor?: string }) {
  const encoded = encodeURIComponent(query);
  const src = `https://www.google.com/maps?q=${encoded}&output=embed`;
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;

  return (
    <div className="w-full">
      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md border border-black/5">
        <iframe
          title="Venue location"
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href={openUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-block mt-3 text-xs uppercase tracking-widest underline underline-offset-4"
        style={{ color: textColor }}
      >
        Open in Maps ↗
      </a>
    </div>
  );
}
