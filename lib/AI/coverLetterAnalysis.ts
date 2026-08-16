import { generateStructuredWithClaude, type SubscriptionTier } from "./claude";
import {
  JDExtractionSchema,
  CvExtractionSchema,
  MatchingResultsSchema,
  type JDExtraction,
  type CvExtraction,
  type MatchingResults,
} from "./schemas";
import { JD_EXTRACTION_PROMPT, CV_EXTRACTION_PROMPT, MATCHING_PROMPT } from "./prompts";

export async function extractJdRequirements(
  jobDescription: string,
  tier: SubscriptionTier
): Promise<JDExtraction> {
  return generateStructuredWithClaude({
    tier,
    system: JD_EXTRACTION_PROMPT,
    prompt: jobDescription,
    schema: JDExtractionSchema,
    toolName: "extract_jd_requirements",
  });
}

export async function extractCvEntries(
  cvText: string,
  tier: SubscriptionTier
): Promise<CvExtraction> {
  return generateStructuredWithClaude({
    tier,
    system: CV_EXTRACTION_PROMPT,
    prompt: cvText,
    schema: CvExtractionSchema,
    toolName: "extract_cv_entries",
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
  });
}