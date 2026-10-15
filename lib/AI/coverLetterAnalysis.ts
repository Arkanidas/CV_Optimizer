import { generateStructuredWithClaude, generateWithClaude, type SubscriptionTier } from "./claude";
import {JDExtractionSchema,CvExtractionSchema,MatchingResultsSchema,CvValidationSchema,AnalysisConclusionSchema,JdValidationSchema,ContactDetailsSchema, type ContactDetails, type JDExtraction,type CvExtraction,type MatchingResults,type CvValidation,type AnalysisConclusion,type JdValidation, TextAnswerValidationSchema, TextAnswerValidation,} from "./schemas";
import {JD_EXTRACTION_PROMPT,CV_EXTRACTION_PROMPT,MATCHING_PROMPT,CV_VALIDATION_PROMPT,ANALYSIS_CONCLUSION_PROMPT,JD_VALIDATION_PROMPT,COVER_LETTER_GENERATION_PROMPT,TONE_WRITING_GUIDANCE, TEXT_ANSWER_VALIDATION_PROMPT,CV_CONTACT_EXTRACTION_PROMPT} from "./prompts";
import { monthsBetween } from "@/lib/dateMath";
import type { ToneOption } from "./tiers";

export async function extractJdRequirements(jobDescription: string, tier: SubscriptionTier): Promise<JDExtraction> {
  return generateStructuredWithClaude({
    tier,
    system: JD_EXTRACTION_PROMPT,
    prompt: jobDescription,
    schema: JDExtractionSchema,
    toolName: "extract_jd_requirements",
  });
}

export async function extractCvEntries(cvText: string, tier: SubscriptionTier): Promise<CvExtraction> {
  const result = await generateStructuredWithClaude({
    tier,
    system: CV_EXTRACTION_PROMPT,
    prompt: cvText,
    schema: CvExtractionSchema,
    toolName: "extract_cv_entries",
  });

  const enrichedEntries = result.entries.map((entry) => ({
    ...entry,
    durationMonths: monthsBetween(entry.startDate, entry.endDate),
  }));

  return { entries: enrichedEntries };
}

export async function validateCvText(cvText: string): Promise<CvValidation> {
  return generateStructuredWithClaude({
    tier: "free",
    system: CV_VALIDATION_PROMPT,
    prompt: cvText,
    schema: CvValidationSchema,
    toolName: "validate_cv",
    maxTokens: 256,
  });
}

export async function matchRequirementsToEntries(
  jdExtraction: JDExtraction,
  cvExtraction: CvExtraction,
  tier: SubscriptionTier
): Promise<MatchingResults> {
  const prompt = `JD Requirements:\n${JSON.stringify(jdExtraction, null, 2)}\n\nCV Entries:\n${JSON.stringify(cvExtraction, null, 2)}`;

  return generateStructuredWithClaude({
    tier,
    system: MATCHING_PROMPT,
    prompt,
    schema: MatchingResultsSchema,
    toolName: "match_requirements",
    maxTokens: 8000,
  });
}

export async function generateAnalysisConclusion(
  matchPercentage: number,
  matches: MatchingResults,
  tier: SubscriptionTier
): Promise<AnalysisConclusion> {
  const prompt = `Match percentage: ${matchPercentage}%\n\nRequirement matches:\n${JSON.stringify(matches, null, 2)}`;

  return generateStructuredWithClaude({
    tier,
    system: ANALYSIS_CONCLUSION_PROMPT,
    prompt,
    schema: AnalysisConclusionSchema,
    toolName: "generate_analysis_conclusion",
    maxTokens: 10000,
  });
}

export async function validateJdText(jobDescription: string): Promise<JdValidation> {
  return generateStructuredWithClaude({
    tier: "free",
    system: JD_VALIDATION_PROMPT,
    prompt: jobDescription,
    schema: JdValidationSchema,
    toolName: "validate_jd",
    maxTokens: 256,
  });
}

function buildEvidenceBlock(highlightedQualifications: string[],matches: MatchingResults): string {
  if (highlightedQualifications.length === 0) {
    return "No specific qualifications were highlighted — select the strongest, most relevant matches from the CV and job description yourself.";
  }

  return highlightedQualifications
    .map((reqText) => {
      const match = matches.matches.find((m) => m.requirement.requirement === reqText);
      const evidence = match?.matchedEntries[0]?.rationale;
      return `- ${reqText}${evidence ? `: ${evidence}` : ""}`;
    })
    .join("\n");
}

export async function validateTextAnswer(answer: string): Promise<TextAnswerValidation> {
  return generateStructuredWithClaude({
    tier: "free",
    system: TEXT_ANSWER_VALIDATION_PROMPT,
    prompt: answer,
    schema: TextAnswerValidationSchema,
    toolName: "validate_text_answer",
    maxTokens: 200,
  });
}

export async function generateCoverLetterText(params: {
  cvText: string;
  jobDescription: string;
  whyCompany: string;
  whyRole: string;
  additionalInfo?: string;
  tone: ToneOption;
  highlightedQualifications: string[];
  matches: MatchingResults;
  tier: SubscriptionTier;
}): Promise<string> {
  
  const {cvText,jobDescription,whyCompany,whyRole,additionalInfo,tone,highlightedQualifications,matches,tier,} = params;

  const evidenceBlock = buildEvidenceBlock(highlightedQualifications, matches);

  const prompt = `JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S CV (for context and evidence — do not repeat this wholesale):
${cvText}

TONE FOR THIS LETTER:
${TONE_WRITING_GUIDANCE[tone]}

WHY THE CANDIDATE WANTS THIS COMPANY (use this as real, specific grounding, do not generalize it):
${whyCompany}

WHY THE CANDIDATE WANTS THIS SPECIFIC ROLE:
${whyRole}

${additionalInfo ? `ADDITIONAL CONTEXT FROM THE CANDIDATE:\n${additionalInfo}\n\n` : ""}QUALIFICATIONS THE CANDIDATE SPECIFICALLY WANTS HIGHLIGHTED, WITH SUPPORTING EVIDENCE FROM THEIR CV:
${evidenceBlock}

Write the cover letter now, following all the rules in your instructions.`;

  return generateWithClaude({
    tier,
    system: COVER_LETTER_GENERATION_PROMPT,
    prompt,
    maxTokens: 2048,
  });
}

const normalizeText = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
const digitsOnly = (s: string) => s.replace(/\D/g, "");

export async function extractContactDetails(cvText: string): Promise<ContactDetails> {
  
  const header = cvText.slice(0, 2500);

  const result = await generateStructuredWithClaude({
    tier: "free", 
    system: CV_CONTACT_EXTRACTION_PROMPT,
    prompt: header,
    schema: ContactDetailsSchema,
    toolName: "extract_cv_contact",
    maxTokens: 400,
  });

  const email = result.email.trim();
  const phone = result.phone.trim();
  const phoneDigits = digitsOnly(phone);

  return {
    firstName: result.firstName.trim(),
    lastName: result.lastName.trim(),
    location: result.location.trim(),
    email: email && normalizeText(cvText).includes(normalizeText(email)) ? email : "",
    phone: phoneDigits.length >= 6 && digitsOnly(cvText).includes(phoneDigits) ? phone : "",
  };
}