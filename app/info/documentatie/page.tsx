'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, FileText } from 'lucide-react'

export default function DocumentatiePage() {
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
            Documentatie
          </h1>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center space-x-4 mb-6">
              <FileText className="h-8 w-8 text-gray-400" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Audit Tool Documentatie</h2>
                <p className="text-gray-600">Handleidingen en documentatie voor de Audit Tool</p>
              </div>
            </div>

            <p className="text-gray-600">
              Documentatie wordt binnenkort toegevoegd.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

