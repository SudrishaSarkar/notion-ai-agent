// tools/addRow.ts
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

export const addRow = tool({
  description:
    "Adds a new row to a database. Requires a database_id and a Notion-style properties object.",
  parameters: z.object({
    database_id: z.string().describe("The ID of the target Notion database."),
    properties: z
      .any()
      .describe("The Notion-style properties object for the new row."),
  }),
  execute: async ({ database_id, properties }) => {
    return await addRowLogic(database_id, properties);
  },
});

export async function addRowLogic(
  databaseId: string,
  properties: any
): Promise<string> {
  try {
    if (!properties || typeof properties !== "object") {
      throw new Error("Invalid or missing 'properties' object.");
    }

    const response = await notion.post("pages", {
      parent: { database_id: databaseId },
      properties,
    });

    return `✅ New row added: ${response.data.id}`;
  } catch (error: any) {
    console.error(
      "❌ Failed to add row:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Unknown error occurred while adding row."
    );
  }
}

// ✅ Example manual test runner (optional)
if (require.main === module) {
  (async () => {
    const testProperties = {
      GoalName: {
        title: [
          {
            text: {
              content: "Launch hiring portal",
            },
          },
        ],
      },
      DueDate: {
        date: {
          start: "2025-06-10",
        },
      },
      Priority: {
        select: {
          name: "High",
        },
      },
      Status: {
        status: {
          name: "Not started",
        },
      },
      Team: {
        multi_select: [{ name: "HR" }],
      },
      Owner: {
        people: [], // Can be updated later with user IDs if needed
      },
    };

    const databaseId = process.env.TEST_DATABASE_ID || "your-database-id";
    const result = await addRowLogic(databaseId, testProperties);
    console.log(result);
  })();
}
