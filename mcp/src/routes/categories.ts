import { Router, Request, Response } from "express";

export const categoriesRouter = Router();

// Helper to send SSE events
function sendSSE(res: Response, event: string, data: any) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// SSE endpoint: /categories/sse
categoriesRouter.get("/sse", async (_req: Request, res: Response) => {
  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  try {
    sendSSE(res, "status", { message: "Fetching categories..." });

    const r = await fetch("http://backend:3001/api/categories");
    const text = await r.text();

    if (!r.ok) {
      sendSSE(res, "error", { error: "Failed to fetch categories", status: r.status });
      res.end();
      return;
    }

    const categories = JSON.parse(text);
    sendSSE(res, "categories", categories);
    sendSSE(res, "done", { message: "Categories loaded" });
    res.end();

  } catch (err) {
    console.error("❌ MCP /categories/sse error:", err);
    sendSSE(res, "error", { error: "Internal server error" });
    res.end();
  }
});

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