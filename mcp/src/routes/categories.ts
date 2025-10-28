import { Router, Request, Response } from "express";

export const categoriesRouter = Router();

/**
 * Proxy: /categories → backend /api/categories
 */
categoriesRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const r = await fetch("http://backend:3001/api/categories");
    const text = await r.text();

    try {
      const json = JSON.parse(text);
      return res.status(r.status).json(json);
    } catch {
      return res.status(r.status).send(text);
    }
  } catch (err) {
    console.error("❌ MCP /categories proxy error:", err);
    res.status(500).json({ error: "Error fetching categories via MCP" });
  }
});