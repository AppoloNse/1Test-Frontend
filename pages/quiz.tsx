'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import FullScreenGuard from '@/components/FullScreenGuard'
import VisibilityMonitor from '@/components/VisibilityMonitor'
import DevToolsDetector from '@/components/DevToolsDetector'
import QuizTimer from '@/components/QuizTimer'
import ProgressBar from '@/components/ProgressBar'
import MathEditor from '@/components/MathEditor'
import { motion } from 'framer-motion'

const mockQuestions = [
  {
    id: 1,
    type: 'multiple_choice',
    question: 'What is the derivative of $f(x) = x^2$?',
    options: [
      '$x$',
      '$2x$',
      '$x^2$',
      '$2$'
    ],
    correctAnswer: 1,
    points: 1
  },
  {
    id: 2,
    type: 'long_text',
    question: 'Explain the Fundamental Theorem of Calculus.',
    correctAnswer: 'The Fundamental Theorem of Calculus establishes the relationship between differentiation and integration, showing that these two operations are essentially inverses of each other.',
    points: 5
  },
  {
    id: 3,
    type: 'multiple_choice',
    question: 'Solve for x: $2x + 5 = 15$',
    options: [
      '$x = 3$',
      '$x = 5$',
      '$x = 7$',
      '$x = 10$'
    ],
    correctAnswer: 1,
    points: 1
  },
  {
    id: 4,
    type: 'long_text',
    question: 'Derive the quadratic formula $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ from $ax^2 + bx + c = 0$.',
    correctAnswer: 'Starting with $ax^2 + bx + c = 0$, divide by a: $x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0$. Complete the square: $x^2 + \\frac{b}{a}x + (\\frac{b}{2a})^2 = (\\frac{b}{2a})^2 - \\frac{c}{a}$. This gives $(x + \\frac{b}{2a})^2 = \\frac{b^2 - 4ac}{4a^2}$. Taking square roots: $x + \\frac{b}{2a} = \\pm \\frac{\\sqrt{b^2 - 4ac}}{2a}$. Finally: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$',
    points: 8
  }
]

export default function QuizPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [violations, setViolations] = useState<string[]>([])
  const [isWarningVisible, setIsWarningVisible] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/')
      return
    }
    
    const shuffled = [...mockQuestions].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
    
    autosaveTimerRef.current = setInterval(() => {
      if (Object.keys(answers).length > 0) {
        saveAnswersToServer()
      }
    }, 5000)
    
    return () => {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current)
      }
    }
  }, [status, router])

  const handleViolation = async (type: string) => {
    const newViolation = {
      type,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    setViolations(prev => [...prev, type])
    
    try {
      await fetch('/api/violation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newViolation)
      })
    } catch (error) {
      console.error('Failed to send violation:', error)
    }
    
    if (violations.length + 1 >= 3) {
      setIsWarningVisible(true)
      toast.error('Multiple violations detected! Further violations may end your test.', {
        duration: 8000
      })
    }
    
    if (violations.length + 1 >= 5) {
      endTest(true)
    }
  }

  const saveAnswersToServer = async () => {
    if (!session) return
    
    try {
      await fetch('/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user?.id,
          answers,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to save answers:', error)
    }
  }

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      endTest()
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const endTest = async (forced = false) => {
    if (forced) {
      toast.error('Test terminated due to excessive violations')
    }
    
    await saveAnswersToServer()
    
    try {
      await fetch('/api/finish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          answers,
          violations,
          completed: !forced,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to finalize test:', error)
    }
    
    setTestCompleted(true)
    router.push('/results')
  }

  const currentQuestion = questions[currentQuestionIndex]

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!currentQuestion) {
    return <div className="flex items-center justify-center min-h-screen">Loading questions...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <FullScreenGuard onViolation={handleViolation} />
      <VisibilityMonitor 
        onVisibilityChange={(visible) => !visible && handleViolation('page_hidden')}
        onFocusChange={(focused) => !focused && handleViolation('window_blur')}
      />
      <DevToolsDetector onDevToolsOpen={() => handleViolation('devtools_opened')} />
      
      {isWarningVisible && (
        <div className="fixed top-16 left-0 right-0 bg-red-100 border-b-2 border-red-500 p-3 z-50">
          <div className="text-center text-red-800 font-medium">
            ⚠️ Warning: Multiple security violations detected. Further violations may terminate your test.
          </div>
        </div>
      )}
      
      <QuizTimer 
        duration={1800}
        onTimeUp={() => endTest()}
      />
      
      <div className="max-w-4xl mx-auto p-6">
        <ProgressBar 
          current={currentQuestionIndex + 1} 
          total={questions.length} 
        />
        
        <motion.div 
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Question {currentQuestionIndex + 1}
            </h2>
            <div className="prose max-w-none text-lg" dangerouslySetInnerHTML={{ 
              __html: currentQuestion.question.replace(/\$(.*?)\$/g, '<span class="font-mono bg-gray-100 px-1 rounded">$1</span>') 
            }} />
          </div>
          
          {currentQuestion.type === 'multiple_choice' && (
            <div className="space-y-3">
              {currentQuestion.options.map((option: string, index: number) => (
                <label 
                  key={index}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestion.id] === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswerChange(currentQuestion.id, index)}
                    className="mr-3 h-5 w-5 text-blue-600"
                  />
                  <span dangerouslySetInnerHTML={{ 
                    __html: option.replace(/\$(.*?)\$/g, '<span class="font-mono bg-gray-100 px-1 rounded">$1</span>') 
                  }} />
                </label>
              ))}
            </div>
          )}
          
          {currentQuestion.type === 'long_text' && (
            <div>
              <MathEditor
                value={answers[currentQuestion.id] || ''}
                onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                placeholder="Type your answer here. Use LaTeX for mathematical expressions (e.g., \frac{a}{b}, \sqrt{x})"
              />
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={() => endTest()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Question
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
