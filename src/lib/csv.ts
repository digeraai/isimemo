export interface ParsedGuestRow {
  name: string;
  email?: string;
  phone?: string;
  language?: string;
}

/**
 * Minimal, dependency-free CSV parser for guest lists. Handles quoted fields
 * and commas-in-quotes, which covers the vast majority of real guest-list
 * exports from Excel/Google Sheets. Expected columns (header row required,
 * case-insensitive, any order): name, email, phone, language.
 */
export function parseGuestCsv(text: string): { rows: ParsedGuestRow[]; errors: string[] } {
  const errors: string[] = [];
  const lines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { rows: [], errors: ["File is empty."] };

  const parseLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          cur += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };

  const header = parseLine(lines[0]).map((h) => h.toLowerCase());
  const nameIdx = header.indexOf("name");
  const emailIdx = header.indexOf("email");
  const phoneIdx = header.indexOf("phone");
  const langIdx = header.indexOf("language");

  if (nameIdx === -1) {
    return { rows: [], errors: ['CSV must have a "name" column.'] };
  }

  const rows: ParsedGuestRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    const name = cols[nameIdx]?.trim();
    if (!name) {
      errors.push(`Row ${i + 1}: missing name, skipped.`);
      continue;
    }
    rows.push({
      name,
      email: emailIdx >= 0 ? cols[emailIdx]?.trim() || undefined : undefined,
      phone: phoneIdx >= 0 ? cols[phoneIdx]?.trim() || undefined : undefined,
      language: langIdx >= 0 ? cols[langIdx]?.trim() || undefined : undefined,
    });
  }
  return { rows, errors };
}
