import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { docsRouter } from "./routes/docs.js";
import { stockRouter } from "./routes/stock.js";
import { productsRouter } from "./routes/products.js";
import { categoriesRouter } from "./routes/categories.js";
import { attributesRouter } from "./routes/attributes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

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
