// The model sometimes leaks its own tool-call markup into text fields, for
// example <parameter name="item">...</parameter> or <item>...</item>.
// Matches opening tags (with any attributes) and closing tags.
const TOOL_MARKUP = /<\/?(?:antml:)?(?:item|parameter|invoke|function_calls?)\b[^>]*>/gi;

export function stripToolMarkup(text: string): string {
  return text.replace(TOOL_MARKUP, "").trim();
}

export function splitOnToolMarkup(text: string): string[] {
  return text
    .split(TOOL_MARKUP)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function hasToolMarkup(text: string): boolean {
  return text.search(TOOL_MARKUP) !== -1;
}