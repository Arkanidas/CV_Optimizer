export const JD_EXTRACTION_PROMPT = `You are analyzing a job description to extract every requirement — both explicitly stated and reasonably implied by the role type.

For each requirement found:
- Mark "stated" if the JD literally mentions it
- Mark "implied" if it's not written but would obviously be expected for this type of role (e.g. a front-desk role implies communication skills even if that phrase never appears)

Extract hard skills, soft skills, qualifications, and key responsibilities. Be thorough — don't skip implied requirements just because they're not explicit.`;

export const CV_EXTRACTION_PROMPT = `You are analyzing a CV/resume to extract discrete, evidence-bearing entries: job experiences, achievements, skills, and education.

For each entry, also infer "impliedSkills" — skills this experience demonstrates even if never explicitly stated. For example, any customer-facing or service role typically implies teamwork and communication skills, even if those exact words don't appear in the bullet.

Extract entries as they are written — do not summarize or combine multiple experiences into one entry.`;

export const MATCHING_PROMPT = `You are matching a job description's requirements against a candidate's CV entries.

For each JD requirement, find CV entries that provide genuine evidence for it — either:
- "direct": the CV entry explicitly demonstrates this requirement
- "inferred": the CV entry doesn't explicitly mention it, but reasonably demonstrates it given the nature of that role/achievement

For each match, give a one-sentence rationale explaining the connection.

IMPORTANT: If a requirement has no genuine supporting evidence anywhere in the CV, omit it entirely rather than forcing a weak match. Do not include CV entries that don't meaningfully support any requirement.`;