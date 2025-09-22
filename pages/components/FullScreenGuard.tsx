'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function FullScreenGuard({ onViolation }: { onViolation: (type: string) => void }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const checkFullscreen = () => {
      const fullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      )
      setIsFullscreen(fullscreen)
      
      if (!fullscreen) {
        onViolation('exit_fullscreen')
        toast.error('Test requires fullscreen mode', { duration: 5000 })
      }
    }

    const requestFullscreen = () => {
      const elem = document.documentElement
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen()
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen()
      }
    }

    requestFullscreen()

    document.addEventListener('fullscreenchange', checkFullscreen)
    document.addEventListener('webkitfullscreenchange', checkFullscreen)
    document.addEventListener('mozfullscreenchange', checkFullscreen)
    document.addEventListener('MSFullscreenChange', checkFullscreen)

    checkFullscreen()

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen)
      document.removeEventListener('webkitfullscreenchange', checkFullscreen)
      document.removeEventListener('mozfullscreenchange', checkFullscreen)
      document.removeEventListener('MSFullscreenChange', checkFullscreen)
    }
  }, [onViolation])

  return null
}
