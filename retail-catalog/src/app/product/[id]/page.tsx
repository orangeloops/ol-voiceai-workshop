import { notFound } from "next/navigation"
import { fetchProducts } from "@/lib/api"
import { formatPrice, getStockStatus } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductPageProps {
  params: Promise<{ id: string }>
}


export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  console.log('ProductPage - Received ID from params:', id, 'Type:', typeof id)

  // Buscar el producto directamente por ID
  const idNumber = Number(id)
  console.log('ProductPage - Searching for ID:', idNumber, 'Type:', typeof idNumber)
  
  const products = await fetchProducts({ id: idNumber })
  console.log('ProductPage - API returned', products.length, 'products')
  
  const product = products[0]
  
  if (!product) {
    console.log('ProductPage - No product found with ID:', idNumber)
    notFound()
  }

  console.log('ProductPage - Found product:', {
    id: product.id,
    name: product.product_display_name,
    stock: product.stock
  })
  const stockStatus = getStockStatus(product.stock)

  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to catalog
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.product_display_name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">{product.product_display_name}</h1>
            <p className="text-sm text-muted-foreground">ID: {product.id}</p>
          </div>

          <div>
            <p className="text-4xl font-bold">{formatPrice(product.price)}</p>
            <Badge variant={stockStatus.variant} className="mt-3">
              {stockStatus.label} ({product.stock} units available)
            </Badge>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Product Details</h2>
            <dl className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-sm text-muted-foreground">Category</dt>
                <dd className="font-medium">{product.master_category}</dd>
              </div>

              <div>
                <dt className="text-sm text-muted-foreground">Sub Category</dt>
                <dd className="font-medium">{product.sub_category}</dd>
              </div>

              <div>
                <dt className="text-sm text-muted-foreground">Article Type</dt>
                <dd className="font-medium">{product.article_type}</dd>
              </div>

              {product.gender && (
                <div>
                  <dt className="text-sm text-muted-foreground">Gender</dt>
                  <dd className="font-medium">{product.gender}</dd>
                </div>
              )}

              {product.base_colour && (
                <div>
                  <dt className="text-sm text-muted-foreground">Color</dt>
                  <dd className="capitalize font-medium">{product.base_colour}</dd>
                </div>
              )}

              {product.season && (
                <div>
                  <dt className="text-sm text-muted-foreground">Season</dt>
                  <dd className="font-medium">{product.season}</dd>
                </div>
              )}

              {product.usage && (
                <div>
                  <dt className="text-sm text-muted-foreground">Usage</dt>
                  <dd className="font-medium">{product.usage}</dd>
                </div>
              )}

              {product.year && (
                <div>
                  <dt className="text-sm text-muted-foreground">Year</dt>
                  <dd className="font-medium">{product.year}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button size="lg" className="w-full" disabled={product.stock === 0}>
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button variant="outline" size="lg" className="w-full bg-transparent">
              Check stock availability
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
