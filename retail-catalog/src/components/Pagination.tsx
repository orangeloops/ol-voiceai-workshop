"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCatalogFilters } from "@/hooks/useCatalogFilters"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

export function Pagination({ currentPage, totalPages, totalItems }: PaginationProps) {
  const { updateFilters } = useCatalogFilters()

  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * 24 + 1
  const endItem = Math.min(currentPage * 24, totalItems)

  return (
    <div className="flex items-center justify-between border-t pt-6">
      <p className="text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {totalItems} products
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateFilters({ page: currentPage - 1 })}
          disabled={currentPage === 1}
          className="bg-transparent"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilters({ page: pageNum })}
                className={currentPage === pageNum ? "" : "bg-transparent"}
              >
                {pageNum}
              </Button>
            )
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateFilters({ page: currentPage + 1 })}
          disabled={currentPage === totalPages}
          className="bg-transparent"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
