import fs from "node:fs";
import path from "node:path";

// Where generated guest images live on disk. On Railway, mount a Volume at
// this path (set GENERATED_DIR to the volume's mount point) so files survive
// deploys/restarts — the container filesystem itself is ephemeral. Locally it
// defaults to ./generated, which is fine for development.
const GENERATED_DIR = process.env.GENERATED_DIR || path.join(process.cwd(), "generated");

function eventDir(eventId: string) {
  return path.join(GENERATED_DIR, eventId);
}

export function ensureEventDir(eventId: string) {
  fs.mkdirSync(eventDir(eventId), { recursive: true });
}

export function guestImagePath(eventId: string, guestId: string) {
  return path.join(eventDir(eventId), `${guestId}.png`);
}

export function writeGuestImage(eventId: string, guestId: string, data: Buffer): string {
  ensureEventDir(eventId);
  fs.writeFileSync(guestImagePath(eventId, guestId), data);
  return `/api/files/${eventId}/${guestId}.png`;
}

export function readGuestImage(eventId: string, guestId: string): Buffer | null {
  const p = guestImagePath(eventId, guestId);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p);
}

export function listEventImages(eventId: string): { guestId: string; path: string }[] {
  const dir = eventDir(eventId);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".png"))
    .map((f) => ({ guestId: f.replace(/\.png$/, ""), path: path.join(dir, f) }));
}
