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


export async function generateStructuredWithClaude<T>(params: {
  tier: SubscriptionTier;
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  toolName: string;
  maxTokens?: number;
}): Promise<T> {
  const { tier, system, prompt, schema, toolName, maxTokens = 4096 } = params;

  const attempt = async (): Promise<T> => {
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

    if (message.stop_reason === "max_tokens") {
      throw new Error(`Claude hit max_tokens (${maxTokens}) before completing tool: ${toolName}`);
    }

    const toolUseBlock = message.content.find((block) => block.type === "tool_use");
    if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
      throw new Error("Claude did not return structured output");
    }

    let input = toolUseBlock.input;

    if (typeof input === "object" && input !== null) {

      for (const key of Object.keys(input)) {
        const value = (input as any)[key];
        if (
          typeof value === "string" &&
          (value.trim().startsWith("[") || value.trim().startsWith("{"))
        ) {
          try {
            (input as any)[key] = JSON.parse(value);
          } catch {
            console.error("Error parsing JSON for key:", key, "value:", value);
          }
        }
      }

      if (schema instanceof z.ZodObject) {
        const shape = schema.shape as Record<string, z.ZodTypeAny>;
        for (const key of Object.keys(shape)) {
          const fieldSchema = shape[key];
          const expectsArray =
            fieldSchema instanceof z.ZodArray ||
            (fieldSchema instanceof z.ZodOptional &&
              fieldSchema._def.innerType instanceof z.ZodArray);

          const value = (input as any)[key];
          if (expectsArray && value && typeof value === "object" && !Array.isArray(value)) {
            (input as any)[key] = Object.values(value).flat();
          }
        }
      }
    }

    return schema.parse(input);
  };

  try {
    return await attempt();
  } catch (firstError) {
    console.error(`Claude structured API error (attempt 1) for ${toolName}:`, firstError);
    try {
      return await attempt();
    } catch (secondError) {
      console.error(`Claude structured API error (attempt 2) for ${toolName}:`, secondError);
      throw new Error(
        "Something went wrong analyzing your content. Please try again."
      );
    }
  }
}