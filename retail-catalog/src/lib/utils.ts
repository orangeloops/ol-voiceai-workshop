import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: string): string {
  const num = Number.parseFloat(price)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num)
}

export function getStockStatus(stock: number): {
  label: string
  variant: "default" | "warning" | "destructive"
} {
  if (stock === 0) {
    return { label: "Out of stock", variant: "destructive" }
  }
  if (stock <= 5) {
    return { label: "Low stock", variant: "warning" }
  }
  return { label: "In stock", variant: "default" }
}
