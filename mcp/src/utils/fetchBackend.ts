import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3001';

export async function fetchStock(sku?: string, name?: string) {
  const url = new URL('/api/stock', BACKEND_URL);
  if (sku) url.searchParams.set('sku', sku);
  if (name) url.searchParams.set('name', name);
  const res = await fetch(url.toString());
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`backend error: ${res.status} ${txt}`);
  }
  const j = await res.json();
  return j;
}
