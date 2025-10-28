"use client"

import { X, Mic } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function VoiceHintBar() {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  const hints = [
    '"Show me blue hoodies in size M under $60"',
    '"Do you have long-sleeve plain hoodies in stock?"',
    '"Filter by color black and style printed"',
  ]

  return (
    <div className="border-b bg-muted/50 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Mic className="h-4 w-4 text-primary" />
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium">Try voice search:</span>
            <div className="flex flex-wrap gap-2">
              {hints.map((hint, i) => (
                <span key={i} className="text-muted-foreground">
                  {hint}
                  {i < hints.length - 1 && <span className="mx-1">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setIsDismissed(true)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  )
}
