import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/">Back to catalog</Link>
        </Button>
      </div>
    </main>
  )
}
