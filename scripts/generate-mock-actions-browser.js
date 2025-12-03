// Browser-based script to generate mock actions
// Run this in the browser console on the actions page

const mockActions = [
  {
    audit_id: 'audit-1',
    audit_resultaat_id: 'result-1',
    titel: 'Actie vereist: Koelkast FIFO',
    beschrijving: 'FIFO regel niet correct nageleefd in de koelkast. Producten moeten worden hergeorganiseerd volgens vervaldatum.',
    urgentie: 'high',
    status: 'pending',
    deadline: '2024-01-22',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    audit_id: 'audit-1',
    audit_resultaat_id: 'result-2',
    titel: 'Actie vereist: Vloeren schoonmaken',
    beschrijving: 'Vloeren in de keuken zijn niet voldoende schoon. Extra schoonmaakbeurt nodig.',
    urgentie: 'medium',
    status: 'in_progress',
    deadline: '2024-01-29',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    audit_id: 'audit-2',
    audit_resultaat_id: 'result-3',
    titel: 'Actie vereist: Koelkast temperatuur',
    beschrijving: 'Koelkast temperatuur is te hoog (8°C). Moet worden aangepast naar 4°C of lager voor voedselveiligheid.',
    urgentie: 'critical',
    status: 'completed',
    deadline: '2024-01-16',
    actie_onderneem: 'Koelkast temperatuur aangepast naar 3°C. Thermometer gecontroleerd en gekalibreerd.',
    foto_urls: ['/uploads/koelkast-temperatuur-voor.jpg', '/uploads/koelkast-temperatuur-na.jpg'],
    voltooid_door: 'demo-user-1',
    voltooid_op: '2024-01-16T14:30:00Z',
    created_at: '2024-01-08T14:30:00Z',
    updated_at: '2024-01-16T14:30:00Z'
  },
  {
    audit_id: 'audit-2',
    audit_resultaat_id: 'result-4',
    titel: 'Actie vereist: FIFO controle koelkast',
    beschrijving: 'FIFO regel niet correct nageleefd. Oudere producten staan voor nieuwe producten.',
    urgentie: 'high',
    status: 'completed',
    deadline: '2024-01-18',
    actie_onderneem: 'Alle producten in koelkast hergeorganiseerd volgens vervaldatum. Personeel getraind op FIFO procedures.',
    foto_urls: ['/uploads/koelkast-fifo-voor.jpg', '/uploads/koelkast-fifo-na.jpg'],
    voltooid_door: 'demo-user-1',
    voltooid_op: '2024-01-18T09:15:00Z',
    geverifieerd_door: 'demo-user-1',
    geverifieerd_op: '2024-01-18T16:00:00Z',
    verificatie_opmerkingen: 'Koelkast correct georganiseerd volgens FIFO. Personeel heeft training gevolgd.',
    created_at: '2024-01-08T14:30:00Z',
    updated_at: '2024-01-18T16:00:00Z'
  },
  {
    audit_id: 'audit-2',
    audit_resultaat_id: 'result-5',
    titel: 'Actie vereist: Gevel reinigen',
    beschrijving: 'Gevel en ramen zijn vuil en hebben een professionele reiniging nodig.',
    urgentie: 'low',
    status: 'pending',
    deadline: '2024-02-05',
    created_at: '2024-01-08T14:30:00Z',
    updated_at: '2024-01-08T14:30:00Z'
  },
  {
    audit_id: 'audit-3',
    audit_resultaat_id: 'result-6',
    titel: 'Actie vereist: Ingang deur repareren',
    beschrijving: 'Ingang deur sluit niet goed af. Reparatie nodig voor veiligheid en energiebesparing.',
    urgentie: 'medium',
    status: 'in_progress',
    deadline: '2024-01-26',
    created_at: '2024-01-12T09:15:00Z',
    updated_at: '2024-01-12T09:15:00Z'
  },
  {
    audit_id: 'audit-3',
    audit_resultaat_id: 'result-7',
    titel: 'Actie vereist: Vloeren vervangen',
    beschrijving: 'Vloeren in de keuken zijn versleten en moeten worden vervangen voor hygiëne.',
    urgentie: 'high',
    status: 'pending',
    deadline: '2024-02-12',
    created_at: '2024-01-12T09:15:00Z',
    updated_at: '2024-01-12T09:15:00Z'
  }
]

async function generateMockActions() {
  try {
    console.log('🚀 Starting to generate mock actions...')
    
    // Check if supabase is available
    if (typeof window === 'undefined' || !window.supabase) {
      console.error('❌ Supabase client not available. Make sure you are running this in the browser.')
      return
    }
    
    // First, check if actions already exist
    const { data: existingActions, error: checkError } = await window.supabase
      .from('acties')
      .select('id')
    
    if (checkError) {
      console.error('❌ Error checking existing actions:', checkError)
      return
    }
    
    if (existingActions && existingActions.length > 0) {
      console.log('⚠️  Actions already exist in database. Skipping generation.')
      return
    }
    
    // Insert mock actions
    const { data, error } = await window.supabase
      .from('acties')
      .insert(mockActions)
      .select()
    
    if (error) {
      console.error('❌ Error inserting mock actions:', error)
      return
    }
    
    console.log('✅ Successfully generated', data.length, 'mock actions')
    console.log('📋 Generated actions:')
    data.forEach((action, index) => {
      console.log(`  ${index + 1}. ${action.titel} (${action.urgentie} - ${action.status})`)
    })
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Export for use in browser console
window.generateMockActions = generateMockActions

console.log('📝 Mock actions script loaded. Run generateMockActions() to create mock data.')
