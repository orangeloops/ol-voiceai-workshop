import { Router, Request, Response } from "express";

export const stockRouter = Router();

/**
 * Proxy: /query-stock -> backend /api/stock
 * Acepta: ?sku=... o ?name=...
 */
stockRouter.get("/", async (req: Request, res: Response) => {
  try {
    const params = new URLSearchParams(req.query as Record<string, string>);
    const url = `http://backend:3001/api/stock?${params.toString()}`;

    const r = await fetch(url);
    const text = await r.text();

    // Si backend responde JSON, devolvelo tal cual
    try {
      const json = JSON.parse(text);
      return res.status(r.status).json(json);
    } catch {
      // Si no es JSON, devolvemos texto (por si hay error plano)
      return res.status(r.status).send(text);
    }
  } catch (err) {
    console.error("❌ MCP /query-stock proxy error:", err);
    res.status(500).json({ error: "Error fetching stock via MCP" });
  }
});