// tools/list_rows.ts
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

export const listRows = tool({
  description: "Lists rows in a database.",
  parameters: z.object({
    databaseId: z.string().optional(),
  }),
  execute: async ({ databaseId }) => {
    if (typeof databaseId !== "string") {
      throw new Error("databaseId must be provided as a string.");
    }
    return await listRowsLogic(databaseId);
  },
});

export async function listRowsLogic(databaseId: string): Promise<any> {
  try {
    const response = await notion.post(`databases/${databaseId}/query`);
    return response.data.results;
  } catch (error: any) {
    console.error(
      "Failed to list rows:",
      error.response?.data || error.message
    );
    throw error;
  }
}

if (require.main === module) {
  (async () => {
    const rows = await listRowsLogic("your_database_id_here");
    console.log(JSON.stringify(rows, null, 2));
  })();
}
