import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { productsRouter } from "./products.js";
import { stockRouter } from "./stock.js";
import { categoriesRouter } from "./categories.js";
import { attributesRouter } from "./attributes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_: Request, res: Response) => res.send("🟢 Backend OK"));
app.get("/health", (_: Request, res: Response) => res.json({ status: "ok", service: "backend" }));

app.use("/api/products", productsRouter);
app.use("/api/stock", stockRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/attributes", attributesRouter);

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`✅ Server running on http://0.0.0.0:${port}`));