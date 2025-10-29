import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://backend:3001"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")

    const url = new URL(`${BACKEND_URL}/api/attributes`)
    if (category) {
      url.searchParams.set("category", category)
    }

    const response = await fetch(url.toString(), {
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch attributes" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching attributes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
