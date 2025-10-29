import { Router, Request, Response } from "express";

export const productsRouter = Router();

// Helper to send SSE events
function sendSSE(res: Response, event: string, data: any) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// SSE endpoint: /query-products/sse
productsRouter.get("/sse", async (req: Request, res: Response) => {
  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering

  try {
    const params = new URLSearchParams(req.query as Record<string, string>);
    const backendUrl = `http://backend:3001/api/products?${params.toString()}`;

    console.log("🔌 SSE Proxy /query-products/sse →", backendUrl);

    // Send initial event
    sendSSE(res, "status", { message: "Searching products..." });

    const r = await fetch(backendUrl);
    const text = await r.text();

    console.log("⬅️  Backend status:", r.status);

    if (!r.ok) {
      sendSSE(res, "error", { error: "Failed to fetch products", status: r.status });
      res.end();
      return;
    }

    const products = JSON.parse(text);

    // Send products count
    sendSSE(res, "count", { total: products.length });

    // Stream products one by one (or in chunks)
    const chunkSize = 5;
    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize);
      sendSSE(res, "products", chunk);
      
      // Small delay to simulate streaming (optional)
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Send completion event
    sendSSE(res, "done", { message: "Search complete", total: products.length });
    res.end();

  } catch (err) {
    console.error("❌ MCP /query-products/sse error:", err);
    sendSSE(res, "error", { error: "Internal server error" });
    res.end();
  }
});

// Regular JSON endpoint: /query-products → backend /api/products
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
