import { generateStructuredWithClaude, generateWithClaude, type SubscriptionTier } from "./claude";
import {JDExtractionSchema,CvExtractionSchema,MatchingResultsSchema,CvValidationSchema,AnalysisConclusionSchema,JdValidationSchema,type JDExtraction,type CvExtraction,type MatchingResults,type CvValidation,type AnalysisConclusion,type JdValidation, TextAnswerValidationSchema, TextAnswerValidation,} from "./schemas";
import {JD_EXTRACTION_PROMPT,CV_EXTRACTION_PROMPT,MATCHING_PROMPT,CV_VALIDATION_PROMPT,ANALYSIS_CONCLUSION_PROMPT,JD_VALIDATION_PROMPT,COVER_LETTER_GENERATION_PROMPT,TONE_WRITING_GUIDANCE, TEXT_ANSWER_VALIDATION_PROMPT,} from "./prompts";
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