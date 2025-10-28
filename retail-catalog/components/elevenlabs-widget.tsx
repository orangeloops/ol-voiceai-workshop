"use client"

import { useEffect, useState, useRef } from 'react'
import { ELEVENLABS_WIDGET_SRC, ELEVENLABS_AGENT_ID } from '../src/lib/config'

function ElevenLabsWidgetInner() {
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('ElevenLabsWidget - WIDGET_SRC:', ELEVENLABS_WIDGET_SRC)
    console.log('ElevenLabsWidget - AGENT_ID:', ELEVENLABS_AGENT_ID)
    
    if (!ELEVENLABS_WIDGET_SRC || !ELEVENLABS_AGENT_ID || !widgetRef.current) {
      console.log('ElevenLabsWidget - Missing configuration')
      return
    }

    // Check if script is already loaded
    let existingScript = document.querySelector('script[src="' + ELEVENLABS_WIDGET_SRC + '"]')
    
    if (!existingScript) {
      console.log('ElevenLabsWidget - Loading script...')
      // Create and load the script
      const script = document.createElement('script')
      script.src = ELEVENLABS_WIDGET_SRC
      script.async = true
      script.type = 'text/javascript'
      script.onload = () => console.log('ElevenLabsWidget - Script loaded successfully')
      script.onerror = () => console.error('ElevenLabsWidget - Script failed to load')
      document.head.appendChild(script)
      existingScript = script
    } else {
      console.log('ElevenLabsWidget - Script already loaded')
    }

    // Create the widget element
    console.log('ElevenLabsWidget - Creating widget element')
    const widgetElement = document.createElement('elevenlabs-convai')
    widgetElement.setAttribute('agent-id', ELEVENLABS_AGENT_ID)
    
    widgetRef.current.appendChild(widgetElement)
    console.log('ElevenLabsWidget - Widget element added to DOM')

    // Cleanup function
    return () => {
      if (widgetRef.current && widgetElement.parentNode) {
        widgetRef.current.removeChild(widgetElement)
      }
    }
  }, [])

  if (!ELEVENLABS_WIDGET_SRC || !ELEVENLABS_AGENT_ID) {
    return null
  }

  return <div ref={widgetRef} />
}

export function ElevenLabsWidget() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <ElevenLabsWidgetInner />
}