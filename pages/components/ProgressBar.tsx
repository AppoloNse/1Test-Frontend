'use client'

import { motion } from 'framer-motion'

export default function ProgressBar({ 
  current, 
  total 
}: { 
  current: number, 
  total: number 
}) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <motion.div 
        className="bg-green-500 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5 }}
      />
      <div className="text-right text-sm text-gray-600 mt-1">
        {current} of {total} questions
      </div>
    </div>
  )
}
