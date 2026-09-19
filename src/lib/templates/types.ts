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
  frameBackgroundUrl?: string; // illustrated arch/frame behind the formal invitation card, if provided
  scratchFoilImageUrl?: string; // texture drawn on each scratch-to-reveal date card, if provided (falls back to a plain gold foil)
  quote?: string;
  quoteArabic?: string; // Arabic-script rendering of the quote, shown above the translation when provided
  quoteAttribution?: string;
  timeline: TimelineItem[];
  venuePhotoUrl?: string; // venue exterior/interior photo shown above the map, if provided
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
