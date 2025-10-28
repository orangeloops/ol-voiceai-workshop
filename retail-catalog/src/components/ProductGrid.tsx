"use client"

import type { Product } from "@/lib/types"
import { ProductCard } from "./ProductCard"
import { SkeletonCard } from "./SkeletonCard"
import { EmptyState } from "./EmptyState"
import { ErrorState } from "./ErrorState"

interface ProductGridProps {
  products: Product[]
  isLoading: boolean
  error: Error | null
  onProductClick: (product: Product) => void
  onRetry?: () => void
  onClearFilters?: () => void
}

export function ProductGrid({ products, isLoading, error, onProductClick, onRetry, onClearFilters }: ProductGridProps) {
  if (error) {
    return <ErrorState onRetry={onRetry} />
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        action={
          onClearFilters
            ? {
                label: "Clear filters",
                onClick: onClearFilters,
              }
            : undefined
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} onClick={() => onProductClick(product)} />
      ))}
    </div>
  )
}
