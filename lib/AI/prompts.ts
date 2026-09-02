export const JD_EXTRACTION_PROMPT = `You are analyzing a job description to extract every requirement the ideal candidate would need — both explicitly stated and reasonably implied by the role itself.

For each requirement found:
- Mark "stated" if the JD literally mentions it.
- Mark "implied" if it's not written but would obviously be expected for this type of role.

Be thorough about implied requirements, especially when the JD is short or vague. Think about what personality traits, soft skills, and working style this type of role genuinely requires in the real world, even if the posting never spells them out. For example, a waiter/waitress posting that only lists basic duties still implies: stress resistance, social skills, service-mindedness, strong communication, a positive attitude, and the ability to work at a fast pace — because these are inherent to succeeding in that role, regardless of whether the JD mentions them.

Apply this same reasoning to any role: infer the traits a realistic, successful person in this position would need, based on the nature of the work itself.

Mark each requirement's importance as "must_have" or "nice_to_have" based on how the JD frames it (e.g. "required" vs "preferred" or "a plus"). If not specified, use your judgment based on how central the requirement is to the role.

For each requirement, also mark "verifiableFromCv": true or false.
- true: skills, experience, qualifications, education, certifications, licenses — anything a CV could reasonably demonstrate or contradict.
- false: work schedule, availability, start date, location/commute requirements, willingness to work on-site, salary expectations, or any other logistical/administrative requirement. A CV can never confirm these regardless of how well-written it is — mark them false so they are excluded from matching.

For each requirement, also provide a "shortLabel" — a compact 2-4 word version suitable for a small UI chip (e.g. "Customer service experience.", "Swedish fluency", "B driving license", "English fluency"). Keep "requirement" as the fuller, more descriptive version — shortLabel is only for tight display, not a replacement for detail.
`;



export const CV_EXTRACTION_PROMPT = `You are analyzing a CV/resume to extract discrete, evidence-bearing entries: job experiences, achievements, skills, and education.

For each entry, also infer "impliedSkills" — skills this experience demonstrates even if never explicitly stated. For example, any customer-facing or service role typically implies teamwork and communication skills, even if those exact words don't appear in the bullet.

Extract entries as they are written by Work Experience, skills or education — do not summarize or combine multiple experiences into one entry.

Pay close attention to short, inline facts often placed in a header or contact-info line — licenses (e.g. driver's licenses), certifications, or language fluency are often stated there rather than in a dedicated bullet. Extract these as their own "skill" type entry even if they appear inline alongside a name, email, or phone number.`;

export const MATCHING_PROMPT = `You are matching a job description's requirements against a candidate's CV entries.

For each JD requirement, find CV entries that provide genuine evidence for it — either:
- "direct": the CV entry explicitly demonstrates this requirement
- "inferred": the CV entry doesn't explicitly mention it, but reasonably demonstrates it given the nature of that role/achievement

Be strict and realistic, not encouraging. Your job is to give the candidate an honest, accurate picture of their fit — not to make them feel good. Only include an "inferred" match if the connection is genuinely reasonable, the kind of connection an experienced hiring manager would actually accept as real evidence. Do not stretch a tenuous, generic, or speculative connection just to avoid leaving a requirement unmatched. A candidate who is genuinely not qualified for a role should see a low score reflecting that — do not soften or round up out of encouragement. If there is no real evidence for a requirement, leave matchedEntries empty; this is the correct, expected, and often important outcome.

For each match, give a one-sentence rationale explaining the connection.

IMPORTANT: Every requirement from the JD requirements list must appear exactly once in your output, even if no matching evidence exists — in that case, return an empty matchedEntries array for that requirement. Do not omit unmatched requirements, and do not force a weak or invented match just to avoid an empty array.`;

export const CV_VALIDATION_PROMPT = `You are checking whether a piece of text is a genuine CV/resume, as opposed to random text, a template with no real content, a different type of document, or an attempt to abuse a CV-processing tool.

A real CV typically includes: identifiable work history or education with plausible details, not just section headers with no substance. Be skeptical of text that only has structural keywords (like "Experience" or "Education") but no actual, specific content underneath them.`;

export const ANALYSIS_CONCLUSION_PROMPT = `You are writing a short, honest, direct analysis conclusion for a candidate, based on how well their CV matches a specific job description.

You will be given the match percentage (already calculated) and the full list of matched/unmatched requirements.

Use the match percentage as your primary guide for the "verdict":
- strong_fit: 85% and above
- good_fit: 65-84%
- moderate_fit: 45-64%
- weak_fit: 31-44%
- poor_fit: below 30%

Write the summary directly to the candidate ("you"), honestly and realistically. Do not soften a genuinely weak fit or round up out of encouragement — the candidate needs accurate information to make a real decision, not to feel good.

For "recommendation", give one direct sentence on whether it's worth proceeding to personalize a cover letter for this specific job, or whether their time may be better spent applying elsewhere.

For "alternativeSuggestions": ONLY include this field if the match percentage is 30% or below. When included, suggest 2-4 job titles or role types that would genuinely fit better, based specifically on what is actually on this candidate's CV — their real skills, experience, and education — not generic advice. If the match percentage is above 30%, omit this field entirely.`;