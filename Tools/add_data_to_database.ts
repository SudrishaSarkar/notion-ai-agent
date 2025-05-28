import axios from "axios";
import dotenv from "dotenv";
import { generateText, tool } from "ai";
import { z } from "zod";
dotenv.config();

export const addDataToDatabase = tool({
  description: "Adds information to a specified database.",
  parameters: z.object({
    database_id: z.string().describe("The target database ID"),
  }),
  execute: async ({ database_id }) => {
    // TODO: Replace this with actual properties or prompt for them as needed
    const properties = {}; // Provide appropriate properties here
    return await addDataToDatabaseLogic(database_id, properties);
  },
});

async function addDataToDatabaseLogic(database_id: string, properties: any) {
  try {
    const response = await axios.post(
      "https://api.notion.com/v1/pages",
      {
        parent: { database_id },
        properties,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error adding data to database:",
      error.response?.data || error.message
    );
    throw error;
  }
}
