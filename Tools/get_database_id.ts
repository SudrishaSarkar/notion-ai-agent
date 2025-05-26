import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function getDatabaseIdByName(database_name: string) {
  if (!database_name || typeof database_name !== "string") {
    console.error("❌ Invalid database_name input:", database_name);
    throw new Error("Invalid database_name input: must be a non-empty string.");
  }

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

    const databases = response.data.results;

    console.log(`🔎 Searching for: "${database_name}"`);
    databases.forEach((db: any) => {
      const title = db.title?.[0]?.plain_text || "(no title)";
      console.log(`• Found: ${title} (${db.id})`);
    });

    const match = databases.find((db: any) => {
      if (db.object !== "database") return false;

      const titleArray = db.title;
      if (!titleArray || titleArray.length === 0) return false;

      const plainText = titleArray[0]?.plain_text;
      return (
        typeof plainText === "string" &&
        plainText.toLowerCase() === database_name.toLowerCase()
      );
    });

    if (!match) {
      throw new Error(`No database found with name: ${database_name}`);
    }

    console.log(`✅ Match found: ${match.title[0].plain_text} → ${match.id}`);
    return match.id;
  } catch (error: any) {
    console.error(
      "❌ Error fetching database ID:",
      error.response?.data || error.message
    );
    throw error;
  }
}
