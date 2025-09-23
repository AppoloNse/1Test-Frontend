'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

export default function QuestionDetailRow({ 
  question, 
  studentAnswer, 
  correctAnswer, 
  isCorrect,
  aiExplanation
}: { 
  question: any,
  studentAnswer: any,
  correctAnswer: any,
  isCorrect: boolean,
  aiExplanation: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  const renderAnswer = (answer: any, isStudent = false) => {
    if (typeof answer === 'number' && question.options) {
      return question.options[answer] || 'No answer selected'
    }
    return answer || (isStudent ? 'No answer provided' : 'No correct answer')
  }

  return (
    <div className="border rounded-lg mb-4 overflow-hidden">
      <div 
        className="p-4 bg-white cursor-pointer hover:bg-gray-50 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h4 className="font-medium text-gray-800">{question.question}</h4>
          <div className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? 'Correct' : 'Incorrect'}
          </div>
        </div>
        <div className="text-gray-500">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className="overflow-hidden bg-gray-50"
      >
        <div className="p-4 space-y-4">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Your Answer:</h5>
            <div className="p-3 bg-white rounded border">
              {renderAnswer(studentAnswer, true)}
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Correct Answer:</h5>
            <div className="p-3 bg-white rounded border">
              {renderAnswer(correctAnswer)}
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-700 mb-2">AI Explanation:</h5>
            <div className="p-3 bg-blue-50 rounded border border-blue-200 text-blue-800">
              {aiExplanation}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
