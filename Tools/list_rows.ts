// tools/list_rows.ts
import axios from "axios";
import dotenv from "dotenv";
import { tool } from "ai";
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
  description:
    "Lists rows in a database. Can optionally filter by property name and value.",
  parameters: z.object({
    databaseId: z.string(),
    filterProperty: z
      .string()
      .optional()
      .describe("Name of the property to filter by"),
    filterValue: z
      .string()
      .optional()
      .describe("Value of the property to filter by"),
  }),
  execute: async ({ databaseId, filterProperty, filterValue }) => {
    return await listRowsLogic(databaseId, filterProperty, filterValue);
  },
});

export async function listRowsLogic(
  databaseId: string,
  filterProperty?: string,
  filterValue?: string
): Promise<any> {
  try {
    const payload: any = {};

    if (filterProperty && filterValue) {
      payload.filter = {
        property: filterProperty,
        select: {
          equals: filterValue,
        },
      };
    }

    const response = await notion.post(
      `databases/${databaseId}/query`,
      payload
    );
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
    const rows = await listRowsLogic(
      "your_database_id_here",
      "Priority",
      "Medium"
    );
    console.log(JSON.stringify(rows, null, 2));
  })();
}
