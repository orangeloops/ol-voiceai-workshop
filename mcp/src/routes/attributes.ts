import { Router, Request, Response } from "express";

export const attributesRouter = Router();

// Helper to send SSE events
function sendSSE(res: Response, event: string, data: any) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// SSE endpoint: /attributes/sse
attributesRouter.get("/sse", async (req: Request, res: Response) => {
  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  try {
    const params = new URLSearchParams(req.query as Record<string, string>);
    const url = `http://backend:3001/api/attributes?${params.toString()}`;

    sendSSE(res, "status", { message: "Fetching attributes..." });

    const r = await fetch(url);
    const text = await r.text();

    if (!r.ok) {
      sendSSE(res, "error", { error: "Failed to fetch attributes", status: r.status });
      res.end();
      return;
    }

    const attributes = JSON.parse(text);
    sendSSE(res, "attributes", attributes);
    sendSSE(res, "done", { message: "Attributes loaded" });
    res.end();

  } catch (err) {
    console.error("❌ MCP /attributes/sse error:", err);
    sendSSE(res, "error", { error: "Internal server error" });
    res.end();
  }
});

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