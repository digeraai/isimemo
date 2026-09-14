import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";
import { getTemplate, type InviteData } from "./templates";

const FONT_DIR = path.join(process.cwd(), "src/assets/fonts");

function loadFont(file: string) {
  return fs.readFileSync(path.join(FONT_DIR, file));
}

// Loaded once per server process and reused across every guest render in a batch.
let fontsCache: { name: string; data: Buffer; weight?: 400 | 700; style?: "normal" | "italic" }[] | null = null;

function fonts() {
  if (fontsCache) return fontsCache;
  fontsCache = [
    { name: "Italiana", data: loadFont("Italiana-Regular.ttf"), weight: 400 as const },
    { name: "Lora", data: loadFont("Lora-Regular.ttf"), weight: 400 as const },
    { name: "Lora", data: loadFont("Lora-Bold.ttf"), weight: 700 as const },
    { name: "Outfit", data: loadFont("Outfit-Regular.ttf"), weight: 400 as const },
    { name: "Outfit", data: loadFont("Outfit-Bold.ttf"), weight: 700 as const },
    { name: "WorkSans", data: loadFont("WorkSans-Regular.ttf"), weight: 400 as const },
    { name: "WorkSans", data: loadFont("WorkSans-Bold.ttf"), weight: 700 as const },
  ];
  return fontsCache;
}

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1350; // 4:5, share-friendly on WhatsApp/Instagram

/**
 * Renders one guest's personalized invitation to a PNG buffer using the
 * template's `Static` (satori-safe, inline-style-only) component.
 *
 * This runs server-side and is what the generation pipeline calls once per
 * guest. It is CPU-bound (SVG layout + rasterization) but has no external
 * network dependency, so it scales predictably up to the 500-guest ceiling —
 * see docs/GENERATION.md for how to move this behind a queue for production.
 */
export async function renderInviteToPng(templateSlug: string, data: InviteData): Promise<Buffer> {
  const tpl = getTemplate(templateSlug);
  if (!tpl) throw new Error(`Unknown template: ${templateSlug}`);

  const element = tpl.Static({ data });

  const svg = await satori(element, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts: fonts(),
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: CARD_WIDTH },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}
