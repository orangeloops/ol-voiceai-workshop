"use client"

import { useState } from "react"
import { FiltersPanel } from "@/components/FiltersPanel"
import { ProductGrid } from "@/components/ProductGrid"
import { SortDropdown } from "@/components/SortDropdown"
import { Pagination } from "@/components/Pagination"
import { QuickViewModal } from "@/components/QuickViewModal"
import { useProducts } from "@/hooks/useProducts"
import { useCatalogFilters } from "@/hooks/useCatalogFilters"
import type { Product } from "@/lib/types"

export default function HomePage() {
  const { data, isLoading, error, page, totalPages, total } = useProducts()
  const { clearFilters } = useCatalogFilters()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <FiltersPanel />

          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{total > 0 ? `${total} Products` : "Products"}</h1>
              <SortDropdown />
            </div>

            <ProductGrid
              products={data}
              isLoading={isLoading}
              error={error}
              onProductClick={setSelectedProduct}
              onClearFilters={clearFilters}
            />

            {!isLoading && !error && <Pagination currentPage={page} totalPages={totalPages} totalItems={total} />}
          </div>
        </div>
      </main>

      <QuickViewModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      />
    </>
  )
}
