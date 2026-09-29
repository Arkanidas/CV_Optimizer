/** Turn textarea text into paragraphs so the template can mirror line breaks. */
export function splitCoverLetterParagraphs(letter: string): string[] {
  const normalized = letter.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  return normalized.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
}
