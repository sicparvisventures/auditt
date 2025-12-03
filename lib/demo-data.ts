import { Filiaal, Gebruiker, Audit, AuditChecklistItem, KPIData } from '@/types'

export const demoGebruiker: Gebruiker = {
  id: 'demo-user-1',
  email: 'manager@poulepoulette.be',
  naam: 'Jan Janssen',
  rol: 'district_manager',
  telefoon: '+32 123 456 789',
  actief: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

export const demoFilialen: Filiaal[] = [
  {
    id: 'filiaal-1',
    naam: 'Poule & Poulette Antwerpen',
    locatie: 'Antwerpen Centrum',
    district_manager_id: 'demo-user-1',
    adres: 'Meir 123, 2000 Antwerpen',
    telefoon: '+32 3 123 45 67',
    email: 'antwerpen@poulepoulette.be',
    status: 'actief',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'filiaal-2',
    naam: 'Poule & Poulette Gent',
    locatie: 'Gent Centrum',
    district_manager_id: 'demo-user-1',
    adres: 'Veldstraat 45, 9000 Gent',
    telefoon: '+32 9 876 54 32',
    email: 'gent@poulepoulette.be',
    status: 'actief',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'filiaal-3',
    naam: 'Poule & Poulette Brussel',
    locatie: 'Brussel Centrum',
    district_manager_id: 'demo-user-1',
    adres: 'Nieuwstraat 78, 1000 Brussel',
    telefoon: '+32 2 555 12 34',
    email: 'brussel@poulepoulette.be',
    status: 'actief',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const demoChecklistItems: AuditChecklistItem[] = [
  {
    id: 'item-1',
    categorie: 'Buitenkant',
    titel: 'Gevel en ramen',
    beschrijving: 'Controleer of de gevel en ramen schoon zijn',
    gewicht: 1.0,
    volgorde: 1,
    actief: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'item-2',
    categorie: 'Buitenkant',
    titel: 'Ingang en deur',
    beschrijving: 'Controleer of de ingang en deur proper zijn',
    gewicht: 1.0,
    volgorde: 2,
    actief: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'item-3',
    categorie: 'Spotchecks',
    titel: 'Koelkast temperatuur',
    beschrijving: 'Controleer of de koelkast op de juiste temperatuur staat',
    gewicht: 1.5,
    volgorde: 3,
    actief: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'item-4',
    categorie: 'Algemene properheid',
    titel: 'Vloeren',
    beschrijving: 'Controleer of de vloeren schoon zijn',
    gewicht: 1.0,
    volgorde: 4,
    actief: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'item-5',
    categorie: 'FIFO controle',
    titel: 'Koelkast FIFO',
    beschrijving: 'Controleer of de FIFO regel wordt nageleefd in de koelkast',
    gewicht: 1.3,
    volgorde: 5,
    actief: true,
    created_at: new Date().toISOString()
  }
]

export const demoAudits: Audit[] = [
  {
    id: 'audit-1',
    filiaal_id: 'filiaal-1',
    district_manager_id: 'demo-user-1',
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
    district_manager_id: 'demo-user-1',
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
    district_manager_id: 'demo-user-1',
    audit_datum: '2024-01-12',
    status: 'completed',
    totale_score: 4.6,
    pass_percentage: 92.0,
    opmerkingen: 'Uitstekende staat, alle punten in orde',
    created_at: '2024-01-12T09:15:00Z',
    updated_at: '2024-01-12T09:15:00Z'
  }
]

export const demoKPIData: KPIData = {
  totaal_audits: 3,
  gemiddelde_score: 4.2,
  pass_percentage: 84.0,
  verbeterpunten: [
    {
      item: 'Koelkast FIFO',
      frequentie: 2,
      laatste_voorkomen: '2024-01-08T14:30:00Z'
    },
    {
      item: 'Koelkast temperatuur',
      frequentie: 1,
      laatste_voorkomen: '2024-01-08T14:30:00Z'
    }
  ],
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

export const demoActions = [
  {
    id: 'action-1',
    audit_id: 'audit-1',
    audit_resultaat_id: 'result-1',
    titel: 'Actie vereist: Koelkast FIFO',
    beschrijving: 'FIFO regel niet correct nageleefd in de koelkast. Producten moeten worden hergeorganiseerd volgens vervaldatum.',
    urgentie: 'high' as const,
    status: 'pending' as const,
    deadline: '2024-01-22',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'action-2',
    audit_id: 'audit-1',
    audit_resultaat_id: 'result-2',
    titel: 'Actie vereist: Vloeren schoonmaken',
    beschrijving: 'Vloeren in de keuken zijn niet voldoende schoon. Extra schoonmaakbeurt nodig.',
    urgentie: 'medium' as const,
    status: 'in_progress' as const,
    deadline: '2024-01-29',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'action-3',
    audit_id: 'audit-2',
    audit_resultaat_id: 'result-3',
    titel: 'Actie vereist: Koelkast temperatuur',
    beschrijving: 'Koelkast temperatuur is te hoog (8°C). Moet worden aangepast naar 4°C of lager voor voedselveiligheid.',
    urgentie: 'critical' as const,
    status: 'completed' as const,
    deadline: '2024-01-16',
    actie_onderneem: 'Koelkast temperatuur aangepast naar 3°C. Thermometer gecontroleerd en gekalibreerd.',
    foto_urls: ['/uploads/koelkast-temperatuur-voor.jpg', '/uploads/koelkast-temperatuur-na.jpg'],
    voltooid_door: 'demo-user-1',
    voltooid_op: '2024-01-16T14:30:00Z',
    created_at: '2024-01-08T14:30:00Z',
    updated_at: '2024-01-16T14:30:00Z'
  },
  {
    id: 'action-4',
    audit_id: 'audit-2',
    audit_resultaat_id: 'result-4',
    titel: 'Actie vereist: FIFO controle koelkast',
    beschrijving: 'FIFO regel niet correct nageleefd. Oudere producten staan voor nieuwe producten.',
    urgentie: 'high' as const,
    status: 'verified' as const,
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
    id: 'action-5',
    audit_id: 'audit-2',
    audit_resultaat_id: 'result-5',
    titel: 'Actie vereist: Gevel reinigen',
    beschrijving: 'Gevel en ramen zijn vuil en hebben een professionele reiniging nodig.',
    urgentie: 'low' as const,
    status: 'pending' as const,
    deadline: '2024-02-05',
    created_at: '2024-01-08T14:30:00Z',
    updated_at: '2024-01-08T14:30:00Z'
  },
  {
    id: 'action-6',
    audit_id: 'audit-3',
    audit_resultaat_id: 'result-6',
    titel: 'Actie vereist: Ingang deur repareren',
    beschrijving: 'Ingang deur sluit niet goed af. Reparatie nodig voor veiligheid en energiebesparing.',
    urgentie: 'medium' as const,
    status: 'in_progress' as const,
    deadline: '2024-01-26',
    created_at: '2024-01-12T09:15:00Z',
    updated_at: '2024-01-12T09:15:00Z'
  },
  {
    id: 'action-7',
    audit_id: 'audit-3',
    audit_resultaat_id: 'result-7',
    titel: 'Actie vereist: Vloeren vervangen',
    beschrijving: 'Vloeren in de keuken zijn versleten en moeten worden vervangen voor hygiëne.',
    urgentie: 'high' as const,
    status: 'pending' as const,
    deadline: '2024-02-12',
    created_at: '2024-01-12T09:15:00Z',
    updated_at: '2024-01-12T09:15:00Z'
  }
]
