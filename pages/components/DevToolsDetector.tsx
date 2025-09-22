'use client'

import { useEffect } from 'react'

export default function DevToolsDetector({ onDevToolsOpen }: { onDevToolsOpen: () => void }) {
  useEffect(() => {
    let devtools = {
      open: false,
      orientation: undefined,
    }

    const threshold = 160

    const emitEvent = (isOpen: boolean, orientation?: string) => {
      devtools.open = isOpen
      devtools.orientation = orientation
      
      if (isOpen) {
        onDevToolsOpen()
      }
    }

    const i = setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      const orientation = widthThreshold ? 'vertical' : 'horizontal'

      if (!(heightThreshold && widthThreshold) && (window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized || widthThreshold || heightThreshold)) {
        if (!devtools.open || devtools.orientation !== orientation) {
          emitEvent(true, orientation)
        }
      } else {
        if (devtools.open) {
          emitEvent(false, undefined)
        }
      }
    }, 500)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.shiftKey && e.key === 'J') || (e.ctrlKey && e.key === 'u')) {
        onDevToolsOpen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearInterval(i)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onDevToolsOpen])

  return null
}
