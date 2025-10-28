import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
export const docsRouter = Router();

docsRouter.get("/", (_: Request, res: Response) => {
  const docsPath = process.env.DOCS_PATH || path.join(process.cwd(), "docs");
  try {
    const files = fs.readdirSync(docsPath);
    const docs = files
      .filter((f) => f.endsWith(".md"))
      .map((f) => ({
        name: f,
        content: fs.readFileSync(path.join(docsPath, f), "utf8"),
      }));
    res.json({ count: docs.length, docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error reading docs", details: String(err) });
  }
});

docsRouter.get("/:name", (req: Request, res: Response) => {
  const docsPath = process.env.DOCS_PATH || path.join(process.cwd(), "docs");
  const name = req.params.name;
  try {
    const full = path.join(docsPath, name);
    if (!fs.existsSync(full)) return res.status(404).json({ error: "not found" });
    const content = fs.readFileSync(full, "utf8");
    res.json({ name, content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error reading doc", details: String(err) });
  }
});
