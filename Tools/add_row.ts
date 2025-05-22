// tools/add_row.ts
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

export async function addRow(
  databaseId: string,
  properties: any
): Promise<string> {
  try {
    const response = await notion.post("pages", {
      parent: { database_id: databaseId },
      properties,
    });
    return `New row added: ${response.data.id}`;
  } catch (error: any) {
    console.error("Failed to add row:", error.response?.data || error.message);
    throw error;
  }
}

if (require.main === module) {
  (async () => {
    const result = await addRow("your_database_id_here", {
      Name: {
        title: [
          {
            text: {
              content: "Example Row",
            },
          },
        ],
      },
    });
    console.log(result);
  })();
}
