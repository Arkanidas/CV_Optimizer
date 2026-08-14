export const JD_EXTRACTION_PROMPT = `You are analyzing a job description to extract every requirement the ideal candidate would need — both explicitly stated and reasonably implied by the role itself.

For each requirement found:
- Mark "stated" if the JD literally mentions it.
- Mark "implied" if it's not written but would obviously be expected for this type of role.

Be thorough about implied requirements, especially when the JD is short or vague. Think about what personality traits, soft skills, and working style this type of role genuinely requires in the real world, even if the posting never spells them out. For example, a waiter/waitress posting that only lists basic duties still implies: stress resistance, social skills, service-mindedness, strong communication, a positive attitude, and the ability to work at a fast pace — because these are inherent to succeeding in that role, regardless of whether the JD mentions them.

Apply this same reasoning to any role: infer the traits a realistic, successful person in this position would need, based on the nature of the work itself.

Mark each requirement's importance as "must_have" or "nice_to_have" based on how the JD frames it (e.g. "required" vs "preferred" or "a plus"). If not specified, use your judgment based on how central the requirement is to the role.`;

export const CV_EXTRACTION_PROMPT = `You are analyzing a CV/resume to extract discrete, evidence-bearing entries: job experiences, achievements, skills, and education.

For each entry, also infer "impliedSkills" — skills this experience demonstrates even if never explicitly stated. For example, any customer-facing or service role typically implies teamwork and communication skills, even if those exact words don't appear in the bullet.

Extract entries as they are written — do not summarize or combine multiple experiences into one entry.`;

export const MATCHING_PROMPT = `You are matching a job description's requirements against a candidate's CV entries.

For each JD requirement, find CV entries that provide genuine evidence for it — either:
- "direct": the CV entry explicitly demonstrates this requirement
- "inferred": the CV entry doesn't explicitly mention it, but reasonably demonstrates it given the nature of that role/achievement

For each match, give a one-sentence rationale explaining the connection.

IMPORTANT: If a requirement has no genuine supporting evidence anywhere in the CV, omit it entirely rather than forcing a weak match. Do not include CV entries that don't meaningfully support any requirement.`;