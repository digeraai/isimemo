// Standalone smoke test for the render pipeline (satori -> resvg), independent
// of Next.js and Prisma, so it can run without a database. Not part of the
// app; just verifies the templates actually rasterize correctly.
import fs from "node:fs";
import path from "node:path";
import { renderInviteToPng } from "../src/lib/render";
import type { InviteData } from "../src/lib/templates/types";

const sample: InviteData = {
  title: "Naledi & Kagiso's Wedding",
  hostNames: "Naledi & Kagiso",
  eventDateISO: "2027-03-14T16:00:00.000Z",
  eventDateLabel: "Saturday, 14 March 2027",
  eventTimeLabel: "16:00",
  venueName: "The Forum, Bryanston",
  venueAddress: "1 Culross Rd, Bryanston, Johannesburg",
  message: "Together with our families, we joyfully invite you to celebrate our wedding.",
  guestName: "Thandi Nkosi",
  themeColor: "#7a1f2b",
  rsvpUrl: "https://isimemo.com/invite/sample-token",
  timeline: [
    { time: "4:00 pm", title: "Ceremony" },
    { time: "6:00 pm", title: "Reception" },
  ],
  dressCodeColors: ["#7a1f2b", "#b98a3d", "#f7ece9"],
};

async function main() {
  const outDir = path.join(process.cwd(), "scripts", "out");
  fs.mkdirSync(outDir, { recursive: true });

  for (const slug of ["wedding-wax-seal", "birthday-bloom", "corporate-minimal"]) {
    const data = { ...sample };
    const png = await renderInviteToPng(slug, data);
    const outPath = path.join(outDir, `${slug}.png`);
    fs.writeFileSync(outPath, png);
    console.log(`Rendered ${slug} -> ${outPath} (${png.length} bytes)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
