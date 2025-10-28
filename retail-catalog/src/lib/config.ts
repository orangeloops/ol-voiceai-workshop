export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!
export const ELEVENLABS_WIDGET_SRC = process.env.NEXT_PUBLIC_ELEVENLABS_WIDGET_SRC || ""
export const ELEVENLABS_AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || ""

if (!API_BASE) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL environment variable")
}
