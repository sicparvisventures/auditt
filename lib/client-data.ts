import { Filiaal, Gebruiker, Audit, AuditChecklistItem, KPIData } from '@/types'
import { supabaseDb } from './supabase-db'

// Client-side data service that replaces API routes
export class ClientDataService {
  private static instance: ClientDataService
  private isInitialized = false

  static getInstance(): ClientDataService {
    if (!ClientDataService.instance) {
      ClientDataService.instance = new ClientDataService()
    }
    return ClientDataService.instance
  }

  private constructor() {
    this.initialize()
  }

  private async initialize() {
    if (this.isInitialized) return
    this.isInitialized = true
    console.log('ClientDataService initialized')
  }

  // Authentication methods
  async authenticateUser(userId: string, password: string): Promise<Gebruiker | null> {
    // Only use Supabase - no fallback to local
    try {
      const user = await supabaseDb.authenticateUser(userId, password)
      if (user) {
        console.log('✅ Supabase authentication successful:', user.id)
        return user
      }
    } catch (error) {
      console.log('❌ Supabase auth failed:', error)
    }
    
    return null
  }

  async getUserById(id: string): Promise<Gebruiker | null> {
    // Only use Supabase - no fallback to local
    try {
      const user = await supabaseDb.getUserById(id)
      if (user) return user
    } catch (error) {
      console.log('❌ Supabase getUserById failed:', error)
    }
    return null
  }

  // Filiaal methods
  async getFilialen(districtManagerId?: string): Promise<Filiaal[]> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.getFilialen(districtManagerId)
    } catch (error) {
      console.log('❌ Supabase getFilialen failed:', error)
      return []
    }
  }

  async getFiliaalById(id: string): Promise<Filiaal | null> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.getFiliaalById(id)
    } catch (error) {
      console.log('❌ Supabase getFiliaalById failed:', error)
      return null
    }
  }

  // Audit methods
  async getAudits(filters?: {
    filiaalId?: string
    districtManagerId?: string
    status?: string
    limit?: number
    offset?: number
  }): Promise<Audit[]> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.getAudits(filters)
    } catch (error) {
      console.log('❌ Supabase getAudits failed:', error)
      return []
    }
  }

  async getAuditById(id: string): Promise<Audit | null> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.getAuditById(id)
    } catch (error) {
      console.log('❌ Supabase getAuditById failed:', error)
      return null
    }
  }

  async createAudit(auditData: Partial<Audit>): Promise<Audit> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.createAudit(auditData)
    } catch (error) {
      console.log('❌ Supabase createAudit failed:', error)
      throw error
    }
  }

  async updateAudit(id: string, updates: Partial<Audit>): Promise<Audit | null> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.updateAudit(id, updates)
    } catch (error) {
      console.log('❌ Supabase updateAudit failed:', error)
      return null
    }
  }

  // Checklist methods
  async getChecklistItems(): Promise<AuditChecklistItem[]> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.getChecklistItems()
    } catch (error) {
      console.log('❌ Supabase getChecklistItems failed:', error)
      return []
    }
  }

  // KPI methods
  async getKPIData(filiaalId?: string): Promise<KPIData> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.getKPIData(filiaalId)
    } catch (error) {
      console.log('❌ Supabase getKPIData failed:', error)
      return {
        totaal_audits: 0,
        gemiddelde_score: 0,
        pass_percentage: 0,
        verbeterpunten: [],
        trends: []
      }
    }
  }

  // Actions methods
  async getActions(filiaalId?: string): Promise<any[]> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.getActions(filiaalId)
    } catch (error) {
      console.log('❌ Supabase getActions failed:', error)
      return []
    }
  }

  async getActionById(id: string): Promise<any | null> {
    try {
      return await supabaseDb.getActionById(id)
    } catch (error) {
      console.log('❌ Supabase getActionById failed:', error)
      return null
    }
  }

  async updateActionStatus(id: string, status: string, userId: string, actieOnderneem?: string, fotoUrls?: string[]): Promise<boolean> {
    try {
      return await supabaseDb.updateActionStatus(id, status, userId, actieOnderneem, fotoUrls)
    } catch (error) {
      console.log('❌ Supabase updateActionStatus failed:', error)
      return false
    }
  }

  async updateActionVerification(id: string, verificatieOpmerkingen: string, userId: string): Promise<boolean> {
    try {
      return await supabaseDb.updateActionVerification(id, verificatieOpmerkingen, userId)
    } catch (error) {
      console.log('❌ Supabase updateActionVerification failed:', error)
      return false
    }
  }

  async createActionsFromAuditResults(auditId: string): Promise<boolean> {
    try {
      return await supabaseDb.createActionsFromAuditResults(auditId)
    } catch (error) {
      console.log('❌ Supabase createActionsFromAuditResults failed:', error)
      return false
    }
  }

  async testDatabaseFunctions(): Promise<any> {
    try {
      return await supabaseDb.testDatabaseFunctions()
    } catch (error) {
      console.log('❌ Supabase testDatabaseFunctions failed:', error)
      return { error: error.message }
    }
  }

  async createTestAction(): Promise<boolean> {
    try {
      return await supabaseDb.createTestAction()
    } catch (error) {
      console.log('❌ Supabase createTestAction failed:', error)
      return false
    }
  }

  async createActionsManually(auditId: string): Promise<boolean> {
    try {
      return await supabaseDb.createActionsManually(auditId)
    } catch (error) {
      console.log('❌ Supabase createActionsManually failed:', error)
      return false
    }
  }


  async updateAction(id: string, updates: any): Promise<any | null> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.updateAction(id, updates)
    } catch (error) {
      console.log('❌ Supabase updateAction failed:', error)
      return null
    }
  }

  // User management methods
  async getAllUsers(): Promise<Gebruiker[]> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.getAllUsers()
    } catch (error) {
      console.log('❌ Supabase getAllUsers failed:', error)
      return []
    }
  }

  async createUser(user: Partial<Gebruiker>): Promise<Gebruiker> {
    // Only use Supabase - no fallback to local
    try {
      if (!user.naam || !user.rol || !user.telefoon) {
        throw new Error('Missing required fields: naam, rol, telefoon')
      }
      return await supabaseDb.createUser({
        naam: user.naam,
        rol: user.rol,
        telefoon: user.telefoon
      })
    } catch (error) {
      console.log('❌ Supabase createUser failed:', error)
      throw error
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.deleteUser(id)
    } catch (error) {
      console.log('❌ Supabase deleteUser failed:', error)
      return false
    }
  }

  async updateUser(id: string, updates: Partial<Gebruiker>): Promise<Gebruiker | null> {
    // Only use Supabase - no fallback to local
    try {
      console.log('🔍 ClientDataService updateUser called with:')
      console.log('  - id:', id)
      console.log('  - updates:', updates)
      
      const result = await supabaseDb.updateUser(id, updates)
      
      if (result) {
        console.log('✅ ClientDataService updateUser successful:', result)
      } else {
        console.log('❌ ClientDataService updateUser failed - no result')
      }
      
      return result
    } catch (error) {
      console.log('❌ Supabase updateUser failed:', error)
      return null
    }
  }

  async getUserByEmail(email: string): Promise<Gebruiker | null> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.getUserByEmail(email)
    } catch (error) {
      console.log('❌ Supabase getUserByEmail failed:', error)
      return null
    }
  }

  // Audit results methods
  async addAuditResults(auditId: string, results: any[]): Promise<void> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.addAuditResults(auditId, results)
    } catch (error) {
      console.log('❌ Supabase addAuditResults failed:', error)
      throw error
    }
  }

  async getAuditResults(auditId: string): Promise<any[]> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.getAuditResults(auditId)
    } catch (error) {
      console.log('❌ Supabase getAuditResults failed:', error)
      return []
    }
  }

  async deleteAudit(auditId: string): Promise<boolean> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.deleteAudit(auditId)
    } catch (error) {
      console.log('❌ Supabase deleteAudit failed:', error)
      throw error
    }
  }

  // File upload methods
  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.uploadFile(file)
    } catch (error) {
      console.log('❌ Supabase uploadFile failed:', error)
      throw error
    }
  }

  // Report methods
  async sendAuditReport(auditId: string): Promise<any> {
    // Only use Supabase - no fallback to local
    try {
      return await supabaseDb.sendAuditReport(auditId)
    } catch (error) {
      console.log('❌ Supabase sendAuditReport failed:', error)
      throw error
    }
  }
}

// Export singleton instance
export const clientDataService = ClientDataService.getInstance()
