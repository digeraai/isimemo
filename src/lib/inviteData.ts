import type { Event, Guest } from "@prisma/client";
import type { InviteData, TimelineItem } from "./templates";

function safeJsonArray<T>(raw: string | null | undefined): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function buildInviteData(event: Event, guest: Guest, baseUrl: string): InviteData {
  const dateLabel = event.eventDate.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeLabel = event.eventDate.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const photoUrls = safeJsonArray<string>(event.photoUrls);
  const timeline = safeJsonArray<TimelineItem>(event.timeline);
  const dressCodeColors = safeJsonArray<string>(event.dressCodeColors);

  return {
    title: event.title,
    hostNames: event.hostNames,
    eventDateISO: event.eventDate.toISOString(),
    eventDateLabel: dateLabel,
    eventTimeLabel: timeLabel,
    venueName: event.venueName || undefined,
    venueAddress: event.venueAddress || undefined,
    message: event.message || undefined,
    guestName: guest.name,
    themeColor: event.themeColor,
    rsvpUrl: `${baseUrl}/invite/${guest.token}`,
    heroImageUrl: photoUrls[0] || undefined,
    quote: event.quote || undefined,
    quoteAttribution: event.quoteAttribution || undefined,
    timeline,
    dressCode: event.dressCode || undefined,
    dressCodeColors,
    dressCodeNote: event.dressCodeNote || undefined,
    giftListUrl: event.giftListUrl || undefined,
  };
}
