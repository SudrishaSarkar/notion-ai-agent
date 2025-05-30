// tools/update_row.ts
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

export const updateRow = tool({
  description: "Updates properties of an existing Notion page (row).",
  parameters: z.object({
    page_id: z.string().describe("The ID of the Notion page to update."),
    properties: z
      .any()
      .describe("The Notion-style properties object to update."),
  }),
  execute: async ({ page_id, properties }) => {
    return await updateRowLogic(page_id, properties);
  },
});

export async function updateRowLogic(
  page_id: string,
  properties: any
): Promise<string> {
  try {
    const response = await notion.patch(`pages/${page_id}`, {
      properties,
    });
    return `Row updated successfully: ${response.data.id}`;
  } catch (error: any) {
    console.error(
      "Failed to update row:",
      error.response?.data || error.message
    );
    throw error;
  }
}

if (require.main === module) {
  (async () => {
    const result = await updateRowLogic("your_page_id_here", {
      Priority: { select: { name: "High" } },
      Status: { status: { name: "Complete" } },
      Team: { multi_select: [{ name: "HR" }] },
    });
    console.log(result);
  })();
}
