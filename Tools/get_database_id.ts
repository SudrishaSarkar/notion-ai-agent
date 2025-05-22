import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function getDatabaseIdByName(database_name: string) {
  try {
    const response = await axios.post(
      "https://api.notion.com/v1/search",
      {
        query: database_name,
        filter: {
          value: "database",
          property: "object",
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
    const database = response.data.results.find(
      (db: any) =>
        db.object === "database" && db.title[0]?.plain_text === database_name
    );
    return database?.id || null;
  } catch (error: any) {
    console.error(
      "Error fetching database ID:",
      error.response?.data || error.message
    );
    throw error;
  }
}
