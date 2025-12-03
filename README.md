# Poule & Poulette - Interne Audit Tool

Een moderne, mobile-first audit tool voor district managers van Poule & Poulette filialen. Deze tool biedt volledige ondersteuning voor checklisten, foto's, feedback, rapporten en KPI's.

## 🚀 Functies

### Dashboard (Mobile First)
- **Filiaal Selectie**: Dropdown-menu om tussen filialen te schakelen
- **Audit Status**: Visuele weergave van audit status en KPI's
- **KPI Weergave**: 
  - Aantal voltooide audits
  - Gemiddelde score per filiaal (0-5)
  - Verbeterpunten per filiaal
  - Pass percentage per filiaal (80% of meer)
- **Data Filtering**: Filter audits per filiaal, datum, en score
- **Visuele Representatie**: Grafieken en staafdiagrammen voor KPI's

### Audit Checklist
- **Checklist Items**: Standaard controlepunten voor audits
- **Checkboxen**: Ok/Niet Ok selectie voor elk punt
- **Opmerkingen**: Vrij tekstveld voor feedback
- **Foto Upload**: Documentatie met foto's per item
- **Puntensysteem**: Automatische scoring op 0-5 schaal
- **FAVV Compliance**: Controle op voedselveiligheidsnormen

### Feedback & Verbeterpunten
- **Gedetailleerde Feedback**: Per controlepunt
- **Verbeterpunten**: Bij negatieve scores
- **Foto Ondersteuning**: Visuele documentatie van problemen

### Rapportage
- **Automatische Generatie**: Na voltooiing van audit
- **Export Mogelijkheden**: PDF en Excel formaten
- **E-mail Verzending**: Naar stakeholders
- **Historisch Overzicht**: Database van alle audits

## 🛠 Technologie Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Charts**: Recharts
- **PDF Generation**: jsPDF, html2canvas
- **Forms**: React Hook Form, Zod validation

## 📦 Installatie

1. **Clone de repository**
   ```bash
   git clone <repository-url>
   cd poule-poulette-audit-tool
   ```

2. **Installeer dependencies**
   ```bash
   npm install
   ```

3. **Configureer environment variabelen**
   ```bash
   cp env.example .env.local
   ```
   
   Vul de volgende variabelen in:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Setup Supabase Database**
   - Ga naar [supabase.com](https://supabase.com) en maak een nieuw project aan
   - Ga naar Settings > API en kopieer je Project URL en anon public key
   - Ga naar de SQL Editor en voer het schema uit uit `supabase/schema.sql`
   - Voer de seed data uit uit `supabase/seed.sql`
   - Test de setup met: `node scripts/setup-supabase.js`

5. **Start de development server**
   ```bash
   npm run dev
   ```

## 🔑 Standaard Login

Na het uitvoeren van de seed data zijn de volgende accounts beschikbaar:

- **Admin**: admin@poulepoulette.be / admin123
- **COO**: coo@poulepoulette.be / coo123  
- **District Manager**: district@poulepoulette.be / district123
- **Filiaal Manager**: filiaal@poulepoulette.be / filiaal123

## 🗄 Database Schema

De tool gebruikt een multi-tenant database structuur met de volgende tabellen:

- **gebruikers**: Gebruikers met rollen (district_manager, coo, filiaal_manager, admin)
- **filialen**: Filiaal informatie en district manager toewijzing
- **audit_checklist_items**: Standaard checklist items voor audits
- **audits**: Audit records met status en scores
- **audit_resultaten**: Resultaten per checklist item
- **rapporten**: Gegenereerde rapporten en verzend status

## 🔐 Beveiliging

- **Authenticatie**: Supabase Auth met JWT tokens
- **Autorisatie**: Role-based access control (RBAC)
- **Data Beveiliging**: SSL/TLS encryptie, AES-256 opslag
- **GDPR Compliance**: Gegevensminimalisatie en logging
- **Zero-Trust**: Elke aanvraag wordt gevalideerd

## 📱 Mobile-First Design

De tool is volledig geoptimaliseerd voor mobile gebruik:
- Responsive design met Tailwind CSS
- Touch-friendly interface
- Mobile navigation
- Optimized voor kleine schermen
- Progressive Web App (PWA) ready

## 🎯 Scoring Systeem

- **0-5 Schaal**: Elk checklist item krijgt een score van 0-5
- **Gewogen Scoring**: Items hebben verschillende gewichten
- **Pass Threshold**: 80% of hoger wordt beschouwd als "Pass"
- **Automatische Berekenen**: Scores worden automatisch berekend

## 📊 KPI's

De tool biedt uitgebreide KPI tracking:
- Totaal aantal audits
- Gemiddelde scores per filiaal
- Pass percentages
- Verbeterpunten analyse
- Trend analyse over tijd

## 🚀 Deployment

### Vercel (Aanbevolen)
1. Push code naar GitHub
2. Verbind repository met Vercel
3. Configureer environment variabelen
4. Deploy automatisch

### Andere Platforms
De tool kan worden gedeployed op:
- Netlify
- AWS Amplify
- Google Cloud Run
- Azure Static Web Apps

## 📈 Schaalbaarheid

- **Horizontale Schaling**: Cloud-native architectuur
- **Database**: Supabase PostgreSQL met automatische schaling
- **Storage**: Supabase Storage voor foto's
- **Caching**: Redis voor performance optimalisatie
- **CDN**: Global content delivery

## 🔧 Development

### Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

### Code Structuur
```
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                 # Utility functions
├── types/               # TypeScript types
├── supabase/            # Database schema
└── public/              # Static assets
```

## 📝 API Endpoints

- `GET /api/audits` - Lijst van audits
- `POST /api/audits` - Nieuwe audit aanmaken
- `GET /api/audits/[id]` - Audit details
- `PUT /api/audits/[id]` - Audit bijwerken
- `GET /api/filialen` - Lijst van filialen
- `GET /api/checklist-items` - Checklist items
- `GET /api/kpi` - KPI data
- `POST /api/upload` - Foto upload
- `GET /api/reports` - Rapporten

## 🤝 Bijdragen

1. Fork de repository
2. Maak een feature branch
3. Commit je wijzigingen
4. Push naar de branch
5. Open een Pull Request

## 📄 Licentie

Dit project is eigendom van Poule & Poulette en is niet open source.

## 📞 Ondersteuning

Voor technische ondersteuning, neem contact op met de IT-afdeling van Poule & Poulette.

## 🔄 Changelog

### v1.0.0 (2024)
- Eerste release
- Mobile-first dashboard
- Audit checklist systeem
- Foto upload functionaliteit
- Automatische rapport generatie
- KPI tracking en visualisatie
- Role-based access control
- GDPR compliance
