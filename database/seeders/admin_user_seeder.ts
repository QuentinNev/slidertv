import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class extends BaseSeeder {
  async run() {
    const existing = await User.findBy('email', 'admin@slidertv.local')
    if (existing) {
      await existing.merge({ role: 'admin', tenantId: null, password: await hash.make('admin1234') }).save()
      console.log('Admin user updated:', existing.email)
      return
    }

    const user = await User.create({
      email: 'admin@slidertv.local',
      password: await hash.make('admin1234'),
      fullName: 'Admin',
      role: 'admin',
      tenantId: null,
    })
    console.log('Admin user created:', user.email, '/ password: admin1234')
  }
}
