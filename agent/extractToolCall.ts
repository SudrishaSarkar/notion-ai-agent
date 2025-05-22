export function extractToolCall(
  text: string
): { tool: string; args: any[] } | null {
  // Normalize: remove markdown/code block formatting if present
  const cleanText = text.replace(/```(?:json)?|```/g, "").trim();

  const match = cleanText.match(/call\s+(\w+)\(([\s\S]*?)\)/i);
  if (!match) return null;

  const tool = match[1];
  const rawArgs = match[2];

  try {
    const args = JSON.parse(`[${rawArgs}]`);
    return { tool, args };
  } catch (error: any) {
    console.error(" Argument parsing error in extractToolCall:", error.message);
    return null;
  }
}
