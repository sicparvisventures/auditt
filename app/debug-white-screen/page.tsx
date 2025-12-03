'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'

export default function DebugWhiteScreenPage() {
  const { user, loading } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    // Collect debug information
    const collectDebugInfo = () => {
      const info = {
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
        localStorage: typeof window !== 'undefined' && localStorage ? {
          hasAuditUser: !!localStorage.getItem('audit_user'),
          auditUserData: localStorage.getItem('audit_user'),
          hasAuditDatabase: !!localStorage.getItem('audit_database')
        } : 'Not available',
        authState: {
          user: user,
          loading: loading,
          userType: typeof user,
          userKeys: user ? Object.keys(user) : null
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          isClient: typeof window !== 'undefined',
          hasDocument: typeof document !== 'undefined'
        }
      }
      setDebugInfo(info)
    }

    collectDebugInfo()
    
    // Update debug info every second
    const interval = setInterval(collectDebugInfo, 1000)
    
    return () => clearInterval(interval)
  }, [user, loading])

  const clearLocalStorage = () => {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const goToLogin = () => {
    window.location.href = '/login'
  }

  const goToDashboard = () => {
    window.location.href = '/pp-dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔍 Debug White Screen Issue
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Cards */}
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${loading ? 'bg-yellow-100 border-yellow-300' : 'bg-green-100 border-green-300'} border`}>
                <h3 className="font-semibold text-gray-900">Loading Status</h3>
                <p className={`text-lg ${loading ? 'text-yellow-800' : 'text-green-800'}`}>
                  {loading ? '⏳ Loading...' : '✅ Loaded'}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${!user ? 'bg-red-100 border-red-300' : 'bg-green-100 border-green-300'} border`}>
                <h3 className="font-semibold text-gray-900">User Status</h3>
                <p className={`text-lg ${!user ? 'text-red-800' : 'text-green-800'}`}>
                  {!user ? '❌ No User' : `✅ User: ${user.naam} (${user.rol})`}
                </p>
              </div>

              <div className="p-4 rounded-lg border" style={{ backgroundColor: '#f0f4f8', borderColor: '#132938' }}>
                <h3 className="font-semibold text-gray-900">Environment</h3>
                <p style={{ color: '#132938' }}>
                  {debugInfo.environment?.isClient ? '🌐 Client-side' : '🖥️ Server-side'}
                </p>
                <p className="text-sm" style={{ color: '#132938' }}>
                  Node ENV: {debugInfo.environment?.nodeEnv || 'unknown'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
              
              <button
                onClick={clearLocalStorage}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                🗑️ Clear LocalStorage & Reload
              </button>

              <button
                onClick={goToLogin}
                className="w-full text-white px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#132938' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f1f2e'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#132938'}
              >
                🔐 Go to Login
              </button>

              <button
                onClick={goToDashboard}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                📊 Go to Dashboard
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                🔄 Reload Page
              </button>
            </div>
          </div>

          {/* Debug Information */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Debug Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg overflow-auto">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </div>

          {/* Console Logs */}
          <div className="mt-6 p-4 bg-black text-green-400 rounded-lg">
            <h4 className="font-semibold mb-2">Console Instructions:</h4>
            <p className="text-sm">
              1. Open browser DevTools (F12)<br/>
              2. Go to Console tab<br/>
              3. Look for messages starting with 🔍, 👤, ⏰, etc.<br/>
              4. Check for any red error messages
            </p>
          </div>

          {/* Navigation Test */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-2">Navigation Test</h4>
            <div className="flex flex-wrap gap-2">
              <a href="/" className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">Home</a>
              <a href="/login" className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">Login</a>
              <a href="/pp-dashboard" className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">Dashboard</a>
              <a href="/audits" className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">Audits</a>
              <a href="/test-db" className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">Test DB</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

