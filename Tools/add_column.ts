import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function addColumn(
  database_id: string,
  columnName: string,
  columnType: string
) {
  try {
    const response = await axios.patch(
      `https://api.notion.com/v1/databases/${database_id}`,
      {
        properties: {
          [columnName]: {
            type: columnType,
            [columnType]: {},
          },
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
    return {
      message: "new column added",
      columns: Object.keys(response.data.properties),
    };
  } catch (error: any) {
    console.error(
      "Error adding column:",
      error.response?.data || error.message
    );
    throw error;
  }
}
