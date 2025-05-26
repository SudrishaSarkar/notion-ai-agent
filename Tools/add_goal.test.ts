import dotenv from "dotenv";
dotenv.config();
import { addRow } from "./add_row";
import { getDatabaseIdByName } from "./get_database_id";
import { listRows } from "./list_rows";

describe("Add goal to 'Goal Tracker' database", () => {
  let databaseId: string;

  beforeAll(async () => {
    databaseId = await getDatabaseIdByName("Goal Tracker");
    expect(databaseId).toBeTruthy();
  });

  it("should add a goal with correct fields", async () => {
    const properties = {
      GoalName: {
        title: [
          {
            text: {
              content: "Organize quarterly team event",
            },
          },
        ],
      },
      DueDate: {
        date: {
          start: "2025-05-30",
        },
      },
      Priority: {
        select: {
          name: "Medium",
        },
      },
    };

    const result = await addRow(databaseId, properties);
    expect(result).toMatch(/New row added:/);

    const rows = await listRows(databaseId);
    const added = rows.find(
      (row: any) =>
        row.properties?.GoalName?.title?.[0]?.text?.content ===
        "Organize quarterly team event"
    );

    expect(added).toBeDefined();
    expect(added.properties.Priority.select.name).toBe("Medium");
    expect(added.properties.DueDate.date.start).toBe("2025-05-30");
  });
});
