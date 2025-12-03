# Poule & Poulette Audit Tool - Database Setup Guide

## Overview

This guide explains how to set up the complete Supabase database schema for the Poule & Poulette Internal Audit Tool. The `supabase_full.sql` file contains everything needed to recreate the database exactly as it runs on localhost.

## Quick Setup (Single File)

### Step 1: Paste and Run SQL
1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the entire contents of `supabase_full.sql`
4. Paste into the SQL Editor
5. Click **RUN** (this may take 30-60 seconds)

### Step 2: Verify Setup
After running the SQL, verify the setup:

1. **Check Tables**: Go to **Table Editor** and verify these tables exist:
   - `gebruikers` (9 seed users)
   - `filialen` (9 seed locations)
   - `audit_checklist_items` (20 checklist items)
   - `audits` (initially empty)
   - `audit_resultaten` (initially empty)
   - `acties` (initially empty)
   - `rapporten` (initially empty)
   - `notificaties` (initially empty)

2. **Check Storage**: Go to **Storage** and verify:
   - `audit-photos` bucket exists and is public

3. **Check Functions**: Go to **Database > Functions** and verify these exist:
   - `calculate_audit_score`
   - `create_actions_from_audit_results`
   - `determine_action_urgency`
   - `update_audit_scores`
   - `send_action_completion_notifications`
   - `send_action_verification_notifications`

### Step 3: Update Environment Variables
Ensure your application has these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (server-side only)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Step 4: Deploy Application
1. Re-deploy your Cloudflare Pages application (no code changes needed)
2. The deployed app should now work identically to localhost

### Step 5: Test Authentication
Test with these seed users:
- **Admin**: `ADMIN` (Filip Van Hoeck)
- **COO**: `COO01` (Sarah De Vries)  
- **District Manager**: `DM001` (Tom Janssen)
- **Inspector**: `INSP1` (Inspector User)
- **Store Manager**: `STORE` (Store Manager)
- **Developer**: `DEV01` (Developer User)

### Step 6: Test File Upload
1. Login as any user
2. Create a new audit
3. Try uploading photos to verify storage bucket works

## Required Environment Variables

| Variable | Description | Required For |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Client-side operations |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Client-side operations |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (keep secret!) | Server-side operations |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL | Redirects and links |

## Code Entity → Database Object Mapping

### TypeScript Types → Database Tables

| Code Type | Database Table | Description |
|-----------|----------------|-------------|
| `Gebruiker` | `gebruikers` | User accounts and roles |
| `Filiaal` | `filialen` | Restaurant locations |
| `Audit` | `audits` | Audit sessions |
| `AuditChecklistItem` | `audit_checklist_items` | Checklist questions |
| `AuditResultaat` | `audit_resultaten` | Audit answers/results |
| `Action` | `acties` | Follow-up actions |
| `Rapport` | `rapporten` | Generated reports |
| `Notificatie` | `notificaties` | User notifications |

### Enums → PostgreSQL Enums

| Code Enum | Database Enum | Values |
|-----------|---------------|--------|
| User roles | `user_role` | admin, coo, district_manager, filiaal_manager, inspector, storemanager, developer |
| Filiaal status | `filiaal_status` | actief, inactief |
| Audit status | `audit_status` | in_progress, completed, cancelled |
| Audit result | `audit_result` | ok, niet_ok |
| Action status | `action_status` | pending, in_progress, completed, verified |
| Urgency level | `urgency_level` | low, medium, high, critical |
| Report status | `report_status` | pending, sent, failed |

### RPC Functions → Database Functions

| Code Call | Database Function | Purpose |
|-----------|------------------|---------|
| `.rpc('create_actions_from_audit_results')` | `create_actions_from_audit_results()` | Auto-generate actions from audit results |

### Storage Buckets

| Code Reference | Bucket Name | Purpose |
|----------------|-------------|---------|
| `'audit-photos'` | `audit-photos` | Photo uploads during audits |

## Row Level Security (RLS) Summary

### Authentication Model
- Users authenticate using the `email` field (which stores user_id like 'ADMIN', 'DM001')
- RLS policies use `auth.uid()` to match against the `id` field in `gebruikers`
- No password authentication in current implementation (demo mode)

### Access Control Rules

#### Users (`gebruikers`)
- Users can read/update their own profile
- Admins and COOs can manage all users

#### Locations (`filialen`)
- District managers can read their assigned locations
- Admins and COOs can read all locations

#### Audits (`audits`)
- District managers can read/create/update audits for their locations
- Admins and COOs can read all audits

#### Audit Results (`audit_resultaten`)
- Follow the same rules as their parent audit

#### Actions (`acties`)
- Follow audit rules PLUS assigned users can see their actions
- Users who completed actions can see them

#### Notifications (`notificaties`)
- Users can only see their own notifications

#### Checklist Items (`audit_checklist_items`)
- All authenticated users can read active items
- Admins can manage items

## Regenerating This Schema

If the codebase changes and you need to regenerate the schema:

1. Run this Cursor task again with the updated codebase
2. The AI will analyze the current code and generate a new `supabase_full.sql`
3. Compare with the existing schema to see what changed
4. Apply changes incrementally or recreate from scratch

## Troubleshooting

### Common Issues

1. **RLS Blocking Access**: If you get permission errors, temporarily disable RLS:
   ```sql
   ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
   ```

2. **Functions Not Working**: Check if functions exist:
   ```sql
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_schema = 'public';
   ```

3. **Storage Upload Fails**: Verify bucket exists and policies are correct:
   ```sql
   SELECT * FROM storage.buckets;
   SELECT * FROM storage.policies;
   ```

4. **Seed Data Missing**: Re-run the seed data sections from `supabase_full.sql`

### Reset Database (Nuclear Option)
If you need to start completely fresh:

```sql
-- WARNING: This deletes ALL data
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

Then re-run `supabase_full.sql`.

## Production Considerations

### Security
- Enable RLS on all tables (already done in schema)
- Use service role key only on server-side
- Implement proper password hashing for production
- Review and tighten RLS policies as needed

### Performance
- Indexes are included for common query patterns
- Monitor query performance and add indexes as needed
- Consider partitioning for large audit history

### Backup
- Enable Supabase automatic backups
- Export schema regularly for version control
- Test restore procedures

### Monitoring
- Set up Supabase monitoring and alerts
- Monitor storage usage for photo uploads
- Track function execution times

## Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Verify environment variables are correct
3. Test with the seed user accounts first
4. Check browser console for client-side errors
5. Regenerate this schema if the codebase has changed significantly

---

**Generated**: October 2, 2025  
**Schema Version**: Complete codebase analysis  
**Compatible With**: Cloudflare Pages deployment

