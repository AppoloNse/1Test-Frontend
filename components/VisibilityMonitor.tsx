'use client'

import { useEffect } from 'react'

export default function VisibilityMonitor({ 
  onVisibilityChange, 
  onFocusChange 
}: { 
  onVisibilityChange: (visible: boolean) => void,
  onFocusChange: (focused: boolean) => void
}) {
  useEffect(() => {
    const handleVisibilityChange = () => {
      onVisibilityChange(!document.hidden)
    }

    const handleFocus = () => {
      onFocusChange(true)
    }

    const handleBlur = () => {
      onFocusChange(false)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [onVisibilityChange, onFocusChange])

  return null
}
