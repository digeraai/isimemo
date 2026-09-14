"use client";

import { useEffect, useState } from "react";

function diff(targetISO: string) {
  const target = new Date(targetISO).getTime();
  const now = Date.now();
  const ms = Math.max(0, target - now);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { days, hours, minutes, seconds, done: ms === 0 };
}

export function Countdown({ targetISO, textColor = "#4a2c1a" }: { targetISO: string; textColor?: string }) {
  const [t, setT] = useState(() => diff(targetISO));

  useEffect(() => {
    const id = setInterval(() => setT(diff(targetISO)), 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  if (t.done) {
    return (
      <p className="font-serif text-2xl" style={{ color: textColor }}>
        The celebration has begun!
      </p>
    );
  }

  const units: [string, number][] = [
    ["Days", t.days],
    ["Hours", t.hours],
    ["Minutes", t.minutes],
    ["Seconds", t.seconds],
  ];

  return (
    <div className="flex items-start justify-center gap-4 sm:gap-6" style={{ color: textColor }}>
      {units.map(([label, value]) => (
        <div key={label} className="text-center">
          <div className="font-serif text-3xl sm:text-4xl tabular-nums">{String(value).padStart(2, "0")}</div>
          <div className="text-[10px] uppercase tracking-widest opacity-60 mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}
