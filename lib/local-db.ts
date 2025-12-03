import { Filiaal, Gebruiker, Audit, AuditChecklistItem, KPIData } from '@/types'
import { demoActions } from './demo-data'

// Lokale database simulatie
class LocalDatabase {
  private users: Gebruiker[] = []
  private filialen: Filiaal[] = []
  private audits: Audit[] = []
  private checklistItems: AuditChecklistItem[] = []
  private actions: any[] = []
  private auditResults: any[] = []

  constructor() {
    console.log('Initializing LocalDatabase...')
    this.loadFromStorage()
    console.log('LocalDatabase initialized with', this.users.length, 'users')
    console.log('Users:', this.users.map(u => u.email))
  }

  private loadFromStorage() {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        console.log('🌐 Server-side rendering detected, using default data')
        this.initializeData()
        return
      }
      
      const storedData = localStorage.getItem('audit_database')
      if (storedData) {
        const data = JSON.parse(storedData)
        console.log('📦 Loading database from localStorage:', data)
        this.users = data.users || []
        this.filialen = data.filialen || []
        this.audits = data.audits || []
        this.checklistItems = data.checklistItems || []
        this.actions = data.actions || []
        this.auditResults = data.auditResults || []
        console.log('🔍 Loaded audit results from storage:', this.auditResults.length)
        console.log('🔍 Loaded actions from storage:', this.actions.length, 'actions')
        
        // Force reinitialize actions if they're missing
        if (!this.actions || this.actions.length === 0) {
          console.log('⚠️ No actions found in storage, reinitializing...')
          this.actions = [...demoActions]
          this.saveToStorage()
        }
        
        console.log('✅ Database loaded from localStorage')
      } else {
        console.log('📭 No stored database found, initializing with default data')
        this.initializeData()
        this.saveToStorage()
      }
    } catch (error) {
      console.error('❌ Error loading database from localStorage:', error)
      console.log('🔄 Falling back to default data')
      this.initializeData()
      this.saveToStorage()
    }
  }

  private saveToStorage() {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        console.log('🌐 Server-side rendering detected, skipping localStorage save')
        return
      }
      
      // Clear old audit results to prevent quota exceeded
      if (this.auditResults.length > 100) {
        console.log('🧹 Cleaning old audit results to prevent quota exceeded')
        this.auditResults = this.auditResults.slice(-50) // Keep only last 50 results
      }
      
      const data = {
      users: this.users,
      filialen: this.filialen,
      audits: this.audits,
      checklistItems: this.checklistItems,
      actions: this.actions,
      auditResults: this.auditResults
      }
      
      const dataString = JSON.stringify(data)
      console.log('💾 Data size:', Math.round(dataString.length / 1024), 'KB')
      
      localStorage.setItem('audit_database', dataString)
      console.log('💾 Database saved to localStorage')
      console.log('💾 Audit results saved:', this.auditResults.length)
    } catch (error: any) {
      console.error('❌ Error saving database to localStorage:', error)
      if (error.name === 'QuotaExceededError') {
        console.log('🧹 Quota exceeded, clearing old data and retrying...')
        this.clearOldData()
        try {
          const data = {
            users: this.users,
            filialen: this.filialen,
            audits: this.audits,
            checklistItems: this.checklistItems,
            actions: this.actions,
            auditResults: this.auditResults
          }
          localStorage.setItem('audit_database', JSON.stringify(data))
          console.log('✅ Database saved after cleanup')
        } catch (retryError) {
          console.error('❌ Still failed after cleanup:', retryError)
        }
      }
    }
  }

  private clearOldData() {
    // Keep only recent audits and results
    this.audits = this.audits.slice(-20) // Keep last 20 audits
    this.auditResults = this.auditResults.slice(-50) // Keep last 50 results
    console.log('🧹 Cleared old data, kept:', this.audits.length, 'audits and', this.auditResults.length, 'results')
  }

  private initializeData() {
    // Initialize actions
    this.actions = [...demoActions] // Create a copy to avoid reference issues
    console.log('🔍 Initialized actions:', this.actions.length, 'actions')
    console.log('🔍 Actions data:', this.actions)
    
    // Standaard gebruikers
    this.users = [
      {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'ADMIN',
        naam: 'Admin User',
        rol: 'admin',
        telefoon: '+32 123 456 789',
        actief: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        email: 'MAN01',
        naam: 'COO Manager',
        rol: 'coo',
        telefoon: '+32 123 456 790',
        actief: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        email: 'MAN02',
        naam: 'District Manager',
        rol: 'district_manager',
        telefoon: '+32 123 456 791',
        actief: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '00000000-0000-0000-0000-000000000004',
        email: 'USER1',
        naam: 'User',
        rol: 'user' as any,
        telefoon: '+32 123 456 792',
        actief: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    // Filialen
    this.filialen = [
      {
        id: 'filiaal-1',
        naam: 'Gent - KM11',
        locatie: 'Gent',
        district_manager_id: '00000000-0000-0000-0000-000000000003',
        adres: 'Korenmarkt 11, 9000 Gent',
        telefoon: '+32 9 245 75 85',
        email: 'km11@poulepoulette.com',
        status: 'actief',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'filiaal-2',
        naam: 'Etterbeek - PJ70',
        locatie: 'Etterbeek',
        district_manager_id: '00000000-0000-0000-0000-000000000003',
        adres: 'Place Jourdan 70, 1040 Etterbeek',
        telefoon: '+32 2 759 42 97',
        email: 'pj70@poulepoulette.com',
        status: 'actief',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'filiaal-3',
        naam: 'Mechelen - IL36',
        locatie: 'Mechelen',
        district_manager_id: '00000000-0000-0000-0000-000000000003',
        adres: 'Ijzerenleen 36, 2800 Mechelen',
        telefoon: '+32 15 528 35 1',
        email: 'il36@poulepoulette.com',
        status: 'actief',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'filiaal-4',
        naam: 'Leuven - TS15',
        locatie: 'Leuven',
        district_manager_id: '00000000-0000-0000-0000-000000000003',
        adres: 'Tiensestraat 15, 3000 Leuven',
        telefoon: '+32 16 792 15 2',
        email: 'ts15@poulepoulette.com',
        status: 'actief',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'filiaal-5',
        naam: 'Antwerpen - GK2',
        locatie: 'Antwerpen',
        district_manager_id: '00000000-0000-0000-0000-000000000003',
        adres: 'Godfrieduskaai 2, 2000 Antwerpen',
        telefoon: '+32 3 828 38 22',
        email: 'gk2@poulepoulette.com',
        status: 'actief',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'filiaal-6',
        naam: 'Oostende - IL34',
        locatie: 'Oostende',
        district_manager_id: '00000000-0000-0000-0000-000000000003',
        adres: 'Leopold II Laan 34, 8400 Oostende',
        telefoon: '+32 59 709 25 55',
        email: 'il34@poulepoulette.com',
        status: 'actief',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'filiaal-7',
        naam: 'Brussel - TL24',
        locatie: 'Brussel',
        district_manager_id: '00000000-0000-0000-0000-000000000003',
        adres: 'Tervurenlaan 24a, 1040 Brussel',
        telefoon: '+32 2 895 57 00',
        email: 'tl24@poulepoulette.com',
        status: 'actief',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'filiaal-8',
        naam: 'Brussel - SC2',
        locatie: 'Brussel',
        district_manager_id: '00000000-0000-0000-0000-000000000003',
        adres: 'Place Saint-Catherine 2, 1000 Brussel',
        telefoon: '+32 2 895 57 00',
        email: 'sc2@poulepoulette.com',
        status: 'actief',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'filiaal-9',
        naam: 'Brugge - SS3',
        locatie: 'Brugge',
        district_manager_id: '00000000-0000-0000-0000-000000000003',
        adres: 'Simon Stevinplein 3, 8000 Brugge',
        telefoon: '+32 50 893 70 00',
        email: 'ss3@poulepoulette.com',
        status: 'actief',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    // Checklist items - Restaurant District Checklist
    this.checklistItems = [
      // 1. BUITENKANT ZAAK
      {
        id: 'item-1',
        categorie: 'Buitenkant Zaak',
        titel: 'Terras uitnodigend (tafels ingedekt - operationeel)',
        beschrijving: 'Controleer of de tafels netjes zijn gedekt, het terras netjes wordt gepresenteerd en gereed is voor gasten',
        gewicht: 1.5,
        volgorde: 1,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-2',
        categorie: 'Buitenkant Zaak',
        titel: 'Terras proper (vloer/meubilair)',
        beschrijving: 'Vloer en meubilair moeten schoon zijn en er mag geen rommel liggen',
        gewicht: 1.3,
        volgorde: 2,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-3',
        categorie: 'Buitenkant Zaak',
        titel: 'Plantenbakken ok',
        beschrijving: 'Planten mogen niet verwelkt of vuil zijn, dit draagt bij aan een verzorgde uitstraling',
        gewicht: 1.0,
        volgorde: 3,
        actief: true,
        created_at: new Date().toISOString()
      },
      // 2. Spotchecks (bij aankomst)
      {
        id: 'item-4',
        categorie: 'Spotchecks',
        titel: 'Inkomzone proper en ordelijk',
        beschrijving: 'De ingang moet netjes en opgeruimd zijn. Geen rommel, schone vloeren en geen obstakels',
        gewicht: 1.5,
        volgorde: 4,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-5',
        categorie: 'Spotchecks',
        titel: 'Geen sporen van ongedierte (vallen, uitwerpselen, vliegen)',
        beschrijving: 'Controleer op tekenen van ongedierte. Dit kan vallen voor insecten zijn, of sporen van muizen of andere dieren',
        gewicht: 2.0,
        volgorde: 5,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-6',
        categorie: 'Spotchecks',
        titel: 'Vuil- of risicoplaatsen proper (achter toestellen, onder meubels, afvalzone, schoonmaakruimte, ventilatieroosters)',
        beschrijving: 'Deze plekken worden vaak over het hoofd gezien, maar ze kunnen ophoping van vuil of ongedierte veroorzaken',
        gewicht: 1.8,
        volgorde: 6,
        actief: true,
        created_at: new Date().toISOString()
      },
      // 3. Algemene properheid per zone
      {
        id: 'item-7',
        categorie: 'Algemene Properheid',
        titel: 'Keuken',
        beschrijving: 'Werkbladen moeten schoon zijn zonder etensresten, en alle producten moeten goed afgesloten zijn om besmetting te voorkomen',
        gewicht: 2.0,
        volgorde: 7,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-8',
        categorie: 'Algemene Properheid',
        titel: 'Zaal',
        beschrijving: 'Tafels en stoelen moeten schoon zijn, de vloer mag geen vuil bevatten',
        gewicht: 1.5,
        volgorde: 8,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-9',
        categorie: 'Algemene Properheid',
        titel: 'Toiletten',
        beschrijving: 'Ze moeten goed voorzien zijn (papier, zeep), geurvrij en hygiënisch',
        gewicht: 1.8,
        volgorde: 9,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-10',
        categorie: 'Algemene Properheid',
        titel: 'Kelder',
        beschrijving: 'De kelder moet schoon, droog en georganiseerd zijn om risico\'s van schimmel of vuil te vermijden',
        gewicht: 1.3,
        volgorde: 10,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-11',
        categorie: 'Algemene Properheid',
        titel: 'Extra ruimtes/kleedkamers',
        beschrijving: 'Persoonlijke spullen moeten opgeborgen zijn en de ruimte moet netjes zijn',
        gewicht: 1.0,
        volgorde: 11,
        actief: true,
        created_at: new Date().toISOString()
      },
      // 4. FIFO-controle
      {
        id: 'item-12',
        categorie: 'FIFO Controle',
        titel: 'Frigo keuken',
        beschrijving: 'In de koelkasten moet volgens het FIFO-principe (First In, First Out) gewerkt worden en mogen er geen verlopen producten zijn',
        gewicht: 2.0,
        volgorde: 12,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-13',
        categorie: 'FIFO Controle',
        titel: 'Vriezer keuken',
        beschrijving: 'Vriezer moet goed gelabeld zijn met datums en producten moeten goed georganiseerd zijn',
        gewicht: 1.8,
        volgorde: 13,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-14',
        categorie: 'FIFO Controle',
        titel: 'Frigo\'s bar',
        beschrijving: 'Ook hier moet FIFO gevolgd worden en de frigo moet ordelijk zijn zonder verlopen producten',
        gewicht: 1.5,
        volgorde: 14,
        actief: true,
        created_at: new Date().toISOString()
      },
      // 5. Overige operationele checks
      {
        id: 'item-15',
        categorie: 'Operationele Checks',
        titel: 'Personeelsbezetting & planning',
        beschrijving: 'Is het personeel voldoende en goed ingepland voor de drukte? Zorg voor een goede balans tussen rust en piekuren',
        gewicht: 1.5,
        volgorde: 15,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-16',
        categorie: 'Operationele Checks',
        titel: 'Kassaprocedures en dagrapporten',
        beschrijving: 'Is alles correct geregistreerd en zijn de dagrapporten accuraat?',
        gewicht: 1.3,
        volgorde: 16,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-17',
        categorie: 'Operationele Checks',
        titel: 'Voorraadniveaus',
        beschrijving: 'Zorg ervoor dat de voorraad op peil is en er geen tekorten zijn voor de operationele uren',
        gewicht: 1.2,
        volgorde: 17,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-18',
        categorie: 'Operationele Checks',
        titel: 'Acties en promoties correct uitgevoerd',
        beschrijving: 'Zijn de promoties correct gepromoot en uitgevoerd volgens de afspraken?',
        gewicht: 1.0,
        volgorde: 18,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-19',
        categorie: 'Operationele Checks',
        titel: 'Gastbeleving en servicekwaliteit',
        beschrijving: 'Hoe wordt de service ervaren door de gasten? Is er ruimte voor verbetering?',
        gewicht: 1.8,
        volgorde: 19,
        actief: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'item-20',
        categorie: 'Operationele Checks',
        titel: 'Veiligheid (brandblussers, nooduitgangen, EHBO)',
        beschrijving: 'Controleer of de veiligheidsmaatregelen op hun plaats zijn en goed werken',
        gewicht: 1.5,
        volgorde: 20,
        actief: true,
        created_at: new Date().toISOString()
      }
    ]

    // Audits
    this.audits = [
      {
        id: 'audit-1',
        filiaal_id: 'filiaal-1',
        district_manager_id: '00000000-0000-0000-0000-000000000003',
        audit_datum: '2024-01-15',
        status: 'completed',
        totale_score: 4.2,
        pass_percentage: 84.0,
        opmerkingen: 'Goede algemene staat, kleine verbeterpunten bij FIFO controle',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'audit-2',
        filiaal_id: 'filiaal-1',
        district_manager_id: '00000000-0000-0000-0000-000000000003',
        audit_datum: '2024-01-08',
        status: 'completed',
        totale_score: 3.8,
        pass_percentage: 76.0,
        opmerkingen: 'Koelkast temperatuur te hoog, FIFO niet correct nageleefd',
        created_at: '2024-01-08T14:30:00Z',
        updated_at: '2024-01-08T14:30:00Z'
      },
      {
        id: 'audit-3',
        filiaal_id: 'filiaal-2',
        district_manager_id: '00000000-0000-0000-0000-000000000003',
        audit_datum: '2024-01-12',
        status: 'completed',
        totale_score: 4.6,
        pass_percentage: 92.0,
        opmerkingen: 'Uitstekende staat, alle punten in orde',
        created_at: '2024-01-12T09:15:00Z',
        updated_at: '2024-01-12T09:15:00Z'
      }
    ]
  }

  // User methods
  async getUserByEmail(email: string): Promise<Gebruiker | null> {
    console.log('Looking for user with email:', email)
    console.log('Available users:', this.users.map(u => u.email))
    const user = this.users.find(user => user.email === email) || null
    console.log('Found user:', user)
    return user
  }

  async getUserById(id: string): Promise<Gebruiker | null> {
    return this.users.find(user => user.id === id) || null
  }

  async getAllUsers(): Promise<Gebruiker[]> {
    return this.users
  }

  private generateUserCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    
    // Generate 5-character code
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    // Check if code already exists
    const existingUser = this.users.find(user => user.email === result)
    if (existingUser) {
      // If exists, generate a new one recursively
      return this.generateUserCode()
    }
    
    return result
  }

  async createUser(userData: { naam: string; rol: string; telefoon: string }): Promise<Gebruiker> {
    const userCode = this.generateUserCode()
    const newUser: Gebruiker = {
      id: `user-${Date.now()}`,
      email: userCode, // Use generated code as email/user_id
      naam: userData.naam,
      rol: userData.rol as any,
      telefoon: userData.telefoon,
      actief: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.users.push(newUser)
    this.saveToStorage()
    return newUser
  }

  async deleteUser(id: string): Promise<boolean> {
    const index = this.users.findIndex(user => user.id === id)
    if (index !== -1) {
      this.users.splice(index, 1)
      this.saveToStorage()
      return true
    }
    return false
  }

  async updateUser(id: string, updates: Partial<Gebruiker>): Promise<Gebruiker | null> {
    console.log('🔍 localDb.updateUser called with:')
    console.log('  - id:', id)
    console.log('  - updates:', updates)
    console.log('  - current users:', this.users.map(u => ({ id: u.id, email: u.email, naam: u.naam })))
    
    const index = this.users.findIndex(user => user.id === id)
    console.log('🔍 Found user at index:', index)
    
    if (index !== -1) {
      const oldUser = this.users[index]
      console.log('👤 Old user data:', oldUser)
      
      this.users[index] = {
        ...this.users[index],
        ...updates,
        updated_at: new Date().toISOString()
      }
      
      const newUser = this.users[index]
      console.log('✅ Updated user data:', newUser)
      console.log('📊 All users after update:', this.users.map(u => ({ id: u.id, email: u.email, naam: u.naam })))
      
      this.saveToStorage()
      console.log('💾 Database saved after user update')
      
      return newUser
    }
    
    console.log('❌ User not found with id:', id)
    return null
  }

  // Filiaal methods
  async getFilialen(): Promise<Filiaal[]> {
    return this.filialen.filter(f => f.status === 'actief')
  }

  async getFiliaalById(id: string): Promise<Filiaal | null> {
    return this.filialen.find(f => f.id === id) || null
  }

  // Action methods
  async getActions(filiaalId?: string): Promise<any[]> {
    console.log('🔍 getActions called with filiaalId:', filiaalId)
    console.log('🔍 Total actions in database:', this.actions.length)
    console.log('🔍 Actions data:', this.actions)
    
    if (filiaalId && filiaalId !== 'all') {
      // Filter actions by filiaal through audit relationship
      const filiaalAudits = this.audits.filter(audit => audit.filiaal_id === filiaalId)
      const auditIds = filiaalAudits.map(audit => audit.id)
      console.log('🔍 Filiaal audits:', filiaalAudits)
      console.log('🔍 Audit IDs:', auditIds)
      const filteredActions = this.actions.filter(action => auditIds.includes(action.audit_id))
      console.log('🔍 Filtered actions:', filteredActions)
      return filteredActions
    }
    console.log('🔍 Returning all actions:', this.actions)
    return this.actions
  }

  async getActionById(id: string): Promise<any | null> {
    return this.actions.find(action => action.id === id) || null
  }

  async updateAction(id: string, updates: any): Promise<any | null> {
    const index = this.actions.findIndex(action => action.id === id)
    if (index !== -1) {
      this.actions[index] = { ...this.actions[index], ...updates, updated_at: new Date().toISOString() }
      this.saveToStorage()
      return this.actions[index]
    }
    return null
  }

  // Audit Results methods
  async addAuditResults(auditId: string, results: any[]): Promise<void> {
    console.log('🔍 Adding audit results for audit:', auditId)
    console.log('📊 Results to save:', results)
    
    // Remove existing results for this audit
    this.auditResults = this.auditResults.filter(r => r.audit_id !== auditId)
    
    // Add new results
    results.forEach((result, index) => {
      const savedResult = {
        id: `result-${Date.now()}-${Math.random().toString(36).substring(2)}`,
        audit_id: auditId,
        checklist_item_id: result.checklist_item_id,
        resultaat: result.resultaat,
        score: result.resultaat === 'ok' ? 5 : 0,
        opmerkingen: result.opmerkingen || null,
        foto_urls: result.foto_urls || [],
        verbeterpunt: result.verbeterpunt || null,
        created_at: new Date().toISOString()
      }
      
      console.log(`💾 Saving result ${index + 1}:`, {
        checklist_item_id: savedResult.checklist_item_id,
        resultaat: savedResult.resultaat,
        opmerkingen: savedResult.opmerkingen,
        verbeterpunt: savedResult.verbeterpunt,
        foto_count: savedResult.foto_urls.length
      })
      
      this.auditResults.push(savedResult)
    })
    
    // Clean up old data before saving to prevent quota exceeded
    if (this.auditResults.length > 100) {
      console.log('🧹 Cleaning old audit results before saving')
      this.auditResults = this.auditResults.slice(-50)
    }
    
    this.saveToStorage()
    console.log('✅ Audit results added:', results.length, 'results for audit', auditId)
    console.log('📈 Total audit results in database:', this.auditResults.length)
  }

  async getAuditResults(auditId: string): Promise<any[]> {
    const results = this.auditResults.filter(r => r.audit_id === auditId)
    console.log('🔍 Loading audit results for audit:', auditId)
    console.log('📊 Found results:', results.length)
    console.log('📊 Total audit results in database:', this.auditResults.length)
    console.log('📊 All audit IDs in database:', this.auditResults.map(r => r.audit_id))
    
    if (results.length === 0) {
      console.log('⚠️ No results found for audit ID:', auditId)
      console.log('⚠️ Available audit IDs:', Array.from(new Set(this.auditResults.map(r => r.audit_id))))
    }
    
    results.forEach((result, index) => {
      console.log(`📋 Result ${index + 1}:`, {
        checklist_item_id: result.checklist_item_id,
        resultaat: result.resultaat,
        opmerkingen: result.opmerkingen,
        verbeterpunt: result.verbeterpunt,
        foto_count: result.foto_urls.length
      })
    })
    return results
  }

  // Audit methods
  async getAudits(filiaalId?: string): Promise<Audit[]> {
    let audits = this.audits
    if (filiaalId) {
      audits = audits.filter(a => a.filiaal_id === filiaalId)
    }
    return audits.sort((a, b) => new Date(b.audit_datum).getTime() - new Date(a.audit_datum).getTime())
  }

  async getAuditById(id: string): Promise<Audit | null> {
    return this.audits.find(a => a.id === id) || null
  }

  async addAudit(audit: Audit): Promise<void> {
    this.audits.push(audit)
    this.saveToStorage()
    console.log('Audit added:', audit.id)
  }

  async createAudit(auditData: Partial<Audit>): Promise<Audit> {
    const newAudit: Audit = {
      id: `audit-${Date.now()}`,
      filiaal_id: auditData.filiaal_id!,
      district_manager_id: auditData.district_manager_id!,
      audit_datum: auditData.audit_datum!,
      status: 'in_progress',
      totale_score: 0,
      pass_percentage: 0,
      opmerkingen: auditData.opmerkingen || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.audits.push(newAudit)
    this.saveToStorage()
    return newAudit
  }

  async createFiliaal(filiaalData: Partial<Filiaal>): Promise<Filiaal> {
    const newFiliaal: Filiaal = {
      id: `filiaal-${Date.now()}`,
      naam: filiaalData.naam!,
      locatie: filiaalData.locatie!,
      district_manager_id: filiaalData.district_manager_id!,
      adres: filiaalData.adres!,
      telefoon: filiaalData.telefoon || '',
      email: filiaalData.email || '',
      status: 'actief',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.filialen.push(newFiliaal)
    this.saveToStorage()
    return newFiliaal
  }

  // Checklist methods
  async getChecklistItems(): Promise<AuditChecklistItem[]> {
    return this.checklistItems.filter(item => item.actief)
  }

  // KPI methods
  async getKPIData(filiaalId?: string): Promise<KPIData> {
    let audits = this.audits
    if (filiaalId) {
      audits = audits.filter(a => a.filiaal_id === filiaalId)
    }

    const totaal_audits = audits.length
    const gemiddelde_score = audits.length > 0 
      ? audits.reduce((sum, audit) => sum + audit.totale_score, 0) / audits.length 
      : 0
    const pass_percentage = audits.length > 0 
      ? (audits.filter(audit => audit.pass_percentage >= 80).length / audits.length) * 100 
      : 0

    // Generate verbeterpunten from audit opmerkingen
    const verbeterpunten = this.generateVerbeterpunten(audits)

    return {
      totaal_audits,
      gemiddelde_score: Math.round(gemiddelde_score * 100) / 100,
      pass_percentage: Math.round(pass_percentage * 100) / 100,
      verbeterpunten,
      trends: [
        {
          periode: 'Week 1',
          score: 3.8,
          audits: 1
        },
        {
          periode: 'Week 2',
          score: 4.4,
          audits: 2
        }
      ]
    }
  }

  private generateVerbeterpunten(audits: Audit[]): Array<{item: string, frequentie: number, laatste_voorkomen: string}> {
    const verbeterpuntMap = new Map<string, {frequentie: number, laatste_voorkomen: string}>()
    
    // Define common improvement areas and their keywords
    const improvementAreas = {
      'Koelkast FIFO': ['FIFO', 'koelkast', 'verlopen', 'producten', 'organisatie'],
      'Koelkast temperatuur': ['temperatuur', 'koelkast', 'te hoog', 'te laag', 'koud'],
      'Hygiëne keuken': ['hygiëne', 'keuken', 'schoon', 'werkbladen', 'etensresten'],
      'Terras properheid': ['terras', 'vloer', 'meubilair', 'rommel', 'schoon'],
      'Toiletten': ['toiletten', 'papier', 'zeep', 'geur', 'hygiënisch'],
      'Personeelsbezetting': ['personeel', 'bezetting', 'planning', 'drukte', 'balans'],
      'Voorraadniveaus': ['voorraad', 'tekorten', 'niveaus', 'op peil'],
      'Veiligheid': ['veiligheid', 'brandblussers', 'nooduitgangen', 'EHBO'],
      'Gastbeleving': ['gastbeleving', 'service', 'kwaliteit', 'ervaring'],
      'Kassaprocedures': ['kassa', 'procedures', 'dagrapporten', 'registratie']
    }

    // Analyze audit opmerkingen
    audits.forEach(audit => {
      if (audit.opmerkingen) {
        const opmerkingen = audit.opmerkingen.toLowerCase()
        
        Object.entries(improvementAreas).forEach(([area, keywords]) => {
          const hasKeyword = keywords.some(keyword => opmerkingen.includes(keyword))
          
          if (hasKeyword) {
            const existing = verbeterpuntMap.get(area)
            if (existing) {
              existing.frequentie++
              if (new Date(audit.audit_datum) > new Date(existing.laatste_voorkomen)) {
                existing.laatste_voorkomen = audit.audit_datum
              }
            } else {
              verbeterpuntMap.set(area, {
                frequentie: 1,
                laatste_voorkomen: audit.audit_datum
              })
            }
          }
        })
      }
    })

    // Convert to array and sort by frequency
    const verbeterpunten = Array.from(verbeterpuntMap.entries())
      .map(([item, data]) => ({
        item,
        frequentie: data.frequentie,
        laatste_voorkomen: data.laatste_voorkomen
      }))
      .sort((a, b) => b.frequentie - a.frequentie)
      .slice(0, 5) // Top 5 verbeterpunten

    return verbeterpunten
  }
}

// Singleton instance
export const localDb = new LocalDatabase()
console.log('LocalDatabase singleton created:', localDb)

// Standaard wachtwoorden
export const defaultPasswords = {
  'admin@poulepoulette.be': 'admin123',
  'coo@poulepoulette.be': 'coo123',
  'district@poulepoulette.be': 'district123',
  'filiaal@poulepoulette.be': 'filiaal123'
}
