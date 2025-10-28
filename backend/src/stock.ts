import { Router, Request, Response } from "express";
import { pool } from "./db.js";

export const stockRouter = Router();

/**
 * GET /api/stock?sku=HOD-BLU-LONG-PLN-M
 * or /api/stock?name=hoodie
 */
stockRouter.get("/", async (req: Request, res: Response) => {
  const { sku, name } = req.query as { sku?: string; name?: string };

  if (!sku && !name) {
    return res.status(400).json({ error: "sku or name required" });
  }

  try {
    let result;

    if (sku) {
      // search by SKU in product_variants
      result = await pool.query(
        `
        SELECT 
          v.sku,
          p.name AS product_name,
          p.category,
          v.color,
          v.sleeve,
          v.style,
          v.size,
          v.price,
          v.stock,
          v.image_url
        FROM product_variants v
        JOIN products p ON p.id = v.product_id
        WHERE v.sku = $1
        LIMIT 1;
        `,
        [sku]
      );
    } else {
      // search by product name (approximate match)
      result = await pool.query(
        `
        SELECT 
          v.sku,
          p.name AS product_name,
          p.category,
          v.color,
          v.sleeve,
          v.style,
          v.size,
          v.price,
          v.stock,
          v.image_url
        FROM product_variants v
        JOIN products p ON p.id = v.product_id
        WHERE p.name ILIKE '%' || $1 || '%'
        ORDER BY similarity(p.name, $1) DESC
        LIMIT 1;
        `,
        [name]
      );
    }

    if (result.rows.length === 0) {
      return res.json({ found: false });
    }

    res.json({
      found: true,
      ...result.rows[0],
    });
  } catch (err) {
    console.error("Error fetching stock:", err);
    res.status(500).json({ error: "Error fetching stock" });
  }
});