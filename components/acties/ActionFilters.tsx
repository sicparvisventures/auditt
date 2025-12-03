'use client'

import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface ActionFiltersProps {
  filters: {
    status: string
    urgentie: string
    search: string
  }
  onFiltersChange: (filters: any) => void
}

export const ActionFilters: React.FC<ActionFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      urgentie: 'all',
      search: ''
    })
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <Button
            onClick={clearFilters}
            variant="outline"
            size="sm"
          >
            Wissen
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zoeken
            </label>
            <Input
              type="text"
              placeholder="Zoek in titel of beschrijving..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--focus-ring-color': '#132938' } as React.CSSProperties}
              onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #132938'}
              onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">Alle statussen</option>
              <option value="pending">In afwachting</option>
              <option value="in_progress">Bezig</option>
              <option value="completed">Voltooid</option>
              <option value="verified">Geverifieerd</option>
            </select>
          </div>

          {/* Urgentie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Urgentie
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--focus-ring-color': '#132938' } as React.CSSProperties}
              onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #132938'}
              onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
              value={filters.urgentie}
              onChange={(e) => handleFilterChange('urgentie', e.target.value)}
            >
              <option value="all">Alle urgenties</option>
              <option value="critical">Kritiek</option>
              <option value="high">Hoog</option>
              <option value="medium">Gemiddeld</option>
              <option value="low">Laag</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  )
}
