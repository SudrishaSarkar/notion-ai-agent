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

export async function addPage(title: string): Promise<string> {
  try {
    const response = await notion.post("pages", {
      parent: { type: "workspace" },
      properties: {
        title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
    });

    return `New page added: ${response.data.id}`;
  } catch (error: any) {
    console.error("Failed to add page:", error.response?.data || error.message);
    throw error;
  }
}
