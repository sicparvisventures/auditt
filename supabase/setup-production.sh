#!/bin/bash

# Poule & Poulette Interne Audit Tool - Production Setup Script
# Dit script zet de complete database op in Supabase voor productie gebruik

set -e  # Exit on any error

echo "🚀 Starting Poule & Poulette Production Database Setup"
echo "=================================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "supabase/schema-production.sql" ]; then
    echo "❌ schema-production.sql not found. Please run this script from the project root."
    exit 1
fi

# Check if we're logged in to Supabase
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run:"
    echo "   supabase login"
    exit 1
fi

echo "✅ Supabase CLI is ready"

# Get project details
echo ""
echo "📋 Please provide your Supabase project details:"
read -p "Project ID: " PROJECT_ID
read -p "Database URL: " DATABASE_URL
read -p "Anon Key: " ANON_KEY
read -p "Service Role Key: " SERVICE_ROLE_KEY

# Validate inputs
if [ -z "$PROJECT_ID" ] || [ -z "$DATABASE_URL" ] || [ -z "$ANON_KEY" ] || [ -z "$SERVICE_ROLE_KEY" ]; then
    echo "❌ All fields are required. Please try again."
    exit 1
fi

echo ""
echo "🔧 Setting up database schema..."

# Link to the project
supabase link --project-ref $PROJECT_ID

# Apply the production schema
echo "📊 Applying production schema..."
psql "$DATABASE_URL" -f supabase/schema-production.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema applied successfully"
else
    echo "❌ Failed to apply schema"
    exit 1
fi

# Apply the production seed data
echo "🌱 Seeding database with production data..."
psql "$DATABASE_URL" -f supabase/seed-production.sql

if [ $? -eq 0 ]; then
    echo "✅ Seed data applied successfully"
else
    echo "❌ Failed to apply seed data"
    exit 1
fi

# Create environment file
echo "📝 Creating environment file..."
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$DATABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY

# Database Configuration
DATABASE_URL=$DATABASE_URL
EOF

echo "✅ Environment file created: .env.local"

# Create storage bucket for file uploads
echo "📁 Setting up storage bucket..."
supabase storage create audit-files --public

if [ $? -eq 0 ]; then
    echo "✅ Storage bucket 'audit-files' created"
else
    echo "⚠️  Storage bucket creation failed (might already exist)"
fi

# Set up storage policies
echo "🔒 Setting up storage policies..."
psql "$DATABASE_URL" << EOF
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to upload files
CREATE POLICY "Authenticated users can upload audit files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'audit-files' AND
        auth.role() = 'authenticated'
    );

-- Policy for authenticated users to view files
CREATE POLICY "Authenticated users can view audit files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'audit-files' AND
        auth.role() = 'authenticated'
    );

-- Policy for authenticated users to update files
CREATE POLICY "Authenticated users can update audit files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'audit-files' AND
        auth.role() = 'authenticated'
    );

-- Policy for authenticated users to delete files
CREATE POLICY "Authenticated users can delete audit files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'audit-files' AND
        auth.role() = 'authenticated'
    );
EOF

if [ $? -eq 0 ]; then
    echo "✅ Storage policies configured"
else
    echo "❌ Failed to configure storage policies"
    exit 1
fi

# Verify setup
echo ""
echo "🔍 Verifying setup..."

# Check if tables exist
TABLE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('gebruikers', 'filialen', 'audits', 'audit_resultaten', 'acties', 'notificaties');")

if [ "$TABLE_COUNT" -eq 6 ]; then
    echo "✅ All required tables exist"
else
    echo "❌ Missing tables. Expected 6, found $TABLE_COUNT"
    exit 1
fi

# Check if users exist
USER_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM gebruikers;")

if [ "$USER_COUNT" -gt 0 ]; then
    echo "✅ Users seeded successfully ($USER_COUNT users)"
else
    echo "❌ No users found in database"
    exit 1
fi

# Check if filialen exist
FILIAAL_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM filialen;")

if [ "$FILIAAL_COUNT" -gt 0 ]; then
    echo "✅ Filialen seeded successfully ($FILIAAL_COUNT filialen)"
else
    echo "❌ No filialen found in database"
    exit 1
fi

# Check if audits exist
AUDIT_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM audits;")

if [ "$AUDIT_COUNT" -gt 0 ]; then
    echo "✅ Audits seeded successfully ($AUDIT_COUNT audits)"
else
    echo "❌ No audits found in database"
    exit 1
fi

echo ""
echo "🎉 Production database setup completed successfully!"
echo "=================================================="
echo ""
echo "📋 Summary:"
echo "  • Database schema applied"
echo "  • Production seed data loaded"
echo "  • Storage bucket configured"
echo "  • Environment file created"
echo "  • $USER_COUNT users created"
echo "  • $FILIAAL_COUNT filialen created"
echo "  • $AUDIT_COUNT audits created"
echo ""
echo "🔑 Default login credentials:"
echo "  • Admin: ADMIN (Filip van Hoeck)"
echo "  • COO: COO01 (Sarah De Vries)"
echo "  • District Manager: DM001 (Tom Janssen)"
echo ""
echo "🚀 You can now deploy your application!"
echo ""
echo "📝 Next steps:"
echo "  1. Update your deployment environment variables"
echo "  2. Deploy your application"
echo "  3. Test the login functionality"
echo "  4. Verify all features work correctly"
echo ""
echo "⚠️  Remember to:"
echo "  • Keep your service role key secure"
echo "  • Regularly backup your database"
echo "  • Monitor your application logs"
echo ""
echo "✅ Setup complete! Your Poule & Poulette audit system is ready for production."
