#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables not found!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('filialen')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    return true
  } catch (err) {
    console.error('❌ Connection error:', err.message)
    return false
  }
}

async function checkTables() {
  console.log('🔍 Checking database tables...')
  
  const tables = ['gebruikers', 'filialen', 'audits', 'audit_checklist_items', 'audit_resultaten']
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)
      
      if (error) {
        console.error(`❌ Table '${table}' not found or accessible:`, error.message)
        return false
      }
      
      console.log(`✅ Table '${table}' is accessible`)
    } catch (err) {
      console.error(`❌ Error checking table '${table}':`, err.message)
      return false
    }
  }
  
  return true
}

async function checkUsers() {
  console.log('🔍 Checking users...')
  
  try {
    const { data, error } = await supabase
      .from('gebruikers')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('❌ Error fetching users:', error.message)
      return false
    }
    
    console.log(`✅ Found ${data.length} users in database`)
    if (data.length > 0) {
      console.log('📋 Users:')
      data.forEach(user => {
        console.log(`   - ${user.email} (${user.rol})`)
      })
    }
    
    return true
  } catch (err) {
    console.error('❌ Error checking users:', err.message)
    return false
  }
}

async function main() {
  console.log('🚀 Supabase Setup Check\n')
  
  const connectionOk = await testConnection()
  if (!connectionOk) {
    process.exit(1)
  }
  
  const tablesOk = await checkTables()
  if (!tablesOk) {
    console.log('\n❌ Database tables are not set up correctly.')
    console.log('Please run the SQL schema from supabase/schema.sql in your Supabase dashboard.')
    process.exit(1)
  }
  
  const usersOk = await checkUsers()
  if (!usersOk) {
    console.log('\n❌ Users table is not accessible.')
    process.exit(1)
  }
  
  console.log('\n🎉 Supabase setup is complete!')
  console.log('You can now use the application with the following login credentials:')
  console.log('   - Admin: admin@poulepoulette.be / admin123')
  console.log('   - COO: coo@poulepoulette.be / coo123')
  console.log('   - District Manager: district@poulepoulette.be / district123')
  console.log('   - Filiaal Manager: filiaal@poulepoulette.be / filiaal123')
}

main().catch(console.error)
