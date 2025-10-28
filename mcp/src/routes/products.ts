import { Router, Request, Response } from "express";

export const productsRouter = Router();

// Proxy: /query-products → backend /api/products
productsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const params = new URLSearchParams(req.query as Record<string, string>);
    const backendUrl = `http://backend:3001/api/products?${params.toString()}`;

    console.log("🔌 Proxy /query-products →", backendUrl);

    const r = await fetch(backendUrl);
    const text = await r.text();

    // log ayuda a ver qué está volviendo el backend
    console.log("⬅️  Backend status:", r.status, "body:", text.slice(0, 300));

    // devolver tal cual (JSON si es JSON, texto si no)
    try {
      const json = JSON.parse(text);
      return res.status(r.status).json(json);
    } catch {
      return res.status(r.status).send(text);
    }
  } catch (err) {
    console.error("❌ MCP /query-products proxy error:", err);
    res.status(500).json({ error: "Error fetching products via MCP" });
  }
});
