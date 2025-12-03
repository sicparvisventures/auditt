import { UserRole } from '@/types'

export interface AuthUser {
  id: string
  user_id: string
  naam: string
  rol: UserRole
  telefoon: string
  actief: boolean
  created_by?: string
}

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    // For demo purposes, return null since we're using localStorage-based auth
    return null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export const hasRole = (user: AuthUser | null, requiredRoles: UserRole[]): boolean => {
  if (!user) return false
  return requiredRoles.includes(user.rol)
}

export const canAccessFiliaal = (user: AuthUser | null, filiaalId: string): boolean => {
  if (!user) return false
  
  // Admin and COO can access all filialen
  if (user.rol === 'admin' || user.rol === 'coo') {
    return true
  }
  
  // District managers can only access their assigned filialen
  if (user.rol === 'district_manager') {
    // This would need to be checked against the filialen table
    // For now, we'll implement this in the API layer
    return true
  }
  
  // Filiaal managers can only access their own filiaal
  if (user.rol === 'filiaal_manager') {
    // This would need to be checked against the filialen table
    return true
  }
  
  return false
}

export const signOut = async () => {
  // For demo purposes, just clear localStorage
  localStorage.removeItem('audit_user')
}
