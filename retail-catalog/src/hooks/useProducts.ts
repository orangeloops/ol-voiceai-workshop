"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { fetchProducts } from "@/lib/api"
import type { Product } from "@/lib/types"

const ITEMS_PER_PAGE = 24

export function useProducts() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const page = Number(searchParams.get("page")) || 1
  const sort = searchParams.get("sort") || "relevance"

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const params: Record<string, string | string[] | undefined> = {
          gender: searchParams.get("gender") || undefined,
          master_category: searchParams.get("master_category") || undefined,
          sub_category: searchParams.get("sub_category") || undefined,
          article_type: searchParams.get("article_type") || undefined,
          base_colour: searchParams.getAll("base_colour") || undefined,
          season: searchParams.get("season") || undefined,
          usage: searchParams.get("usage") || undefined,
          year: searchParams.get("year") || undefined,
          min_price: searchParams.get("min_price") || undefined,
          max_price: searchParams.get("max_price") || undefined,
          search: searchParams.get("search") || undefined,
        }

        let products = await fetchProducts(params)

        // Client-side sorting
        if (sort === "price-asc") {
          products = products.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
        } else if (sort === "price-desc") {
          products = products.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
        } else if (sort === "stock") {
          products = products.sort((a, b) => b.stock - a.stock)
        }

        setData(products)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load products"))
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [searchParams, sort])

  // Client-side pagination
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedData = data.slice(startIndex, endIndex)
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)

  return {
    data: paginatedData,
    allData: data,
    isLoading,
    error,
    page,
    totalPages,
    total: data.length,
  }
}
