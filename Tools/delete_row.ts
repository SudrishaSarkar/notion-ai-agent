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

export const deleteRow = tool({
  description: "Deletes a row in a database.",
  parameters: z.object({
    database_id: z.string().optional(),
  }),
  execute: async ({ database_id }) => {
    if (typeof database_id !== "string") {
      throw new Error("database_id must be provided as a string.");
    }
    return await deleteRowLogic(database_id);
  },
});

export async function deleteRowLogic(pageId: string): Promise<string> {
  try {
    await notion.patch(`pages/${pageId}`, {
      archived: true,
    });

    return `Row deleted: ${pageId}`;
  } catch (error: any) {
    console.error(
      "Failed to delete row:",
      error.response?.data || error.message
    );
    throw error;
  }
}
