import { generateStructuredWithClaude, type SubscriptionTier } from "./claude";
import {JDExtractionSchema,CvExtractionSchema,MatchingResultsSchema, CvValidationSchema, AnalysisConclusionSchema, JdValidationSchema, type JDExtraction,type CvExtraction, type MatchingResults, type CvValidation, type AnalysisConclusion, type JdValidation} from "./schemas";
import { JD_EXTRACTION_PROMPT, CV_EXTRACTION_PROMPT, MATCHING_PROMPT, CV_VALIDATION_PROMPT, ANALYSIS_CONCLUSION_PROMPT, JD_VALIDATION_PROMPT } from "./prompts";
import { monthsBetween } from "@/lib/dateMath";

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
    maxTokens: 10000,
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