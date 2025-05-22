import axios from "axios";
import readline from "readline";
import dotenv from "dotenv";
import chalk from "chalk";
import * as tools from "./Tools";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { agentLoop } from "./agent/agentLoop";
//import { generateLasagnaRecipe } from "./agent/example_vercel_sdk";

// Load environment variables from .env file
dotenv.config();

// Define types for messages
type MessageRole = "user" | "assistant";
type Message = {
  role: MessageRole;
  content: string;
};

class Agent {
  private getUserMessage: () => Promise<string | null>;
  private conversation: Message[] = [];

  constructor(getUserMessage: () => Promise<string | null>) {
    this.getUserMessage = getUserMessage;
  }

  /*  
  public async run(): Promise<void> {
    console.log("Chat with Gemini (use ctrl-c to quit)");

    while (true) {
      process.stdout.write(chalk.blue("You") + ": ");
      const userInput = await this.getUserMessage();
      if (!userInput) break;

      const userMessage: Message = { role: "user", content: userInput };
      this.conversation.push(userMessage);

      const response = await this.runInference(this.conversation);
      if (!response) break;

      this.conversation.push({ role: "assistant", content: response });

      // Print assistant's response
      console.log(chalk.yellow("Gemini") + ": " + response);
    }
  }
*/

  public async run(): Promise<void> {
    // main.ts (inside agent.run())

    const userInput = await this.getUserMessage();
    if (!userInput) return;

    await agentLoop(userInput); // Use the agent loop here
  }

  private async runInference(conversation: Message[]): Promise<string | null> {
    try {
      const messagesWithSystemPrompt = [
        { role: "user", content: SYSTEM_PROMPT }, // Injected system prompt
        ...conversation,
      ];

      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process
          .env.GEMINI_API_KEY!}`,
        {
          contents: [
            {
              parts: [
                {
                  text: messagesWithSystemPrompt
                    .map((m) => `${m.role}: ${m.content}`)
                    .join("\n"),
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const contentParts = res.data?.candidates?.[0]?.content?.parts;
      const contentText = contentParts
        ?.map((part: any) => part.text)
        .join("\n");
      return contentText ?? null;
    } catch (err: any) {
      console.error("Inference error:", err.response?.data || err.message);
      return null;
    }
  }
}

// Function to get user input from the terminal
function getUserInput(): Promise<string | null> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("", (answer) => {
      rl.close();
      resolve(answer.trim() || null);
    });
  });
}

export async function runTool(toolName: string, args: any): Promise<string> {
  if (toolName in tools) {
    try {
      const result = await (tools as any)[toolName](...args);
      return typeof result === "string"
        ? result
        : JSON.stringify(result, null, 2);
    } catch (err: any) {
      return `Error running tool ${toolName}: ${err.message}`;
    }
  } else {
    return `Tool "${toolName}" not found.`;
  }
}

// Run the agent

(async () => {
  console.log(" Notion Agent started. Ask me something:");
  const agent = new Agent(getUserInput);
  await agent.run();
  //generateLasagnaRecipe();
})();
