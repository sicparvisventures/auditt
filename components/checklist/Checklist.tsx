'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { MobileNavigation } from '@/components/dashboard/MobileNavigation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { 
  CheckCircle, 
  Circle, 
  Target,
  TrendingUp,
  Award,
  Star,
  Calendar,
  Clock
} from 'lucide-react'

interface ChecklistItem {
  id: string
  categorie: string
  titel: string
  beschrijving: string
  completed: boolean
  completed_at?: string
}

export const Checklist: React.FC = () => {
  const { user } = useAuth()
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadChecklistItems()
  }, [])

  const loadChecklistItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/checklist-items')
      const data = await response.json()
      
      // Transform API data to component format
      const transformedItems: ChecklistItem[] = data.items.map((item: any) => ({
        id: item.id,
        categorie: item.categorie,
        titel: item.titel,
        beschrijving: item.beschrijving,
        completed: false, // Default to not completed
        completed_at: undefined
      }))
      
      setChecklistItems(transformedItems)
    } catch (error) {
      setError('Fout bij het laden van de checklist')
      console.error('Error loading checklist:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = async (itemId: string) => {
    try {
      setError('')
      
      const updatedItems = checklistItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            completed: !item.completed,
            completed_at: !item.completed ? new Date().toISOString() : undefined
          }
        }
        return item
      })
      
      setChecklistItems(updatedItems)
      setSuccess('Checklist item bijgewerkt!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Fout bij het bijwerken van het item')
    }
  }

  const getCompletionStats = () => {
    const total = checklistItems.length
    const completed = checklistItems.filter(item => item.completed).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { total, completed, percentage }
  }

  const getCategoryStats = () => {
    const categories = [...new Set(checklistItems.map(item => item.categorie))]
    return categories.map(category => {
      const categoryItems = checklistItems.filter(item => item.categorie === category)
      const completed = categoryItems.filter(item => item.completed).length
      const total = categoryItems.length
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
      
      return {
        category,
        completed,
        total,
        percentage
      }
    })
  }

  const stats = getCompletionStats()
  const categoryStats = getCategoryStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader user={user} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-lino-caps text-gray-900 mb-2">Mijn Voortgang</h1>
          <p className="text-gray-600 font-lino">Houd je taken bij en blijf gemotiveerd!</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6">
            <Alert variant="success">
              {success}
            </Alert>
          </div>
        )}

        {error && (
          <div className="mb-6">
            <Alert variant="error">
              {error}
            </Alert>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Target className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Totale Voortgang</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.percentage}%</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Voltooid</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completed}/{stats.total}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8" style={{ color: '#132938' }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Streak</p>
                  <p className="text-2xl font-semibold text-gray-900">7 dagen</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Category Progress */}
        <div className="mb-8">
          <h2 className="text-xl font-lino-caps text-gray-900 mb-4">Voortgang per Categorie</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryStats.map((stat) => (
              <Card key={stat.category}>
                <CardBody>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{stat.category}</h3>
                    <span className="text-sm text-gray-500">{stat.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{stat.completed}/{stat.total} voltooid</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-6">
          {categoryStats.map((categoryStat) => (
            <Card key={categoryStat.category}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">{categoryStat.category}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{categoryStat.completed}/{categoryStat.total}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${categoryStat.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {checklistItems
                    .filter(item => item.categorie === categoryStat.category)
                    .map((item) => (
                      <div key={item.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="flex-shrink-0 mt-0.5"
                        >
                          {item.completed ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-400 hover:text-primary-600" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {item.titel}
                          </h3>
                          <p className={`text-sm ${item.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.beschrijving}
                          </p>
                          {item.completed && item.completed_at && (
                            <p className="text-xs text-gray-400 mt-1">
                              Voltooid op {new Date(item.completed_at).toLocaleDateString('nl-NL')}
                            </p>
                          )}
                        </div>
                        {item.completed && (
                          <div className="flex-shrink-0">
                            <Award className="h-5 w-5 text-[#c59a6d]" />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Motivational Message */}
        {stats.percentage === 100 && (
          <Card className="mt-8 border-green-200" style={{ background: 'linear-gradient(to right, #f0fdf4, #f0f4f8)' }}>
            <CardBody>
              <div className="text-center">
                <Star className="h-12 w-12 text-[#c59a6d] mx-auto mb-4" />
                <h3 className="text-xl font-lino-caps text-gray-900 mb-2">Gefeliciteerd! 🎉</h3>
                <p className="text-gray-600">
                  Je hebt alle taken voltooid! Je bent een echte ster in kwaliteitsbeheer.
                </p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      <MobileNavigation />
    </div>
  )
}
