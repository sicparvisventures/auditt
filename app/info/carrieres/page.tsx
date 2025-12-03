'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export default function CarrieresPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Carrières bij Poule & Poulette
          </h1>

          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600 mb-4">
              Op dit moment zijn er geen openstaande vacatures.
            </p>
            <p className="text-gray-600">
              Interesse in werken bij Poule & Poulette? Stuur je CV naar{' '}
              <a href="mailto:info@poulepoulette.be" className="text-blue-600 hover:underline">
                info@poulepoulette.be
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

