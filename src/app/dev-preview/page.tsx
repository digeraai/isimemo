import { notFound } from "next/navigation";
import { getTemplate } from "@/lib/templates";
import type { InviteData } from "@/lib/templates";

// Dev-only route: renders a template's Live component with a hardcoded
// sample InviteData, bypassing Prisma/Postgres entirely. Useful for
// iterating on template visuals/animations without a database. Automatically
// disabled outside development.
const SAMPLE: InviteData = {
  title: "Naledi & Kagiso's Wedding",
  hostNames: "Naledi & Kagiso",
  eventDateISO: "2027-01-10T18:00:00.000Z",
  eventDateLabel: "Sunday, 10 January 2027",
  eventTimeLabel: "18:00",
  venueName: "Four Seasons Hotel, Dana Ballroom",
  venueAddress: "Jumeirah Beach Road, Dubai, UAE",
  message: "Together with our families, we joyfully invite you to celebrate our wedding.",
  guestName: "Thandi Nkosi",
  themeColor: "#7a1f2b",
  rsvpUrl: "#rsvp",
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
  quote: "And We created you in pairs.",
  quoteArabic: "وَخَلَقْنَاكُمْ أَزْوَاجًا",
  quoteAttribution: "Surah An-Naba 78:8",
  timeline: [
    { time: "6:00 pm", title: "Guest Arrival and Welcome Drinks" },
    { time: "6:30 pm", title: "Bride Entrance" },
    { time: "7:30 pm", title: "Salat al Isha" },
    { time: "8:30 pm", title: "Buffet Opening" },
    { time: "10:00 pm", title: "Let the Fun Begin" },
  ],
  dressCode: "We kindly invite our guests to dress in traditional attire in soft pastel shades.",
  dressCodeColors: ["#c9b8e8", "#e8b8a8", "#e8d9a8", "#a8c9c0", "#c9c9c9"],
  dressCodeNote: "Please avoid wearing beige, as it has been reserved for the bride and groom.",
  giftListUrl: "https://example.com/gift-list",
};

export default function DevPreviewPage({ searchParams }: { searchParams: { template?: string } }) {
  if (process.env.NODE_ENV === "production") return notFound();

  const slug = searchParams.template || "wedding-wax-seal";
  const tpl = getTemplate(slug);
  if (!tpl) return notFound();

  const { Live } = tpl;
  return (
    <div>
      <Live data={SAMPLE} />
      <div className="max-w-md mx-auto pb-20 pt-4 px-6 bg-[#fbf3ee]">
        <div className="mt-8 text-center text-xs opacity-50">[RSVP form renders here in the real page]</div>
      </div>
    </div>
  );
}
