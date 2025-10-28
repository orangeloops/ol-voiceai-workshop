"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import type { FilterState } from "@/lib/types"

export function useCatalogFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const filters: FilterState = {
    category: searchParams.get("category") || undefined,
    color: searchParams.getAll("color") || undefined,
    sleeve: searchParams.get("sleeve") || undefined,
    style: searchParams.get("style") || undefined,
    size: searchParams.getAll("size") || undefined,
    min_price: searchParams.get("min_price") || undefined,
    max_price: searchParams.get("max_price") || undefined,
    search: searchParams.get("search") || undefined,
    page: Number(searchParams.get("page")) || 1,
    sort: (searchParams.get("sort") as FilterState["sort"]) || "relevance",
  }

  const updateFilters = useCallback(
    (updates: Partial<FilterState>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        params.delete(key)

        if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
          return
        }

        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)))
        } else {
          params.set(key, String(value))
        }
      })

      // Reset to page 1 when filters change (except when explicitly setting page)
      if (!("page" in updates)) {
        params.delete("page")
      }

      router.push(`/?${params.toString()}`)
    },
    [router, searchParams],
  )

  const clearFilters = useCallback(() => {
    router.push("/")
  }, [router])

  return {
    filters,
    updateFilters,
    clearFilters,
  }
}
