// import { addRow } from "./add_row";
// import dotenv from "dotenv";
// import { generateText, tool } from "ai";
// import { z } from "zod";
// dotenv.config();

// describe("addRow", () => {
//   const testDatabaseId = "1f3f1f8ba66b8081a139fc10f00c29d5"; // Replace with an actual ID

//   it("should add a row to the Notion database", async () => {
//     const response = await addRowLogic(testDatabaseId, {
//       GoalName: {
//         title: [
//           {
//             text: {
//               content: "Test Row " + new Date().toISOString(),
//             },
//           },
//         ],
//       },
//     });

//     expect(response).toMatch(/^New row added: /);
//   });
// });
