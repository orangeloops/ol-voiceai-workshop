"use client"

import { useEffect, useState } from "react"
import { X, ChevronDown, Filter } from "lucide-react"
import { useCatalogFilters } from "@/hooks/useCatalogFilters"
import { fetchCategories, fetchAttributes } from "@/lib/api"
import type { Attributes } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function FiltersPanel() {
  const { filters, updateFilters, clearFilters } = useCatalogFilters()
  const [categories, setCategories] = useState<string[]>([])
  const [attributes, setAttributes] = useState<Attributes>({
    colors: [],
    sleeve: [],
    style: [],
    size: [],
  })
  const [isOpen, setIsOpen] = useState(false)
  const [minPrice, setMinPrice] = useState(filters.min_price || "")
  const [maxPrice, setMaxPrice] = useState(filters.max_price || "")

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    fetchAttributes(filters.category).then(setAttributes).catch(console.error)
  }, [filters.category])

  // Debounce price updates
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ min_price: minPrice, max_price: maxPrice })
    }, 400)
    return () => clearTimeout(timer)
  }, [minPrice, maxPrice])

  const hasActiveFilters =
    filters.category ||
    (filters.color && filters.color.length > 0) ||
    filters.sleeve ||
    filters.style ||
    (filters.size && filters.size.length > 0) ||
    filters.min_price ||
    filters.max_price

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Category</Label>
        <RadioGroup
          value={filters.category || "all"}
          onValueChange={(value) => updateFilters({ category: value === "all" ? undefined : value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="cat-all" />
            <Label htmlFor="cat-all" className="font-normal cursor-pointer">
              All Categories
            </Label>
          </div>
          {categories.map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <RadioGroupItem value={cat} id={`cat-${cat}`} />
              <Label htmlFor={`cat-${cat}`} className="font-normal cursor-pointer capitalize">
                {cat}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Colors */}
      {Array.isArray(attributes.colors) && attributes.colors.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <Label className="text-sm font-semibold">Color</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            {(Array.isArray(attributes.colors) ? attributes.colors : []).map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={filters.color?.includes(color)}
                  onCheckedChange={(checked) => {
                    const current = filters.color || []
                    updateFilters({
                      color: checked ? [...current, color] : current.filter((c) => c !== color),
                    })
                  }}
                />
                <Label htmlFor={`color-${color}`} className="font-normal cursor-pointer capitalize">
                  {color}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Sleeve */}
      {Array.isArray(attributes.sleeve) && attributes.sleeve.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <Label className="text-sm font-semibold">Sleeve</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <RadioGroup
              value={filters.sleeve || "all"}
              onValueChange={(value) => updateFilters({ sleeve: value === "all" ? undefined : value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="sleeve-all" />
                <Label htmlFor="sleeve-all" className="font-normal cursor-pointer">
                  All
                </Label>
              </div>
              {(Array.isArray(attributes.sleeve) ? attributes.sleeve : []).map((sleeve) => (
                <div key={sleeve} className="flex items-center space-x-2">
                  <RadioGroupItem value={sleeve} id={`sleeve-${sleeve}`} />
                  <Label htmlFor={`sleeve-${sleeve}`} className="font-normal cursor-pointer capitalize">
                    {sleeve}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Style */}
      {Array.isArray(attributes.style) && attributes.style.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <Label className="text-sm font-semibold">Style</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <RadioGroup
              value={filters.style || "all"}
              onValueChange={(value) => updateFilters({ style: value === "all" ? undefined : value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="style-all" />
                <Label htmlFor="style-all" className="font-normal cursor-pointer">
                  All
                </Label>
              </div>
              {(Array.isArray(attributes.style) ? attributes.style : []).map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <RadioGroupItem value={style} id={`style-${style}`} />
                  <Label htmlFor={`style-${style}`} className="font-normal cursor-pointer capitalize">
                    {style}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Size */}
      {Array.isArray(attributes.size) && attributes.size.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <Label className="text-sm font-semibold">Size</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            {(Array.isArray(attributes.size) ? attributes.size : []).map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={filters.size?.includes(size)}
                  onCheckedChange={(checked) => {
                    const current = filters.size || []
                    updateFilters({
                      size: checked ? [...current, size] : current.filter((s) => s !== size),
                    })
                  }}
                />
                <Label htmlFor={`size-${size}`} className="font-normal cursor-pointer">
                  {size}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Price Range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          <X className="h-4 w-4 mr-2" />
          Clear all filters
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile: Sheet */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">Active</span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your product search</SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
            {hasActiveFilters && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">Active</span>
            )}
          </div>
          <FilterContent />
        </div>
      </div>
    </>
  )
}
