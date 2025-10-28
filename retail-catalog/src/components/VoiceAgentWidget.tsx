"use client"

import { useEffect, useState } from "react"
import { ELEVENLABS_WIDGET_SRC, ELEVENLABS_AGENT_ID } from "@/lib/config"
import { Mic, Settings } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function VoiceAgentWidget() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    // If script URL is provided, inject it
    if (ELEVENLABS_WIDGET_SRC) {
      const script = document.createElement("script")
      script.src = ELEVENLABS_WIDGET_SRC
      script.defer = true
      script.onload = () => setIsScriptLoaded(true)
      script.onerror = () => {
        console.error("Failed to load ElevenLabs widget script")
        setIsScriptLoaded(false)
      }
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [])

  // If iframe URL is provided, render iframe (using agent ID)
  if (ELEVENLABS_AGENT_ID && !ELEVENLABS_WIDGET_SRC) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <iframe
          src={`https://elevenlabs.io/convai-widget?agent_id=${ELEVENLABS_AGENT_ID}`}
          className="w-16 h-16 rounded-full border-2 border-primary shadow-lg"
          title="ElevenLabs Voice Agent"
          allow="microphone"
        />
      </div>
    )
  }

  // If script is configured and loaded, it will render itself
  if (ELEVENLABS_WIDGET_SRC && isScriptLoaded) {
    return null // Widget renders itself
  }

  // If script is loading
  if (ELEVENLABS_WIDGET_SRC && !isScriptLoaded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="w-14 h-14 rounded-full bg-primary/20 animate-pulse flex items-center justify-center">
          <Mic className="h-6 w-6 text-primary" />
        </div>
      </div>
    )
  }

  // No widget configured - show placeholder with instructions
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <Alert className="shadow-lg">
        <Settings className="h-4 w-4" />
        <AlertTitle>Voice Agent Not Configured</AlertTitle>
        <AlertDescription className="text-xs mt-2">
          To enable the ElevenLabs voice agent, add one of these environment variables:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              <code className="text-xs bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_ELEVENLABS_WIDGET_SRC</code>
            </li>
            <li>
              <code className="text-xs bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_ELEVENLABS_AGENT_ID</code>
            </li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
