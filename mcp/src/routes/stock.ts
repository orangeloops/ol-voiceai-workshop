import { Router, Request, Response } from "express";

export const stockRouter = Router();

// Helper to send SSE events
function sendSSE(res: Response, event: string, data: any) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// SSE endpoint: /query-stock/sse
stockRouter.get("/sse", async (req: Request, res: Response) => {
  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  try {
    const params = new URLSearchParams(req.query as Record<string, string>);
    const url = `http://backend:3001/api/stock?${params.toString()}`;

    console.log("🔌 SSE Proxy /query-stock/sse →", url);

    // Send initial event
    sendSSE(res, "status", { message: "Checking stock..." });

    const r = await fetch(url);
    const text = await r.text();

    if (!r.ok) {
      sendSSE(res, "error", { error: "Failed to fetch stock", status: r.status });
      res.end();
      return;
    }

    const stockData = JSON.parse(text);

    // Stream stock results
    if (Array.isArray(stockData)) {
      sendSSE(res, "count", { total: stockData.length });
      
      for (const item of stockData) {
        sendSSE(res, "stock", item);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } else {
      sendSSE(res, "stock", stockData);
    }

    // Send completion event
    sendSSE(res, "done", { message: "Stock check complete" });
    res.end();

  } catch (err) {
    console.error("❌ MCP /query-stock/sse error:", err);
    sendSSE(res, "error", { error: "Internal server error" });
    res.end();
  }
});

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