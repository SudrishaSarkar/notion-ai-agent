import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function getColumnList(database_id: string) {
  try {
    const response = await axios.get(
      `https://api.notion.com/v1/databases/${database_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
        },
      }
    );
    return Object.keys(response.data.properties);
  } catch (error: any) {
    console.error(
      "Error fetching column list:",
      error.response?.data || error.message
    );
    throw error;
  }
}
