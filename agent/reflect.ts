// agent/reflect.ts
export function reflect(
  output: string,
  step: number,
  maxSteps: number
): { done: boolean; nextQuery: string } {
  if (output.includes("task complete") || step >= maxSteps - 1) {
    return { done: true, nextQuery: "" };
  }

  // For now, continue reasoning with the same output
  return { done: false, nextQuery: output };
}
