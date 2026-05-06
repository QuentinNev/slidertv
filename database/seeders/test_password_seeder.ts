import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const existing = await User.findBy('email', 'admin@slidertv.local')
    if (existing) {
      await existing.delete()
      console.log('Deleted existing admin user')
    }

    const user = await User.create({
      email: 'admin@slidertv.local',
      password: 'admin1234',
      fullName: 'Admin',
      role: 'admin',
      tenantId: null,
    })
    console.log('Admin user created')
    console.log('Password hash stored:', user.password)

    try {
      const verified = await User.verifyCredentials('admin@slidertv.local', 'admin1234')
      console.log('[SUCCESS] Login works:', verified.email)
    } catch (e) {
      console.error('[FAILED] Login failed:', e instanceof Error ? e.message : String(e))
    }
  }
}
