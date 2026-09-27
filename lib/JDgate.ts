
export function looksLikeJobDescription(text: string): boolean {
  const lower = text.toLowerCase();

  const jdKeywords = [
    // English
    "responsibilities", "requirements", "qualifications", "experience",
    "we are looking for", "you will", "your role", "apply", "candidate",
    "skills", "position", "team", "duties", "benefits", "full-time",
    "part-time", "ideal candidate", "join us", "we're hiring", "hiring",
    // Swedish
     "ansvarsområden", "krav", "kvalifikationer", "erfarenhet",
    "vi söker", "du kommer", "din roll", "ansök", "kandidat",
    "kompetens", "tjänst", "team", "arbetsuppgifter", "meriterande",
    "tillgänglig", "trivs", "lagspelare", "anställning", "rekrytering",
    "heltid", "deltid", "extraarbete", "vikariat", "söker dig",
  ];
  const keywordHits = jdKeywords.filter((kw) => lower.includes(kw)).length;

  // Real prose has a reasonable ratio of actual dictionary-shaped words to
  // total characters. Pure gibberish tends to be one giant unbroken token
  // or have an abnormally low ratio of whitespace/punctuation to letters.
  const words = text.trim().split(/\s+/).filter(Boolean);
  const avgWordLength = words.length > 0 ? text.replace(/\s/g, "").length / words.length : 0;
  const hasReasonableWordShape = words.length >= 20 && avgWordLength < 12;

  return keywordHits >= 1 && hasReasonableWordShape;
}