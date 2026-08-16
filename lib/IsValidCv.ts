export function looksLikeCv(text: string): boolean {
    
  const lower = text.toLowerCase();

  const sectionKeywords = [
    // English
    "experience", "employment", "work history", "education", "skills",
    "summary", "objective", "certification", "reference", "qualifications",
    // Swedish
    "erfarenhet", "anställning", "arbetslivserfarenhet","arbetserfarenhet", "utbildning",
    "kompetens", "färdigheter", "sammanfattning", "referenser", "behörighet"
  ];
  const sectionHits = sectionKeywords.filter((kw) => lower.includes(kw)).length;

  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);
  const hasDateRange = /(19|20)\d{2}\s*[-–—to]+\s*((19|20)\d{2}|present|nu|nutid)/i.test(text);
  const hasPhoneLike = /(\+?\d[\d\s().-]{7,}\d)/.test(text);

  let score = 0;
  if (sectionHits >= 2) score++;
  if (hasEmail) score++;
  if (hasDateRange) score++;
  if (hasPhoneLike) score++;

  return score >= 2;
}