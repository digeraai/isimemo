import type { TemplateMeta } from "./types";

// Plain data, deliberately in its own file with no "use client" directive.
// wedding-wax-seal.tsx IS a client component (interactive envelope, scratch
// cards, framer-motion); React Server Components will not let server code
// read properties off any export of a "use client" file (even a plain
// object like `meta`) — only pass the component reference through as JSX.
// Keeping `meta` here lets index.ts build the template registry (which is
// read from Server Components) without tripping that restriction.
export const meta: TemplateMeta = {
  slug: "wedding-wax-seal",
  name: "The Sealed Garden",
  category: "Wedding",
  description: "A cream envelope and wax-seal open on tap into a full scrolling invitation — date reveal, timeline, countdown, map, dress code and RSVP.",
  swatch: "#7a1f2b",
};
