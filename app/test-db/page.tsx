'use client'

import { useState } from 'react'
import { clientDataService } from '@/lib/client-data'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'

export default function TestDbPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [audits, setAudits] = useState<any[]>([])
  const [actions, setActions] = useState<any[]>([])

  const testDatabase = async () => {
    setLoading(true)
    setResult('')
    
    try {
      // Test database functions
      console.log('🔍 Testing database functions...')
      const testResult = await clientDataService.testDatabaseFunctions()
      console.log('📋 Test result:', testResult)
      
      if (testResult.error) {
        setResult(`Database test failed: ${testResult.error}`)
        return
      }
      
      setAudits(testResult.audits || [])
      setActions(testResult.actions || [])
      
      const functionsFound = testResult.functions?.length || 0
      const auditsFound = testResult.audits?.length || 0
      const actionsFound = testResult.actions?.length || 0
      
      setResult(`Database test complete. Functions: ${functionsFound}, Audits: ${auditsFound}, Actions: ${actionsFound}`)
      
    } catch (error) {
      console.error('❌ Database test error:', error)
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const createTestAudit = async () => {
    setLoading(true)
    try {
      // Create a test audit with some results
      const testAudit = {
        filiaal_id: 'test-filiaal',
        audit_datum: new Date().toISOString().split('T')[0],
        status: 'completed'
      }
      
      console.log('🔧 Creating test audit...')
      const auditId = await clientDataService.addAudit(testAudit)
      console.log('✅ Test audit created:', auditId)
      
      // Add some test results with low scores
      const testResults = [
        {
          checklist_item_id: 'test-item-1',
          resultaat: 'niet_ok',
          score: 2,
          opmerkingen: 'Test opmerking',
          verbeterpunt: 'Test verbeterpunt'
        },
        {
          checklist_item_id: 'test-item-2', 
          resultaat: 'ok',
          score: 1,
          opmerkingen: 'Test opmerking 2',
          verbeterpunt: 'Test verbeterpunt 2'
        }
      ]
      
      console.log('🔧 Adding test results...')
      await clientDataService.addAuditResults(auditId, testResults)
      console.log('✅ Test results added')
      
      // Try to create actions
      console.log('🔧 Creating actions from test audit...')
      const success = await clientDataService.createActionsFromAuditResults(auditId)
      console.log('✅ Action creation result:', success)
      
      setResult(`Test audit created with ID: ${auditId}. Actions created: ${success}`)
      
      // Refresh data
      const auditsData = await clientDataService.getAudits()
      const actionsData = await clientDataService.getActions()
      setAudits(auditsData)
      setActions(actionsData)
      
    } catch (error) {
      console.error('❌ Test audit creation error:', error)
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ppwhite p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Database Test</h1>
            <p className="text-gray-600">Test database connection and action creation</p>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Button
                onClick={testDatabase}
                disabled={loading}
              >
                {loading ? 'Testing...' : 'Test Database'}
              </Button>
              
              <Button
                onClick={createTestAudit}
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Creating...' : 'Create Test Audit'}
              </Button>
              
              <Button
                onClick={async () => {
                  setLoading(true)
                  try {
                    // Get first audit
                    const auditsData = await clientDataService.getAudits()
                    if (auditsData.length > 0) {
                      const firstAudit = auditsData[0]
                      console.log('🔧 Creating actions manually for audit:', firstAudit.id)
                      const success = await clientDataService.createActionsManually(firstAudit.id)
                      if (success) {
                        setResult('Actions created manually successfully!')
                        // Refresh actions
                        const testResult = await clientDataService.testDatabaseFunctions()
                        setActions(testResult.actions || [])
                      } else {
                        setResult('Failed to create actions manually')
                      }
                    } else {
                      setResult('No audits found to create actions for')
                    }
                  } catch (error) {
                    setResult(`Error: ${error}`)
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Creating...' : 'Create Actions Manually'}
              </Button>
              
              <Button
                onClick={async () => {
                  setLoading(true)
                  try {
                    const success = await clientDataService.createTestAction()
                    if (success) {
                      setResult('Test action created successfully!')
                      // Refresh actions
                      const testResult = await clientDataService.testDatabaseFunctions()
                      setActions(testResult.actions || [])
                    } else {
                      setResult('Failed to create test action')
                    }
                  } catch (error) {
                    setResult(`Error: ${error}`)
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Creating...' : 'Create Test Action'}
              </Button>
              
              {result && (
                <div className="p-4 bg-gray-100 rounded-md">
                  <p className="text-sm">{result}</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Database Functions</h3>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600">
                Check if the required database functions are installed.
                <br />
                <strong>Required:</strong> create_actions_from_audit_results, determine_action_urgency
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Audits ({audits.length})</h3>
            </CardHeader>
            <CardBody>
              {audits.length === 0 ? (
                <p className="text-gray-500">No audits found</p>
              ) : (
                <div className="space-y-2">
                  {audits.slice(0, 3).map((audit, index) => (
                    <div key={index} className="p-2 bg-creme rounded text-sm">
                      <p><strong>ID:</strong> {audit.id?.substring(0, 8)}...</p>
                      <p><strong>Status:</strong> {audit.status}</p>
                      <p><strong>Date:</strong> {audit.audit_datum}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Actions ({actions.length})</h3>
            </CardHeader>
            <CardBody>
              {actions.length === 0 ? (
                <p className="text-gray-500">No actions found</p>
              ) : (
                <div className="space-y-2">
                  {actions.slice(0, 3).map((action, index) => (
                    <div key={index} className="p-2 bg-creme rounded text-sm">
                      <p><strong>ID:</strong> {action.id?.substring(0, 8)}...</p>
                      <p><strong>Title:</strong> {action.titel?.substring(0, 20)}...</p>
                      <p><strong>Status:</strong> {action.status}</p>
                      <p><strong>Urgency:</strong> {action.urgentie}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
