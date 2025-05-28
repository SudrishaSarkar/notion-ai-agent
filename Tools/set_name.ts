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

export const setName = tool({
  description: "Updates the name of a page, row, or column.",
  parameters: z.object({
    pageId: z.string().optional(),
    newName: z.string().optional(),
  }),
  execute: async ({ pageId, newName }) => {
    if (typeof pageId !== "string" || typeof newName !== "string") {
      throw new Error("Both pageId and newName must be provided as strings.");
    }
    return await setNameLogic(pageId, newName);
  },
});

export async function setNameLogic(
  pageId: string,
  newName: string
): Promise<string> {
  try {
    await notion.patch(`pages/${pageId}`, {
      properties: {
        title: {
          title: [
            {
              text: {
                content: newName,
              },
            },
          ],
        },
      },
    });

    return `Name updated to "${newName}"`;
  } catch (error: any) {
    console.error("Failed to set name:", error.response?.data || error.message);
    throw error;
  }
}
