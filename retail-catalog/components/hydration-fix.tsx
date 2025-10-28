"use client"

import { useEffect } from 'react'

export function HydrationFix() {
  useEffect(() => {
    // Suppress hydration warnings for browser extension attributes
    const originalError = console.error
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('bis_register') || 
         args[0].includes('__processed_') ||
         args[0].includes('Hydration') ||
         args[0].includes('server rendered HTML'))
      ) {
        return
      }
      originalError.call(console, ...args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return null
}