import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { SubscriptionTier } from "./tiers";
import { hasToolMarkup, splitOnToolMarkup, stripToolMarkup } from "./cleanModelText";

export type { SubscriptionTier };

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

function unwrapOptional(field: z.ZodTypeAny): z.ZodTypeAny {
  return field instanceof z.ZodOptional ? (field.unwrap() as z.ZodTypeAny) : field;
}

function listFromString(value: string, allowPlainText: boolean): unknown[] | null {
  const text = value.trim();

  // A list written in the model's own tag format
  if (allowPlainText && hasToolMarkup(text)) {
    const items = splitOnToolMarkup(text);
    if (items.length > 0) return items;
  }

  if (text.startsWith("[") || text.startsWith("{")) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null; 
    }
  }

  if (!allowPlainText) return null;


  return text
    .split(/\r?\n|;\s+/)
    .map((item) => item.replace(/^\s*(?:[-•*–]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

// Removes the model's tool markup from every string, however deeply nested.
function cleanStrings(value: unknown): unknown {
  if (typeof value === "string") return stripToolMarkup(value);
  if (Array.isArray(value)) return value.map(cleanStrings);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, inner]) => [
        key,
        cleanStrings(inner),
      ])
    );
  }
  return value;
}

function coerceStructuredInput(schema: z.ZodTypeAny, input: unknown): unknown {
  if (typeof input !== "object" || input === null || !(schema instanceof z.ZodObject)) {
    return input;
  }

  const shape = schema.shape as Record<string, z.ZodTypeAny>;
  const result: Record<string, unknown> = { ...(input as Record<string, unknown>) };

  for (const key of Object.keys(shape)) {
    const field = unwrapOptional(shape[key]);
    if (!(field instanceof z.ZodArray)) continue;

    let value = result[key];
    const listOfStrings = (field as z.ZodArray<z.ZodTypeAny>).element instanceof z.ZodString;

    if (typeof value === "string") {
      const list = listFromString(value, listOfStrings);
      if (list) value = list;
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
   
      value = Object.values(value).flat();
    }

    if (listOfStrings && Array.isArray(value)) {
      value = value.flatMap((item) =>
        typeof item === "string" && hasToolMarkup(item) ? splitOnToolMarkup(item) : [item]
      );
    }

    result[key] = value;
  }

  return cleanStrings(result);
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

    const coerced = coerceStructuredInput(schema, toolUseBlock.input);
    const parsed = schema.safeParse(coerced);

    if (!parsed.success) {
      // Shows what the bad value really looks like. It can contain CV text,
      // so delete this log before you go live.
      console.error(
        `Invalid structured output for ${toolName}:`,
        JSON.stringify(toolUseBlock.input).slice(0, 600)
      );
      throw parsed.error;
    }

    return parsed.data;
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