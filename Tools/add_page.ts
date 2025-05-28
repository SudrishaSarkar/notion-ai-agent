import axios from "axios";
import dotenv from "dotenv";
import { generateText, tool } from "ai";
import { z } from "zod";
dotenv.config();

const notion = axios.create({
  baseURL: "https://api.notion.com/v1/",
  headers: {
    Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  },
});

export const addPage = tool({
  description: "Adds a new page to the workspace.",
  parameters: z.object({
    page_name: z.string().describe("The name of the page to add"),
  }),
  execute: async ({ page_name }) => {
    return await addPageLogic(page_name);
  },
});

export async function addPageLogic(title: string): Promise<string> {
  try {
    const response = await notion.post("pages", {
      parent: { type: "workspace" },
      properties: {
        title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
    });

    return `New page added: ${response.data.id}`;
  } catch (error: any) {
    console.error("Failed to add page:", error.response?.data || error.message);
    throw error;
  }
}
