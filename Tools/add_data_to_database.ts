import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function addDataToDatabase(database_id: string, properties: any) {
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
