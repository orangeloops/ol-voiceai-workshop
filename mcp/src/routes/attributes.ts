import { Router, Request, Response } from "express";

export const attributesRouter = Router();

/**
 * Proxy: /attributes -> backend /api/attributes
 * Opcional: ?category=hoodies
 */
attributesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const params = new URLSearchParams(req.query as Record<string, string>);
    const url = `http://backend:3001/api/attributes?${params.toString()}`;

    const r = await fetch(url);
    const text = await r.text();

    try {
      const json = JSON.parse(text);
      return res.status(r.status).json(json);
    } catch {
      return res.status(r.status).send(text);
    }
  } catch (err) {
    console.error("❌ MCP /attributes proxy error:", err);
    res.status(500).json({ error: "Error fetching attributes via MCP" });
  }
});