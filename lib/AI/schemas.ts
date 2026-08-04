import { z } from "zod";

export const JDRequirementSchema = z.object({
  requirement: z.string().describe("The specific requirement, e.g. 'Customer service experience'"),
  category: z.enum(["hard_skill", "soft_skill", "qualification", "responsibility"]),
  explicitness: z.enum(["stated", "implied"]).describe(
    "stated = literally written in the JD. implied = not written, but reasonably expected given the role type."
  ),
  importance: z.enum(["must_have", "nice_to_have"]),
});

export const JDExtractionSchema = z.object({
  requirements: z.array(JDRequirementSchema),
});

export const CvEntrySchema = z.object({
  id: z.string().describe("A short unique id you assign, e.g. 'exp_1', 'skill_2'"),
  type: z.enum(["job_experience", "achievement", "skill", "education"]),
  title: z.string().describe("e.g. 'Barista, Blue Bottle Coffee'"),
  description: z.string().describe("The bullet or detail as written on the CV"),
  impliedSkills: z.array(z.string()).describe(
    "Skills this role/bullet demonstrates even if not explicitly stated, based on what this type of role typically involves"
  ),
});

export const CvExtractionSchema = z.object({
  entries: z.array(CvEntrySchema),
});

export const MatchedEntrySchema = z.object({
  cvEntryId: z.string(),
  relevance: z.enum(["direct", "inferred"]),
  rationale: z.string().describe("One sentence: why this CV entry counts as relevant evidence"),
});

export const MatchResultSchema = z.object({
  requirement: JDRequirementSchema,
  matchedEntries: z.array(MatchedEntrySchema),
});

export const MatchingResultsSchema = z.object({
  matches: z.array(MatchResultSchema),
});

// TypeScript types, inferred directly from the schemas above — always in sync, no separate interface needed
export type JDExtraction = z.infer<typeof JDExtractionSchema>;
export type CvExtraction = z.infer<typeof CvExtractionSchema>;
export type MatchingResults = z.infer<typeof MatchingResultsSchema>;