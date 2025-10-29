import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://backend:3001"

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/categories`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
