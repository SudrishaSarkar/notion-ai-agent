// agent/reasonAct.ts
import axios from "axios";
import { SYSTEM_PROMPT } from "../systemPrompt";
import { google } from "@ai-sdk/google";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { z } from "zod";
import { addPage } from "../Tools/add_page";
import { title } from "process";

export async function reasonAndAct(
  query: string
): Promise<{ output: string; toolCallSummary: string }> {
  //const prompt = `${SYSTEM_PROMPT}\n\nUser Query:\n${query}`;
  const prompt = query;
  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    prompt,
    tools: {
      addPage: tool({
        description: "Add a page to a Notion database",
        parameters: z.object({
          title: z.string().describe("The title of the page"),
        }),
        execute: async ({ title }) => {
          console.log("Adding page with title:", title);
          const response = await addPage(title);
          return response;
        },
      }),
    },
  });
  console.log("Gemini Output:", text);
  //   const res = await axios.post(
  //     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
  //     {
  //       contents: [{ parts: [{ text: prompt }] }],
  //     },
  //     {
  //       headers: { "Content-Type": "application/json" },
  //     }
  //   );

  throw new Error("Sudrisha's special error message");
  //   const output =
  //     res.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  //   const toolCallSummary = "Simulated summary of tool used here"; // Optional: parse or extract if needed

  //   return { output, toolCallSummary };
}
