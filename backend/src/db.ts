import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.POSTGRES_USER || "workshop",
  host: process.env.POSTGRES_HOST || "postgres",
  database: process.env.POSTGRES_DB || "store",
  password: process.env.POSTGRES_PASSWORD || "workshop",
  port: Number(process.env.POSTGRES_PORT) || 5432,
});
