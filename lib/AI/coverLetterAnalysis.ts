import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

import {
  JDExtractionSchema,
  CvExtractionSchema,
  MatchingResultsSchema,
  type JDExtraction,
  type CvExtraction,
  type MatchingResults,
} from "./schemas";
import { JD_EXTRACTION_PROMPT, CV_EXTRACTION_PROMPT, MATCHING_PROMPT } from "./prompts";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Generic helper: calls Claude with a forced tool call matching a Zod schema,
// and returns the validated, typed result.
async function extractStructured<T>(
  model: string,
  systemPrompt: string,
  userContent: string,
  schema: { parse: (data: unknown) => T },
  toolName: string,
  jsonSchema: object
): Promise<T> {
  const response = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
    tools: [
      {
        name: toolName,
        description: `Return the extracted data matching the required structure.`,
        input_schema: jsonSchema as any,
      },
    ],
    tool_choice: { type: "tool", name: toolName }, // forces Claude to respond via this tool, not free text
  });

  const toolUseBlock = response.content.find((block) => block.type === "tool_use");

  if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
    throw new Error("Model did not return structured output.");
  }

  return schema.parse(toolUseBlock.input); // Zod validates the shape at runtime here
}

export async function extractJdRequirements(
  jobDescription: string,
  model: string
): Promise<JDExtraction> {
  return extractStructured(
    model,
    JD_EXTRACTION_PROMPT,
    jobDescription,
    JDExtractionSchema,
    "extract_jd_requirements",
    z.toJSONSchema(JDExtractionSchema)
  );
}

export async function extractCvEntries(
  cvText: string,
  model: string
): Promise<CvExtraction> {
  return extractStructured(
    model,
    CV_EXTRACTION_PROMPT,
    cvText,
    CvExtractionSchema,
    "extract_cv_entries",
    z.toJSONSchema(CvExtractionSchema)
  );
}

export async function matchRequirementsToEntries(
  jdExtraction: JDExtraction,
  cvExtraction: CvExtraction,
  model: string
): Promise<MatchingResults> {
  const userContent = `JD Requirements:\n${JSON.stringify(jdExtraction, null, 2)}\n\nCV Entries:\n${JSON.stringify(cvExtraction, null, 2)}`;

  return extractStructured(
    model,
    MATCHING_PROMPT,
    userContent,
    MatchingResultsSchema,
    "match_requirements",
    z.toJSONSchema(MatchingResultsSchema)
  );
}