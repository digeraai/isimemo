// Quick sanity checks for the CSV parser and tier logic — pure functions, no
// Prisma/DB dependency, so they run cleanly in any environment.
import { parseGuestCsv } from "../src/lib/csv";
import { tierFor, TIERS } from "../src/lib/tiers";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`FAILED: ${msg}`);
  console.log(`OK: ${msg}`);
}

// CSV parsing
{
  const { rows, errors } = parseGuestCsv(
    `name,email,phone\n"Nkosi, Thandi",thandi@example.com,+27821234567\nSipho Dlamini,,\n,missing@name.com,`
  );
  assert(rows.length === 2, "parses 2 valid rows, skips the one missing a name");
  assert(rows[0].name === "Nkosi, Thandi", "handles a quoted comma inside a field");
  assert(rows[0].email === "thandi@example.com", "parses email column");
  assert(errors.length === 1, "reports 1 error for the missing-name row");
}

{
  const { rows, errors } = parseGuestCsv("email,name\na@b.com,Alice\nc@d.com,Bob");
  assert(rows.length === 2, "column order doesn't matter");
  assert(rows[0].name === "Alice" && rows[1].name === "Bob", "maps columns by header, not position");
}

{
  const { rows, errors } = parseGuestCsv("wrongheader\nfoo");
  assert(rows.length === 0 && errors.length === 1, "rejects a CSV with no name column");
}

// Tier logic
{
  assert(tierFor(1)?.id === "STARTER", "1 guest -> Starter");
  assert(tierFor(25)?.id === "STARTER", "25 guests -> Starter (inclusive upper bound)");
  assert(tierFor(26)?.id === "ESSENTIAL", "26 guests -> Essential");
  assert(tierFor(500)?.id === "GRAND", "500 guests -> Grand");
  assert(tierFor(501) === null, "501 guests exceeds every tier -> null");
  assert(TIERS.length === 5, "exactly 5 tiers defined");
}

console.log("\nAll logic checks passed.");
