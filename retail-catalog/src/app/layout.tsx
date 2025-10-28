import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/Header"
import { ElevenLabsWidget } from "../../components/elevenlabs-widget"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RetailCo - Modern Retail Catalog",
  description: "Browse our collection of hoodies, shirts, jeans, jackets, and pants",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <ElevenLabsWidget />
      </body>
    </html>
  )
}
