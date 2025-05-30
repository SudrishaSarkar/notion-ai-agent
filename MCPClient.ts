// import {
//   McpServer,
//   ResourceTemplate,
// } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// // Create an MCP server
// const server = new McpServer({
//   name: "Demo",
//   version: "1.0.0",
// });

// const transport = new StdioServerTransport({
//   command: "node",
//   args: ["server.js"],
// });

// const client = new Client({
//   name: "example-client",
//   version: "1.0.0",
// });

// await client.connect(transport);

// //List prompts
// const prompts = await client.listPrompts();

// //get a prompt
// const prompt = await client.getPrompt({
//   name: "example-prompt",
//   arguments: {
//     arg1: "value1",
//   },
// });

// //list resources
// const resources = await client.listResources;

// //read a resource
// const resource = await client.getResource({
//   url: "file:///example.txt",
// });

// const result = await client.callTool({
//   name: "example-tool",
//   arguments: {
//     arg1: "value1",
//   },
// });
