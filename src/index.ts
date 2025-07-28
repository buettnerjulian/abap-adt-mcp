#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import path from "path";
import dotenv from "dotenv";

// Import tool definitions
import { toolDefinitions } from "./toolDefinitions";

// Import shared utility functions and types
import { return_error, return_response } from "./lib/utils";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Interface for SAP configuration
export interface SapConfig {
  url: string;
  username: string;
  password: string;
  client: string;
}

/**
 * Retrieves SAP configuration from environment variables.
 *
 * @returns {SapConfig} The SAP configuration object.
 * @throws {Error} If any required environment variable is missing.
 */
export function getConfig(): SapConfig {
  const url = process.env.SAP_URL;
  const username = process.env.SAP_USERNAME;
  const password = process.env.SAP_PASSWORD;
  const client = process.env.SAP_CLIENT;

  // Check if all required environment variables are set
  if (!url || !username || !password || !client) {
    throw new Error(`Missing required environment variables. Required variables:
- SAP_URL
- SAP_USERNAME
- SAP_PASSWORD
- SAP_CLIENT`);
  }

  return { url, username, password, client };
}

/**
 * Server class for interacting with ABAP systems via ADT.
 */
export class mcp_abap_adt_server {
  private server: Server; // Instance of the MCP server
  private sapConfig: SapConfig; // SAP configuration

  /**
   * Constructor for the mcp_abap_adt_server class.
   */
  constructor() {
    this.sapConfig = getConfig(); // Load SAP configuration
    this.server = new Server( // Initialize the MCP server
      {
        name: "abap-adt-mcp", // Server name
        version: "0.1.0", // Server version
      },
      {
        capabilities: {
          tools: {}, // Initially, no tools are registered
        },
      }
    );

    this.setupHandlers(); // Setup request handlers
  }

  /**
   * Sets up request handlers for listing and calling tools.
   * @private
   */
  private setupHandlers() {
    // Handler for ListToolsRequest
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: toolDefinitions.map(({ name, description, inputSchema }) => ({
          name,
          description,
          inputSchema,
        })),
      };
    });

    // Handler for CallToolRequest
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const tool = toolDefinitions.find(
          (t) => t.name === request.params.name
        );
        if (!tool) {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
        }

        // Required parameter check (only supporting required parameters)
        const args = request.params.arguments || {};
        if (Array.isArray(tool.inputSchema.required)) {
          for (const reqKey of tool.inputSchema.required) {
            if (args[reqKey] === undefined) {
              throw new McpError(
                ErrorCode.InvalidParams,
                `Missing required parameter: ${reqKey}`
              );
            }
          }
        }

        // Type-safe handler call
        return await tool.handler(args as any);
      } catch (error) {
        return return_error(error);
      }
    });

    // Handle server shutdown on SIGINT (Ctrl+C)
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Starts the MCP server and connects it to the transport.
   */
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Create and run the server
const server = new mcp_abap_adt_server();
server.run().catch((error) => {
  process.exit(1);
});
