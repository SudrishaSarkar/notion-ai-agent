import axios from "axios";
import dotenv from "dotenv";
import { generateText, tool } from "ai";
import { z } from "zod";
dotenv.config();

export const getColumnList = tool({
  description: "Lists columns in a given database.",
  parameters: z.object({
    database_id: z.string().optional(),
  }),
  execute: async ({ database_id }) => {
    if (typeof database_id !== "string") {
      throw new Error("database_id must be provided as a string.");
    }
    return await getColumnListLogic(database_id);
  },
});

async function getColumnListLogic(database_id: string) {
  try {
    const response = await axios.get(
      `https://api.notion.com/v1/databases/${database_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
        },
      }
    );
    return Object.keys(response.data.properties);
  } catch (error: any) {
    console.error(
      "Error fetching column list:",
      error.response?.data || error.message
    );
    throw error;
  }
}
