import { meta as weddingMeta } from "./wedding-wax-seal.meta";
import { meta as birthdayMeta } from "./birthday-bloom.meta";
import { meta as corporateMeta } from "./corporate-minimal.meta";
import { meta as gardenVowMeta } from "./garden-vow.meta";
import { meta as marrakechMeta } from "./marrakech-nights.meta";
import { Live as WeddingLive, Static as WeddingStatic } from "./wedding-wax-seal";
import { Live as BirthdayLive, Static as BirthdayStatic } from "./birthday-bloom";
import { Live as CorporateLive, Static as CorporateStatic } from "./corporate-minimal";
import { Live as GardenVowLive, Static as GardenVowStatic } from "./garden-vow";
import { Live as MarrakechLive, Static as MarrakechStatic } from "./marrakech-nights";
import type { InviteData, TemplateMeta, TimelineItem } from "./types";

export type { InviteData, TemplateMeta, TimelineItem };

export interface TemplateModule {
  meta: TemplateMeta;
  Live: (props: { data: InviteData }) => JSX.Element;
  Static: (props: { data: InviteData }) => JSX.Element;
}

// `meta` for each template is imported from a plain, non-"use client" file
// (see wedding-wax-seal.meta.ts) so this module — which Server Components
// read from — can freely access its properties (e.g. `.slug` below). `Live`
// and `Static` are still imported directly from the "use client" template
// files; passing a Client Component reference through like this (rather than
// dotting into a `import * as X` namespace) is the supported pattern.
export const TEMPLATES: Record<string, TemplateModule> = {
  [weddingMeta.slug]: { meta: weddingMeta, Live: WeddingLive, Static: WeddingStatic },
  [birthdayMeta.slug]: { meta: birthdayMeta, Live: BirthdayLive, Static: BirthdayStatic },
  [corporateMeta.slug]: { meta: corporateMeta, Live: CorporateLive, Static: CorporateStatic },
  [gardenVowMeta.slug]: { meta: gardenVowMeta, Live: GardenVowLive, Static: GardenVowStatic },
  [marrakechMeta.slug]: { meta: marrakechMeta, Live: MarrakechLive, Static: MarrakechStatic },
};

export const TEMPLATE_LIST: TemplateMeta[] = Object.values(TEMPLATES).map((t) => t.meta);

export function getTemplate(slug: string): TemplateModule | undefined {
  return TEMPLATES[slug];
}
