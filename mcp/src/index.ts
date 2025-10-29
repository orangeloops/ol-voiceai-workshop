import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { docsRouter } from "./routes/docs.js";
import { stockRouter } from "./routes/stock.js";
import { productsRouter } from "./routes/products.js";
import { categoriesRouter } from "./routes/categories.js";
import { attributesRouter } from "./routes/attributes.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from public directory (for .well-known and openapi.json)
app.use(express.static(path.join(__dirname, "..", "public")));

// Serve openapi.json from root
app.get("/openapi.json", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "openapi.json"));
});

app.get("/", (_req: Request, res: Response) => res.send("🟣 MCP Server running"));
app.get("/health", (_req: Request, res: Response) => res.json({ status: "ok", service: "mcp" }));

// legacy (si ya lo usabas):
app.use("/docs", docsRouter);
app.use("/query-stock", stockRouter);

// nuevos endpoints “humanos”:
app.use("/categories", categoriesRouter);
app.use("/attributes", attributesRouter);
app.use("/query-products", productsRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`✅ MCP listening on http://0.0.0.0:${port}`));
