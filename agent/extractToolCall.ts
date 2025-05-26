export function extractToolCall(text: string): {
  tool: string | null;
  tool_input: any;
  final_response: string | null;
} | null {
  try {
    // Get the first JSON block inside ```json ... ``` or raw
    const match =
      text.match(/```json([\s\S]*?)```/) || text.match(/({[\s\S]*})/);
    if (!match) return null;

    const jsonText = match[1].trim();
    const parsed = JSON.parse(jsonText);

    return {
      tool: parsed.tool ?? null,
      tool_input: parsed.tool_input ?? {},
      final_response: parsed.final_response ?? null,
    };
  } catch (e) {
    console.error("❌ Failed to parse tool call JSON:", e);
    return null;
  }
}
