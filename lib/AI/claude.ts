import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { SubscriptionTier } from "./tiers";


export type { SubscriptionTier } 


if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("Missing ANTHROPIC_API_KEY in your environment variables");
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});



export const MODEL_BY_TIER: Record<SubscriptionTier, string> = {
  free: "claude-haiku-4-5-20251001", // Free plan
  standard: "claude-sonnet-5", // $4.99/mo plan
  pro: "claude-opus-4-8", // $9.99/mo plan
};

export function getModelForTier(tier: SubscriptionTier): string {
  return MODEL_BY_TIER[tier];
}


export async function generateWithClaude(params: {
  tier: SubscriptionTier;
  system: string;
  prompt: string;
  maxTokens?: number;
}): Promise<string> {
  const { tier, system, prompt, maxTokens = 1024 } = params;

  try {
    const message = await anthropic.messages.create({
      model: getModelForTier(tier),
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Claude returned no text content");
    }
    return textBlock.text;
  } catch (error) {
    console.error("Claude API error:", error);
    throw new Error(
      "Something went wrong generating your content. Please try again."
    );
  }
}

// Sibling to generateWithClaude, for forced structured/schema output.
// Use this for extraction/matching stages (JD parsing, CV parsing, matching)
// instead of free-text generation.
export async function generateStructuredWithClaude<T>(params: {
  tier: SubscriptionTier;
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  toolName: string;
  maxTokens?: number;
}): Promise<T> {
  const { tier, system, prompt, schema, toolName, maxTokens = 4096 } = params;

  try {
    const message = await anthropic.messages.create({
      model: getModelForTier(tier),
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: prompt }],
      tools: [
        {
          name: toolName,
          description: "Return the extracted data matching the required structure.",
          input_schema: z.toJSONSchema(schema) as any,
        },
      ],
      tool_choice: { type: "tool", name: toolName },
    });

    const toolUseBlock = message.content.find((block) => block.type === "tool_use");
    if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
      throw new Error("Claude did not return structured output");
    }

    return schema.parse(toolUseBlock.input);
  } catch (error) {
    console.error("Claude structured API error:", error);
    throw new Error(
      "Something went wrong analyzing your content. Please try again."
    );
  }
}