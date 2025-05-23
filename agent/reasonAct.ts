// agent/reasonAct.ts
import axios from "axios";
import { SYSTEM_PROMPT } from "../systemPrompt";
import { google } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { z } from "zod";
import { addPage } from "../Tools/add_page";
import { title } from "process";
import {
  addColumn,
  addDataToDatabase,
  addRow,
  deleteColumn,
  deletePage,
  deleteRow,
  getColumnList,
  getDatabaseIdByName,
  listAllDatabases,
  listRows,
  searchData,
  setName,
} from "../Tools";

export async function reasonAndAct(
  query: string
): Promise<{ output: string; toolCallSummary: string }> {
  const prompt = `${SYSTEM_PROMPT}\n\nUser Query:\n${query}`;
  //const prompt = query;
  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    prompt,
    tools: {
      list_all_databases: tool({
        description: "Lists all existing databases.",
        parameters: z.object({}),
        execute: async () => {
          return await listAllDatabases();
        },
      }),
      add_data_to_database: tool({
        description: "Adds information to a specified database.",
        parameters: z.object({
          database_id: z.string().describe("The target database ID"),
        }),
        execute: async ({ database_id }) => {
          // TODO: Replace this with actual properties or prompt for them as needed
          const properties = {}; // Provide appropriate properties here
          return await addDataToDatabase(database_id, properties);
        },
      }),
      get_database_id: tool({
        description: "Fetches the database_id from a given database_name.",
        parameters: z.object({
          database_name: z.string().describe("The name of the database"),
        }),
        execute: async ({ database_name }) => {
          return await getDatabaseIdByName(database_name);
        },
      }),
      get_column_list: tool({
        description: "Lists columns in a given database.",
        parameters: z.object({
          database_id: z.string().optional(),
        }),
        execute: async ({ database_id }) => {
          if (typeof database_id !== "string") {
            throw new Error("database_id must be provided as a string.");
          }
          return await getColumnList(database_id);
        },
      }),
      add_column: tool({
        description: "Adds a column to a database.",
        parameters: z.object({
          database_id: z.string().describe("The database ID to add column to"),
          columnName: z.string().describe("The name of the new column"),
          columnType: z.string().describe("The type of the new column"),
        }),
        execute: async ({ database_id, columnName, columnType }) => {
          return await addColumn(database_id, columnName, columnType);
        },
      }),
      list_rows: tool({
        description: "Lists rows in a database.",
        parameters: z.object({
          databaseId: z.string().optional(),
        }),
        execute: async ({ databaseId }) => {
          if (typeof databaseId !== "string") {
            throw new Error("databaseId must be provided as a string.");
          }
          return await listRows(databaseId);
        },
      }),
      add_row: tool({
        description: "Adds a row to a database.",
        parameters: z.object({
          database_id: z.string().optional(),
          properties: z.string().optional(),
        }),
        execute: async ({ database_id, properties }) => {
          if (typeof database_id !== "string") {
            throw new Error("database_id must be provided as a string.");
          }
          return await addRow(database_id, properties);
        },
      }),
      delete_row: tool({
        description: "Deletes a row in a database.",
        parameters: z.object({
          database_id: z.string().optional(),
        }),
        execute: async ({ database_id }) => {
          if (typeof database_id !== "string") {
            throw new Error("database_id must be provided as a string.");
          }
          return await deleteRow(database_id);
        },
      }),
      delete_column: tool({
        description: "Deletes a column from a database.",
        parameters: z.object({
          database_id: z.string().optional(),
          database_name: z.string().optional(),
        }),
        execute: async ({ database_id, database_name }) => {
          return await deleteColumn();
        },
      }),
      add_page: tool({
        description: "Adds a new page to the workspace.",
        parameters: z.object({
          page_name: z.string().describe("The name of the page to add"),
        }),
        execute: async ({ page_name }) => {
          return await addPage(page_name);
        },
      }),
      delete_page: tool({
        description: "Deletes a page from the workspace.",
        parameters: z.object({
          pageId: z.string().optional(),
        }),
        execute: async ({ pageId }) => {
          if (typeof pageId !== "string") {
            throw new Error("pageId must be provided as a string.");
          }
          return await deletePage(pageId);
        },
      }),
      set_name: tool({
        description: "Updates the name of a page, row, or column.",
        parameters: z.object({
          pageId: z.string().optional(),
          newName: z.string().optional(),
        }),
        execute: async ({ pageId, newName }) => {
          if (typeof pageId !== "string" || typeof newName !== "string") {
            throw new Error(
              "Both pageId and newName must be provided as strings."
            );
          }
          return await setName(pageId, newName);
        },
      }),
      search_data: tool({
        description: "Performs a query-based search in the workspace.",
        parameters: z.object({
          query: z.string().describe("Search term to find relevant data"),
        }),
        execute: async ({ query }) => {
          return await searchData(query);
        },
      }),
    },
  });
  console.log("Gemini Output:", text);
  //throw new Error("Sudrisha's special error message");
  return {
    output: text || "No response",
    toolCallSummary: "No structured tools used yet", // You can refine this later
  };
  //   const res = await axios.post(
  //     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
  //     {
  //       contents: [{ parts: [{ text: prompt }] }],
  //     },
  //     {
  //       headers: { "Content-Type": "application/json" },
  //     }
  //   );

  //   const output =
  //     res.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  //   const toolCallSummary = "Simulated summary of tool used here"; // Optional: parse or extract if needed

  //   return { output, toolCallSummary };
}
