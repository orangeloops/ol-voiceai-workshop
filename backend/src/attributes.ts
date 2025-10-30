import { Router, Request, Response } from "express";
import { pool } from "./db.js";

export const attributesRouter = Router();

/**
 * GET /api/attributes?master_category=Apparel (opcional)
 * Devuelve los posibles valores para todos los atributos del catálogo.
 * Si pasás master_category, filtra los valores a solo los presentes para esa categoría.
 */
attributesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { master_category } = req.query as { master_category?: string };

    // Usar la vista para obtener todos los atributos disponibles
    const attrSql = `SELECT * FROM product_attributes;`;
    const attrResult = await pool.query(attrSql);
    
    if (attrResult.rows.length === 0) {
      return res.json({
        genders: [],
        master_categories: [],
        sub_categories: [],
        article_types: [],
        colours: [],
        seasons: [],
        usages: [],
      });
    }

    const attrs = attrResult.rows[0];

    // Si se filtró por master_category, obtener valores específicos
    if (master_category) {
      const filterSql = `
        SELECT 
          ARRAY_AGG(DISTINCT gender ORDER BY gender) FILTER (WHERE gender IS NOT NULL) as genders,
          ARRAY_AGG(DISTINCT sub_category ORDER BY sub_category) as sub_categories,
          ARRAY_AGG(DISTINCT article_type ORDER BY article_type) as article_types,
          ARRAY_AGG(DISTINCT base_colour ORDER BY base_colour) FILTER (WHERE base_colour IS NOT NULL) as colours,
          ARRAY_AGG(DISTINCT season ORDER BY season) FILTER (WHERE season IS NOT NULL) as seasons,
          ARRAY_AGG(DISTINCT usage ORDER BY usage) FILTER (WHERE usage IS NOT NULL) as usages
        FROM products
        WHERE master_category ILIKE $1;
      `;
      const filterResult = await pool.query(filterSql, [master_category]);
      const filtered = filterResult.rows[0];

      return res.json({
        genders: filtered.genders || [],
        master_categories: [master_category],
        sub_categories: filtered.sub_categories || [],
        article_types: filtered.article_types || [],
        colours: filtered.colours || [],
        seasons: filtered.seasons || [],
        usages: filtered.usages || [],
      });
    }

    // Sin filtro, devolver todos
    res.json({
      genders: attrs.genders || [],
      master_categories: attrs.master_categories || [],
      sub_categories: attrs.sub_categories || [],
      article_types: attrs.article_types || [],
      colours: attrs.colours || [],
      seasons: attrs.seasons || [],
      usages: attrs.usages || [],
    });
  } catch (err) {
    console.error("Error fetching attributes:", err);
    res.status(500).json({ error: "Error fetching attributes" });
  }
});

