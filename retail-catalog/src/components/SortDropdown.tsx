"use client"

import { ArrowUpDown } from "lucide-react"
import { useCatalogFilters } from "@/hooks/useCatalogFilters"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SortDropdown() {
  const { filters, updateFilters } = useCatalogFilters()

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={filters.sort || "relevance"} onValueChange={(value) => updateFilters({ sort: value as any })}>
        <SelectTrigger className="w-[180px] bg-transparent">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="stock">Stock</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
