import axios from "axios";
import dotenv from "dotenv";
import { generateText, tool } from "ai";
import { z } from "zod";
dotenv.config();

export const addColumn = tool({
  description: "Adds a column to a database.",
  parameters: z.object({
    database_id: z.string().describe("The database ID to add column to"),
    columnName: z.string().describe("The name of the new column"),
    columnType: z.string().describe("The type of the new column"),
  }),
  execute: async ({ database_id, columnName, columnType }) => {
    return await addColumnLogic(database_id, columnName, columnType);
  },
});

export async function addColumnLogic(
  database_id: string,
  columnName: string,
  columnType: string
) {
  try {
    const response = await axios.patch(
      `https://api.notion.com/v1/databases/${database_id}`,
      {
        properties: {
          [columnName]: {
            type: columnType,
            [columnType]: {},
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      }
    );
    return {
      message: "new column added",
      columns: Object.keys(response.data.properties),
    };
  } catch (error: any) {
    console.error(
      "Error adding column:",
      error.response?.data || error.message
    );
    throw error;
  }
}
