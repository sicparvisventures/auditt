'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/translation'
import { Globe, ChevronDown } from 'lucide-react'

const languages = [
  { code: 'nl', name: 'NL' },
  { code: 'en', name: 'EN' },
  { code: 'fr', name: 'FR' }
]

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1.5 rounded-md border border-gray-200 hover:border-gray-300 transition-colors bg-white text-xs font-medium text-gray-600 hover:text-gray-800"
      >
        <span>{currentLanguage.name}</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-20 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-center px-3 py-2 text-xs font-medium hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md ${
                  language === lang.code ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
