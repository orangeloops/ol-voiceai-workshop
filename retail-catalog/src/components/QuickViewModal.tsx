"use client"

import type { Product } from "@/lib/types"
import { formatPrice, getStockStatus } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mic } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface QuickViewModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
  if (!product) return null

  const stockStatus = getStockStatus(product.stock)

  const handleAskByVoice = () => {
    // Dispatch custom event for voice agent
    window.dispatchEvent(
      new CustomEvent("voiceAgent:suggest", {
        detail: {
          context: {
            id: product.id,
            name: product.product_display_name,
            master_category: product.master_category,
            article_type: product.article_type,
            color: product.base_colour,
            price: product.price,
            stock: product.stock,
          },
        },
      }),
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-balance">{product.product_display_name}</DialogTitle>
          <DialogDescription>ID: {product.id}</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.product_display_name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
              <Badge variant={stockStatus.variant} className="mt-2">
                {stockStatus.label} ({product.stock} units)
              </Badge>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Details</h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-muted-foreground">Category:</dt>
                <dd className="capitalize font-medium">{product.master_category}</dd>

                <dt className="text-muted-foreground">Sub Category:</dt>
                <dd className="capitalize font-medium">{product.sub_category}</dd>

                <dt className="text-muted-foreground">Article Type:</dt>
                <dd className="capitalize font-medium">{product.article_type}</dd>

                {product.gender && (
                  <>
                    <dt className="text-muted-foreground">Gender:</dt>
                    <dd className="font-medium">{product.gender}</dd>
                  </>
                )}

                {product.base_colour && (
                  <>
                    <dt className="text-muted-foreground">Color:</dt>
                    <dd className="capitalize font-medium">{product.base_colour}</dd>
                  </>
                )}

                {product.season && (
                  <>
                    <dt className="text-muted-foreground">Season:</dt>
                    <dd className="font-medium">{product.season}</dd>
                  </>
                )}

                {product.usage && (
                  <>
                    <dt className="text-muted-foreground">Usage:</dt>
                    <dd className="font-medium">{product.usage}</dd>
                  </>
                )}

                {product.year && (
                  <>
                    <dt className="text-muted-foreground">Year:</dt>
                    <dd className="font-medium">{product.year}</dd>
                  </>
                )}
              </dl>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <Button onClick={handleAskByVoice} variant="outline" className="w-full bg-transparent">
                <Mic className="h-4 w-4 mr-2" />
                Ask stock by voice
              </Button>
              <Button asChild className="w-full">
                <Link href={`/product/${product.id}`}>View full details</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

