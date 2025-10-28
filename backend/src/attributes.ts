import { Router, Request, Response } from "express";
import { pool } from "./db.js";

export const attributesRouter = Router();

/**
 * GET /api/attributes?category=hoodies (opcional)
 * Devuelve los posibles valores para color (distintos en variantes),
 * y los enums (sleeve/style/size). Si pasás category, filtra los colors
 * a solo los presentes para esa categoría.
 */
attributesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { category } = req.query as { category?: string };

    // enums completos desde tipos
    const enumsSql = `
      SELECT
        (SELECT array_agg(val) FROM unnest(enum_range(NULL::sleeve_enum)) AS val) AS sleeve,
        (SELECT array_agg(val) FROM unnest(enum_range(NULL::style_enum))  AS val) AS style,
        (SELECT array_agg(val) FROM unnest(enum_range(NULL::size_enum))   AS val) AS size
    `;
    const enums = await pool.query(enumsSql);

    // colores: o globales o filtrados por categoría
    let colorsSql = `
      SELECT DISTINCT v.color
      FROM product_variants v
      JOIN products p ON p.id = v.product_id
    `;
    const params: any[] = [];
    if (category) {
      params.push(String(category));
      colorsSql += ` WHERE p.category::text ILIKE $1`;
    }
    colorsSql += ` ORDER BY 1`;

    const colors = await pool.query(colorsSql, params);

    res.json({
      colors: colors.rows.map(r => r.color),
      sleeve: enums.rows[0].sleeve,
      style:  enums.rows[0].style,
      size:   enums.rows[0].size,
    });
  } catch (err) {
    console.error("Error fetching attributes:", err);
    res.status(500).json({ error: "Error fetching attributes" });
  }
});
