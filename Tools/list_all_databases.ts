// tools/list_all_databases.ts
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const notion = axios.create({
  baseURL: "https://api.notion.com/v1/",
  headers: {
    Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  },
});

export async function listAllDatabases(): Promise<any> {
  try {
    const response = await notion.post("search", {
      filter: {
        property: "object",
        value: "database",
      },
    });

    return response.data.results;
  } catch (error: any) {
    console.error(
      "Failed to list databases:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Optional: Example usage when running the file directly
if (require.main === module) {
  (async () => {
    const databases = await listAllDatabases();
    console.log(JSON.stringify(databases, null, 2));
  })();
}
