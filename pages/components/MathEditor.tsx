'use client'

import { useState, useEffect, useRef } from 'react'

export default function MathEditor({ 
  value, 
  onChange, 
  placeholder = "Enter your answer with LaTeX (e.g., \\frac{a}{b})" 
}: { 
  value: string, 
  onChange: (value: string) => void,
  placeholder?: string
}) {
  const [preview, setPreview] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (value) {
      const escaped = value
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<sup>$1</sup>&frasl;<sub>$2</sub>')
        .replace(/\\sqrt\{([^}]+)\}/g, '&radic;<span style="text-decoration:overline">$1</span>')
        .replace(/\^(\{[^}]+\}|\w)/g, '<sup>$1</sup>')
        .replace(/_(\{[^}]+\}|\w)/g, '<sub>$1</sub>')
      
      setPreview(escaped)
    } else {
      setPreview('')
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="border rounded-lg">
      <div className="p-3 bg-gray-50 border-b">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full h-24 p-2 border-none resize-none focus:ring-0 focus:outline-none bg-transparent"
        />
      </div>
      {preview && (
        <div className="p-3 bg-white border-t">
          <div className="text-sm text-gray-600 mb-1">Preview:</div>
          <div 
            className="prose max-w-none text-lg"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      )}
    </div>
  )
}
