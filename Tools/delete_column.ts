import { generateText, tool } from "ai";
import { z } from "zod";

export const deleteColumn = tool({
  description: "Deletes a column from a database.",
  parameters: z.object({
    database_id: z.string().optional(),
    database_name: z.string().optional(),
  }),
  execute: async ({ database_id, database_name }) => {
    return await deleteColumnLogic();
  },
});

export async function deleteColumnLogic(): Promise<string> {
  return "Notion API does not support deleting columns via API.";
}
