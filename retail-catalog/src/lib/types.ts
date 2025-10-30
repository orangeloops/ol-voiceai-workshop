export type Product = {
  id: number
  gender: string | null
  master_category: string
  sub_category: string
  article_type: string
  base_colour: string | null
  season: string | null
  year: number | null
  usage: string | null
  product_display_name: string
  image_url: string
  price: string
  stock: number
}

export type Attributes = {
  genders: string[]
  master_categories: string[]
  sub_categories: string[]
  article_types: string[]
  colours: string[]
  seasons: string[]
  usages: string[]
}

export type FilterState = {
  gender?: string
  master_category?: string
  sub_category?: string
  article_type?: string
  base_colour?: string[]
  season?: string
  usage?: string
  year?: number
  min_price?: string
  max_price?: string
  search?: string
  page?: number
  sort?: "relevance" | "price-asc" | "price-desc" | "stock"
}

