import { Router, Request, Response } from "express";
import { pool } from "./db.js";

export const categoriesRouter = Router();

/**
 * GET /api/categories
 * Devuelve todas las categorías definidas en el ENUM (no solo las que tienen productos)
 */
categoriesRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const sql = `SELECT unnest(enum_range(NULL::category_enum)) AS category;`;
    const { rows } = await pool.query(sql);
    res.json(rows.map(r => r.category));
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Error fetching categories" });
  }
});
