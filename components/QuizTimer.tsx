'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function QuizTimer({ 
  duration, 
  onTimeUp 
}: { 
  duration: number, 
  onTimeUp: () => void 
}) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, onTimeUp])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((duration - timeLeft) / duration) * 100

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4 flex items-center justify-between"
    >
      <div className="text-lg font-semibold text-gray-800">
        Time Remaining: {formatTime(timeLeft)}
      </div>
      <div className="w-64 bg-gray-200 rounded-full h-2">
        <motion.div 
          className="bg-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>
    </motion.div>
  )
}
