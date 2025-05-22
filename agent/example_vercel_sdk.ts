// import { generateObject } from "ai";
// import { z } from "zod";
// import { google } from "@ai-sdk/google";

// export async function generateLasagnaRecipe() {
//   const { object } = await generateObject({
//     model: google("gemini-2.0-flash"),
//     schema: z.object({
//       recipe: z.object({
//         name: z.string(),
//         ingredients: z.array(
//           z.object({ name: z.string(), amount: z.string() })
//         ),
//         steps: z.array(z.string()),
//       }),
//     }),
//     prompt: "Generate a lasagna recipe.",
//   });
//   console.log("Generated Recipe:", object);
// }
