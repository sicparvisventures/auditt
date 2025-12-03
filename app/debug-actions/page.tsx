'use client'

import { useState } from 'react'
import { clientDataService } from '@/lib/client-data'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'

export default function DebugActionsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const createActionsForAllAudits = async () => {
    setLoading(true)
    setResult('')
    
    try {
      // Get all audits
      const audits = await clientDataService.getAudits()
      console.log('📋 Found audits:', audits.length)
      
      let actionsCreated = 0
      let errors = 0
      
      for (const audit of audits) {
        try {
          console.log(`🔧 Creating actions for audit ${audit.id}...`)
          const success = await clientDataService.createActionsFromAuditResults(audit.id)
          
          if (success) {
            actionsCreated++
            console.log(`✅ Actions created for audit ${audit.id}`)
          } else {
            errors++
            console.log(`❌ Failed to create actions for audit ${audit.id}`)
          }
        } catch (error) {
          errors++
          console.error(`❌ Error creating actions for audit ${audit.id}:`, error)
        }
      }
      
      setResult(`Actions created for ${actionsCreated} audits. Errors: ${errors}`)
      
    } catch (error) {
      console.error('Error:', error)
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Debug Actions</h1>
            <p className="text-gray-600">Create actions for all existing audits</p>
          </CardHeader>
          <CardBody>
            <Button
              onClick={createActionsForAllAudits}
              disabled={loading}
              className="mb-4"
            >
              {loading ? 'Creating Actions...' : 'Create Actions for All Audits'}
            </Button>
            
            {result && (
              <div className="p-4 bg-gray-100 rounded-md">
                <p className="text-sm">{result}</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
