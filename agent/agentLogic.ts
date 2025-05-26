import { generateText, tool } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { deletePage } from "../Tools";

// ✅ TOOL 1: Say Hello
// This tool greets a user by name
const greetTool = tool({
  description: "Greets a user by name",
  parameters: z.object({
    name: z.string().describe("The name of the user to greet"),
  }),
  execute: async ({ name }) => {
    return `Hello, ${name}!`;
  },
});

// ✅ TOOL 2: Say Age
// This tool responds with the user's age
const ageTool = tool({
  description: "Tells the user their age",
  parameters: z.object({
    age: z.number().describe("The age of the user"),
  }),
  execute: async ({ age }) => {
    return `You are ${age} years old.`;
  },
});

// ✅ MAIN AGENT FUNCTION
export async function runAgent() {
  const { text, steps } = await generateText({
    // 👇 Language model to use (can be Claude, OpenAI, etc.)
    model: google("gemini-2.0-flash"), // or openai("gpt-4o") if you're importing from @ai-sdk/openai

    // 👇 List of tools that the agent can use
    tools: {
      greet: greetTool,
      tellAge: ageTool,
      deletePage: deletePage, // Example tool for deleting a page
    },

    // 👇 Prompt to the agent
    // Ask it something that requires using tools
    prompt: "Greet John and tell him he is 25 years old.",

    // 👇 Allow multiple steps (tool call → result → next reasoning)
    maxSteps: 5,
  });

  // ✅ Final model response after all reasoning + tool usage
  console.log("Final Response:", text);

  // ✅ Optional: Inspect all intermediate steps
  for (const [i, step] of steps.entries()) {
    console.log(`Step ${i + 1}:`);
    if (step.toolCalls?.length) {
      console.log(
        "  Tool called:",
        step.toolCalls.map((tc) => tc.toolName)
      );
    }
    if (step.toolResults?.length) {
      console.log(
        "  Tool results:",
        step.toolResults.map((tr) => tr.result)
      );
    }
    if (step.text) {
      console.log("  Text generated:", step.text);
    }
  }
}
