export interface ParsedLetter {
  greeting: string;
  paragraphs: string[];
  signOff: string;
  senderName: string;
}

const GREETING_PATTERNS = [
  /^dear\b/i, /^hi\b/i, /^hello\b/i,
  /^kär[ae]?\b/i, /^hej\b/i, /^bäste\b/i,
];

const SIGNOFF_PATTERNS = [
  /^sincerely,?$/i, /^best regards,?$/i, /^kind regards,?$/i, /^regards,?$/i,
  /^med vänlig hälsning,?$/i, /^vänliga hälsningar,?$/i, /^mvh,?$/i,
];

// Splits the raw letter text into semantic parts so templates can style
// the greeting, body, and sign-off differently without the user ever
// having to edit anything other than one plain textarea.
export function parseLetterText(raw: string): ParsedLetter {
  const blocks = raw
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return { greeting: "", paragraphs: [], signOff: "", senderName: "" };
  }

  let rest = [...blocks];
  let greeting = "";

  if (GREETING_PATTERNS.some((p) => p.test(rest[0]))) {
    greeting = rest[0];
    rest = rest.slice(1);
  }

  let signOff = "";
  let senderName = "";

  const lastBlock = rest[rest.length - 1] ?? "";
  const lastLines = lastBlock.split("\n").map((l) => l.trim()).filter(Boolean);

  if (lastLines.length > 0 && SIGNOFF_PATTERNS.some((p) => p.test(lastLines[0]))) {
    signOff = lastLines[0];
    senderName = lastLines.slice(1).join(" ");
    rest = rest.slice(0, -1);
  }

  return { greeting, paragraphs: rest, signOff, senderName };
}