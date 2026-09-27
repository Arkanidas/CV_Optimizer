import type { ToneOption } from "@/lib/AI/tiers";

export const JD_EXTRACTION_PROMPT = `You are analyzing a job description to extract every requirement the ideal candidate would need — both explicitly stated and reasonably implied by the role itself.

For each requirement found:
- Mark "stated" if the JD literally mentions it.
- Mark "implied" if it's not written but would obviously be expected for this type of role.

Be thorough about implied requirements, especially when the JD is short or vague. Think about what personality traits, soft skills, and working style this type of role genuinely requires in the real world, even if the posting never spells them out. For example, a waiter/waitress posting that only lists basic duties still implies: stress resistance, social skills, service-mindedness, strong communication, a positive attitude, and the ability to work at a fast pace — because these are inherent to succeeding in that role, regardless of whether the JD mentions them.

Apply this same reasoning to any role: infer the traits a realistic, successful person in this position would need, based on the nature of the work itself.

IMPORTANT: Extract at most 20 requirements total, prioritizing the ones most central and clearly relevant to the role. If a job description is narrative/prose-heavy rather than structured, be selective and concise — do not attempt to extract every possible inferred trait. Quality and relevance matter more than exhaustiveness.

Mark each requirement's importance as "must_have" or "nice_to_have" based on how the JD frames it (e.g. "required" vs "preferred" or "a plus"). If not specified, use your judgment based on how central the requirement is to the role.

For each requirement, also mark "verifiableFromCv": true or false.
- true: skills, experience, qualifications, education, certifications, licenses — anything a CV could reasonably demonstrate or contradict.
- false: work schedule, availability, start date, location/commute requirements, willingness to work on-site, salary expectations, or any other logistical/administrative requirement. A CV can never confirm these regardless of how well-written it is — mark them false so they are excluded from matching.

For each requirement, also provide a "shortLabel" — a compact 2-4 word version suitable for a small UI chip (e.g. "Customer service experience.", "Swedish fluency", "B driving license", "English fluency"). Keep "requirement" as the fuller, more descriptive version — shortLabel is only for tight display, not a replacement for detail.

IMPORTANT: Only extract requirements from content actually describing the role, responsibilities, and desired qualifications for the candidate. Ignore general company background, marketing copy, "About us" sections, company achievements, or descriptions of the company's product/technology that are not themselves things the candidate needs to have or do. Do not invent requirements from company-description text just because it mentions technical-sounding concepts — a company using large-scale data infrastructure does not mean the candidate needs experience with that infrastructure, unless the role description itself says so.
`;

export const TONE_WRITING_GUIDANCE: Record<ToneOption, string> = {
  formal: "Formal and polished. Traditional business language, complete sentences, no contractions, respectful and measured.",
  casual: "Relaxed and conversational, but still professional and appropriate for a real job application. Contractions are fine. Sounds like a confident person talking naturally, not stiff.",
  professional: "Polished, confident, and businesslike — the default tone for most modern job applications. Warm but not overly casual.",
  balanced: "A blend of warmth and professionalism — personable without being too casual, confident without being stiff.",
  traditional: "Classic, conventional cover letter structure and language, formal salutation and closing, more conservative phrasing throughout.",
  silly: "Light, playful, and a bit humorous in places while still taking the application seriously and clearly conveying genuine qualification. Use wit sparingly, never at the expense of clarity or professionalism.",
};

export const CV_EXTRACTION_PROMPT = `You are analyzing a CV/resume to extract discrete, evidence-bearing entries: job experiences, achievements, skills, and education.

For each entry, also infer "impliedSkills" — skills this experience demonstrates even if never explicitly stated. For example, any customer-facing or service role typically implies teamwork, problem-solving, and communication skills, even if those exact words don't appear in the bullet.

Extract entries as they are written by Work Experience, skills or education — do not summarize or combine multiple experiences into one entry.

Pay close attention to short, inline facts often placed in a header or contact-info line — licenses (e.g. driver's licenses), certifications, or language fluency are often stated there rather than in a dedicated bullet. Extract these as their own "skill" type entry even if they appear inline alongside a name, email, or phone number.

For job_experience and education entries, extract "startDate" and "endDate" in YYYY-MM format whenever a date range is present on the CV (e.g. "Okt. 2024 - Juni 2026" becomes startDate: "2024-10", endDate: "2026-06"). If the role is ongoing (e.g. "2022 - present", "2022 - nu"), set endDate to the literal string "present". If no date range is stated for an entry, leave both fields null — do not guess.`;

export const MATCHING_PROMPT = `You are matching a job description's requirements against a candidate's CV entries.

For each JD requirement, find CV entries that provide genuine evidence for it — either:
- "direct": the CV entry explicitly demonstrates this requirement
- "inferred": the CV entry doesn't explicitly mention it, but reasonably demonstrates it given the nature of that role/achievement

SPECIAL HANDLING FOR "YEARS OF EXPERIENCE" REQUIREMENTS: Some requirements specify a minimum duration (e.g. "2+ years of customer support experience", "4+ years of software development experience etc"). For these:
- Each CV job_experience/education entry includes a "durationMonths" field, already correctly calculated — use this number directly, never estimate duration yourself from dates.
- Identify every CV entry relevant to the SAME domain as the requirement (e.g. for "customer support experience", include every support/service-facing role — do not require the exact same job title).
- SUM the durationMonths across all relevant entries to get the candidate's total combined experience in that domain — a candidate does not need one single role covering the whole required duration; combined tenure across multiple relevant roles counts.
- If the requirement is scoped narrowly (e.g. "years of WORK experience in software development"), only sum job_experience entries in that domain — do not include education.
- If the requirement is scoped broadly (e.g. "years of experience in software" or "background in software development" without specifying work-only), you may include relevant education duration alongside work experience.
- State the combined total explicitly in your rationale (e.g. "Combined support experience across two roles totals 2 years, 8 months, meeting the 2+ year requirement.").
- Only mark this as unmatched if the correctly-summed combined duration genuinely falls short of the stated requirement — never because individual entries don't each independently meet it.


Be strict and realistic, not encouraging. Your job is to give the candidate an honest, accurate picture of their fit — not to make them feel good. Only include an "inferred" match if the connection is genuinely reasonable, the kind of connection an experienced hiring manager would actually accept as real evidence. Do not stretch a tenuous, generic, or speculative connection just to avoid leaving a requirement unmatched. A candidate who is genuinely not qualified for a role should see a low score reflecting that — do not soften or round up out of encouragement. If there is no real evidence for a requirement, leave matchedEntries empty; this is the correct, expected, and often important outcome.

For each match, give a one-sentence rationale explaining the connection.

IMPORTANT: Every requirement from the JD requirements list must appear exactly once in your output, even if no matching evidence exists — in that case, return an empty matchedEntries array for that requirement. Do not omit unmatched requirements, and do not force a weak or invented match just to avoid an empty array.`;

export const CV_VALIDATION_PROMPT = `You are checking whether a piece of text is a genuine CV/resume, as opposed to random text, a template with no real content, a different type of document, or an attempt to abuse a CV-processing tool.

A real CV typically includes: identifiable work history or education with plausible details, not just section headers with no substance. Be skeptical of text that only has structural keywords (like "Experience" or "Education") but no actual, specific content underneath them.`;

export const JD_VALIDATION_PROMPT = `You are checking whether a piece of text is a genuine job description/job posting, as opposed to random text, gibberish, an unrelated document, or content not actually describing a job opening.

A real job description typically describes: a role, responsibilities, and/or qualifications a candidate would need. Be skeptical of text that is well-formed language but is clearly about something other than a job (a story, an article, a recipe, etc.), and equally skeptical of text that is gibberish or nonsensical regardless of length.`;

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

For "alternativeSuggestions": ONLY include this field if the match percentage is 30% or below. When included, suggest 2-4 job titles or role types that would genuinely fit better, based specifically on what is actually on this candidate's CV — their real skills, experience, and education — not generic advice. If the match percentage is above 30%, omit this field entirely.

IMPORTANT: Never include by any means things you can't know about the candidate e.g being able to afford relocation, their personal preferences, or being able to work for under set hours. Only make recommendations based on what is actually in the CV and the job description.`;

export const COVER_LETTER_GENERATION_PROMPT = `You are writing a genuinely excellent, human-sounding cover letter for a real job application. This letter needs to read like it was written thoughtfully by the actual candidate, not generated by AI.

Follow these rules strictly:

SALUTATION: Look for a named contact (hiring manager, recruiter) in the job description. If you find a real name, address the letter to them by name.
If no name is given and the job description is in English, use "Dear Recruitment Manager" or "Dear Recruiter".
If no name is given and the job description is in Swedish, use "Kära rekryterare" — do not translate the English fallback yourself, use this exact Swedish phrase.
If the job description is in another language, use the natural, correct equivalent greeting in that language for "no named contact given" — do not default to English.

LANGUAGE: Write the entire letter in the same language as the job description.

LENGTH: 250 to 400 words, one page. This is a hard cap — do not exceed it. Length is one of the most common recruiter complaints about cover letters; respect this.

TONE: Follow the specific tone guidance provided below.

FORBIDDEN PUNCTUATION: NEVER use a hyphen or em dash (— or -) to join or separate clauses within a sentence (e.g. "this role excites me — especially the technical challenges" is FORBIDDEN). This is one of the most recognizable signs of AI-generated writing. Instead, restructure the sentence, or use a comma, a period, or a semicolon. A hyphen inside a single compound word (e.g. "long-term", "well-suited") is fine — only the dash-as-punctuation usage between clauses is forbidden.

SPECIFICITY, NOT GENERICITY: This is the most important rule. The letter must be genuinely tailored to this specific company and role. Use the candidate's own stated reasons for wanting this company and this role as the real, specific foundation of the letter, not generic enthusiasm. If you swapped out the company name, this letter should stop making sense, because it is that specific.

EVIDENCE, NOT ASSERTION: For every qualification or claim made, back it up with a specific, concrete piece of evidence from the candidate's real background. Never make an unsupported claim like "I am a great communicator" without grounding it in something real the candidate actually did.

SENTENCE VARIETY: Do not start every sentence with "I." Vary sentence structure and openings naturally, the way a real person writes.

DO NOT REPEAT THE CV: This is a cover letter, not a second copy of the resume. Reference specific, relevant experience selectively and purposefully, do not attempt to summarize the candidate's entire work history.

CLARITY: Keep sentences reasonably short and readable. Avoid corporate jargon and cliché phrases ("team player," "hard worker," "passionate," "go-getter," "detail-oriented" used as empty descriptors). Say things plainly and specifically instead.

ENTHUSIASM: The letter should feel genuinely interested and engaged, not going through the motions, but this enthusiasm must come from specific, real reasons, not generic excitement.

Return ONLY the finished cover letter text. No preamble, no explanation, no markdown formatting, no placeholder brackets like [Company Name], everything must be filled in with the real information provided.`;

export const TEXT_ANSWER_VALIDATION_PROMPT = `You are checking whether a short piece of text is a genuine, coherent attempt to answer a personal question in a job application (such as "why do you want to work here" or "why this role"), as opposed to gibberish, keyboard-mashing, or completely unrelated/nonsensical text.

The answer does not need to be well-written, long, or even particularly convincing, it just needs to be a real, coherent attempt at answering. Be lenient with short or imperfect answers. Only reject text that is gibberish, nonsensical, or has no genuine relation to answering the question at all.`;