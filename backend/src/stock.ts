import { Router, Request, Response } from "express";
import { pool } from "./db.js";

export const stockRouter = Router();

/**
 * GET /api/stock?id=12532
 * or /api/stock?name=puma
 */
stockRouter.get("/", async (req: Request, res: Response) => {
  const { id, name } = req.query as { id?: string; name?: string };

  if (!id && !name) {
    return res.status(400).json({ error: "id or name required" });
  }

  try {
    let result;

    if (id) {
      // search by product ID
      result = await pool.query(
        `
        SELECT 
          id,
          gender,
          master_category,
          sub_category,
          article_type,
          base_colour,
          season,
          year,
          usage,
          product_display_name,
          image_url,
          price,
          stock
        FROM products
        WHERE id = $1
        LIMIT 1;
        `,
        [Number(id)]
      );
    } else {
      // search by product name (approximate match)
      result = await pool.query(
        `
        SELECT 
          id,
          gender,
          master_category,
          sub_category,
          article_type,
          base_colour,
          season,
          year,
          usage,
          product_display_name,
          image_url,
          price,
          stock
        FROM products
        WHERE product_display_name ILIKE '%' || $1 || '%'
        ORDER BY 
          CASE 
            WHEN product_display_name ILIKE $1 || '%' THEN 1
            WHEN product_display_name ILIKE '%' || $1 || '%' THEN 2
            ELSE 3
          END
        LIMIT 5;
        `,
        [name]
      );
    }

    if (result.rows.length === 0) {
      return res.json({ found: false });
    }

    // Si buscamos por ID, devolvemos un solo resultado
    if (id) {
      res.json({
        found: true,
        ...result.rows[0],
      });
    } else {
      // Si buscamos por nombre, devolvemos múltiples resultados
      res.json({
        found: true,
        count: result.rows.length,
        products: result.rows,
      });
    }
  } catch (err) {
    console.error("Error fetching stock:", err);
    res.status(500).json({ error: "Error fetching stock" });
  }
});
