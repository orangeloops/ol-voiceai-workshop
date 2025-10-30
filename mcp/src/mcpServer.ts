import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  CallToolRequest,
  ReadResourceRequest,
  ErrorCode,
  McpError
} from "@modelcontextprotocol/sdk/types.js";
import { fetchBackend } from "./utils/fetchBackend.js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = process.env.BACKEND_URL || "http://backend:3001";

// Create MCP server
export const server = new Server(
  {
    name: "workshop-retail-catalog",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "query_products",
        description: "Search and filter products by various criteria including categories, attributes, price range, and stock availability",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Filter by category name (e.g., 'Footwear', 'Apparel', 'Accessories')"
            },
            attributes: {
              type: "object",
              description: "Filter by product attributes (e.g., {'Color': 'Black', 'Size': 'M'})",
              additionalProperties: { type: "string" }
            },
            minPrice: {
              type: "number",
              description: "Minimum price filter"
            },
            maxPrice: {
              type: "number",
              description: "Maximum price filter"
            },
            inStock: {
              type: "boolean",
              description: "Filter for products in stock"
            },
            limit: {
              type: "number",
              description: "Maximum number of results to return (default: 20)"
            }
          }
        }
      },
      {
        name: "query_stock",
        description: "Check stock availability for a specific product by product ID",
        inputSchema: {
          type: "object",
          properties: {
            productId: {
              type: "string",
              description: "The unique identifier of the product"
            }
          },
          required: ["productId"]
        }
      },
      {
        name: "get_categories",
        description: "Get all available product categories",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "get_attributes",
        description: "Get all available product attributes (e.g., colors, sizes, materials)",
        inputSchema: {
          type: "object",
          properties: {}
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "query_products": {
        const queryParams = new URLSearchParams();
        
        if (args && typeof args === "object") {
          const params = args as any;
          
          if (params.category) queryParams.append("category", params.category);
          if (params.minPrice) queryParams.append("minPrice", params.minPrice.toString());
          if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice.toString());
          if (params.inStock !== undefined) queryParams.append("inStock", params.inStock.toString());
          if (params.limit) queryParams.append("limit", params.limit.toString());
          
          if (params.attributes && typeof params.attributes === "object") {
            for (const [key, value] of Object.entries(params.attributes)) {
              queryParams.append(`attr_${key}`, value as string);
            }
          }
        }

        const url = `${BACKEND_URL}/api/products?${queryParams.toString()}`;
        const data = await fetchBackend(url);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      }

      case "query_stock": {
        if (!args || typeof args !== "object" || !(args as any).productId) {
          throw new Error("productId is required");
        }

        const url = `${BACKEND_URL}/api/stock/${(args as any).productId}`;
        const data = await fetchBackend(url);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      }

      case "get_categories": {
        const url = `${BACKEND_URL}/api/categories`;
        const data = await fetchBackend(url);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      }

      case "get_attributes": {
        const url = `${BACKEND_URL}/api/attributes`;
        const data = await fetchBackend(url);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    };
  }
});

// List available resources (documentation files)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const docsDir = path.join(__dirname, "..", "docs");
  const files = await fs.readdir(docsDir);
  
  const resources = files
    .filter((file: string) => file.endsWith(".txt"))
    .map((file: string) => ({
      uri: `file://docs/${file}`,
      name: file.replace(".txt", "").replace(/_/g, " "),
      description: `Policy document: ${file.replace(".txt", "").replace(/_/g, " ")}`,
      mimeType: "text/plain"
    }));

  return { resources };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest) => {
  const uri = request.params.uri;
  
  if (!uri.startsWith("file://docs/")) {
    throw new Error("Invalid resource URI");
  }

  const filename = uri.replace("file://docs/", "");
  const filePath = path.join(__dirname, "..", "docs", filename);

  try {
    const content = await fs.readFile(filePath, "utf-8");
    
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: content
        }
      ]
    };
  } catch (error) {
    throw new Error(`Failed to read resource: ${error instanceof Error ? error.message : String(error)}`);
  }
});
