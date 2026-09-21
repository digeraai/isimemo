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

// Default envelope/hero videos bundled with the wedding-wax-seal template,
// used until hosts can upload their own (see docs/GENERATION.md follow-up).
const WEDDING_WAX_SEAL_DEFAULTS = {
  envelopeVideoUrl: "/templates/wedding-wax-seal-envelope.mp4",
  heroVideoUrl: "/templates/wedding-wax-seal-hero.mp4",
  posterSections: [
    "/templates/wedding-wax-seal-03-date.png",
    "/templates/wedding-wax-seal-04-description.png",
    "/templates/wedding-wax-seal-05-verse.png",
    "/templates/wedding-wax-seal-06-timeline.png",
    "/templates/wedding-wax-seal-07-countdown.png",
    "/templates/wedding-wax-seal-08-location.png",
    "/templates/wedding-wax-seal-09-dresscode.png",
    "/templates/wedding-wax-seal-10-gift.png",
    "/templates/wedding-wax-seal-11-rsvp.png",
  ],
};

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
  const heroImageUrl = photoUrls[0] || undefined;

  const isWeddingWaxSeal = event.templateSlug === "wedding-wax-seal";

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
    heroImageUrl,
    // The bundled envelope video is the default look for every wedding-wax-seal
    // event until per-event asset uploads exist; the hero video only applies
    // when the host hasn't uploaded their own photo yet.
    envelopeVideoUrl: isWeddingWaxSeal ? WEDDING_WAX_SEAL_DEFAULTS.envelopeVideoUrl : undefined,
    heroVideoUrl: isWeddingWaxSeal && !heroImageUrl ? WEDDING_WAX_SEAL_DEFAULTS.heroVideoUrl : undefined,
    posterSections: isWeddingWaxSeal ? WEDDING_WAX_SEAL_DEFAULTS.posterSections : undefined,
    quote: event.quote || undefined,
    quoteAttribution: event.quoteAttribution || undefined,
    timeline,
    dressCode: event.dressCode || undefined,
    dressCodeColors,
    dressCodeNote: event.dressCodeNote || undefined,
    giftListUrl: event.giftListUrl || undefined,
  };
}
