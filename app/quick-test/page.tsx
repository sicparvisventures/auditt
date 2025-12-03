'use client'

import { useEffect, useState } from 'react'

export default function QuickTestPage() {
  const [info, setInfo] = useState<any>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auditUser = localStorage.getItem('audit_user')
      const auditDb = localStorage.getItem('audit_database')
      
      setInfo({
        hasAuditUser: !!auditUser,
        auditUserData: auditUser ? JSON.parse(auditUser) : null,
        hasAuditDb: !!auditDb,
        timestamp: new Date().toISOString()
      })
    }
  }, [])

  const createTestUser = () => {
    const testUser = {
      id: 'test-id',
      user_id: 'ADMIN',
      naam: 'Test Admin',
      rol: 'admin',
      telefoon: '+32 123 456 789',
      actief: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    localStorage.setItem('audit_user', JSON.stringify(testUser))
    window.location.href = '/'
  }

  const clearStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">🧪 Quick Test Page</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold">LocalStorage Status</h3>
            <p>Has audit_user: {info.hasAuditUser ? '✅ Yes' : '❌ No'}</p>
            <p>Has audit_database: {info.hasAuditDb ? '✅ Yes' : '❌ No'}</p>
            {info.auditUserData && (
              <p>User: {info.auditUserData.naam} ({info.auditUserData.rol})</p>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={createTestUser}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              🔧 Create Test Admin User & Go Home
            </button>
            
            <button
              onClick={clearStorage}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              🗑️ Clear Storage & Reload
            </button>
            
            <a
              href="/login"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
            >
              🔐 Go to Login
            </a>
            
            <a
              href="/debug-white-screen"
              className="block w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-center"
            >
              🔍 Go to Debug Page
            </a>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold mb-2">Debug Info:</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(info, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

