
export function looksLikeReadableText(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length === 0) return false;

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 5) return false; // too short to be a real answer at all

  const letters = trimmed.toLowerCase().replace(/[^a-zåäöéèüßøæ]/g, "");
  if (letters.length === 0) return false;

  const vowels = letters.replace(/[^aeiouyåäöéèü]/g, "");
  const vowelRatio = vowels.length / letters.length;


  const hasReasonableVowelRatio = vowelRatio >= 0.2 && vowelRatio <= 0.65;

  const avgWordLength = letters.length / words.length;
  const hasReasonableWordLength = avgWordLength >= 2 && avgWordLength <= 14;


  const longestWord = Math.max(...words.map((w) => w.length));
  const noExcessivelyLongWord = longestWord <= 25;

  return hasReasonableVowelRatio && hasReasonableWordLength && noExcessivelyLongWord;
}