import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaGoogle } from 'react-icons/fa'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center"
      >
        <div className="mb-8">
          <Image 
            src="/logo.svg" 
            alt="EduTest Platform" 
            width={120} 
            height={120} 
            className="mx-auto"
          />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">EduTest</h1>
          <p className="text-gray-600 mt-2">Secure Modern Testing Platform</p>
        </div>
        
        <button
          onClick={() => signIn('google', { callbackUrl: '/quiz' })}
          className="w-full bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
        >
          <FaGoogle className="mr-3 text-lg" />
          Sign in with Google
        </button>
        
        <p className="text-xs text-gray-500 mt-6">
          By signing in, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  )
}
