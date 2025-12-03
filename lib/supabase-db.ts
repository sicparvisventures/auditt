import { supabase } from './supabase'
import { Filiaal, Gebruiker, Audit, AuditChecklistItem, KPIData } from '@/types'

// Supabase database service
export class SupabaseDatabase {
  // Authentication methods
  async authenticateUser(userId: string, password: string): Promise<Gebruiker | null> {
    try {
      const { data, error } = await supabase
        .from('gebruikers')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error || !data) return null

      // For demo purposes, we'll allow login without password check
      // In production, you'd implement proper password hashing
      return data as Gebruiker
    } catch (error) {
      console.error('Authentication error:', error)
      return null
    }
  }

  async getUserById(id: string): Promise<Gebruiker | null> {
    try {
      const { data, error } = await supabase
        .from('gebruikers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) return null
      return data as Gebruiker
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  }

  async getUserByUserId(userId: string): Promise<Gebruiker | null> {
    try {
      const { data, error } = await supabase
        .from('gebruikers')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) return null
      return data as Gebruiker
    } catch (error) {
      console.error('Get user by user_id error:', error)
      return null
    }
  }

  // Filiaal methods
  async getFilialen(districtManagerId?: string): Promise<Filiaal[]> {
    try {
      let query = supabase.from('filialen').select('*')
      
      if (districtManagerId) {
        query = query.eq('district_manager_id', districtManagerId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Get filialen error:', error)
        return []
      }

      return data as Filiaal[]
    } catch (error) {
      console.error('Get filialen error:', error)
      return []
    }
  }

  async getFiliaalById(id: string): Promise<Filiaal | null> {
    try {
      const { data, error } = await supabase
        .from('filialen')
        .select('*')
        .eq('id', id)
        .single()

      if (error) return null
      return data as Filiaal
    } catch (error) {
      console.error('Get filiaal error:', error)
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
    try {
      let query = supabase
        .from('audits')
        .select(`
          *,
          filialen:filiaal_id (
            id,
            naam,
            locatie,
            adres,
            telefoon,
            email,
            status
          ),
          gebruikers:district_manager_id (
            id,
            user_id,
            naam,
            rol,
            telefoon,
            actief
          )
        `)

      if (filters?.filiaalId) {
        query = query.eq('filiaal_id', filters.filiaalId)
      }

      if (filters?.districtManagerId) {
        query = query.eq('district_manager_id', filters.districtManagerId)
      }

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
      }

      const { data, error } = await query.order('audit_datum', { ascending: false })

      if (error) {
        console.error('Get audits error:', error)
        return []
      }

      // Transform the data to match the expected structure
      return (data || []).map((audit: any) => ({
        ...audit,
        filiaal: audit.filialen,
        district_manager: audit.gebruikers
      })) as Audit[]
    } catch (error) {
      console.error('Get audits error:', error)
      return []
    }
  }

  async getAuditById(id: string): Promise<Audit | null> {
    try {
      const { data, error } = await supabase
        .from('audits')
        .select(`
          *,
          filialen:filiaal_id (
            id,
            naam,
            locatie,
            adres,
            telefoon,
            email,
            status
          ),
          gebruikers:district_manager_id (
            id,
            user_id,
            naam,
            rol,
            telefoon,
            actief
          )
        `)
        .eq('id', id)
        .single()

      if (error) return null
      
      // Get audit results with checklist items
      const results = await this.getAuditResults(id)
      
      // Transform the data to match the expected structure
      return {
        ...data,
        filiaal: data.filialen,
        district_manager: data.gebruikers,
        resultaten: results
      } as Audit
    } catch (error) {
      console.error('Get audit error:', error)
      return null
    }
  }

  async createAudit(auditData: Partial<Audit>): Promise<Audit> {
    try {
      const { data, error } = await supabase
        .from('audits')
        .insert({
          filiaal_id: auditData.filiaal_id,
          district_manager_id: auditData.district_manager_id,
          audit_datum: auditData.audit_datum,
          status: auditData.status || 'in_progress',
          totale_score: auditData.totale_score || 0,
          pass_percentage: auditData.pass_percentage || 0,
          opmerkingen: auditData.opmerkingen
        })
        .select()
        .single()

      if (error) throw error
      return data as Audit
    } catch (error) {
      console.error('Create audit error:', error)
      throw error
    }
  }

  async updateAudit(id: string, updates: Partial<Audit>): Promise<Audit | null> {
    try {
      const { data, error } = await supabase
        .from('audits')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) return null
      return data as Audit
    } catch (error) {
      console.error('Update audit error:', error)
      return null
    }
  }

  // Audit Results methods
  async addAuditResults(auditId: string, results: any[]): Promise<void> {
    try {
      // First, delete existing results for this audit
      await supabase
        .from('audit_resultaten')
        .delete()
        .eq('audit_id', auditId)

      // Then insert new results with proper null handling
      const auditResults = results.map(result => ({
        audit_id: auditId,
        checklist_item_id: result.checklist_item_id,
        resultaat: result.resultaat,
        score: result.resultaat === 'ok' ? 5 : 0,
        opmerkingen: (result.opmerkingen && result.opmerkingen.trim()) ? result.opmerkingen.trim() : null,
        foto_urls: result.foto_urls || [],
        verbeterpunt: (result.verbeterpunt && result.verbeterpunt.trim()) ? result.verbeterpunt.trim() : null
      }))

      console.log('💾 Supabase - Saving audit results:', auditResults.map(r => ({
        checklist_item_id: r.checklist_item_id,
        resultaat: r.resultaat,
        opmerkingen: r.opmerkingen,
        verbeterpunt: r.verbeterpunt
      })))

      const { error } = await supabase
        .from('audit_resultaten')
        .insert(auditResults)

      if (error) throw error
    } catch (error) {
      console.error('Add audit results error:', error)
      throw error
    }
  }

  async getAuditResults(auditId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('audit_resultaten')
        .select(`
          *,
          audit_checklist_items!inner(
            id,
            titel,
            beschrijving,
            categorie,
            gewicht
          )
        `)
        .eq('audit_id', auditId)

      if (error) {
        console.error('Get audit results error:', error)
        return []
      }

      // Transform the data to match the expected structure
      return (data || []).map(result => ({
        ...result,
        checklist_item: result.audit_checklist_items
      }))
    } catch (error) {
      console.error('Get audit results error:', error)
      return []
    }
  }

  async deleteAudit(auditId: string): Promise<boolean> {
    try {
      // First delete all related audit results
      const { error: resultsError } = await supabase
        .from('audit_resultaten')
        .delete()
        .eq('audit_id', auditId)

      if (resultsError) {
        console.error('Delete audit results error:', resultsError)
        return false
      }

      // Then delete all related actions
      const { error: actionsError } = await supabase
        .from('acties')
        .delete()
        .eq('audit_id', auditId)

      if (actionsError) {
        console.error('Delete audit actions error:', actionsError)
        return false
      }

      // Finally delete the audit itself
      const { error: auditError } = await supabase
        .from('audits')
        .delete()
        .eq('id', auditId)

      if (auditError) {
        console.error('Delete audit error:', auditError)
        return false
      }

      return true
    } catch (error) {
      console.error('Delete audit error:', error)
      return false
    }
  }

  // Checklist methods
  async getChecklistItems(): Promise<AuditChecklistItem[]> {
    try {
      const { data, error } = await supabase
        .from('audit_checklist_items')
        .select('*')
        .eq('actief', true)
        .order('volgorde')

      if (error) {
        console.error('Get checklist items error:', error)
        return []
      }

      return data as AuditChecklistItem[]
    } catch (error) {
      console.error('Get checklist items error:', error)
      return []
    }
  }

  // Actions methods
  async getActions(filiaalId?: string): Promise<any[]> {
    try {
      let query = supabase.from('acties').select(`
        *,
        audits!inner(
          id,
          filiaal_id,
          audit_datum,
          totale_score,
          pass_percentage,
          filialen!inner(
            id,
            naam,
            locatie
          )
        ),
        audit_resultaten!inner(
          id,
          checklist_item_id,
          resultaat,
          score,
          opmerkingen,
          verbeterpunt,
          audit_checklist_items!inner(
            id,
            categorie,
            titel,
            beschrijving,
            gewicht
          )
        )
      `)

      if (filiaalId) {
        query = query.eq('audits.filiaal_id', filiaalId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Get actions error:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Get actions error:', error)
      return []
    }
  }

  async getActionById(id: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('acties')
        .select(`
          *,
          audits!inner(
            id,
            filiaal_id,
            audit_datum,
            totale_score,
            pass_percentage,
            filialen!inner(
              id,
              naam,
              locatie
            )
          ),
          audit_resultaten!inner(
            id,
            checklist_item_id,
            resultaat,
            score,
            opmerkingen,
            verbeterpunt,
            audit_checklist_items!inner(
              id,
              categorie,
              titel,
              beschrijving,
              gewicht
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) return null
      return data
    } catch (error) {
      console.error('Get action error:', error)
      return null
    }
  }

  async updateActionStatus(id: string, status: string, userId: string, actieOnderneem?: string, fotoUrls?: string[]): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      }

      if (status === 'completed') {
        updateData.voltooid_door = userId
        updateData.voltooid_op = new Date().toISOString()
        if (actieOnderneem) updateData.actie_onderneem = actieOnderneem
        if (fotoUrls) updateData.foto_urls = fotoUrls
      } else if (status === 'verified') {
        updateData.geverifieerd_door = userId
        updateData.geverifieerd_op = new Date().toISOString()
      }

      const { error } = await supabase
        .from('acties')
        .update(updateData)
        .eq('id', id)

      if (error) {
        console.error('Update action status error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Update action status error:', error)
      return false
    }
  }

  async updateActionVerification(id: string, verificatieOpmerkingen: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('acties')
        .update({
          verificatie_opmerkingen: verificatieOpmerkingen,
          geverifieerd_door: userId,
          geverifieerd_op: new Date().toISOString(),
          status: 'verified',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        console.error('Update action verification error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Update action verification error:', error)
      return false
    }
  }

  async createActionsFromAuditResults(auditId: string): Promise<boolean> {
    try {
      console.log('🔧 Calling create_actions_from_audit_results for audit:', auditId)
      
      const { data, error } = await supabase.rpc('create_actions_from_audit_results', {
        audit_id: auditId
      })

      if (error) {
        console.error('❌ Create actions from audit results error:', error)
        return false
      }

      console.log('✅ Actions created successfully:', data)
      return true
    } catch (error) {
      console.error('❌ Create actions from audit results error:', error)
      return false
    }
  }

  async testDatabaseFunctions(): Promise<any> {
    try {
      console.log('🔍 Testing database connection...')
      
      // Test 1: Get audits
      const { data: audits, error: auditError } = await supabase
        .from('audits')
        .select('id, status, audit_datum')
        .limit(5)

      if (auditError) {
        console.error('❌ Error getting audits:', auditError)
        return { error: 'Failed to get audits' }
      }

      console.log('📋 Audits found:', audits)

      // Test 2: Get actions
      const { data: actions, error: actionError } = await supabase
        .from('acties')
        .select('id, titel, status, urgentie')
        .limit(5)

      if (actionError) {
        console.error('❌ Error getting actions:', actionError)
        return { error: 'Failed to get actions' }
      }

      console.log('🎯 Actions found:', actions)

      // Test 3: Check if function exists (optional)
      let functions = []
      try {
        const { data: funcData, error: funcError } = await supabase
          .from('information_schema.routines')
          .select('routine_name, routine_type')
          .eq('routine_schema', 'public')
          .in('routine_name', ['create_actions_from_audit_results', 'determine_action_urgency'])

        if (!funcError) {
          functions = funcData || []
          console.log('📋 Available functions:', functions)
        } else {
          console.log('⚠️ Could not check functions (this is OK):', funcError.message)
        }
      } catch (funcErr) {
        console.log('⚠️ Could not check functions (this is OK):', funcErr.message)
      }

      return {
        functions: functions,
        audits: audits || [],
        actions: actions || []
      }
    } catch (error) {
      console.error('❌ Test database functions error:', error)
      return { error: error.message }
    }
  }

  async createTestAction(): Promise<boolean> {
    try {
      console.log('🔧 Creating test action...')
      
      // Create a simple test action directly
      const { data, error } = await supabase
        .from('acties')
        .insert({
          titel: 'Test Actie - Database Test',
          beschrijving: 'Dit is een test actie om te controleren of de database werkt',
          urgentie: 'medium',
          status: 'pending',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
        })
        .select()

      if (error) {
        console.error('❌ Error creating test action:', error)
        return false
      }

      console.log('✅ Test action created:', data)
      return true
    } catch (error) {
      console.error('❌ Create test action error:', error)
      return false
    }
  }

  async createActionsManually(auditId: string): Promise<boolean> {
    try {
      console.log('🔧 Creating actions manually for audit:', auditId)
      
      // Get audit results for this audit
      const { data: auditResults, error: resultsError } = await supabase
        .from('audit_resultaten')
        .select(`
          id,
          checklist_item_id,
          resultaat,
          score,
          opmerkingen,
          verbeterpunt,
          audit_checklist_items (
            categorie,
            titel,
            beschrijving,
            gewicht
          )
        `)
        .eq('audit_id', auditId)

      if (resultsError) {
        console.error('❌ Error getting audit results:', resultsError)
        return false
      }

      console.log('📋 Audit results found:', auditResults)

      if (!auditResults || auditResults.length === 0) {
        console.log('⚠️ No audit results found for this audit')
        return false
      }

      let actionsCreated = 0

      // Create actions for each result that needs one
      for (const result of auditResults) {
        // Check if action is needed (score < 4 or resultaat = 'niet_ok')
        if (result.resultaat === 'niet_ok' || result.score < 4) {
          // Determine urgency
          let urgency = 'low'
          if (result.score <= 1) {
            urgency = 'high'
          } else if (result.score <= 2) {
            urgency = 'medium'
          }

          // Set deadline based on urgency
          let deadline = new Date()
          switch (urgency) {
            case 'high':
              deadline.setDate(deadline.getDate() + 3)
              break
            case 'medium':
              deadline.setDate(deadline.getDate() + 7)
              break
            default:
              deadline.setDate(deadline.getDate() + 14)
          }

          // Create action
          const { error: actionError } = await supabase
            .from('acties')
            .insert({
              audit_id: auditId,
              audit_resultaat_id: result.id,
              titel: `Actie vereist: ${result.audit_checklist_items?.titel || 'Onbekend item'}`,
              beschrijving: (result.verbeterpunt || result.audit_checklist_items?.beschrijving || 'Actie vereist') + 
                (result.opmerkingen ? ` Opmerkingen: ${result.opmerkingen}` : ''),
              urgentie: urgency,
              status: 'pending',
              deadline: deadline.toISOString().split('T')[0]
            })

          if (actionError) {
            console.error('❌ Error creating action:', actionError)
          } else {
            actionsCreated++
            console.log(`✅ Action created for result ${result.id}`)
          }
        }
      }

      console.log(`✅ Created ${actionsCreated} actions for audit ${auditId}`)
      return actionsCreated > 0
    } catch (error) {
      console.error('❌ Create actions manually error:', error)
      return false
    }
  }

  async updateAction(id: string, updates: any): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('acties')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) return null
      return data
    } catch (error) {
      console.error('Update action error:', error)
      return null
    }
  }

  // User management methods
  async getAllUsers(): Promise<Gebruiker[]> {
    try {
      const { data, error } = await supabase
        .from('gebruikers')
        .select('*')
        .order('naam')

      if (error) {
        console.error('Get all users error:', error)
        return []
      }

      return data as Gebruiker[]
    } catch (error) {
      console.error('Get all users error:', error)
      return []
    }
  }

  async createUser(userData: { naam: string; rol: string; telefoon: string }): Promise<Gebruiker> {
    try {
      console.log('Supabase createUser called with:', userData)
      
      // Let the database trigger generate the user_id automatically
      const { data, error } = await supabase
        .from('gebruikers')
        .insert({
          user_id: null, // Will be generated by database trigger
          naam: userData.naam,
          rol: userData.rol,
          telefoon: userData.telefoon,
          actief: true
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase createUser error:', error)
        throw new Error(`Database error: ${error.message}`)
      }
      
      console.log('Supabase createUser success:', data)
      return data as Gebruiker
    } catch (error) {
      console.error('Create user error:', error)
      throw error
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('gebruikers')
        .delete()
        .eq('id', id)

      return !error
    } catch (error) {
      console.error('Delete user error:', error)
      return false
    }
  }

  async updateUser(id: string, updates: Partial<Gebruiker>): Promise<Gebruiker | null> {
    try {
      console.log('🔍 Supabase updateUser called with:')
      console.log('  - id:', id)
      console.log('  - updates:', updates)
      
      const { data, error } = await supabase
        .from('gebruikers')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ Update user error:', error)
        return null
      }

      console.log('✅ User updated successfully:', data)
      return data as Gebruiker
    } catch (error) {
      console.error('❌ Update user error:', error)
      return null
    }
  }

  async getUserByEmail(email: string): Promise<Gebruiker | null> {
    try {
      console.log('🔍 Supabase getUserByEmail called with email:', email)
      const { data, error } = await supabase
        .from('gebruikers')
        .select('*')
        .eq('user_id', email)
        .single()

      console.log('🔍 Supabase getUserByEmail result:', { data, error })
      if (error) {
        console.log('❌ Supabase getUserByEmail error:', error)
        return null
      }
      return data as Gebruiker
    } catch (error) {
      console.error('❌ Get user by email error:', error)
      return null
    }
  }

  // KPI methods
  async getKPIData(filiaalId?: string): Promise<KPIData> {
    try {
      // Get total audits
      let auditsQuery = supabase
        .from('audits')
        .select('id, totale_score, status, audit_datum, pass_percentage')
      
      if (filiaalId) {
        auditsQuery = auditsQuery.eq('filiaal_id', filiaalId)
      }

      const { data: audits, error: auditsError } = await auditsQuery

      if (auditsError) {
        console.error('Get audits for KPI error:', auditsError)
        return this.getDefaultKPIData()
      }

      const totalAudits = audits?.length || 0
      const completedAudits = audits?.filter(a => a.status === 'completed') || []
      const averageScore = completedAudits.length > 0 
        ? completedAudits.reduce((sum, a) => sum + (a.totale_score || 0), 0) / completedAudits.length 
        : 0
      const passRate = completedAudits.length > 0 
        ? (completedAudits.filter(a => (a.pass_percentage || 0) >= 80).length / completedAudits.length) * 100 
        : 0

      // Get actions for this filiaal
      let actionsQuery = supabase
        .from('acties')
        .select('id, status, urgentie')
      
      if (filiaalId) {
        actionsQuery = actionsQuery.eq('filiaal_id', filiaalId)
      }

      const { data: actions, error: actionsError } = await actionsQuery
      const actionsData = actions || []

      const pendingActions = actionsData.filter(a => a.status === 'pending').length
      const completedActions = actionsData.filter(a => a.status === 'completed').length
      const criticalActions = actionsData.filter(a => a.urgentie === 'critical').length

      // Get improvement points from audit results
      let verbeterpuntenQuery = supabase
        .from('audit_resultaten')
        .select('verbeterpunt, created_at')
        .not('verbeterpunt', 'is', null)
        .not('verbeterpunt', 'eq', '')
      
      if (filiaalId) {
        // Join with audits to filter by filiaal
        verbeterpuntenQuery = supabase
          .from('audit_resultaten')
          .select(`
            verbeterpunt, 
            created_at,
            audits!inner(filiaal_id)
          `)
          .not('verbeterpunt', 'is', null)
          .not('verbeterpunt', 'eq', '')
          .eq('audits.filiaal_id', filiaalId)
      }

      const { data: verbeterpuntenData, error: verbeterpuntenError } = await verbeterpuntenQuery
      
      // Group verbeterpunten by content and count frequency
      const verbeterpuntenMap = new Map<string, { count: number; lastOccurrence: string }>()
      
      if (verbeterpuntenData) {
        verbeterpuntenData.forEach(item => {
          if (item.verbeterpunt) {
            const existing = verbeterpuntenMap.get(item.verbeterpunt)
            if (existing) {
              existing.count++
              if (item.created_at > existing.lastOccurrence) {
                existing.lastOccurrence = item.created_at
              }
            } else {
              verbeterpuntenMap.set(item.verbeterpunt, {
                count: 1,
                lastOccurrence: item.created_at
              })
            }
          }
        })
      }

      const verbeterpunten = Array.from(verbeterpuntenMap.entries())
        .map(([item, data]) => ({
          item,
          frequentie: data.count,
          laatste_voorkomen: data.lastOccurrence
        }))
        .sort((a, b) => b.frequentie - a.frequentie)
        .slice(0, 5) // Top 5 most frequent

      return {
        totaal_audits: totalAudits,
        gemiddelde_score: averageScore,
        pass_percentage: passRate,
        verbeterpunten,
        trends: []
      }
    } catch (error) {
      console.error('Get KPI data error:', error)
      return this.getDefaultKPIData()
    }
  }

  private getDefaultKPIData(): KPIData {
    return {
      totaal_audits: 0,
      gemiddelde_score: 0,
      pass_percentage: 0,
      verbeterpunten: [],
      trends: []
    }
  }

  // File upload methods
  async uploadFile(file: File, bucket: string = 'uploads', path?: string): Promise<{ url: string; filename: string }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `audit-photos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return {
        url: publicUrl,
        filename: fileName
      }
    } catch (error) {
      console.error('Upload file error:', error)
      throw error
    }
  }

  // Report methods
  async sendAuditReport(auditId: string): Promise<any> {
    try {
      console.log('📧 Supabase sendAuditReport called for audit:', auditId)
      
      // Call the database function that handles the correct email mapping
      const { data, error } = await supabase.rpc('send_audit_report_to_relevant_emails', {
        audit_id_param: auditId
      })

      if (error) {
        console.error('❌ Send audit report error:', error)
        throw error
      }

      console.log('📧 Supabase sendAuditReport success:', data)
      return data[0] // Return first result
    } catch (error) {
      console.error('❌ Send audit report error:', error)
      throw error
    }
  }

  // Helper methods
  // User ID generation is now handled by database trigger
}

// Export singleton instance
export const supabaseDb = new SupabaseDatabase()
