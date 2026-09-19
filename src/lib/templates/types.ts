export interface TimelineItem {
  time: string; // pre-formatted, e.g. "6:00 pm"
  title: string; // e.g. "Guest Arrival and Welcome Drinks"
  iconUrl?: string; // optional illustrated icon for this timeline moment
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
  heroVideoUrl?: string; // looping video shown in a framed card on the reveal scene, takes precedence over heroImageUrl
  envelopeImageUrl?: string; // illustrated/embossed envelope texture, if provided (falls back to a CSS gradient envelope)
  envelopeVideoUrl?: string; // looping envelope video, takes precedence over envelopeImageUrl
  quote?: string;
  quoteAttribution?: string;
  timeline: TimelineItem[];
  dressCode?: string;
  dressCodeColors: string[];
  dressCodeNote?: string;
  dressCodeImageUrl?: string; // illustrated outfit figures, if provided
  giftListUrl?: string;
}

export interface TemplateMeta {
  slug: string;
  name: string;
  category: string;
  description: string;
  swatch: string; // hex used for gallery card accent
}
