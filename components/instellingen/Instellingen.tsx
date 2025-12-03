'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { MobileNavigation } from '@/components/dashboard/MobileNavigation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { RoleSwitcher } from '@/components/admin/RoleSwitcher'
import { clientDataService } from '@/lib/client-data'
import { Gebruiker } from '@/types'
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Trash2,
  Settings,
  Save,
  LogOut,
  Plus,
  Edit,
  Users,
  UserPlus,
  Search,
  ChevronDown,
  ChevronUp,
  Key,
  Settings as SettingsIcon
} from 'lucide-react'
import Image from 'next/image'

export const Instellingen: React.FC = () => {
  const { user, signOut, updateUser } = useAuth()
  
  const [profile, setProfile] = useState({
    naam: '',
    user_id: '',
    telefoon: '',
    rol: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [users, setUsers] = useState<Gebruiker[]>([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [collapsedRoles, setCollapsedRoles] = useState<Set<string>>(new Set())
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    naam: '',
    email: '',
    telefoon: ''
  })
  const [newUser, setNewUser] = useState({
    naam: '',
    rol: 'storemanager',
    telefoon: ''
  })

  useEffect(() => {
    if (user) {
      setProfile({
        naam: user.naam,
        user_id: user.id,
        telefoon: user.telefoon,
        rol: user.rol
      })
    }
  }, [user])

  // Load users for admin
  useEffect(() => {
    if (user?.rol === 'admin') {
      loadUsers()
    }
  }, [user])

  const loadUsers = async () => {
    try {
      const users = await clientDataService.getAllUsers()
      setUsers(users)
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const handleCreateUser = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      
      console.log('Creating user with data:', newUser)
      const createdUser = await clientDataService.createUser(newUser)
      console.log('User created successfully:', createdUser)
      
      // Reload users to get the updated list
      await loadUsers()
      setNewUser({ naam: '', rol: 'storemanager', telefoon: '' })
      setShowUserForm(false)
      setSuccess('Gebruiker succesvol aangemaakt')
    } catch (error) {
      console.error('Error creating user:', error)
      setError(`Er is een fout opgetreden: ${error instanceof Error ? error.message : 'Onbekende fout'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    // Find the user to check if it's admin
    const userToDelete = users.find(u => u.id === userId)
    
    // Prevent deletion of admin account
    if (userToDelete?.rol === 'admin') {
      setError('Admin account kan niet worden verwijderd')
      return
    }

    if (!confirm('Weet u zeker dat u deze gebruiker wilt verwijderen?')) {
      return
    }

    try {
      const success = await clientDataService.deleteUser(userId)
      if (success) {
        setUsers(prev => prev.filter(u => u.id !== userId))
        setSuccess('Gebruiker succesvol verwijderd')
      } else {
        setError('Fout bij het verwijderen van gebruiker')
      }
    } catch (error) {
      setError('Er is een fout opgetreden')
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      if (!user) {
        setError('Geen gebruiker ingelogd')
        return
      }

      // Update user profile
      const result = await updateUser({
        naam: profile.naam,
        telefoon: profile.telefoon
      })

      if (result.success) {
        setSuccess('Uw profiel is succesvol bijgewerkt')
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || 'Fout bij het bijwerken van het profiel')
      }
    } catch (err) {
      setError('Fout bij het bijwerken van het profiel')
      console.error('Error updating profile:', err)
    } finally {
      setSaving(false)
    }
  }


  const getRoleDisplayName = (role: string | undefined) => {
    if (!role) return 'Onbekend'
    
    switch (role) {
      case 'admin':
        return 'Administrator'
      case 'inspector':
        return 'Inspector'
      case 'storemanager':
        return 'Store Manager'
      case 'developer':
        return 'Developer'
      default:
        return role.replace('_', ' ')
    }
  }

  // Helper function to sort users with Filip Van Hoeck first
  const sortUsers = (users: Gebruiker[]) => {
    return [...users].sort((a, b) => {
      // Filip Van Hoeck always comes first
      if (a.naam === 'Filip Van Hoeck') return -1
      if (b.naam === 'Filip Van Hoeck') return 1
      
      // Then sort alphabetically by name
      return a.naam.localeCompare(b.naam)
    })
  }

  // Helper function to filter users by search term
  const filterUsers = (users: Gebruiker[], searchTerm: string) => {
    if (!searchTerm.trim()) return users
    
    const term = searchTerm.toLowerCase()
    return users.filter(user => 
      user.naam.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.telefoon?.includes(term) ||
      user.id.toLowerCase().includes(term)
    )
  }

  // Helper function to toggle role collapse state
  const toggleRoleCollapse = (userId: string) => {
    setCollapsedRoles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  // Helper function to start editing a user
  const startEditUser = (userItem: Gebruiker) => {
    setEditingUser(userItem.id)
    setEditForm({
      naam: userItem.naam,
      email: userItem.email || '',
      telefoon: userItem.telefoon || ''
    })
  }

  // Helper function to cancel editing
  const cancelEdit = () => {
    setEditingUser(null)
    setEditForm({ naam: '', email: '', telefoon: '' })
  }

  // Helper function to save user edits
  const saveUserEdit = async () => {
    if (!editingUser) return

    try {
      setSaving(true)
      setError('')
      
      const result = await clientDataService.updateUser(editingUser, {
        naam: editForm.naam,
        email: editForm.email,
        telefoon: editForm.telefoon
      })

      if (result) {
        setSuccess('Gebruiker succesvol bijgewerkt')
        await loadUsers() // Refresh the users list
        cancelEdit()
      } else {
        setError('Fout bij het bijwerken van de gebruiker')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      setError('Er is een fout opgetreden bij het bijwerken')
    } finally {
      setSaving(false)
    }
  }

  // Get filtered and sorted users
  const displayUsers = sortUsers(filterUsers(users, searchTerm))

  return (
    <div className="min-h-screen bg-ppwhite">
      <DashboardHeader user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-lino-caps text-ppblack mb-2">Instellingen</h1>
          <p className="text-olive font-lino">Beheer uw account instellingen en voorkeuren</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-olive" />
                  <h2 className="text-lg font-lino-caps text-ppblack">
                    Profiel Instellingen
                  </h2>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Naam"
                      value={profile.naam}
                      onChange={(e) => setProfile(prev => ({ ...prev, naam: e.target.value }))}
                      icon={User}
                    />
                    
                    <Input
                      label="User ID"
                      value={profile.user_id}
                      disabled
                      icon={User}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Telefoon"
                      value={profile.telefoon}
                      onChange={(e) => setProfile(prev => ({ ...prev, telefoon: e.target.value }))}
                      icon={Phone}
                    />
                    
                    <Input
                      label="Rol"
                      value={getRoleDisplayName(profile.rol)}
                      disabled
                      icon={Shield}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Opslaan...' : 'Opslaan'}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* User Management - Admin Only */}
            {user?.rol === 'admin' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-olive" />
                      <h2 className="text-lg font-lino-caps text-ppblack">
                        Gebruikersbeheer
                      </h2>
                    </div>
                    <Button
                      onClick={() => setShowUserForm(true)}
                      className="flex items-center space-x-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Nieuwe Gebruiker</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  {/* Search functionality */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Zoek gebruikers op naam, email, telefoon of ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {displayUsers.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Geen gebruikers gevonden</p>
                        {searchTerm && (
                          <p className="text-sm text-gray-400 mt-2">
                            Probeer een andere zoekterm
                          </p>
                        )}
                      </div>
                    ) : (
                      displayUsers.map((userItem) => (
                      <div key={userItem.id}>
                        <div className={`flex items-center justify-between p-4 rounded-lg ${
                          userItem.naam === 'Filip Van Hoeck' 
                            ? 'bg-yellow-200 border-2 border-yellow-300 shadow-md' 
                            : 'bg-yellow-50 border border-gray-200'
                        }`}>
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-olive bg-opacity-20 rounded-full flex items-center justify-center">
                              {userItem.naam === 'Filip Van Hoeck' ? (
                                <Image 
                                  src="/kip2.png" 
                                  alt="User icon" 
                                  width={40} 
                                  height={40}
                                  className="object-contain w-full h-full rounded-full"
                                  priority
                                />
                              ) : (
                                <User className="h-5 w-5 text-olive" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-ppblack flex items-center">
                                {userItem.naam}
                                {userItem.naam === 'Filip Van Hoeck' && (
                                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <Image 
                                      src="/kip2.png" 
                                      alt="Crown icon" 
                                      width={16} 
                                      height={16}
                                      className="mr-1"
                                      priority
                                    />
                                    Administrator
                                  </span>
                                )}
                              </h3>
                              <div className="space-y-1">
                                <p className="text-sm text-olive flex items-center">
                                  <Key className="h-3 w-3 mr-1" />
                                  <span className="font-mono font-semibold text-christmas">
                                    {userItem.user_id || 'Geen login code'}
                                  </span>
                                  <span className="ml-1 text-xs text-olive opacity-75">(Login Code)</span>
                                </p>
                                <p className="text-sm text-olive flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {userItem.email || 'Geen email'}
                                </p>
                                <p className="text-sm text-olive flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {userItem.telefoon || 'Geen telefoon'}
                                </p>
                                <p className="text-sm text-olive flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  ID: {userItem.id}
                                </p>
                                <p className="text-sm text-olive flex items-center">
                                  <Shield className="h-3 w-3 mr-1" />
                                  {getRoleDisplayName(userItem.rol)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              userItem.actief 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {userItem.actief ? 'Actief' : 'Inactief'}
                            </span>
                            
                            {/* Edit user button - only show for admin */}
                            {user?.rol === 'admin' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditUser(userItem)}
                                title="Bewerk gebruiker"
                              >
                                <SettingsIcon className="h-4 w-4" />
                              </Button>
                            )}

                            {/* Role toggle button - only show for non-admin users and if current user is admin */}
                            {user?.rol === 'admin' && userItem.id !== user.id && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleRoleCollapse(userItem.id)}
                                title="Rol beheer"
                              >
                                {collapsedRoles.has(userItem.id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteUser(userItem.id)}
                              disabled={userItem.rol === 'admin'}
                              title={userItem.rol === 'admin' ? 'Admin account kan niet worden verwijderd' : 'Verwijder gebruiker'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Role Switcher for Admin - only show when expanded */}
                        {user?.rol === 'admin' && userItem.id !== user.id && collapsedRoles.has(userItem.id) && (
                          <div className="mt-2">
                            <RoleSwitcher
                              userId={userItem.id}
                              currentRole={userItem.rol}
                              userName={userItem.naam}
                              onRoleChanged={() => {
                                // Refresh users list
                                loadUsers()
                              }}
                            />
                          </div>
                        )}
                      </div>
                      ))
                    )}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* New User Form Modal */}
            {showUserForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold text-ppblack mb-4">Nieuwe Gebruiker</h3>
                  <div className="space-y-4">
                    <Input
                      label="Naam"
                      value={newUser.naam}
                      onChange={(e) => setNewUser(prev => ({ ...prev, naam: e.target.value }))}
                      placeholder="Volledige naam"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                      </label>
                      <select
                        value={newUser.rol}
                        onChange={(e) => setNewUser(prev => ({ ...prev, rol: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="storemanager">Store Manager</option>
                        <option value="inspector">Inspector</option>
                        <option value="developer">Developer</option>
                      </select>
                    </div>
                    <Input
                      label="Telefoon"
                      value={newUser.telefoon}
                      onChange={(e) => setNewUser(prev => ({ ...prev, telefoon: e.target.value }))}
                      placeholder="+32 123 456 789"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="secondary"
                      onClick={() => setShowUserForm(false)}
                    >
                      Annuleren
                    </Button>
                    <Button
                      onClick={handleCreateUser}
                      disabled={saving || !newUser.naam}
                    >
                      {saving ? 'Aanmaken...' : 'Aanmaken'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit User Form Modal */}
            {editingUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold text-ppblack mb-4">Gebruiker Bewerken</h3>
                  <div className="space-y-4">
                    <Input
                      label="Naam"
                      value={editForm.naam}
                      onChange={(e) => setEditForm(prev => ({ ...prev, naam: e.target.value }))}
                      placeholder="Volledige naam"
                    />
                    <Input
                      label="E-mail"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="gebruiker@poulepoulette.be"
                      icon={Mail}
                    />
                    <Input
                      label="Telefoon"
                      value={editForm.telefoon}
                      onChange={(e) => setEditForm(prev => ({ ...prev, telefoon: e.target.value }))}
                      placeholder="+32 123 456 789"
                      icon={Phone}
                    />
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="secondary"
                      onClick={cancelEdit}
                    >
                      Annuleren
                    </Button>
                    <Button
                      onClick={saveUserEdit}
                      disabled={saving || !editForm.naam}
                    >
                      {saving ? 'Opslaan...' : 'Opslaan'}
                    </Button>
                  </div>
                </div>
              </div>
            )}


          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-olive" />
                  <h2 className="text-lg font-lino-caps text-ppblack">
                    Account Informatie
                  </h2>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      {profile.naam === 'Filip Van Hoeck' ? (
                        <Image 
                          src="/kip2.png" 
                          alt="User profile" 
                          width={64} 
                          height={64}
                          className="object-contain w-full h-full rounded-full"
                          priority
                        />
                      ) : (
                        <User className="h-8 w-8 text-olive" />
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-ppblack">{profile.naam}</h3>
                    <p className="text-sm text-olive">ID: {profile.user_id}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-olive bg-opacity-20 text-olive mt-2">
                      {getRoleDisplayName(profile.rol)}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-lino-caps text-ppblack">
                  Snelle Acties
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <Button
                    variant="danger"
                    onClick={signOut}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Uitloggen
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <MobileNavigation />
    </div>
  )
}
