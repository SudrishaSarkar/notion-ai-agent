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

export async function setName(
  pageId: string,
  newName: string
): Promise<string> {
  try {
    await notion.patch(`pages/${pageId}`, {
      properties: {
        title: {
          title: [
            {
              text: {
                content: newName,
              },
            },
          ],
        },
      },
    });

    return `Name updated to "${newName}"`;
  } catch (error: any) {
    console.error("Failed to set name:", error.response?.data || error.message);
    throw error;
  }
}
