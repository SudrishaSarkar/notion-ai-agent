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

export async function searchData(query: string): Promise<any[]> {
  try {
    const response = await notion.post("search", { query });

    return response.data.results;
  } catch (error: any) {
    console.error("Failed to search:", error.response?.data || error.message);
    throw error;
  }
}
