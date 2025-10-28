import { API_BASE } from "./config"
import type { Product, Attributes } from "./types"

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/categories`, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }
  return response.json()
}

export async function fetchAttributes(category?: string): Promise<Attributes> {
  const params = new URLSearchParams()
  if (category) {
    params.set("category", category)
  }
  const response = await fetch(`${API_BASE}/attributes?${params.toString()}`, {
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error("Failed to fetch attributes")
  }
  return response.json()
}

export async function fetchProducts(
  params: Record<string, string | number | string[] | undefined>,
): Promise<Product[]> {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)))
      } else {
        searchParams.set(key, String(value))
      }
    }
  })

  const response = await fetch(`${API_BASE}/products?${searchParams.toString()}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }

  return response.json()
}
