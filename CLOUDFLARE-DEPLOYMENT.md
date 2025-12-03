# Cloudflare Pages Deployment Guide

## Productie Build

De applicatie is geoptimaliseerd voor Cloudflare Pages deployment.

### Build Grootte
- **Totaal**: 3.5MB (onder de 25MB limiet)
- **Static assets**: 1.4MB
- **Server chunks**: 1.4MB

### Configuratie Bestanden

#### 1. `_headers` - Security Headers
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
```

#### 2. `_redirects` - SPA Routing
```
/*    /index.html   200
```

#### 3. `wrangler.toml` - Cloudflare Config
```toml
name = "poule-poulette-audit"
compatibility_date = "2024-01-15"

[env.production]
vars = { NODE_ENV = "production" }

[[env.production.vars]]
NEXT_PUBLIC_SUPABASE_URL = "https://kauerobifkgjvddyrkuz.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Deployment Stappen

#### Optie 1: Direct Upload
1. Ga naar [Cloudflare Pages](https://pages.cloudflare.com)
2. Klik op "Upload assets"
3. Upload de `dist` folder
4. Stel environment variables in:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://kauerobifkgjvddyrkuz.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthdWVyb2JpZmtnanZkZHlya3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTIxODQsImV4cCI6MjA3NDcyODE4NH0.GqMYsz9byBYHw_fqmPYH53E4fyciz3MpdUtDQDhpvd8`

#### Optie 2: Git Integration
1. Push code naar GitHub/GitLab
2. Connect repository in Cloudflare Pages
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Stel environment variables in

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://kauerobifkgjvddyrkuz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthdWVyb2JpZmtnanZkZHlya3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTIxODQsImV4cCI6MjA3NDcyODE4NH0.GqMYsz9byBYHw_fqmPYH53E4fyciz3MpdUtDQDhpvd8
```

### Database Setup
1. Run `supabase/COMPLETE-SETUP.sql` in Supabase SQL Editor
2. Run `supabase/UPDATE-USER-IDS.sql` om user_id's in te stellen
3. Test login met:
   - Admin: `ADMIN`
   - COO: `COO01`
   - District Managers: `DM001`, `DM002`, `DM003`
   - Filiaal Managers: `FM001`, `FM002`, `FM003`, `FM004`

### Features
- ✅ Supabase database integratie
- ✅ User authentication
- ✅ Audit management
- ✅ Action tracking
- ✅ Report generation
- ✅ Mobile responsive
- ✅ Admin user management
- ✅ Audit deletion (admin only)
- ✅ Admin account protection

### Performance
- Build size: 3.5MB
- First Load JS: ~87-158kB per page
- Static optimization enabled
- Image optimization disabled (for static export)
- Caching headers configured

### Security
- XSS protection headers
- Content type validation
- Frame options
- Referrer policy
- Permissions policy

### Support
- Next.js 14.2.33
- TypeScript
- Tailwind CSS
- Lucide React icons
- Supabase client