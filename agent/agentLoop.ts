// agent/agentLoop.ts
import { reasonAndAct } from "./reasonAct";
import { reflect } from "./reflect";
import { extractToolCall } from "./extractToolCall";
import { runTool } from "../main"; // Or wherever runTool is defined/exported

export async function agentLoop(query: string, maxSteps = 5): Promise<void> {
  let currentQuery = query;
  let step = 0;

  while (step < maxSteps) {
    console.log(`\n Step ${step + 1}: Reasoning and Acting`);
    const { output, toolCallSummary } = await reasonAndAct(currentQuery);

    console.log("Gemini Output:", output);
    console.log(" Tool Call Summary:", toolCallSummary);

    const toolCall = extractToolCall(output);

    if (toolCall) {
      const { tool, args } = toolCall;
      console.log(` Detected tool call: ${tool}(${JSON.stringify(args)})`);

      const toolResult = await runTool(tool, args);
      console.log(`Tool Result: ${toolResult}`);

      currentQuery = `Previous tool result:\n${toolResult}`; // feed result back into next loop
    } else {
      console.log(
        " No tool call found. Passing output directly into next step."
      );
      currentQuery = output;
    }

    const { done, nextQuery } = reflect(currentQuery, step, maxSteps);
    if (done) {
      console.log(" Task complete. Exiting.");
      break;
    }

    currentQuery = nextQuery;
    step++;
  }

  if (step >= maxSteps) {
    console.log(" Max steps reached. Exiting.");
  }
}
