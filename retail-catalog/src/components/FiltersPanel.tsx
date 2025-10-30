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
    genders: [],
    master_categories: [],
    sub_categories: [],
    article_types: [],
    colours: [],
    seasons: [],
    usages: [],
  })
  const [isOpen, setIsOpen] = useState(false)
  const [minPrice, setMinPrice] = useState(filters.min_price || "")
  const [maxPrice, setMaxPrice] = useState(filters.max_price || "")

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    fetchAttributes(filters.master_category).then(setAttributes).catch(console.error)
  }, [filters.master_category])

  // Debounce price updates
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ min_price: minPrice, max_price: maxPrice })
    }, 400)
    return () => clearTimeout(timer)
  }, [minPrice, maxPrice])

  const hasActiveFilters =
    filters.gender ||
    filters.master_category ||
    filters.sub_category ||
    filters.article_type ||
    (filters.base_colour && filters.base_colour.length > 0) ||
    filters.season ||
    filters.usage ||
    filters.min_price ||
    filters.max_price

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Category</Label>
        <RadioGroup
          value={filters.master_category || "all"}
          onValueChange={(value) => updateFilters({ master_category: value === "all" ? undefined : value })}
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

      {/* Gender */}
      {Array.isArray(attributes.genders) && attributes.genders.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <Label className="text-sm font-semibold">Gender</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <RadioGroup
              value={filters.gender || "all"}
              onValueChange={(value) => updateFilters({ gender: value === "all" ? undefined : value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="gender-all" />
                <Label htmlFor="gender-all" className="font-normal cursor-pointer">
                  All
                </Label>
              </div>
              {attributes.genders.map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <RadioGroupItem value={gender} id={`gender-${gender}`} />
                  <Label htmlFor={`gender-${gender}`} className="font-normal cursor-pointer">
                    {gender}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Sub Category */}
      {Array.isArray(attributes.sub_categories) && attributes.sub_categories.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <Label className="text-sm font-semibold">Sub Category</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <RadioGroup
              value={filters.sub_category || "all"}
              onValueChange={(value) => updateFilters({ sub_category: value === "all" ? undefined : value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="subcat-all" />
                <Label htmlFor="subcat-all" className="font-normal cursor-pointer">
                  All
                </Label>
              </div>
              {attributes.sub_categories.map((subcat) => (
                <div key={subcat} className="flex items-center space-x-2">
                  <RadioGroupItem value={subcat} id={`subcat-${subcat}`} />
                  <Label htmlFor={`subcat-${subcat}`} className="font-normal cursor-pointer">
                    {subcat}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Colors */}
      {Array.isArray(attributes.colours) && attributes.colours.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <Label className="text-sm font-semibold">Color</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {attributes.colours.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={filters.base_colour?.includes(color)}
                  onCheckedChange={(checked) => {
                    const current = filters.base_colour || []
                    updateFilters({
                      base_colour: checked ? [...current, color] : current.filter((c) => c !== color),
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

      {/* Season */}
      {Array.isArray(attributes.seasons) && attributes.seasons.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <Label className="text-sm font-semibold">Season</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <RadioGroup
              value={filters.season || "all"}
              onValueChange={(value) => updateFilters({ season: value === "all" ? undefined : value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="season-all" />
                <Label htmlFor="season-all" className="font-normal cursor-pointer">
                  All
                </Label>
              </div>
              {attributes.seasons.map((season) => (
                <div key={season} className="flex items-center space-x-2">
                  <RadioGroupItem value={season} id={`season-${season}`} />
                  <Label htmlFor={`season-${season}`} className="font-normal cursor-pointer">
                    {season}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Usage */}
      {Array.isArray(attributes.usages) && attributes.usages.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <Label className="text-sm font-semibold">Usage</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <RadioGroup
              value={filters.usage || "all"}
              onValueChange={(value) => updateFilters({ usage: value === "all" ? undefined : value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="usage-all" />
                <Label htmlFor="usage-all" className="font-normal cursor-pointer">
                  All
                </Label>
              </div>
              {attributes.usages.map((usage) => (
                <div key={usage} className="flex items-center space-x-2">
                  <RadioGroupItem value={usage} id={`usage-${usage}`} />
                  <Label htmlFor={`usage-${usage}`} className="font-normal cursor-pointer">
                    {usage}
                  </Label>
                </div>
              ))}
            </RadioGroup>
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

