export interface TimelineItem {
  time: string; // pre-formatted, e.g. "6:00 pm"
  title: string; // e.g. "Guest Arrival and Welcome Drinks"
}

export interface InviteData {
  title: string; // "Naledi & Kagiso's Wedding"
  hostNames: string;
  eventDateISO: string; // full ISO timestamp, for the live countdown
  eventDateLabel: string; // pre-formatted, e.g. "Saturday, 14 March 2027"
  eventTimeLabel?: string; // "16:00"
  venueName?: string;
  venueAddress?: string;
  message?: string;
  guestName: string;
  themeColor: string; // hex
  rsvpUrl: string;
  heroImageUrl?: string; // couple/venue photo shown on the reveal scene, if the host uploaded one
  quote?: string;
  quoteAttribution?: string;
  timeline: TimelineItem[];
  dressCode?: string;
  dressCodeColors: string[];
  dressCodeNote?: string;
  giftListUrl?: string;
}

export interface TemplateMeta {
  slug: string;
  name: string;
  category: string;
  description: string;
  swatch: string; // hex used for gallery card accent
}
