export type Category = "hoodies" | "shirts" | "jeans" | "jackets" | "pants"

export type Product = {
  product_id: string
  slug: string
  name: string
  category: Category
  description: string
  sku: string
  color: string
  sleeve: "long" | "short" | "sleeveless" | null
  style: "plain" | "printed" | "embroidered" | null
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL"
  price: string
  stock: number
  image_url: string
}

export type Attributes = {
  colors: string[]
  sleeve: string[]
  style: string[]
  size: string[]
}

export type FilterState = {
  category?: string
  color?: string[]
  sleeve?: string
  style?: string
  size?: string[]
  min_price?: string
  max_price?: string
  search?: string
  page?: number
  sort?: "relevance" | "price-asc" | "price-desc" | "stock"
}
