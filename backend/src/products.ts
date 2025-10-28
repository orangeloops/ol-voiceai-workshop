import express, { Request, Response } from "express";
import { pool } from "./db.js";

export const productsRouter = express.Router();

/**
 * GET /api/products
 * Query params: category, color, sleeve, style, size, min_price, max_price, sku
 */
productsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const {
      category,
      color,
      sleeve,
      style,
      size,
      min_price,
      max_price,
      sku,
    } = req.query;

    const conditions: string[] = [];
    const values: any[] = [];

    // Filters dynamically
    if (category) {
      values.push(String(category));
      conditions.push(`p.category::text ILIKE $${values.length}`);
    }
    if (color) {
      values.push(String(color));
      conditions.push(`v.color::text ILIKE $${values.length}`);
    }
    if (sleeve) {
      values.push(String(sleeve));
      conditions.push(`v.sleeve::text ILIKE $${values.length}`);
    }
    if (style) {
      values.push(String(style));
      conditions.push(`v.style::text ILIKE $${values.length}`);
    }
    if (size) {
      values.push(String(size));
      conditions.push(`v.size::text ILIKE $${values.length}`);
    }
    if (min_price) {
      values.push(Number(min_price));
      conditions.push(`v.price >= $${values.length}`);
    }
    if (max_price) {
      values.push(Number(max_price));
      conditions.push(`v.price <= $${values.length}`);
    }
    if (sku) {
      values.push(String(sku));
      conditions.push(`v.sku = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT
        p.id AS product_id,
        p.slug,
        p.name,
        p.category,
        p.description,
        v.sku,
        v.color,
        v.sleeve,
        v.style,
        v.size,
        v.price,
        v.stock,
        v.image_url
      FROM products p
      JOIN product_variants v ON p.id = v.product_id
      ${whereClause}
      ORDER BY p.category, p.name
      LIMIT 100;
    `;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error fetching products" });
  }
});
