'use client'

import React, { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { UserRole } from '@/types'
import { clientDataService } from '@/lib/client-data'
import { useToast } from '@/components/ui/Toaster'

interface RoleSwitcherProps {
  userId: string
  currentRole: UserRole
  userName: string
  onRoleChanged?: () => void
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  userId,
  currentRole,
  userName,
  onRoleChanged
}) => {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Only ADMIN users can switch roles
  if (user?.rol !== 'admin') {
    return null
  }

  const availableRoles: { value: UserRole; label: string }[] = [
    { value: 'admin', label: 'Administrator' },
    { value: 'inspector', label: 'Inspector' },
    { value: 'storemanager', label: 'Store Manager' },
    { value: 'developer', label: 'Developer' }
  ]

  const handleRoleChange = async (newRole: UserRole) => {
    if (newRole === currentRole) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const result = await clientDataService.updateUser(userId, { rol: newRole })
      
      if (result && result.rol === newRole) {
        addToast({
          title: 'Rol gewijzigd',
          message: `De rol van ${userName} is gewijzigd naar ${availableRoles.find(r => r.value === newRole)?.label}`,
          variant: 'success'
        })
        
        if (onRoleChanged) {
          onRoleChanged()
        }
      } else {
        console.error('Role update failed:', result)
        setError('Fout bij het wijzigen van de rol. Controleer of de gebruiker bestaat en de rol geldig is.')
        addToast({
          title: 'Fout',
          message: 'Fout bij het wijzigen van de rol. Controleer of de gebruiker bestaat en de rol geldig is.',
          variant: 'error'
        })
      }
    } catch (err) {
      console.error('Error changing role:', err)
      setError('Er is een fout opgetreden bij het wijzigen van de rol')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <h3 className="text-lg font-semibold">Rol Beheer</h3>
        <p className="text-sm text-gray-600">
          Alleen ADMIN gebruikers kunnen rollen wijzigen
        </p>
      </CardHeader>
      <CardBody>
        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Huidige rol van <span className="font-semibold">{userName}</span>:
          </p>
          <p className="text-lg font-semibold" style={{ color: '#132938' }}>
            {availableRoles.find(r => r.value === currentRole)?.label}
          </p>
          
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Wijzig naar:</p>
            <div className="flex flex-wrap gap-2">
              {availableRoles
                .filter(role => role.value !== currentRole)
                .map((role) => (
                  <Button
                    key={role.value}
                    onClick={() => handleRoleChange(role.value)}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    {loading ? 'WIJZIGEN...' : role.label}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
