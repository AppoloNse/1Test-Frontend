'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ResultsDonutChart from '@/components/ResultsDonutChart'
import AIAssistant from '@/components/AIAssistant'
import QuestionDetailRow from '@/components/QuestionDetailRow'
import { motion } from 'framer-motion'
import { FaTrophy, FaChartPie, FaExclamationTriangle } from 'react-icons/fa'

const mockResults = {
  totalQuestions: 4,
  correctAnswers: 2,
  score: 75,
  violations: 1,
  questions: [
    {
      id: 1,
      question: "What is the derivative of $f(x) = x^2$?",
      studentAnswer: 1,
      correctAnswer: 1,
      isCorrect: true,
      aiExplanation: "You correctly identified that the derivative of $x^2$ is $2x$. This follows from the power rule: if $f(x) = x^n$, then $f'(x) = nx^{n-1}$."
    },
    {
      id: 2,
      question: "Explain the Fundamental Theorem of Calculus.",
      studentAnswer: "It connects derivatives and integrals.",
      correctAnswer: "The Fundamental Theorem of Calculus establishes the relationship between differentiation and integration, showing that these two operations are essentially inverses of each other.",
      isCorrect: false,
      aiExplanation: "Your answer was on the right track but incomplete. The Fundamental Theorem of Calculus has two parts: 1) If F is an antiderivative of f, then the definite integral from a to b of f(x) dx = F(b) - F(a). 2) If F(x) is defined as the integral from a to x of f(t) dt, then F'(x) = f(x). This establishes that differentiation and integration are inverse processes."
    },
    {
      id: 3,
      question: "Solve for x: $2x + 5 = 15$",
      studentAnswer: 1,
      correctAnswer: 1,
      isCorrect: true,
      aiExplanation: "Excellent! You correctly solved $2x + 5 = 15$ by subtracting 5 from both sides to get $2x = 10$, then dividing by 2 to find $x = 5$."
    },
    {
      id: 4,
      question: "Derive the quadratic formula $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ from $ax^2 + bx + c = 0$.",
      studentAnswer: "Use the formula directly.",
      correctAnswer: "Starting with $ax^2 + bx + c = 0$, divide by a: $x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0$. Complete the square: $x^2 + \\frac{b}{a}x + (\\frac{b}{2a})^2 = (\\frac{b}{2a})^2 - \\frac{c}{a}$. This gives $(x + \\frac{b}{2a})^2 = \\frac{b^2 - 4ac}{4a^2}$. Taking square roots: $x + \\frac{b}{2a} = \\pm \\frac{\\sqrt{b^2 - 4ac}}{2a}$. Finally: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$",
      isCorrect: false,
      aiExplanation: "The question asked you to derive the quadratic formula, not just state it. The derivation involves completing the square on the general quadratic equation. Start with $ax^2 + bx + c = 0$, divide by a, move the constant term to the other side, add $(b/2a)^2$ to both sides to complete the square, then solve for x."
    }
  ]
}

export default function ResultsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [results, setResults] = useState<any>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/')
      return
    }
    
    setResults(mockResults)
  }, [status, router])

  if (status === "loading" || !results) {
    return <div className="flex items-center justify-center min-h-screen">Loading results...</div>
  }

  const chartData = [
    { name: 'Correct', value: results.correctAnswers },
    { name: 'Incorrect', value: results.totalQuestions - results.correctAnswers }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Test Results</h1>
          <p className="text-xl text-gray-600">Here's how you performed on your assessment</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrophy className="text-3xl text-green-600" />
            </div>
            <h3
