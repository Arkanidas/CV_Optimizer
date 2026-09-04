import { z } from "zod";

export const JDRequirementSchema = z.object({
  requirement: z.string().describe("The specific requirement, e.g. 'Customer service experience'"),
  shortLabel: z.string().describe("A concise version of the requirement, 2-4 words, short enough for a small UI chip. E.g. 'Customer service experience.', 'Swedish fluency', 'B driving license', 'English fluency'. The full detail stays in 'requirement' for tooltip text."),
  category: z.enum(["hard_skill", "soft_skill", "qualification", "responsibility"]),
  explicitness: z.enum(["stated", "implied"]).describe("stated = literally written in the JD. implied = not written, but reasonably expected given the role type."),
  importance: z.enum(["must_have", "nice_to_have"]),
  verifiableFromCv: z.boolean().describe("true if this is a skill, experience, qualification, or education that a CV could reasonably confirm or deny. false if this is scheduling, availability, location/commute, salary, or any other logistics that no CV can ever answer."),
});

export const JDExtractionSchema = z.object({requirements: z.array(JDRequirementSchema),});

export const CvEntrySchema = z.object({
  id: z.string().describe("A short unique id you assign, e.g. 'exp_1', 'skill_2'"),
  type: z.enum(["job_experience", "achievement", "skill", "education"]),
  title: z.string().describe("e.g. 'Barista, Blue Bottle Coffee'"),
  description: z.string().describe("The bullet or detail as written on the CV"),
  impliedSkills: z.array(z.string()).describe("Skills this role/bullet demonstrates even if not explicitly stated, based on what this type of role typically involves"),
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

export const CvValidationSchema = z.object({
  isLikelyCv: z.boolean(),
  confidence: z.enum(["high", "medium", "low"]),
  reason: z.string().describe("One short sentence explaining the classification"),
});

export const AnalysisConclusionSchema = z.object({
  verdict: z.enum(["strong_fit", "good_fit", "moderate_fit", "weak_fit", "poor_fit"]),
  summary: z.string().describe(
    "2-4 sentences, written directly to the candidate using 'you', giving an honest, realistic overview of their fit for this specific role."
  ),
  strengths: z.array(z.string()).describe(
    "Up to 4 short, specific points on what makes this candidate a good fit for this job."
  ),
  gaps: z.array(z.string()).describe(
    "Up to 4 short, specific points on what's missing or weak for this job."
  ),
  recommendation: z.string().describe(
    "One direct sentence telling the candidate whether it's worth proceeding to personalize a cover letter for this job or not."
  ),
  alternativeSuggestions: z
    .array(z.string())
    .optional()
    .describe(
      "Only present when match percentage is 40% or below: 2-4 short suggestions of job titles/role types that would fit this candidate's real CV much better."
    ),
});

export type AnalysisConclusion = z.infer<typeof AnalysisConclusionSchema>;
export type JDExtraction = z.infer<typeof JDExtractionSchema>;
export type CvExtraction = z.infer<typeof CvExtractionSchema>;
export type MatchingResults = z.infer<typeof MatchingResultsSchema>;
export type CvValidation = z.infer<typeof CvValidationSchema>;