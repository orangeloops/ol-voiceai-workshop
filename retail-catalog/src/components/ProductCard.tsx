"use client"

import type { Product } from "@/lib/types"
import { formatPrice, getStockStatus } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const stockStatus = getStockStatus(product.stock)

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image_url || "/placeholder.svg"}
          alt={product.product_display_name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={stockStatus.variant} className="bg-background/90 backdrop-blur-sm">
            {stockStatus.label}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-balance line-clamp-2 group-hover:text-primary transition-colors">
          {product.product_display_name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">{formatPrice(product.price)}</p>
          <p className="text-xs text-muted-foreground">ID: {product.id}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
          {product.gender && <span>{product.gender}</span>}
          {product.base_colour && (
            <>
              <span>•</span>
              <span className="capitalize">{product.base_colour}</span>
            </>
          )}
          {product.season && (
            <>
              <span>•</span>
              <span>{product.season}</span>
            </>
          )}
          {product.usage && (
            <>
              <span>•</span>
              <span>{product.usage}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

