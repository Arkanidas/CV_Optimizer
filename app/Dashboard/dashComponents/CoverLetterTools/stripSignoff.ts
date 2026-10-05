const SIGNOFF_PATTERNS = [
  /^sincerely,?$/i,
  /^best regards,?$/i,
  /^kind regards,?$/i,
  /^regards,?$/i,
  /^yours truly,?$/i,
  /^yours sincerely,?$/i,
  /^med vänlig hälsning,?$/i,
  /^vänliga hälsningar,?$/i,
  /^mvh,?$/i,
];

// If the generated letter's last paragraph looks like a sign-off (e.g.
// "Sincerely,\n[Name]"), drop it — templates that render their own styled
// closing block (name + "Yours truly,") add it back in a consistent format,
// so the letter never shows two signatures stacked on top of each other.
export function stripTrailingSignoff(paragraphs: string[]): string[] {
  if (paragraphs.length === 0) return paragraphs;
  const last = paragraphs[paragraphs.length - 1];
  const firstLine = last.split("\n")[0]?.trim() ?? "";
  if (SIGNOFF_PATTERNS.some((p) => p.test(firstLine))) {
    return paragraphs.slice(0, -1);
  }
  return paragraphs;
}