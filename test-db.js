// Test script voor lokale database
const { localDb, defaultPasswords } = require('./lib/local-db.ts')

async function testLogin() {
  console.log('Testing local database...')
  
  // Test user lookup
  const user = await localDb.getUserByEmail('admin@poulepoulette.be')
  console.log('User found:', user)
  
  // Test password
  const expectedPassword = defaultPasswords['admin@poulepoulette.be']
  console.log('Expected password:', expectedPassword)
  
  // Test all users
  const users = await Promise.all([
    localDb.getUserByEmail('admin@poulepoulette.be'),
    localDb.getUserByEmail('coo@poulepoulette.be'),
    localDb.getUserByEmail('district@poulepoulette.be'),
    localDb.getUserByEmail('filiaal@poulepoulette.be')
  ])
  
  console.log('All users:', users.map(u => u ? u.email : 'NOT FOUND'))
}

testLogin().catch(console.error)
