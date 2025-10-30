import { Router, Request, Response } from "express";
import { pool } from "./db.js";

export const categoriesRouter = Router();

/**
 * GET /api/categories
 * Devuelve todas las categorías principales (master_category) disponibles
 */
categoriesRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const sql = `SELECT DISTINCT master_category FROM products ORDER BY master_category;`;
    const { rows } = await pool.query(sql);
    res.json(rows.map(r => r.master_category));
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Error fetching categories" });
  }
});

